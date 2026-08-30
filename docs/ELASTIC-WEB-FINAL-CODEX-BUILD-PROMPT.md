# Elastic Web — Final Codex Build Prompt

## Role

You are the lead product engineer taking **Elastic Web** from a locked hackathon specification to a working, tested, deployed WebMCP Challenge submission.

Work as a disciplined senior engineer, not as a brainstorming partner.

The product strategy and architecture have already been researched and substantially decided. Your job is now to:

1. understand the specification,
2. resolve the actual repository/environment state,
3. prove WebMCP works in the target environment,
4. implement the smallest complete version,
5. test every important invariant,
6. deploy early,
7. preserve scope,
8. prepare a reliable demo and submission.

Do **not** redesign the concept unless a real implementation constraint makes a locked requirement impossible.

---

# 1. Repository and documentation location

Project root:

```text
D:\Github\Elastic Web
```

Documentation directory:

```text
D:\Github\Elastic Web\docs
```

Begin by inspecting the entire repository and then the documentation directory.

Expected documentation currently includes:

```text
D:\Github\Elastic Web\docs\
  elastic-web-complete-handover-prompt.md
  elastic-web-tool-surface-and-adaptation-policy.md
  files.zip
```

The ZIP contains the latest detailed implementation pack.

---

# 2. Documentation precedence — IMPORTANT

There are three layers of documentation.

Use them in this precedence order:

## Level 1 — AUTHORITATIVE

The contents of:

```text
D:\Github\Elastic Web\docs\files.zip
```

Extract it into a readable documentation subdirectory if it has not already been extracted.

Recommended location:

```text
D:\Github\Elastic Web\docs\build-spec\
```

The ZIP should contain approximately these files:

```text
00-START-HERE.md
01-fixture-and-demo-states.md
02-tool-manifest.md
03-attention-policy.md
04-architecture.md
05-ui-motion-accessibility.md
06-eval-harness.md
07-build-plan.md
08-demo-and-submission.md
09-security.md
```

These files represent the latest, implementation-ready specification.

Read them in exactly that order.

---

## Level 2 — BACKGROUND / DESIGN HISTORY

These standalone files are useful context but may contain superseded decisions:

```text
elastic-web-complete-handover-prompt.md
elastic-web-tool-surface-and-adaptation-policy.md
```

Read them **after** the Level 1 specification.

Use them to understand:

- product rationale,
- research lineage,
- original design thinking,
- why certain decisions were made.

Do **not** allow them to override the latest ZIP specification.

If a Level 2 file conflicts with Level 1:

> **Level 1 wins.**

Record meaningful conflicts in `DECISIONS.md`, but do not reopen already-settled product strategy unless implementation evidence requires it.

---

# 3. First task: understand before changing

Before making meaningful changes, inspect:

```text
D:\Github\Elastic Web
```

Determine:

- current repository structure,
- whether an app already exists,
- package manager,
- framework,
- branch and git state,
- uncommitted changes,
- existing deployment configuration,
- existing tests,
- whether the ZIP has already been extracted,
- whether any implementation has already begun.

Then read all Level 1 specification files.

Do not begin implementation until you can summarize the system accurately.

---

# 4. Report your mental model first

Before coding, give me a concise implementation briefing containing:

## Goal
What Elastic Web must prove in the WebMCP Challenge.

## Core product thesis
State the thesis in one or two sentences.

## Architecture
Explain the source of truth and the two projections:

```text
Committed Attention State
       │
       ├── Human render model
       │
       └── Agent capability eligibility
                   │
                   └── best-effort WebMCP registration
```

## Current repository state
What exists already and what must be created.

## Critical files
Which files/modules you expect to build first.

## Build gates
G1, G2 and G3.

## Risks
Especially:
- WebMCP discovery/refresh behavior,
- human/agent state divergence,
- capability lifecycle during tool execution,
- scope creep,
- demo reliability.

## Definition of done
What must be working before submission.

Keep this briefing practical. Then begin with G1.

---

