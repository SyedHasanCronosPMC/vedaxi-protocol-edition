# Elastic Web — G3A Functional Semantic UI

## Current status

Accepted:

```text
G1 = PARTIAL
G2 = PASS
```

G1 remains pending target WebMCP host discovery/execution/refresh verification.

Do not work on G1 in this phase.

G2 is complete and accepted based on:

- 10/10 tests passing
- deterministic S0/S1/S2 transitions
- transcript-level fixture fidelity
- asset projection
- centralized capability eligibility
- stale-registration refusal
- shared command path
- deferred surface mutation
- undo consistency
- build and lint passing

Your task now is to build the **smallest functional semantic UI** that renders the already-committed attention state.

Do not redesign the engine.

Do not start final motion polish yet.

---

# 1. Read before changing code

Read:

```text
D:\Github\Elastic Web\docs\build-spec\01-fixture-and-demo-states.md
D:\Github\Elastic Web\docs\build-spec\03-attention-policy.md
D:\Github\Elastic Web\docs\build-spec\04-architecture.md
D:\Github\Elastic Web\docs\build-spec\05-ui-motion-accessibility.md
```

Also inspect the current implementation under:

```text
src/core
src/fixture
src/webmcp
src
```

Use the current repository state as the implementation source of truth.

Do not duplicate state logic in the UI.

---

# 2. Objective

Build a functional, non-polished UI proving:

```text
Committed Attention State
        ↓
Human Render Model
        ↓
Visible Semantic Foveation
```

The UI must visibly represent the exact S0, S1 and S2 committed states already validated in G2.

The central proof is:

> **The page reorganizes around explicit intent because the render model is a projection of the same committed state that governs agent capability eligibility.**

This phase is about correctness and clarity, not final aesthetics.

---

# 3. Required UI structure

Implement the five-zone structure from the authoritative specification.

At minimum:

```text
Intent Bar
Focal Plane
Context Ring
Peripheral Belt
App Drawer
```

The exact component names may vary, but the semantics must remain.

Recommended equivalents:

```text
src/ui/IntentBar.tsx
src/ui/FocalPlane.tsx
src/ui/ContextRing.tsx
src/ui/PeripheralBelt.tsx
src/ui/Drawer.tsx
src/ui/SemanticText.tsx
src/ui/RationaleLabel.tsx
src/ui/CapabilityIndicator.tsx
```

Follow the current codebase organization where sensible.

Do not introduce a heavy component framework unless already present.

---

# 4. Shared command path — mandatory

The human intent bar must route through the same application command already validated in G2.

Do NOT directly manipulate attention state from the React component.

Required conceptual path:

```text
IntentBar submit
    ↓
applyIntent(intent, "human-ui")
    ↓
committed state
    ↓
render model
    ↓
React UI
```

Do not:

```text
IntentBar
→ local React state
→ manual zone changes
```

The UI must be a projection, not a second state machine.

---

# 5. S0 visible state

Render the default publisher/research workspace.

Use the actual fixture content.

S0 should look credible, not deliberately bad.

Required behavior:

- no active intent
- no FOCUSED elements
- content is broadly available
- paper/video/references/dataset/publisher content are visible according to the committed state
- capability indicator shows the actual S0 capability count from the engine
- no fabricated capability count hardcoded into the UI

Current accepted S0 capability count:

```text
15
```

But derive it from state, do not hardcode it.

Display the synthetic fixture disclosure subtly:

> Synthetic research fixture created for the WebMCP Challenge. No real study is depicted.

---

# 6. S1 visible state

Human enters:

> Help me understand the methodology in this paper.

The UI must visibly reflect the existing S1 committed state.

Current accepted S1:

```text
FOCUSED:
- paper.methodology

CONTEXT:
- paper.results
- references
- dataset

PERIPHERAL:
- paper.limitations
- video.segment.01–12

DRAWER:
- publisher

Capability count:
12
```

The key visible effect is semantic resolution.

For example, a low-resolution item such as:

```text
Methodology · pp. 4–7
```

must become a higher-resolution structured representation such as:

```text
Methodology
Participants
Setting
Instrumentation
Independent variables
Analysis procedure
```

Use the authored semantic levels already present in the fixture/model.

Do not invent separate UI-specific copy where the fixture already provides semantic representations.

---

# 7. S2 visible state

Human enters:

> Compare the methodology with what the author says in the video.

The UI must visibly reflect the accepted S2 state.

Current accepted S2:

```text
FOCUSED:
- paper.methodology
- paper.results
- video.segment.05
- video.segment.06
- video.segment.07
- video.segment.08

CONTEXT:
- video.segment.01–04
- video.segment.09–12

PERIPHERAL:
- paper.limitations
- references
- dataset

DRAWER:
- publisher

Asset projection:
- paper = FOCUSED
- video = FOCUSED

Capability count:
13
```

Make this state visually legible.

The user should be able to understand, without opening DevTools:

- paper and video are simultaneously in play
- relevant transcript segments have been promoted
- surrounding transcript segments remain context
- references/dataset have receded
- publisher content remains preserved in the drawer

---

# 8. SemanticText component

Build one reusable rendering component that consumes the semantic representation produced by the model.

Conceptually:

```ts
<SemanticText
  element={element}
  attentionLevel={level}
/>
```

It should choose the current semantic representation according to attention state.

The UI must not maintain a separate semantic-level mapping.

Use the existing model data.

---

# 9. Rationale labels

Implement the first-layer rationale label now.

Do not build the full expanded seven-term inspector unless it is trivial.

