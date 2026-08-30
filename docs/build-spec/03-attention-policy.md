# 03 — Attention Policy

Deterministic by design. No model call and no embedding runtime in the scoring path, so the eval is reproducible and the demo cannot surprise you on camera.

---

## 1. Why this is deliberately conservative

Adaptive interfaces have a poor empirical record and the failure mode is documented. Static menus beat adaptive ones on speed; user-controlled (adaptable) menus beat both on satisfaction. Adaptive split menus degrade specifically when selection frequency shifts. Colour highlighting has never been shown to beat a non-adaptive baseline.

One technique wins cleanly: **ephemeral adaptation** — predicted items appear immediately, non-predicted items fade in — which was faster than static when prediction accuracy was high and *not significantly slower when it was low*, while preserving spatial consistency.

That bounded-downside property is the target. Two non-negotiable consequences:

1. **Position is never the adaptation.** Elements change scale, weight, contrast, semantic detail and zone membership. Within a zone, order is stable. Moving targets is where adaptive interfaces lose.
2. **When unsure, do nothing structural.** See §6.

State this lineage honestly in the writeup. Claiming to have invented adaptive UI in front of this panel is a bad trade; showing you designed around its known failure modes is a strong one.

---

## 2. Levels

```
FOCUSED    (3)  focal plane      full semantic resolution, all tools, writes allowed
CONTEXT    (2)  context ring     readable, grouped with focal object, read tools
PERIPHERAL (1)  peripheral belt  reduced scale and contrast, no tools
DRAWER     (0)  app drawer       collapsed, categorised, no tools
MASKED     (—)  not rendered     permissions/unavailability; never available, never listed
```

MASKED is a hard state, not a score outcome.

---

## 3. The score

All inputs normalised 0–1.

```
relevance = 0.40 · explicitIntentMatch
          + 0.25 · taskRelevance
          + 0.15 · capabilityFit
          + 0.10 · deviceFit
          + 0.10 · interactionEvidence

score     = relevance − 0.15 · interfaceCost − 0.20 · uncertainty
```

| Term | Definition | Implementation |
|---|---|---|
| `explicitIntentMatch` | Intent string against the element's semantic descriptor | **Deterministic alias map — see §4. No embeddings.** |
| `taskRelevance` | Structural relation to the focused element | Graph distance in the content model: same section, cited-by, transcribed-from. Not similarity — this is what makes it explainable. |
| `capabilityFit` | Does this element expose a tool that advances the intent? | Derived from the manifest. **This is what makes WebMCP an input to adaptation, not only an output.** Say so in the writeup. |
| `deviceFit` | Viewport and input affordance | Constant per session in the demo. Keep the term so the responsive beat has something behind it. |
| `interactionEvidence` | Keyboard focus and repeat selection | Dwell and pointer contribute **at most 0.2** of this term. Cursor is not intent. |
| `interfaceCost` | Screen area and reading cost of promoting | Precomputed per element. |
| `uncertainty` | Intent-parse ambiguity + evidence sparsity | Drives §6. |

**All seven numbers are displayed** in the expanded rationale panel. That is the "simple first layer, deeper explainability underneath" promise made concrete.

---

## 4. Intent matching without embeddings

You have ~30 elements and five states. An embedding runtime buys nothing and costs model loading, a vector package, latency and browser-compatibility risk. Your architectural promise is determinism, not similarity sophistication.

Each element carries an alias set:

```ts
"paper.methodology": {
  aliases: ["methodology", "method", "methods", "how they did it", "study design",
            "participants", "setting", "instrumentation", "variables", "analysis"],
  weight: 1.0,
},
"paper.methodology.participants": {
  aliases: ["participants", "subjects", "sample", "how many people", "n ="],
  weight: 0.9,
},
```

```ts
function explicitIntentMatch(el: Element, intent: string): number {
  const t = tokenize(intent.toLowerCase());
  const hits = el.aliases.filter(a => t.includes(a) || intent.toLowerCase().includes(a));
  if (hits.length === 0) return 0;
  return Math.min(1, 0.5 + 0.25 * hits.length) * el.weight;
}
```

Authoring alias sets for 30 elements is about ninety minutes. It is deterministic, debuggable, and it will not fail on stage.

---

## 5. Thresholds with dead band