# 5. Product thesis — DO NOT DILUTE THIS

The product is **Elastic Web**.

The interaction mechanism is **semantic foveation**.

The durable thesis is:

> **One committed attention state governs both what the human sees and what the agent is allowed to do.**

Another acceptable formulation is:

> **WebMCP tells an agent what a website can do. Elastic Web determines which content and capabilities deserve attention right now, and renders that decision to the human and the agent from the same underlying state.**

The product is NOT primarily:

- a chatbot,
- browser zoom,
- a distraction blocker,
- a document summarizer,
- an AI dashboard,
- a browser extension,
- cursor tracking,
- a generic MCP demo.

---

# 6. Critical architecture rule

The application has one source of truth:

```text
Attention State
```

Both the human UI and the agent capability layer must derive from the **same committed state**.

Never create separate parallel logic that can drift.

The conceptual pipeline is:

```text
Human intent
Agent tool call
Human correction
        │
        ▼
Shared command layer
        │
        ▼
Apply authority overrides
        │
        ▼
Deterministic scoring
        │
        ▼
Commit attention state
        │
        ├───────────────┐
        ▼               ▼
Render model      Capability eligibility
                        │
                        ▼
               WebMCP registration
               where host supports it
        │               │
        └───────┬───────┘
                ▼
          Shared rationale
              ledger
```

---

# 7. Shared command layer — REQUIRED

Human UI actions and WebMCP tools must call the same application commands.

For example:

```ts
applyIntent(intent, source)
```

with something like:

```ts
type CommandSource =
  | "human-ui"
  | "webmcp-agent";
```

Human path:

```text
IntentBar.onSubmit()
    ↓
applyIntent(intent, "human-ui")
```

Agent path:

```text
set_intent.execute()
    ↓
applyIntent(intent, "webmcp-agent")
```

Both paths must produce equivalent committed state for equivalent inputs.

Do not duplicate business logic inside UI event handlers and tool executors.

---

# 8. Capability availability policy

This distinction is non-negotiable:

> **Eligibility is authoritative. Registration is best-effort.**

Do not architect the product around an assumption that the browser's built-in agent will immediately observe every mid-session WebMCP registration change.

Every conditional capability must therefore have two gates:

```text
1. Registration lifecycle
   registerTool / AbortController

2. Executor eligibility guard
   authoritative at call time
```

If an ineligible capability is invoked through a stale registration, return a structured result that explains:

- that it is unavailable in the current attention state,
- why,
- what is currently focused,
- how the agent can make it available.

For example:

```json
{
  "ok": false,
  "reason": "attention_state",
  "hint": "Bring a second source into focus first.",
  "remedy": {
    "tool": "set_intent",
    "or": "pin_element"
  }
}
```

Do not silently fail.

---

# 9. Capability rules must be declarative

Use the Level 1 specification's capability-rule model.

Do not scatter eligibility conditions through UI components and tool executors.

Create a single declarative source such as:

```ts
CAPABILITY_RULES
```

and have both:

```text
deriveToolSurface()
```

and:

```text
capabilityEligibility()
```

consume it.

This prevents the eligibility test from becoming a second implementation of the rules.

---

# 10. Tool execution lifecycle safety

A tool must not unregister itself while still executing.

Use the execution guard / queued surface update design defined in the specification.

Conceptually:

```text
tool begins
    ↓
execution guard active
    ↓
state may commit
    ↓
surface diff queued
    ↓
tool result safely returns
    ↓
execution guard releases
    ↓
queued registration/unregistration applied
```

Do NOT do:

```text
tool begins
    ↓
state change
    ↓
AbortController aborts same tool
    ↓
tool dies mid-call
```

Protect this with a test.

---

# 11. G1 — prove WebMCP before UI work

This is the first engineering gate.

Do not start visual design first.

## G1 tasks

1. Ensure the project is runnable.
2. If no app exists, create the minimal Vite + React + TypeScript app defined by the specification.
3. Deploy a minimal version as early as practical.
4. Feature-detect:

