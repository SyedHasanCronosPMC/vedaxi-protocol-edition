# 04 — Architecture

---

## 1. Stack

| Choice | Why |
|---|---|
| **Vite + React + TypeScript** | Fastest path to a deployed SPA |
| **Zero backend** | WebMCP is client-side. A backend adds deploy risk and buys nothing. |
| **Fixture as static TS modules** | No database, no fetch latency, deterministic evals |
| **CSS custom properties + small motion layer** | Semantic levels are data-driven |
| **Netlify** | Challenge sponsor, 3,000 free credits (request by 1 Sep 12:00 PT) |

No backend, no auth, no database, no state library beyond a single store. Each of those is a Wednesday-morning failure waiting to happen.

---

## 2. Single source of truth

```ts
interface ElasticState {
  intent: { text: string; constraints: string[]; parsedAt: number } | null;
  elements: Record<ElementId, Element>;
  attention: Record<ElementId, AttentionLevel>;   // the committed state
  pins: Record<ElementId, AttentionLevel>;
  rejected: Set<ElementId>;
  rationale: Record<RationaleId, ElasticRationale>;
  history: Transition[];                          // ledger + undo stack, one structure
  surface: { eligible: Set<string>; live: string[]; revision: string };
}

interface Element {
  id: ElementId;
  assetId: AssetId;
  kind: "section" | "subsection" | "segment" | "table" | "reference-list" | "publisher";
  aliases: string[];                  // deterministic intent matching, see 03 §4
  weight: number;
  semantic: SemanticLevels;           // peripheral / candidate / focused
  tools: string[];                    // tool names this element owns
  interfaceCost: number;
  graph: { parent?: ElementId; cites?: ElementId[]; transcribes?: ElementId[] };
}
```

`history` is both the undo stack and the explainability artifact. One structure, two uses.

---

## 3. One command layer — humans and agents enter here

The product claims humans and agents operate the *same* workspace. That must be literally true in code, not two implementations that resemble each other.

```ts
// src/core/applyIntent.ts
export type ActorSource = "human-ui" | "webmcp-agent";

export async function applyIntent(
  intent: string,
  constraints: string[] = [],
  source: ActorSource,
): Promise<CommitResult> {
  return runPipeline({ kind: "intent", intent, constraints, source });
}
```

`IntentBar.onSubmit()` calls `applyIntent(text, [], "human-ui")`.
`set_intent.execute()` calls `applyIntent(input.intent, input.constraints, "webmcp-agent")`.

The same applies to `pin_element`, `restore_capability` and `undo_last_adaptation` — one command each, two callers. `source` is recorded in the rationale record and is what populates the drawer's "used by the agent" category. It affects *provenance only*, never the computation.

Test 6 in §6 asserts this.

## 4. Pipeline

Every state change follows this path. No side doors.

```
  applyIntent(...)  |  applyPin(...)  |  applyUndo(...)      ← one command layer
                        ↓
              1. applyOverrides(state)        pins, rejections, masks
                        ↓
              2. scoreAll(elements, intent)   deterministic, 03 §3
                        ↓
              3. commitAttention(scores)      hysteresis, dwell, caps, confidence bands
                        ↓
              4. writeRationale(delta)        one record per transition, tagged with source
                        ↓
              5. deriveToolSurface(state)     eligibility + registration diff
                        ↓
        ┌───────────────┴───────────────┐
        ▼                               ▼
  renderDOM(attention)          queueSurface(diff)
  zones + semantic levels        ← DEFERRED, see §5
```

Steps 1–5 are pure functions over state. Only `renderDOM` and the surface application touch the outside world, which is what makes the eval harness possible — it runs 1–5 headlessly and asserts on the output.

## 5. Never unregister a tool during its own execution

**This will bite you if you skip it.** Spec issue #218 (opened by the spec's primary editor, labelled Agenda+, still open) records that **in Chromium today, unregistering a tool unconditionally aborts any in-flight executions.** The editor's own inclination is to keep that behaviour.

Elastic Web hits this directly: an agent calls a tool, the tool changes attention state, the new surface unregisters that same tool, and the tool's own response is aborted before it returns. The agent sees a failure for a call that actually succeeded.

**Rule: eligibility commits immediately; registration changes are applied only after the invoking tool's response has settled.**