Show concise labels such as:

```text
↑ Direct intent match

↑ Required to interpret method

↓ Outside current goal · preserved in drawer
```

Use the rationale records already generated by the engine.

Do not create separate human-only explanations.

The same underlying rationale data must remain compatible with `get_attention_state`.

If a rationale is missing, fix the data flow rather than hardcoding text in the UI.

---

# 10. Capability indicator

Add the small judge-facing capability indicator.

Example:

```text
12 capabilities active · r1
```

Values must come from the current state/surface model.

Do not hardcode:

```text
15
12
13
```

Clicking the indicator may reveal the current eligible capability names.

For G3A, a simple accessible popover/panel is enough.

Do not build elaborate DevTools-style chrome.

---

# 11. Drawer

Implement the functional app drawer.

For this phase, the minimum useful categories are:

```text
Related to task
Used by agent
Outside current focus
```

If the authoritative current spec requires more categories and they are already easy to derive, include them.

Do not spend hours on taxonomy.

The essential proof is:

```text
demoted ≠ deleted
```

Each drawer entry must show at minimum:

- label
- reason
- restore control or restore-ready identifier

The restore interaction itself may remain for the S3/S4 phase if not already trivial, but do not make the content unreachable.

---

# 12. No animation yet

For G3A, transitions should be immediate.

This is deliberate.

Do NOT implement:

- 1.4s transition choreography
- easing curves
- FLIP layout animation
- stagger
- semantic onset timing
- decorative motion

First prove that the correct state renders instantly.

Motion comes only after the functional state projection is accepted.

---

# 13. Minimal styling only

Use enough styling to make the semantic zones understandable.

Follow the authoritative visual direction:

- light
- editorial
- calm
- text-led
- warm white / graphite feel
- restrained hierarchy

Avoid:

- dark sci-fi
- glassmorphism
- gradients
- particles
- chat sidebar
- excessive cards
- blur
- visual gimmicks

Do not spend time tuning final typography yet.

Correct hierarchy matters more than polish.

---

# 14. Accessibility baseline

Implement structural accessibility now because it affects component architecture.

At minimum:

- real form controls
- real buttons
- landmarks/regions where appropriate
- keyboard access to intent bar
- keyboard access to drawer
- keyboard access to capability indicator
- meaningful aria labels

Do not yet spend time on the final reduced-motion proof because motion is not part of G3A.

---

# 15. Rendering invariant

Add tests that protect the UI projection.

At minimum test:

## A. S1 zone projection

Given accepted S1 committed state:

```text
paper.methodology → Focal Plane
paper.results → Context
video segments → Peripheral
publisher → Drawer
```

## B. S2 transcript projection

Given accepted S2 committed state:

```text
segments 05–08 → Focal Plane
segments 01–04 and 09–12 → Context
```

## C. Semantic representation

Verify a FOCUSED element uses its focused semantic representation and a PERIPHERAL element uses its peripheral representation.

## D. Capability indicator

Verify capability count is derived from state/surface rather than hardcoded.

## E. Human intent path

Submitting the S1 intent through the UI route must invoke the shared `applyIntent(..., "human-ui")` path and produce the same committed state already tested at core level.

Do not duplicate core scoring logic inside UI tests.

---

# 16. Preserve all existing tests

All current G2 tests must continue passing.

Current baseline:

```text
10/10
```

Do not weaken them to accommodate the UI.

The UI is a consumer of the engine.

The engine must not be distorted to simplify React rendering unless there is a genuine design flaw.

---

# 17. What not to do

Do not:

- change G1 status
- attempt fake WebMCP host verification
- start final animation
- build final visual polish
- add backend
- add auth
- add database
- add analytics
- add extra tools
- add extra workflows
- add LLM scoring
- add embeddings
- build S3/S4 unless required to support the component structure
- rewrite working core architecture
- hardcode S0/S1/S2 outputs in React

---

# 18. Verification

Run:

```text
npm test
npm run build
npm run lint
```

Also manually verify in the local/deployed app:

```text
S0
→ submit S1 intent
→ visibly correct S1 zones
→ submit S2 intent
→ visibly correct S2 zones
```

Record actual observations.

If practical, deploy this functional version so it can be inspected early.

Do not wait for final polish before deploying.

---

# 19. Definition of G3A PASS

G3A is PASS only if:

1. Intent Bar routes through shared `applyIntent`.
2. S0 renders from committed state.
3. S1 visibly matches accepted state.
4. S2 visibly matches accepted transcript-level state.
5. Focal/Context/Peripheral/Drawer are derived from render model.
6. Semantic representations change by attention level.
7. Rationale labels use engine rationale data.
8. Capability indicator uses actual derived capability state.
9. No duplicated UI state machine exists.
10. Existing 10 G2 tests remain passing.
11. New UI projection tests pass.
12. Build passes.
13. No blocking lint errors.

If not:

```text
G3A = PARTIAL
```

Do not force PASS.

---

# 20. Required report

Return:

## Changed

## Tests

## Manual UI verification

### S0

### S1

### S2

## G1

Must remain:

```text
PARTIAL — target WebMCP host verification pending
```

## G2

Must remain:

```text
PASS
```

## G3A

```text
PASS / PARTIAL / FAIL
```

## Risks

## Next

If G3A passes, recommend only the next smallest phase.

Likely next phase:

```text
S3/S4 mixed-initiative controls + restore/undo UI
```

or, if those already exist functionally:

```text
motion/accessibility polish
```

Do not start either automatically.

Stop after reporting.
