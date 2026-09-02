# Elastic Web — G2 Acceptance Checklist & Report Contract

Codex must use this file to decide whether G2 is PASS, PARTIAL, or FAIL.

G1 remains separate and may remain PARTIAL.

---

# 1. Core invariant tests

## A. Tier-0 spine invariant

For every tested state:

```text
S0
S1
S2
```

and any additional state already implemented:

- Tier-0 spine tools remain eligible.
- `deriveToolSurface()` never schedules them for unregister.

Expected:

```text
PASS
```

---

## B. `compare_sources` eligibility

Use the latest Level 1 rule.

Test at minimum:

- state before prerequisite → ineligible,
- state after prerequisite → eligible.

Do not encode an outdated rule in the test.

Do not duplicate the production capability rule manually if the test can exercise `CAPABILITY_RULES`.

Expected:

```text
PASS
```

---

## C. Stale-registration protection

Simulate a stale host registration.

Invoke a conditional capability that is currently ineligible.

Verify:

- underlying operation does not run,
- result is structured,
- `ok` is false,
- reason identifies attention state,
- remedy is actionable.

Expected:

```text
PASS
```

---

## D. Human/agent consistency

For a committed attention state:

- generate the human render model,
- derive capability eligibility.

Verify both are projections of the same state.

No accidental divergence such as:

```text
human state implies focused/active content
while capability rules incorrectly see another state
```

Any intentional additional capability precondition must be explicit in `CAPABILITY_RULES`.

Expected:

```text
PASS
```

---

## E. Human vs WebMCP command equivalence

Given equivalent intent input:

```text
applyIntent(..., "human-ui")
```

and:

```text
applyIntent(..., "webmcp-agent")
```

must produce equivalent committed attention outcomes except for legitimate provenance/source metadata.

Expected:

```text
PASS
```

---

## F. Deferred mutation safety

Simulate a tool execution that causes a state change capable of altering its surface eligibility/registration.

Verify:

- execution remains alive until result return,
- surface change is queued while the execution guard is active,
- queued diff applies after execution completes.

Expected:

```text
PASS
```

---

## G. Undo consistency

After a state transition:

- call undo,
- verify prior attention state,
- verify prior human render model,
- verify prior capability eligibility,
- verify rationale/history is consistent.

Expected:

```text
PASS
```

---

# 2. Deterministic transition acceptance

Codex must report the actual observed state summary for:

```text
S0
S1
S2
```

For each state report:

```text
Intent:
Focused:
Context:
Peripheral:
Drawer:
Eligible capabilities:
Capability count:
Surface revision:
```

Counts and rules must match the latest Level 1 specification.

If they do not, G2 is not PASS.

---

# 3. Build quality

Run:

```text
npm test
npm run build
npm run lint
```

Required:

- tests pass,
- build passes,
- no blocking lint errors.

A documented non-blocking advisory is acceptable only if it does not indicate incorrect behavior.

---

# 4. G1 reporting rule

Always report:

```text
G1: PARTIAL — target WebMCP host verification pending
```

unless `DECISIONS.md` contains real manual target-environment evidence that completes the required discovery/execution/classification.

Do not upgrade G1 based on unit tests.

---

# 5. G2 classification

## PASS

Only if:

- shared command layer exists,
- one committed attention state is source of truth,
- capability rules are declarative/centralized,
- eligibility guards work,
- safe deferred surface mutation works,
- S0→S1→S2 are deterministic,
- required invariants pass,
- undo is consistent,
- build/lint/tests pass.

## PARTIAL

Use if the architecture exists but one or more non-trivial invariants or transitions remain incomplete.

## FAIL

Use if:

- duplicated state paths exist,
- eligibility can be bypassed,
- human and agent state can drift,
- core tests fail,
- S0→S1→S2 cannot be reproduced.

---

# 6. Required Codex report format

Return exactly these headings.

## Changed

List:
- files created,
- files modified,
- core behavior implemented.

## Tests

Report:
- command,
- passed,
- failed,
- important assertions.

## State transitions

### S0
```text
Focused:
Context:
Peripheral:
Drawer:
Eligible capabilities:
Capability count:
Revision:
```

### S1
```text
Focused:
Context:
Peripheral:
Drawer:
Eligible capabilities:
Capability count:
Revision:
```

### S2
```text
Focused:
Context:
Peripheral:
Drawer:
Eligible capabilities:
Capability count:
Revision:
```

## G1

Use:

```text
PARTIAL — target WebMCP host verification pending
```

unless evidence in `DECISIONS.md` supports otherwise.

## G2

```text
PASS / PARTIAL / FAIL
```

State why in no more than five bullets.

## Risks

Only real current blockers or uncertainties.

## Next

Give the single smallest next implementation phase.

Then stop.

Do not begin final animation or polish until this report is reviewed.