```ts
document.modelContext?.registerTool
```

5. Register one trivial tool.
6. Verify that the tool can actually be discovered and executed in the intended ChatGPT WebMCP environment.
7. Run the dynamic observation spike.

### Observation spike

Start with:

```text
A
B
C
```

registered.

Have the agent observe them.

Then:

```text
remove B
remove C
add D
```

without a page reload.

Determine whether the agent sees:

```text
A + D
```

### Record one outcome

```text
A = observed immediately
B = observed on next turn
C = stale observation remains
```

Write the result into:

```text
DECISIONS.md
```

with:
- date/time,
- browser/app version,
- environment,
- exact behavior,
- any relevant screenshots/logs.

Do not spend hours trying to force outcome A.

The product must work under A, B or C because eligibility guards are authoritative.

---

# 12. G2 — build the core engine

After G1, implement the engine before polishing the UI.

Expected core modules include equivalents of:

```text
src/core/types.ts
src/core/eligibility.ts
src/core/deriveToolSurface.ts
src/core/renderModel.ts
src/core/applyIntent.ts
src/core/score.ts
src/core/commit.ts
src/core/rationale.ts
src/core/undo.ts

src/webmcp/registry.ts
src/webmcp/gated.ts
```

Use the exact repository structure from the authoritative specification when possible.

Do not invent complexity.

---

# 13. Required invariants and tests

Before animation work, protect at least these invariants.

## Invariant 1 — Spine survival

Tier-0 spine tools must never disappear.

## Invariant 2 — Relational capability condition

`compare_sources` must be unavailable until the exact prerequisite defined in the latest Level 1 spec is satisfied.

Follow the current ZIP specification, not older handover language.

## Invariant 3 — Stale registration safety

Even if the host still exposes a stale registered tool, an ineligible call must return a structured refusal and remedy.

## Invariant 4 — Human/agent state consistency

The human render model and agent capability eligibility must derive from the same committed attention state.

No state may produce:

```text
human says FOCUSED
agent says unavailable
```

unless the capability itself has an additional explicit rule.

## Invariant 5 — Human and agent command equivalence

Equivalent human and WebMCP intent commands must produce equivalent committed state.

## Invariant 6 — Safe deferred surface mutation

Registration/unregistration must wait until affected tool execution is complete.

## Invariant 7 — Undo correctness

Undo must restore the prior committed attention state and capability eligibility consistently.

Run these tests before visual polish.

---

# 14. Locked demo workflow

Follow the latest `01-fixture-and-demo-states.md` exactly.

Do not improvise new hero scenarios.

The intended flow is:

```text
S0 → S1 → S2 → S3 → S4
```

Treat the Level 1 document as authoritative for the exact capability counts and transition rules.

---

# 15. S0 — Publisher default

The initial page should look like a credible research/publisher workspace.

It must NOT look intentionally bad.

Show:
- paper,
- author talk/video,
- transcript,
- references,
- dataset if still in scope,
- publisher components.

The point is that all content is initially available at similar visual priority.

Display the subtle fixture disclosure:

> **Synthetic research fixture created for the WebMCP Challenge. No real study is depicted.**

Do not present fabricated research data as a real scientific study.

---

# 16. S1 — Understand methodology

Trigger:

> **Help me understand the methodology in this paper.**

The page should visibly reform.

Methodology becomes high semantic resolution.

Supporting evidence becomes context.

Unrelated publisher content contracts or enters the drawer.

The important visual message is:

> **This is not browser zoom.**

One line becomes meaningful structured detail.

For example:

```text
Methodology · pp. 4–7
```

can become:

```text
Methodology
  Participants
  Setting
  Instrumentation
  Independent variables
  Analysis procedure
```

with relevant inline actions.

---

# 17. S2 — Compare sources

Trigger:

> **Compare the methodology with what the author says in the video.**

This is the hero WebMCP state.

Paper and relevant video/transcript content enter the appropriate focus states.

`compare_sources` becomes eligible for the first time according to the current specification.

The judge-facing message is:

> **The user's task changed what the agent is allowed to do, not only what the human sees.**

Do not reduce this moment to a tool-count trick.

Capability count is supporting evidence.

---

# 18. S3 — Human authority

The fixture contains the planted disagreement defined in the specification.

Preserve it exactly.

The agent identifies the disagreement.

The human instructs:

> **Prioritize the peer-reviewed paper, but preserve the video's explanation.**

Implement this using the specified pin operations.

The conceptual distinction must remain:

> **Preserve is a constraint, not a ranking preference.**

The video should retain a minimum attention level rather than merely receiving a lower score.

The intended story is:

```text
Agent:
finds and compares evidence

Human:
assigns evidentiary authority

System:
turns that judgment into explicit attention constraints
```

Do not frame this as something the agent is intellectually incapable of doing.

It is about human authority.

---

# 19. S4 — Reversibility

The drawer proves that:

```text
demoted ≠ deleted
```

Every demoted item must retain:

- label,
- provenance,
- reason,
- restore action.

Show at least one restore/undo round trip in the product.

If schedule pressure requires cutting it from the final video, keep it working in the application.

---

# 20. Attention policy

Follow `03-attention-policy.md`.

The scoring path must remain deterministic.

Do not insert an LLM into attention scoring.

Do not add network-dependent embedding infrastructure unless the Level 1 spec explicitly requires it and it is already trivial.

Prefer the current lexical / alias / deterministic strategy.

Implement the specified:

- scoring terms,
- thresholds,
- hysteresis,
- confidence bands,
- capacity caps,
- authority overrides,
- stable within-zone ordering,
- minimum dwell,
- one restructure per intent event.

The interface must not continuously move while the user reads.

---

# 21. Semantic foveation

The primary UI invention is semantic resolution.

Attention changes:

```text
meaning rendered
+
scale
+
weight
+
contrast
+
proximity
+
available actions
```

It is NOT uniform scaling.

Elements should have authored semantic representations such as:

```ts
interface SemanticLevels {
  peripheral: string;
  candidate: string;
  focused: string[];
}
```

Author these carefully for the fixture.

This is higher priority than decorative animation.

---

# 22. UI direction

Follow `05-ui-motion-accessibility.md`.

The look should be:

- light,
- editorial,
- calm,
- premium,
- text-led,
- credible as a research reading interface.

Avoid:

- glassmorphism,
- dark sci-fi dashboards,
- purple AI gradients,
- neural network graphics,
- particle effects,
- cursor trails,
- permanent chatbot sidebar,
- unnecessary cards,
- excessive blur,
- idle animation.

The interface should look still and intentional while reading.

---

# 23. Capability indicator

Add the small judge-facing capability surface indicator defined in the specification.

Example:

```text
12 capabilities active · r3
```

It should be compact and dismissible/non-distracting.

Clicking it may expose the current active capability list.

This indicator exists to make the invisible WebMCP layer legible during the demo without relying on DevTools.

Do not make it the primary product UI.

---

# 24. Motion

Only after functional G2.

Use the motion specification from the authoritative file.

Rules:

- one batched transition per intent event,
- roughly the specified duration,
- promoted content arrives clearly,
- demoted content recedes,
- no random target movement,
- no idle animation,
- no continuous reordering.

Under reduced motion:

- state change still occurs,
- state change remains explained,
- interpolation is removed.

---

# 25. Accessibility

Implement the two proofs specified:

## Keyboard / screen reader

- semantic landmarks,
- real buttons,
- readable rationale labels,
- correct focus order,
- attention order aligned with reading order where specified,
- polite change announcement.

## Reduced motion

Honor:

```css
prefers-reduced-motion
```

Do not create a separate “accessibility mode.”

---

# 26. WebMCP tools

Implement the tool manifest from the latest `02-tool-manifest.md`.

Do not resurrect tools removed by later revisions.

Do not add random tools to inflate the count.

Critical capabilities that must survive scope cuts include the latest equivalents of:

```text
set_intent
get_attention_state
compare_sources
pin_element
list_drawer
restore_capability
undo_last_adaptation
```

Tier-0 spine capabilities must remain available.

Keep agent-facing text outputs short.

Return structured content.

Do not put Elastic Web rationale fields inside standard WebMCP annotations.

---

# 27. Rationale ledger

Every meaningful adaptation should produce an inspectable rationale record.

The human should see a concise first layer, for example:

```text
↑ Direct intent match

↓ Outside current goal · preserved in drawer

↑ Pinned by you · protected from demotion
```

Expanded rationale may expose the detailed deterministic score terms.

The same underlying rationale must be accessible to the agent through `get_attention_state`.

This shared explainability layer is part of the product.

Do not implement separate human-only and agent-only explanations.

---

# 28. Instrumentation

Instrument from the beginning.

At minimum capture the latest spec's events equivalent to:

```text
intent_set
attention_delta
surface_delta
tool_call
human_override
stale_revision_rejected
```

Keep instrumentation local/session-scoped unless the spec says otherwise.

Do not build an analytics backend.

---

# 29. Evaluation harness

Implement `06-eval-harness.md` after the core product works.

Baseline:

> Same fixture, same tasks, full static capability surface.

Elastic condition:

> Capability availability is intent-conditioned.

The primary claim is intentionally narrow:

> **Intent-conditioned capability surfaces reduce the agent decision surface without reducing task success.**

Do not pre-decide the results.

Do not manufacture metrics.

Report only values generated by the evaluation artifacts.

Prioritize:

1. task success,
2. capabilities available at decision,
3. tool calls to completion,
4. incorrect selections,
5. recovery attempts.

Only report timing where it represents meaningful agent execution rather than trivial JavaScript runtime.

If supported by actual results, calculate:

```text
capability reduction
=
1 - active_capabilities / static_capabilities
```

and report the median.

---

# 30. Security scope

Implement the proportional controls from `09-security.md`.

Keep it small.

Expected controls include:

- CSP restricting scripts,
- `Permissions-Policy: tools=(self)`,
- no unnecessary cross-origin tool exposure,
- revision/state-version guard,
- Tier-0 spine invariant,
- bounded tool outputs,
- confirmation for consequential actions,
- lifecycle ledger,
- no third-party scripts unless truly necessary.

Treat revision primarily as application-state consistency and lifecycle defense-in-depth, not as cryptographic tool identity.

Do not turn this into a separate security product.

---

# 31. Graceful degradation

The page must still render if WebMCP is unavailable.

Feature-detect.

Do not throw.

Do not show a blank page.

Human-driven semantic foveation should still work.

Make any WebMCP-specific indicator clearly reflect unsupported status when appropriate.

Test the deployed URL in a normal browser without the WebMCP capability.

---

# 32. Scope prohibitions

Do NOT build any of these unless I explicitly override this instruction:

```text
browser extension
universal legacy DOM adaptation
real cross-site automation
auth system
database
backend platform
multi-user collaboration
personalization history
ONNX classifier
model training
cross-device sync
real commerce
real booking
CRM
mobile app
analytics backend
agent marketplace
extra product workflow
cursor-intent system
gaze tracking
```

Interesting is not the same as useful for this submission.

---

# 33. Cut order

If schedule pressure occurs, follow the cut order in the latest `07-build-plan.md`.

The exact Level 1 document wins if this prompt differs.

Preserve the essential story:

```text
S0
  ↓
S1 — intent changes semantic presentation
  ↓
S2 — intent changes agent capability availability
  ↓
S3 — human authority becomes an explicit constraint
```

That is the minimum coherent submission.

---

# 34. Build gates

## G1

Passed only when:

```text
A deployed/live page
+
one actual WebMCP tool
+
real tool execution
+
A/B/C observation behavior documented
```

## G2

Passed only when:

```text
set_intent
    ↓
committed attention state
    ↓
human render changes
    ↓
capability eligibility changes
```

and core invariants/tests pass.

Dynamic host refresh is not required for G2 because registration observation is host-dependent.

