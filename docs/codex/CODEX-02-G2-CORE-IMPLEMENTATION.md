# Elastic Web — G2 Host-Independent Core Implementation

## Objective

Implement and test the core Elastic Web engine while keeping G1 formally PARTIAL.

Do not wait for WebMCP host-refresh evidence because the architecture is designed so correctness does not depend on it.

Do not begin final visual polish or animation in this phase.

---

# 1. Read first

Before changing code, read the authoritative Level 1 files:

```text
D:\Github\Elastic Web\docs\build-spec\00-START-HERE.md
D:\Github\Elastic Web\docs\build-spec\01-fixture-and-demo-states.md
D:\Github\Elastic Web\docs\build-spec\02-tool-manifest.md
D:\Github\Elastic Web\docs\build-spec\03-attention-policy.md
D:\Github\Elastic Web\docs\build-spec\04-architecture.md
```

Then inspect the current source tree and existing G1 probe.

Follow current repository structure when sensible.

---

# 2. Core flow to implement

```text
Human UI / WebMCP command
        ↓
Shared command layer
        ↓
Authority overrides
        ↓
Deterministic scoring
        ↓
Committed attention state
        ↓
Rationale
        ↓
┌───────────────────────────┐
│                           │
Human render model     Capability eligibility
                            ↓
                   Best-effort tool surface
```

One committed state is the source of truth.

---

# 3. Expected core modules

Create or complete equivalents of:

```text
src/core/types.ts
src/core/eligibility.ts
src/core/score.ts
src/core/commit.ts
src/core/deriveToolSurface.ts
src/core/renderModel.ts
src/core/rationale.ts
src/core/undo.ts
src/core/applyIntent.ts

src/webmcp/gated.ts
src/webmcp/registry.ts
```

Use the authoritative specification's actual layout where already defined.

Avoid unnecessary abstractions and frameworks.

---

# 4. Shared command layer

Human UI and WebMCP tools must not implement parallel state-transition logic.

Implement a shared application command path, for example:

```ts
type CommandSource = "human-ui" | "webmcp-agent";

applyIntent(intent, source)
```

Human path:

```text
IntentBar
  → applyIntent(intent, "human-ui")
```

WebMCP path:

```text
set_intent.execute()
  → applyIntent(intent, "webmcp-agent")
```

Equivalent inputs must produce equivalent committed state.

---

# 5. Declarative capability rules

Create one authoritative capability rules source, e.g.:

```ts
CAPABILITY_RULES
```

The rules must determine:

- Tier-0 always-live spine behavior,
- attention-level requirements,
- read/write restrictions,
- relational prerequisites such as `compare_sources`,
- consequential-action restrictions where applicable.

Both:

```text
capabilityEligibility()
```

and:

```text
deriveToolSurface()
```

must consume those same rules.

Do not duplicate business rules inside tests, UI components, or individual tools.

---

# 6. Eligibility is authoritative

Registration is not the security/correctness boundary.

Every conditional tool executor must check current eligibility.

If a stale registered capability is invoked while ineligible, return a structured refusal.

Required properties should include the semantic equivalent of:

```json
{
  "ok": false,
  "reason": "attention_state",
  "hint": "Bring a second source into focus first.",
  "currentFocus": [],
  "remedy": {
    "tool": "set_intent",
    "or": "pin_element"
  }
}
```

The exact shape should follow the authoritative tool manifest.

Do not silently fail.

Do not execute the underlying operation after eligibility fails.

---

# 7. Safe capability-surface mutation

Never unregister a capability while an affected tool is still executing.

Implement the execution guard and queued surface application defined by the latest specification.

Conceptually:

```text
tool begins
    ↓
execution guard active
    ↓
state commits
    ↓
surface diff queued
    ↓
tool result returns
    ↓
execution guard releases
    ↓
queued surface mutation applies
```

Protect with a deterministic test.

---

# 8. Attention scoring

Use the latest authoritative deterministic attention policy.

Do not insert an LLM into the scoring loop.

Do not add network-dependent embeddings unless the current spec explicitly requires them.

Use the current deterministic lexical/alias strategy if that is what the Level 1 files specify.

Implement:

- authority overrides,
- score terms,
- thresholds,
- hysteresis/dead bands,
- confidence bands,
- capacity caps,
- stable ordering,
- dwell/stability constraints,
- one restructure per intent event.

---

# 9. G2 fixture scope

Implement only enough fixture data and render-model data to prove:

```text
S0 → S1 → S2
```

according to the latest:

```text
01-fixture-and-demo-states.md
```

Do not use old handover numbers or old `compare_sources` rules if they differ.

The latest Level 1 specification wins.

---

# 10. S0

Implement the default publisher/research state required by the latest spec.

The render model should be deterministic.

The capability eligibility set should match the latest authoritative expected state.

---

# 11. S1

Intent:

> Help me understand the methodology in this paper.

Verify:

- methodology elements promote as defined,
- supporting evidence becomes context,
- irrelevant publisher content demotes,
- render model and capability eligibility change from the same committed state,
- expected capability set/count matches the latest spec.

---

# 12. S2

Intent:

> Compare the methodology with what the author says in the video.

Verify:

- paper and relevant video/transcript state changes match the spec,
- `compare_sources` becomes eligible only when the latest authoritative precondition is satisfied,
- human render and agent eligibility remain consistent.

This is the hero state transition.

---

# 13. Undo

Implement undo so that it restores:

- committed attention state,
- pins/overrides as applicable,
- rationale/history consistency,
- human render model,
- capability eligibility,
- best-effort derived registration surface.

Undo must not restore only the UI.

---

# 14. Instrumentation

Add the current specification's core events as early as possible.

At minimum the semantic equivalents of:

```text
intent_set
attention_delta
surface_delta
tool_call
human_override
stale_revision_rejected
```

Keep instrumentation session-local unless the spec explicitly says otherwise.

Do not build an analytics backend.

---

# 15. Do not do these things during G2

Do not:

- mark G1 PASS,
- claim target ChatGPT host discovery,
- claim dynamic refresh behavior,
- build final animation,
- redesign branding,
- add auth,
- add a database,
- add a backend,
- add extra tools,
- add extra workflows,
- build a browser extension,
- add a model to deterministic scoring,
- optimize aesthetics before invariants pass.

---

# 16. Verification commands

Use repository-appropriate commands, expected to include:

```text
npm test
npm run build
npm run lint
```

If the project uses a different test command, document it.

Do not ignore failed tests.

---

# 17. Stop condition

Stop after the G2 core implementation and report using:

```text
CODEX-03-G2-ACCEPTANCE-CHECKLIST.md
```

Do not move on to final motion/polish until G2 is reviewed.