```ts
// src/webmcp/registry.ts
let inFlight = 0;
let pending: SurfaceDiff | null = null;

export function queueSurface(diff: SurfaceDiff) {
  pending = mergeDiff(pending, diff);
  if (inFlight === 0) flushSurface();
}

export function withExecutionGuard<T>(fn: () => Promise<T>): Promise<T> {
  inFlight += 1;
  return fn().finally(() => {
    inFlight -= 1;
    if (inFlight === 0 && pending) flushSurface();   // settle, THEN mutate
  });
}
```

Every tool executor is wrapped in `withExecutionGuard`. The human UI path has no in-flight call, so `queueSurface` flushes immediately and the visible transition is not delayed.

This costs about twenty lines and removes an entire category of intermittent, hard-to-reproduce failure — the worst kind to hit while filming on Wednesday morning.

---

## 6. The core function

Build this first.

```ts
// src/core/eligibility.ts
//
// SINGLE SOURCE OF CAPABILITY RULES. deriveToolSurface calls it.
// The tests call it. Nothing re-implements it anywhere.

export function capabilityEligibility(tool: string, state: ElasticState): boolean {
  if (SPINE_TOOLS.includes(tool)) return true;

  const rule = CAPABILITY_RULES[tool];        // declarative table, see 02 §2
  return rule(state);
}

const CAPABILITY_RULES: Record<string, (s: ElasticState) => boolean> = {
  get_document_outline:  s => levelOf(s, "paper")     >= CONTEXT,
  get_document_section:  s => levelOf(s, "paper")     >= CONTEXT,
  get_transcript_segment: s => levelOf(s, "video")    >= CONTEXT,
  list_references:       s => levelOf(s, "references")>= CONTEXT,
  subscribe_newsletter:  s => levelOf(s, "publisher") >= CONTEXT,
  list_related_videos:   s => levelOf(s, "publisher") >= CONTEXT,
  share_asset:           s => levelOf(s, "publisher") >= CONTEXT,
  compare_sources:       s => assetsAt(s, "FOCUSED").length >= 2,
  create_citation:       s => levelOf(s, "paper") === FOCUSED,
};
```

```ts
// src/core/deriveToolSurface.ts
//
// `eligible` is authoritative and always enforced.
// register/unregister are best-effort: agent observation of a tool change
// is implementation-defined (spec issue #230, closed as not planned).

export function deriveToolSurface(state: ElasticState): {
  eligible: Set<string>;
  register: ToolSpec[];
  unregister: string[];
  revision: string;
} {
  const eligible = new Set(ALL_TOOLS.filter(t => capabilityEligibility(t, state)));
  const live = new Set(state.surface.live);
  return {
    eligible,
    register:   [...eligible].filter(n => !live.has(n)).map(specFor),
    unregister: [...live].filter(n => !eligible.has(n) && !SPINE_TOOLS.includes(n)),
    revision:   nextRevision(state),
  };
}
```

Two functions, one rule table. `02-tool-manifest.md` §2 and `CAPABILITY_RULES` must always agree — if you cut a tool, change both and re-run the counts in `01` §2.

---

## 7. The six tests — your build contract

```ts
test("publisher demotion removes exactly the publisher capabilities", () => {
  const d = deriveToolSurface(stateAt("S1"));
  ["subscribe_newsletter", "share_asset", "list_related_videos"]
    .forEach(t => expect(d.eligible.has(t)).toBe(false));
  expect(d.eligible.has("get_attention_state")).toBe(true);      // spine invariant
});

test("compare_sources appears only with two assets FOCUSED", () => {
  expect(deriveToolSurface(stateAt("S0")).eligible.has("compare_sources")).toBe(false);
  expect(deriveToolSurface(stateAt("S1")).eligible.has("compare_sources")).toBe(false);
  expect(deriveToolSurface(stateAt("S2")).eligible.has("compare_sources")).toBe(true);
});

test("spine survives every state", () => {
  for (const s of ["S0","S1","S2","S3","S4"])
    SPINE_TOOLS.forEach(t => expect(deriveToolSurface(stateAt(s)).eligible.has(t)).toBe(true));
});

test("an ineligible tool refuses with a remedy, even if still registered", async () => {
  const res = await compareSources.execute({ asset_ids: ["paper","video"], claim: "x" }, stateAt("S1"));
  expect(res.structuredContent.ok).toBe(false);
  expect(res.structuredContent.reason).toBe("attention_state");
  expect(res.structuredContent.remedy.tool).toBe("set_intent");
});

// ── INVARIANT 5: no human/agent divergence ────────────────────────
// Note: this asserts that BOTH projections agree with the committed
// state and with the shared rule table. It does not restate the rules.
test("DOM and capability surface are projections of one committed state", () => {
  for (const s of ["S0","S1","S2","S3","S4"]) {
    const state = stateAt(s);
    const dom   = renderModel(state);                  // pure: what the human sees
    const caps  = deriveToolSurface(state).eligible;

    for (const [id, level] of Object.entries(state.attention)) {
      expect(dom[id].level).toBe(level);               // UI agrees with state
    }
    for (const tool of ALL_TOOLS) {
      expect(caps.has(tool)).toBe(capabilityEligibility(tool, state));   // caps agree with rules
    }
  }
});

// ── INVARIANT 6: one workspace, two actors ────────────────────────
test("human and agent intent paths produce identical committed state", async () => {
  const viaHuman = await applyIntent("understand the methodology", [], "human-ui");
  reset();
  const viaAgent = await setIntent.execute({ intent: "understand the methodology" });

  expect(stripSource(viaHuman.attention)).toEqual(stripSource(viaAgent.attention));
  expect(stripSource(viaHuman.eligible )).toEqual(stripSource(viaAgent.eligible ));
  // provenance differs, computation does not
  expect(viaHuman.rationale[0].source).toBe("human-ui");
  expect(viaAgent.rationale[0].source).toBe("webmcp-agent");
});
```

