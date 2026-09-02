# Elastic Web — Complete G2 Semantic Fixture Fidelity

Your previous G2 report is accepted.

Current status:

```text
G1 = PARTIAL
G2 = PARTIAL
```

G1 remains pending target WebMCP host verification.

Do not work on G1 in this phase.

The core G2 engine and seven invariant tests are accepted.

Your only task now is to close the remaining G2 gap:

> Expand the fixture and render model from coarse asset-level video handling to the transcript-level element model required by the authoritative S2 specification.

---

## Read before changing code

Re-read:

```text
D:\Github\Elastic Web\docs\build-spec\01-fixture-and-demo-states.md
D:\Github\Elastic Web\docs\build-spec\03-attention-policy.md
D:\Github\Elastic Web\docs\build-spec\04-architecture.md
```

Also inspect the current implementations under:

```text
src/core
src/fixture
src/webmcp
```

Do not redesign the architecture.

Preserve the existing centralized capability rules and seven passing invariants.

---

# Objective

Make S2 faithfully represent the semantic structure defined in the authoritative fixture.

The video must no longer be treated only as one indivisible asset for rendering/attention purposes.

Introduce transcript segments as scoreable elements while preserving the asset-level relationship required by capability eligibility.

The intended distinction is:

```text
Asset:
video

Elements:
video.segment.01
video.segment.02
...
video.segment.12
```

The exact names/shape should follow the authoritative specification and current repository conventions.

---

# Required S2 behavior

For the intent:

> Compare the methodology with what the author says in the video.

The committed state must represent the authoritative S2 behavior.

At minimum:

## FOCUSED

- Paper Methodology
- Paper Results where required by the current spec
- Relevant video/transcript segments 05–08

## CONTEXT

- Surrounding transcript segments required by the authoritative specification, including the non-focal surrounding segments
- Any dataset/supporting elements that the current authoritative S2 state retains as context

## PERIPHERAL

- References and other elements exactly as defined by the latest `01-fixture-and-demo-states.md`

## DRAWER

- Publisher elements according to the authoritative state

Do not infer from the older handover if the current build-spec differs.

The latest build-spec wins.

---

# Preserve asset semantics

Element-level attention must not break relational capability logic.

For example:

```text
video.segment.07 = FOCUSED
```

must still mean:

```text
video asset is in play
```

for capability rules such as `compare_sources`.

Do not solve this by duplicating eligibility rules.

Instead provide a clean helper/projection such as the existing equivalent of:

```ts
assetAttention(...)
assetsAtOrAbove(...)
```

derived from element attention.

The exact implementation should fit the current codebase.

---

# Plant the disagreement exactly

Ensure the synthetic fixture includes the authoritative disagreement used for the demo:

```text
Video segment 07:
~8% performance reduction for a 2°C rise above neutral

Paper Results:
4–11% measured effect

Paper Limitations:
34 participants
single climate zone
no broad generalization
```

Do not introduce additional scientific claims.

Keep the fixture explicitly synthetic.

---

# Semantic representations

For transcript elements, implement the semantic representations required by the attention model.

At minimum each relevant transcript segment should support the current equivalent of:

```ts
peripheral
candidate
focused
```

Do not build final CSS or motion.

This phase is data/model fidelity, not visual polish.

---

# Update deterministic tests

Keep the existing 7 tests passing.

Add focused tests for the new fixture fidelity.

At minimum test:

## 1. S2 transcript focus

Verify the authoritative matched transcript segments are FOCUSED.

## 2. S2 surrounding context

Verify surrounding transcript segments receive CONTEXT rather than being flattened into the same video-level attention state.

## 3. Asset projection

Verify transcript-level attention correctly causes the `video` asset to count as active/in-play for `compare_sources`.

## 4. Capability count stability

Verify the S2 capability count remains:

```text
13
```

or the exact latest authoritative value if the build-spec says otherwise.

Element granularity must not accidentally change tool eligibility counts.

## 5. No regression

All previous seven G2 invariant tests must continue to pass unchanged unless a test was objectively incorrect.

Do not weaken an invariant merely to make the new implementation pass.

---

# Expected state reporting

After implementation, report S0, S1 and S2 again.

For S2, report both:

```text
Asset-level projection
```

and:

```text
Element-level attention
```

Example structure:

```text
S2

Assets in play:
- paper
- video

FOCUSED elements:
- ...
- video.segment.05
- video.segment.06
- video.segment.07
- video.segment.08

CONTEXT elements:
- ...

PERIPHERAL:
- ...

DRAWER:
- ...

Eligible capabilities:
- ...

Capability count:
13

Revision:
r2
```

Use actual results, not expected values copied from this prompt.

---

# Definition of G2 PASS

G2 can be marked PASS only if all are true:

1. Existing 7 invariant tests still pass.
2. Transcript-level fixture model exists.
3. S2 matched transcript segments are individually FOCUSED.
4. Surrounding transcript content is represented at the correct lower attention level.
5. Asset-level capability projection remains correct.
6. `compare_sources` eligibility remains centralized and correct.
7. S0/S1/S2 capability counts still match the authoritative spec.
8. `npm test` passes.
9. `npm run build` passes.
10. `npm run lint` has no blocking errors.

If any of these fail:

```text
G2 = PARTIAL
```

Do not force PASS.

---

# Do not do in this phase

Do not:

- start final animation
- polish typography
- redesign the five zones
- add extra tools
- add a backend
- add auth
- change G1 status
- change WebMCP registration policy
- add an LLM or embedding service
- build S3/S4 unless absolutely required by the current data model
- refactor working core architecture without necessity

Keep this change narrow.

---

# Verification

Run:

```text
npm test
npm run build
npm run lint
```

Then report:

## Changed

## Tests

## S0

## S1

## S2
Include both asset-level and element-level state.

## G1

Must remain:

```text
PARTIAL — target WebMCP host verification pending
```

## G2

```text
PASS / PARTIAL / FAIL
```

## Risks

## Next

If G2 passes, the next recommendation should be the smallest functional UI phase.

Stop after reporting.

Do not begin UI implementation yet.
