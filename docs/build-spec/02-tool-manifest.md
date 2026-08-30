# 02 — Tool Manifest

Verified against the W3C explainer, ChatGPT's site-tools documentation, and spec issue #230.

---

## 1. The governing rule

> **Attention state governs both interface prominence and agent capability availability — registration where the host supports it, eligibility always.**

| Attention level | Human treatment | Capability |
|---|---|---|
| FOCUSED | Full semantic resolution, actions inline | All tools for element, writes enabled |
| CONTEXT | Readable, grouped with focal object | Read tools available |
| PERIPHERAL | Reduced scale and contrast | None — discoverable via `list_drawer` |
| DRAWER | Collapsed, categorised | None — discoverable via `list_drawer` |
| MASKED | Absent | Never available, never listed |

---

## 2. The 17

Exactly 8 + 8 + 1. Every number in the pack derives from this table, so do not add a tool without updating `01-fixture-and-demo-states.md` §2.

### Tier 0 — Spine (8, always active, never unregistered)

| Tool | Input | Returns | readOnlyHint |
|---|---|---|---|
| `get_workspace` | — | Assets with attention level, pin state, capability count | ✓ |
| `set_intent` | `{ intent, constraints? }` | New attention state, rationale ids, capability delta | ✗ |
| `get_attention_state` | `{ element_id? }` | Level, seven score terms, rationale, last transition | ✓ |
| `search_workspace` | `{ query, asset_ids? }` | Ranked hits: asset id, locator, snippet | ✓ |
| `list_drawer` | — | Demoted elements: label, origin, reason, restore handle | ✓ |
| `pin_element` | `{ element_id, level }` | Confirmation + attention delta | ✗ |
| `restore_capability` | `{ element_id }` | Confirmation; restores to CONTEXT | ✗ |
| `undo_last_adaptation` | — | Reverted state + what was undone | ✗ |

**Hard invariant: the spine is never unregistered.** The agent can always orient, enumerate what was demoted, and restore it. UX requirement and safety property — an adaptation can never strand the agent.

`get_attention_state` is the tool no other submission will have. It makes the rationale ledger readable by the agent, turning "the interface explains itself to the user" into "the interface explains itself to both parties in the same words." Name it in the writeup.

### Tier 1 — Focus-gated (8)

| Tool | Precondition | untrustedContentHint |
|---|---|---|
| `get_document_outline` | paper ≥ CONTEXT | |
| `get_document_section` | paper ≥ CONTEXT | |
| `get_transcript_segment` | video ≥ CONTEXT | ✓ |
| `list_references` | references ≥ CONTEXT | ✓ |
| `compare_sources` | **≥2 assets at FOCUSED** | ✓ |
| `subscribe_newsletter` | publisher ≥ CONTEXT | |
| `list_related_videos` | publisher ≥ CONTEXT | ✓ |
| `share_asset` | publisher ≥ CONTEXT | |

The three publisher tools exist to be taken away — they are ~10-line stubs and they carry the compaction beat. Do not cut them to save time; cut the dataset tool instead (already done: the dataset is content with no tool).

`compare_sources` requires **FOCUSED**, not CONTEXT. Visible is not attended. This is what makes its emergence at S2 genuine.

### Tier 2 — Consequential (1)

| Tool | Precondition | readOnlyHint | Confirmation |
|---|---|---|---|
| `create_citation` | paper = FOCUSED | ✗ | Always — preview, then confirm |

Keep Tier 2 at one. Consequential surface area is demo risk, not demo value.

---

## 3. Dual-path availability — the most important section

**The problem.** Per the spec, `registerTool` notifies *other documents* of a tool change; whether the browser's built-in agent gets a fresh observation is **implementation-defined**. Issue #230 asked to mandate it with MUST and was **closed as not planned**.

**The design.** Two independent gates:

| Gate | Mechanism | Host-dependent |
|---|---|---|
| **Eligibility** | Executor checks attention state at call time | **No — authoritative** |
| **Registration** | `registerTool` / `AbortController.abort()` | Yes — best effort |

```ts
function gated(spec: ToolSpec, requires: (s: State) => boolean, hint: string): ToolSpec {
  return {
    ...spec,
    async execute(input) {
      if (!requires(store.state)) {
        return {
          content: [{ type: "text", text: `Not available in the current focus. ${hint}` }],
          structuredContent: {
            ok: false,
            reason: "attention_state",
            hint,
            currentFocus: focusedIds(store.state),
            remedy: { tool: "set_intent", or: "pin_element" },
          },
        };
      }
      return spec.execute(input);
    },
  };
}

export const compareSources = gated(
  compareSourcesImpl,
  s => assetsAt(s, "FOCUSED").length >= 2,
  "Bring a second source into focus first — try set_intent, or pin_element on the video."
);
```

**Why this is better, not merely safer:**

1. **The refusal teaches.** `reason` + `hint` + `remedy` tell the agent how to make the capability available. More interesting than a tool silently vanishing, and filmable.
2. **No dead handles.** A stale handle gets an explanation, not an opaque failure.
3. **Host-independent demo.** If the judging browser refreshes surfaces, you get the visible count change *and* the guard. If not, the whole interaction still works, narrated through tool results.

Both paths ship. Never let the demo depend on registration alone.