| Transition | Promote at ≥ | Demote below | Dead band |
|---|---|---|---|
| → FOCUSED | 0.72 | 0.58 | 0.14 |
| → CONTEXT | 0.50 | 0.38 | 0.12 |
| → PERIPHERAL | 0.28 | 0.18 | 0.10 |
| → DRAWER | — | < 0.18 | — |

Capacity caps, applied after thresholding, by rank: **FOCUSED max 5**, **CONTEXT max 7**.

An element that clears the threshold but loses on rank drops one level, and its rationale reads **"relevant, below focal capacity"** — not "not relevant." That is the difference between a system that appears wrong and one that appears constrained.

---

## 6. Authority overrides

Evaluated **before** scoring. Ladder: explicit statement > pinning > task state > keyboard focus > dwell > history.

| Condition | Effect |
|---|---|
| Pinned (by user or agent via `pin_element`) | Floor at pinned level, immune to demotion, `canDemote: false` |
| Rejected by user | DRAWER, sticky for session |
| Named in current intent | `explicitIntentMatch = 1.0` |
| MASKED | Not rendered, not available, excluded from ranking |
| `undo_last_adaptation` | Restore prior state; suppress the reverted transition for 30s |

**Preserve is a constraint, not a preference.** A pinned element has a minimum attention level and cannot be silently demoted. This is the semantic core of the S3 beat.

## 7. Confidence bands

`confidence = 1 − uncertainty`

| Band | Behaviour |
|---|---|
| ≥ 0.75, reversible, read-only | Apply automatically. Show rationale. Offer undo. |
| 0.45 – 0.75 | **Propose without restructuring.** Element gains semantic detail *in place* with an accept affordance. Zones do not change. |
| < 0.45 | No change. One clarifying question in the intent bar. |
| Any confidence, consequential | Never automatic. Preview, then confirm. |

The middle band saves you. A wrong guess costs nothing, and a system visibly declining to reorganise when unsure films better than one that always looks confident.

## 8. Stability budget

1. **Minimum dwell** — an element promoted to FOCUSED cannot be demoted for 4 seconds.
2. **One restructure per intent event** — changes accumulate and apply on the next event or explicit correction. **The interface never moves while the user is reading.**
3. **Batched transition** — all deltas animate as a single 1.4s transition.
4. **Position stability** — within a zone, order does not change.

---

## 9. Semantic resolution levels

Specify as data, not CSS. Each element carries three authored representations:

```ts
interface SemanticLevels {
  peripheral: string;   // one line   — "Methodology · pp. 4–7"
  candidate: string;    // one phrase — "Methodology · participants · dataset · evaluation"
  focused: string[];    // full structure — subheadings plus inline actions
}
```

Authoring these for ~30 elements is roughly two hours and it is the single highest-leverage block of time in the build. It is what makes the transformation look designed rather than animated.

## 10. Demotion guarantees

Every demoted element carries, without exception: a drawer location and label, provenance, the demotion reason in one clause, and a one-step restore reachable by both human and agent.

Nothing is deleted. Nothing becomes unreachable. This is the licence to adapt at all.

## 11. Rationale record

Separate registry, never in tool annotations.

```ts
interface ElasticRationale {
  id: string;
  subject: { kind: "asset" | "content" | "webmcp-tool" | "tool-result"; id: string; label: string };
  provenance: { origin: string; toolName?: string; registrationRevision?: string };
  adaptation: { operation: "promote" | "demote" | "retain" | "reveal" | "mask"; from: AttentionLevel; to: AttentionLevel };
  why: { summary: string; goalContribution: string;
         expectedBenefit?: { interactionsSaved?: number; estimatedTimeSavedMs?: number } };
  how: { explicitIntentMatch: number; taskRelevance: number; capabilityFit: number;
         deviceFit: number; interactionEvidence: number; interfaceCost: number; uncertainty: number };
  safety: { readOnly: boolean; consequential: boolean; reversible: boolean; confirmationRequired: boolean };
  confidence: number;
  controls: { canAccept: boolean; canReject: boolean; canPin: boolean; canUndo: boolean };
}
```

### Display

Inline, brief, adjacent — never a modal:

```
Methodology
↑ Direct intent match · read-only site capability

Related videos
↓ Outside current goal · preserved in drawer

Results
↑ Pinned by you · protected from demotion
```

Expanding reveals the seven `how` terms and the confidence.

**Only claim `expectedBenefit` numbers you actually measure.** Inventing "6 steps saved" is the fastest way to lose a judge who checks.