## G3

Passed only when:

- deployed URL works from a clean environment,
- S0→S1→S2→S3 is repeatable,
- critical tools work,
- no local-only dependencies remain,
- graceful degradation works.

After G3:

> **Feature freeze.**

Remaining work becomes:

- evals,
- video,
- README,
- Devpost,
- verification.

---

# 35. Working discipline

Before every meaningful implementation phase, tell me briefly:

1. what you are about to build,
2. why it is next,
3. files involved,
4. invariant being protected,
5. test/verification method.

Then implement.

After the phase, report:

```text
Changed:
...

Tests:
...

Observed:
...

Gate:
G1/G2/G3 — PASS / FAIL / PARTIAL

Risks:
...

Next:
...
```

Do not write giant status essays.

Do not continue through a failed gate as though it passed.

---

# 36. Git discipline

Before editing:

```text
git status
git branch --show-current
git log --oneline -10
```

Do not overwrite unrelated user work.

Commit meaningful milestones with useful messages.

Maintain:

```text
DECISIONS.md
```

for important implementation findings, especially:

- WebMCP observation outcome,
- spec conflicts,
- browser limitations,
- deliberate scope cuts,
- deviations from the authoritative pack.

Do not commit secrets.

---

# 37. Deployment discipline

Deploy early.

Do not wait until the UI is polished.

The application must eventually be available at a public URL suitable for judging.

Test:

- clean browser,
- private/incognito session,
- target ChatGPT environment,
- no local storage assumptions,
- no localhost dependency,
- no VPN dependency.

Do not change the final production behavior after the submission freeze except where absolutely necessary and allowed by the challenge rules.

---

# 38. Demo priorities

Do not start video production before G3.

The final demo should prioritize three memories:

## 1

> The page reorganized itself around explicit intent.

## 2

> The user's task changed the agent's capability surface.

## 3

> Human evidentiary authority became a durable constraint the agent respected.

Everything else is supporting evidence.

Target the duration defined in the latest `08-demo-and-submission.md`, with safety below the three-minute limit.

Do not invent demo metrics.

---

# 39. Definition of done

Elastic Web is done for this challenge when all of the following are true:

### Product
- semantic foveation is visibly real,
- S0→S1→S2→S3 is deterministic and repeatable,
- drawer/reversal works if retained,
- rationale is inspectable.

### Architecture
- one committed attention state,
- shared command layer,
- render and eligibility cannot drift,
- eligibility is authoritative,
- best-effort dynamic registration works as supported by host,
- execution lifecycle is safe.

### WebMCP
- real registered tools execute,
- critical tools work,
- stale/ineligible calls fail structurally and helpfully,
- agent can inspect attention rationale.

### Quality
- tests pass,
- app degrades gracefully,
- keyboard/reduced-motion behavior works,
- deployment is clean.

### Evidence
- eval harness runs,
- results are reproducible,
- no invented metrics.

### Submission
- public live URL,
- public repository,
- recognized OSS license,
- README/run instructions,
- final video under the challenge time limit,
- written explanation,
- challenge requirements verified.

---

# 40. Start now — exact first action

Do **not** begin by implementing the final UI.

Perform only this first phase:

## Phase G1

1. Inspect `D:\Github\Elastic Web`.
2. Inspect `D:\Github\Elastic Web\docs`.
3. Extract `docs\files.zip` to `docs\build-spec\` if needed.
4. Read all ten Level 1 files in order.
5. Read the two Level 2 historical files afterward.
6. Inspect git/repository/runtime/deployment state.
7. Give me the concise mental-model briefing requested in Section 4.
8. Identify any real conflicts between the latest spec and the repository.
9. Implement/verify one minimal WebMCP tool.
10. Run the A/B/C observation spike.
11. Record findings in `DECISIONS.md`.
12. Report G1 status.

**Stop after G1 and report back.**

Do not proceed to G2 until G1 has been reviewed or is clearly passed.

The next engineering decision must be based on observed WebMCP behavior, not assumptions.