---

## 4. Registration wrapper

```ts
// src/webmcp/registry.ts
const live = new Map<string, AbortController>();
let revision = 0;

export function supported(): boolean {
  return typeof (document as any).modelContext?.registerTool === "function";
}

export async function applySurface(diff: { register: ToolSpec[]; unregister: string[] }) {
  if (!supported()) return;                    // graceful no-op; page still works
  revision += 1;

  // Unregister first: any observable intermediate state is a valid SUBSET,
  // never a mix of stale and fresh. The spec exposes no atomic swap —
  // provideContext() was removed in the March 2026 revision.
  for (const name of diff.unregister) {
    live.get(name)?.abort();
    live.delete(name);
  }
  for (const spec of diff.register) {
    if (live.has(spec.name)) continue;
    const c = new AbortController();
    await (document as any).modelContext.registerTool({ ...spec }, { signal: c.signal });
    live.set(spec.name, c);
  }
  return { revision: `r${revision}`, live: [...live.keys()] };
}
```

Batch the whole diff inside one microtask so the intermediate window is sub-millisecond.

## 5. A representative tool

```ts
export const setIntent: ToolSpec = {
  name: "set_intent",
  description: "Set what the user is currently trying to do. The page re-renders around it.",
  inputSchema: {
    type: "object",
    properties: {
      intent: { type: "string", description: "The user's current goal, in their words." },
      constraints: { type: "array", items: { type: "string" },
                     description: "Optional hard constraints, e.g. 'peer-reviewed sources only'." },
    },
    required: ["intent"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: false },
  async execute({ intent, constraints }) {
    const delta   = commitAttention(scoreAll(store.elements, { intent, constraints }));
    const surface = deriveToolSurface(store.state);
    const applied = await applySurface(surface);

    return {
      content: [{ type: "text", text:
        `Focus set to "${intent}". ${delta.promoted.length} promoted, ${delta.demoted.length} demoted. ${surface.eligible.size} capabilities active.` }],
      structuredContent: {
        ok: true,
        attentionDelta: delta.records,
        capabilityDelta: {
          eligible: [...surface.eligible],
          registered: surface.register.map(t => t.name),
          unregistered: surface.unregister,
          revision: applied?.revision,
        },
      },
    };
  },
};
```

### Result envelope

```ts
interface ElasticToolResult {
  content: Array<{ type: "text"; text: string }>;   // ≤2 sentences, agent-facing
  structuredContent: {
    ok: boolean;
    reason?: "attention_state";
    hint?: string;
    remedy?: { tool: string; or?: string };
    attentionDelta?: Array<{ elementId: string; from: AttentionLevel; to: AttentionLevel; rationaleId: string }>;
    capabilityDelta?: { eligible: string[]; registered: string[]; unregistered: string[]; revision?: string };
    payload?: unknown;
  };
}
```

Keep `text` short. Chrome's guidance is explicit that verbose descriptions and outputs trip agent guardrails.

---

## 6. Annotations and hygiene

- `readOnlyHint: true` on all Tier 0 reads and Tier 1 fetches.
- `untrustedContentHint: true` on every tool returning text you did not author — transcript, references, related videos. Chrome names contaminated outputs as one of two attack vectors; annotating correctly shows you understand the boundary.
- **Rationale never goes in annotations.** Separate registry keyed by `rationaleId`. At least one judge will check.
- `exposedTo` unset — built-in agent default. No cross-origin exposure.
- Always feature-detect. On a browser without WebMCP the page renders and works normally, no console noise.

## 7. Registration revision

Every surface change increments a monotonic revision, recorded in `provenance.registrationRevision`. A call arriving against a stale revision returns a structured error directing the agent to re-read `get_attention_state`.

Think of this as **state-version consistency**, not cryptographic capability identity. The spec itself acknowledges race conditions around unregistering and quickly re-registering a tool with the same name and a different schema. Revision is one layer of defence in depth alongside origin restriction and the ledger — describe it that way and don't imply more.

## 8. Never mutate the surface during a tool's own execution

Spec issue #218 — opened by the spec's primary editor, labelled Agenda+, still open — records that **in Chromium today, unregistering a tool unconditionally aborts any in-flight executions.** The editor's stated inclination is to keep that behaviour.

Elastic Web hits this directly: an agent calls a tool → the tool changes attention state → the new surface unregisters that tool → the tool's own response is aborted before it returns. The agent sees a failure for a call that succeeded.

**Rule: eligibility commits immediately; registration changes are deferred until the invoking tool's response has settled.** Implementation in `04-architecture.md` §5 — about twenty lines, and it removes an entire class of intermittent failure you do not want to meet while filming.

## 9. Cut order

Cut in this order if behind:

1. `share_asset` and `list_related_videos` — **keep `subscribe_newsletter`**, the compaction beat needs one publisher tool
2. `create_citation` and all of Tier 2
3. `search_workspace`
4. `get_document_outline` (fold into `get_document_section`)

**Never cut:** `set_intent`, `get_attention_state`, `pin_element`, `list_drawer`, `restore_capability`, `undo_last_adaptation`, `compare_sources`, the eligibility guard. Those eight are the product.

If you cut, update the counts in `01-fixture-and-demo-states.md` §2 **before** recording the video.
