# Elastic Web — Tool Surface & Adaptation Policy

**Status:** decision-complete for implementation. Locks items 2, 3 and 7 of the handover's "immediate next task", and the parts of 4 that the tool layer depends on.
**Out of scope here:** fixture copy, typography states, animation curves, eval harness, deployment checklist.

---

## 0. The one rule everything else derives from

> **Attention level determines tool registration.**
> The same score that decides whether a human sees an element in the focal plane decides whether the agent can call that element's tools.

This is the answer to the judge test *"would this product remain essentially the same without WebMCP?"* — no, because the output of the adaptation engine is not just a layout. It is a **live tool surface**, re-registered through `toolchange` every time intent shifts. Remove WebMCP and half the product's output has nowhere to go.

State this claim explicitly in the written submission. It is the single most WebMCP-native thing in the design.

### Two corrections to the handover

**1. The proposed tool list is a read API, not a semantic surface.** `list_assets`, `get_document_outline`, `get_document_section`, `search_document`, `get_transcript_segment` are all document fetches. An agent calling them changes nothing on screen, which breaks the handover's own critical loop (*tool invocation → shared state changes → rationale → interface reforms*). The manifest below adds the missing half: tools that **read and write the attention state itself**.

**2. Nothing in the handover lets the agent inspect *why* the interface looks the way it does.** `get_attention_state` fixes this. It is the tool that makes the ledger bidirectional — the agent can read the rationale, disagree with it, and propose a correction, in the same record the human sees. No other submission will have this.

---

## A. Tool surface

### A.1 Tiers and lifecycle

| Tier | Registration | Unregistration | Purpose |
|---|---|---|---|
| **0 — Spine** | At load, permanently | Never | Orientation, intent, correction, recovery |
| **1 — Focus-gated** | When owning element reaches CONTEXT or FOCUSED | On demotion below threshold | The compaction proof |
| **2 — Consequential** | When owning element is FOCUSED | On demotion below FOCUSED | Write actions, always confirmed |

**Hard invariant: Tier 0 is never unregistered.** An agent must always be able to orient itself, find what was demoted, and put it back. This is both a UX requirement and the mitigation for tool-surface instability — the agent is never stranded, because `list_drawer` always tells it what exists and `restore_capability` always brings it back.

### A.2 Manifest

All tools registered via `document.modelContext.registerTool()`. Tier 1 and 2 registrations hold an `AbortController` whose signal is aborted on demotion.

#### Tier 0 — Spine (8 tools, always live)

| Tool | Input | Returns | readOnly |
|---|---|---|---|
| `get_workspace` | — | Asset inventory with current attention level, pin state, and available tool count per asset | ✓ |
| `set_intent` | `{ intent: string, constraints?: string[] }` | New attention state + rationale ids + tool surface delta | ✗ (reversible) |
| `get_attention_state` | `{ elementId?: string }` | Current level, score breakdown, rationale record, what changed last and why | ✓ |
| `search_workspace` | `{ query: string, assetIds?: string[] }` | Ranked hits with asset id, locator, snippet | ✓ |
| `list_drawer` | — | Demoted elements with label, provenance, demotion reason, restore handle | ✓ |
| `pin_element` | `{ elementId: string, level: "focused" \| "context" }` | Confirmation + attention delta | ✗ (reversible) |
| `restore_capability` | `{ elementId: string }` | Confirmation + re-registered tool names | ✗ (reversible) |
| `undo_last_adaptation` | — | Reverted state + what was undone | ✗ (reversible) |

#### Tier 1 — Focus-gated

| Tool | Registered when | Input | untrustedContentHint |
|---|---|---|---|
| `get_document_outline` | paper ≥ CONTEXT | — | |
| `get_document_section` | paper = FOCUSED | `{ sectionId }` | |
| `get_transcript_segment` | video ≥ CONTEXT | `{ startMs, endMs }` or `{ query }` | ✓ |
| `list_references` | references ≥ CONTEXT | `{ sectionId? }` | ✓ |
| `compare_sources` | **≥2 assets ≥ CONTEXT** | `{ assetIds: string[], claim: string }` | ✓ |
| `subscribe_newsletter` | publisher block ≥ CONTEXT | `{ email }` | |
| `share_asset` | publisher block ≥ CONTEXT | `{ assetId, channel }` | |
| `list_related_videos` | publisher block ≥ CONTEXT | — | ✓ |

`compare_sources` is the best `toolchange` demo in the manifest: it does not exist until two sources are simultaneously in play, and it appears mid-session without a page load. Put it on camera.

The three publisher tools exist to be **taken away**. At load, all 17 tools are registered. After the first `set_intent`, the publisher block demotes and its tools unregister, leaving 9–11. That delta is the compaction claim, and it is measurable on camera in under ten seconds.

#### Tier 2 — Consequential

| Tool | Registered when | readOnly | Confirmation |
|---|---|---|---|
| `create_citation` | paper = FOCUSED | ✗ | Always — preview then confirm |