**Tests 5 and 6 are the product.** Five prevents the human interface and the agent's capabilities from disagreeing. Six prevents them being computed by different code in the first place. If everything else is red and those two are green, you still have a coherent submission. Write them first.

---

## 6. File layout

```
src/
  core/
    types.ts               ElasticState, Element, ElasticRationale
    applyIntent.ts         ← the one command layer (human + agent)
    eligibility.ts         ← CAPABILITY_RULES, the single rule source
    score.ts               scoreAll — seven terms, alias matching
    commit.ts              hysteresis, dwell, caps, confidence bands
    deriveToolSurface.ts   eligibility set + registration diff
    renderModel.ts         pure: state → what the human sees (needed by test 5)
    rationale.ts           record construction + inline labels
    undo.ts
  webmcp/
    registry.ts            queueSurface, withExecutionGuard, feature detection, revision
    gated.ts               the eligibility wrapper
    tools/spine/ focus/ consequential/
  ui/
    zones/                 IntentBar, FocalPlane, ContextRing, PeripheralBelt, Drawer
    SemanticText.tsx       renders peripheral | candidate | focused
    RationaleLabel.tsx     inline ↑/↓ annotation + expand
    CapabilityIndicator.tsx
    Transition.tsx         batched 1.4s, reduced-motion aware
  fixture/
    paper.ts video.ts transcript.ts references.ts dataset.ts publisher.ts
    elements.ts            ~30 elements: aliases + SemanticLevels
evals/
  cases.ts run.ts baseline.ts
```

## 7. Graceful degradation

```ts
if (!supported()) {
  // Page renders fully. Intent bar works — human-driven adaptation only.
  // No registration. No errors. No console noise.
}
```

Judges may open the URL in a browser without WebMCP. If it throws or renders blank, Execution is gone. Test in Safari before submitting.

## 8. Instrumentation

| Event | Fields |
|---|---|
| `intent_set` | text, parse confidence, ms to first paint |
| `attention_delta` | promoted[], demoted[], suppressed-by-hysteresis[] |
| `capability_delta` | eligible count before/after, registered[], unregistered[], revision |
| `tool_call` | name, eligible?, revision, ok, ms |
| `tool_refused` | name, reason, remedy offered |
| `human_override` | pin / reject / restore / undo, elementId |

`human_override` is your adaptation-quality metric and the honest answer if a judge asks how you know the adaptation is any good.

## 11. Build order — frozen

1. Deployed hello world
2. One real WebMCP tool, called from ChatGPT's browser
3. **Observation spike**
4. `types.ts` + fixture elements (aliases, SemanticLevels)
5. `eligibility.ts` — CAPABILITY_RULES
6. `deriveToolSurface.ts` + `renderModel.ts`
7. **The six tests** — write 5 and 6 first
8. `applyIntent.ts` command layer
9. `score.ts` + `commit.ts`, verified against the transition table
10. `registry.ts` + `gated.ts` + `withExecutionGuard` + spine tools
11. Plain UI, five zones, no motion
12. S0 → S1
13. S1 → S2, `compare_sources` emergence
14. Pinning (S3)
15. Rationale labels
16. Drawer + undo (S4)
17. Motion and reduced motion
18. Eval harness
19. Video

**No visual polishing before G2.** That discipline is worth more than any additional feature.