Keep Tier 2 at one tool. Consequential surface area is demo risk, not demo value.

### A.3 Result shape

Every tool returns standard MCP content blocks plus a structured payload on the same envelope:

```ts
interface ElasticToolResult {
  content: Array<{ type: "text"; text: string }>;   // agent-facing summary, ≤2 sentences
  structuredContent: {
    ok: boolean;
    attentionDelta?: Array<{
      elementId: string;
      from: AttentionLevel;
      to: AttentionLevel;
      rationaleId: string;
    }>;
    toolSurfaceDelta?: {
      registered: string[];
      unregistered: string[];
      revision: string;          // monotonic, see A.5
    };
    payload?: unknown;           // tool-specific
  };
}
```

`ElasticRationale` records stay in the **separate rationale registry** described in the handover, keyed by `rationaleId`. Do not put them in tool annotations — the handover is right about this and the judges include people who will check.

The agent-facing `text` block must stay short. Chrome's guidance is explicit that verbose tool descriptions and outputs trip agent guardrails.

### A.4 Security annotations

- `readOnlyHint: true` on all Tier 0 reads and all Tier 1 fetches.
- `untrustedContentHint: true` on every tool returning third-party text — transcript segments, references, related videos. This is the correct signal for content you did not author and it costs one line.
- `exposedTo` left unset (built-in agent default) for the hackathon. Do not add cross-origin exposure; it adds attack surface and no judge value.
- Set `Permissions-Policy: tools=(self)` and a CSP that blocks third-party script. A page with a dynamic tool surface and unrestricted third-party JS is the exact shape of the Mid-Session Tool Injection attack published in June 2026. You will not be attacked in a hackathon, but stating this control in the writeup reads as competence.

### A.5 Registration revision

Every registration change increments a monotonic `revision` string, recorded in `ElasticRationale.provenance.registrationRevision`.

Purpose: a tool call arriving against a stale revision is rejected with a structured error telling the agent to re-read `get_attention_state`. Without this, an agent holding a tool handle from before an intent shift can invoke against an attention state that no longer exists.

This also gives you a one-line answer to the strongest security question a judge can ask: *"your tool surface mutates mid-session — how do you know a tool is the one you registered?"* Origin binding plus revision plus the ledger.

---

## B. Adaptation policy

### B.1 Levels

```
FOCUSED    (3)  focal plane      tools registered, writes allowed
CONTEXT    (2)  context ring     read tools registered
PERIPHERAL (1)  peripheral belt  no tools registered, visible
DRAWER     (0)  app drawer       no tools registered, listed
MASKED     (—)  not rendered     never registered, not listed
```

MASKED is not a score outcome. It is a hard state from permissions or unavailability, per the handover's masking analogy.

### B.2 Deterministic score

All inputs normalised 0–1. No model call in the scoring path — the handover requires deterministic scoring and you need reproducibility for the eval suite.

```
relevance = 0.40·explicitIntentMatch
          + 0.25·taskRelevance
          + 0.15·capabilityFit
          + 0.10·deviceFit
          + 0.10·interactionEvidence

score     = relevance − 0.15·interfaceCost − 0.20·uncertainty
```

Field definitions, in the order the demo will exercise them:

- **explicitIntentMatch** — lexical + embedding similarity between the current `intent` string and the element's semantic descriptor. An asset named directly in the intent scores 1.0.
- **taskRelevance** — structural relation to the currently focused element (same section, cited by, transcribed from). Graph distance, not similarity.
- **capabilityFit** — does this element expose a tool that advances the stated intent? Derived from the tool manifest, which is what makes WebMCP an *input* to adaptation rather than only an output.
- **deviceFit** — viewport and input affordance. Constant per session in the demo; keep the term so the cross-device beat at 2:10 has something real behind it.
- **interactionEvidence** — keyboard focus and repeat selection only. Per the handover, dwell and pointer contribute at most 0.2 of this term. Cursor is not intent.
- **interfaceCost** — screen area and reading cost of promoting this element.
- **uncertainty** — intent parse ambiguity + evidence sparsity. Drives the confidence bands in B.5.

### B.3 Thresholds with dead band

Promotion and demotion use different thresholds. The gap is the hysteresis that stops the interface oscillating when a score sits on a boundary.

| Transition | Promote at ≥ | Demote below |
|---|---|---|
| → FOCUSED | 0.72 | 0.58 |
| → CONTEXT | 0.50 | 0.38 |
| → PERIPHERAL | 0.28 | 0.18 |
| → DRAWER | — | < 0.18 |

Capacity caps applied after thresholding, by rank:

- FOCUSED: max 5 elements
- CONTEXT: max 7 elements

An element that clears the threshold but loses on rank goes to the next level down and its rationale reads *"relevant, below focal capacity"* — not *"not relevant"*. The distinction matters; it is the difference between a system that seems wrong and one that seems constrained.

### B.4 Stability budget

Adaptive interfaces lose to static ones through thrash, not through bad ranking. Four constraints:

1. **Minimum dwell.** An element promoted to FOCUSED cannot be demoted for 4 seconds.
2. **One restructure per intent event.** Score changes between intent events accumulate and apply on the next event or on explicit user correction. The interface does not move while the user is reading.
3. **Batched transition.** All deltas from one event animate as a single 1.2–1.8s transition, matching the storyboard.
4. **Position is never the adaptation.** Elements change scale, weight, contrast, semantic detail and zone membership. Within a zone, order is stable. This is deliberate: the controlled studies that adaptive menus lose are the ones that move targets, and the technique that wins (ephemeral adaptation) is the one that changes salience while preserving spatial consistency.

### B.5 Authority overrides

Hard rules, evaluated before scoring. These implement the handover's authority ladder.

| Condition | Effect |
|---|---|
| Element pinned by user or by agent via `pin_element` | Floor at pinned level, immune to demotion, `canDemote: false` |
| Element rejected by user | DRAWER, sticky for session |
| Element named in current intent string | `explicitIntentMatch = 1.0` |
| Element MASKED | Not rendered, not registered, excluded from ranking |
| `undo_last_adaptation` called | Restore prior state, suppress the reverted transition for 30s |

**The 1:25 demo beat maps to exactly two calls:** *"Prioritize the peer-reviewed paper, but preserve the video's explanation"* → `pin_element(paper, "focused")` + `pin_element(video, "context")`. The video is protected from demotion rather than merely ranked below the paper. Make sure the rationale label says so, because that is the moment a judge sees human judgment and agent execution as distinct things.

### B.6 Confidence bands

`confidence = 1 − uncertainty`

| Band | Behaviour |
|---|---|
| ≥ 0.75, reversible, read-only | Apply automatically. Show rationale. Offer undo. |
| 0.45 – 0.75 | **Propose without restructuring.** Candidate treatment — the element gains semantic detail in place, with an accept affordance. Zones do not change. |
| < 0.45 | No change. Ask one clarifying question in the intent bar. |
| Any confidence, consequential | Never automatic. Preview then confirm. |

The middle band is the one that will save you. It is where a wrong guess costs nothing, and it is a visible, filmable demonstration of a system that knows what it doesn't know.

### B.7 Demotion guarantees

Every demoted element must carry, without exception:

- a drawer location and label
- provenance (which origin supplied it)
- the demotion reason, in one clause
- a one-step restore, reachable by both human and agent

Nothing is deleted. Nothing becomes unreachable. The drawer is the residual connection in the Transformer analogy and it is also the reason this design is defensible against the standard objection to adaptive interfaces.

---

## C. The binding

| Attention level | Human treatment | Tool registration |
|---|---|---|
| FOCUSED | Full semantic resolution, actions inline | All tools for element, writes enabled |
| CONTEXT | Readable, grouped with focal object | Read tools only |
| PERIPHERAL | Reduced scale and contrast | None — discoverable via `list_drawer` |
| DRAWER | Collapsed, categorised | None — discoverable via `list_drawer` |
| MASKED | Absent | Never registered, never listed |

Implement this as a single pure function:

```ts
function deriveToolSurface(state: AttentionState): {
  register: ToolSpec[];
  unregister: string[];
  revision: string;
}
```

One function, called after every attention transition. It emits the registration diff, bumps the revision, and writes the rationale records. Both the DOM renderer and the WebMCP layer consume its output.

If you build nothing else tonight, build this function and its test. Everything else in the demo is a consumer of it.

---

## D. What the demo needs from this layer

| Beat | Depends on |
|---|---|
| 0:15 first transformation | `set_intent` → deriveToolSurface → batched 1.2–1.8s transition |
| 0:35 WebMCP proof | Tool count 17 → 9, shown live, with `toolchange` firing |
| 0:55 second transformation | `compare_sources` appearing mid-session |
| 1:25 mixed initiative | Two `pin_element` calls, distinct rationale labels |
| 1:50 drawer | `list_drawer` + `restore_capability` round trip |
| 2:30 evidence | Tool-call counts and completion time, WebMCP vs. baseline |

For 2:30, the honest and easy baseline is the same fixture with a static full tool surface. Measure tool calls to task completion and incorrect tool selections across your 10 deterministic cases. That is a real measurement you can run tomorrow, it isolates the compaction effect, and it does not require you to build a screenshot-driven comparison you don't have time for.

---

## E. Two decisions still open

1. **Does the agent get `pin_element`, or only the human?** I have given it to the agent because the 1:25 beat needs it and because an agent that can only read the attention state is a weaker claim. The cost is that an agent can now protect an element from the policy. Acceptable given everything is logged and reversible, but it is your call.

2. **Publisher tools at load.** Registering `subscribe_newsletter` and friends at load is slightly artificial — a real site would have them anyway, but you are adding them partly to make the compaction delta visible. This is defensible and I would keep it, but do not overstate the 17 → 9 number in the writeup. Describe it as what it is: the publisher's full surface reducing to the task's surface.
