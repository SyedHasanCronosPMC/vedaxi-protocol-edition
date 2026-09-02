# Elastic Web — Codex Execution Pack

## Purpose

This folder is the execution-control layer for Codex.

The detailed product and engineering specification already exists in:

```text
D:\Github\Elastic Web\docs
```

Codex must read the repository and documentation itself. Do not treat this pack as a replacement for the authoritative specification; this pack tells Codex **how to execute it safely and in what order**.

---

# 1. Project locations

Project root:

```text
D:\Github\Elastic Web
```

Documentation directory:

```text
D:\Github\Elastic Web\docs
```

Expected historical/reference files include:

```text
elastic-web-complete-handover-prompt.md
elastic-web-tool-surface-and-adaptation-policy.md
files.zip
```

The latest detailed implementation pack is inside:

```text
D:\Github\Elastic Web\docs\files.zip
```

If it has not already been extracted, extract it to:

```text
D:\Github\Elastic Web\docs\build-spec\
```

Expected authoritative files:

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

---

# 2. Documentation precedence

Use this precedence order:

## Level 1 — Authoritative

```text
D:\Github\Elastic Web\docs\build-spec\
```

or, if not yet extracted, the contents of:

```text
D:\Github\Elastic Web\docs\files.zip
```

Read the 10 files in numeric order.

## Level 2 — Historical / background

```text
D:\Github\Elastic Web\docs\elastic-web-complete-handover-prompt.md
D:\Github\Elastic Web\docs\elastic-web-tool-surface-and-adaptation-policy.md
```

These explain the history and rationale but may contain superseded decisions.

If Level 2 conflicts with Level 1:

> **Level 1 wins.**

## Level 3 — This Codex execution pack

These files control sequencing, evidence standards, gate status, and what Codex should do next.

If this execution pack appears to conflict with a product-detail decision in Level 1, stop and report the conflict rather than silently changing the product.

---

# 3. Current verified status

G1 is **PARTIAL**, not PASS.

Verified:

- Minimal Vite + React + TypeScript probe exists.
- Public deployment exists:
  `https://elastic-web-g1-probe.netlify.app/`
- The probe contains WebMCP registration logic.
- The page can register A/B/C and swap B/C for D without a reload.
- `npm run build` passed.
- `npm run lint` passed with one non-blocking React effect advisory.
- Public deployment returned HTTP 200.
- Git history contains G1 commits.
- `DECISIONS.md` exists.

Not verified:

- ChatGPT has not been empirically shown to discover A/B/C.
- Tool A has not been empirically executed from a WebMCP-capable ChatGPT session.
- Dynamic observation after the B/C → D swap has not been classified A/B/C.
- No claim about ChatGPT's host refresh behavior may be made yet.

Therefore:

```text
G1 = PARTIAL
Dynamic WebMCP host observation = UNMEASURED
```

Do not rewrite this as PASS unless actual target-environment evidence is later recorded.

---

# 4. Architecture policy that is already locked

The core thesis is:

> **One committed attention state governs both what the human sees and what the agent is allowed to do.**

The architecture is:

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
┌──────────────────────────┐
│                          │
Human render model    Capability eligibility
                           ↓
                  Best-effort WebMCP registration
```

Non-negotiable:

> **Eligibility is authoritative. Registration is best-effort.**

Do not assume the host immediately observes `registerTool()` / unregister changes.

Every conditional tool must enforce eligibility again inside its executor.

---

# 5. What Codex should do now

Read:

1. this file,
2. `CODEX-01-G1-STATUS-AND-MANUAL-VERIFICATION.md`,
3. `CODEX-02-G2-CORE-IMPLEMENTATION.md`,
4. `CODEX-03-G2-ACCEPTANCE-CHECKLIST.md`,
5. the full Level 1 specification.

Then inspect:

```text
D:\Github\Elastic Web
```

including:

```text
git status
git branch --show-current
git log --oneline -10
```

Do not overwrite unrelated user work.

Proceed with the **host-independent G2 core only**.

Do not mark G1 PASS.

Do not start final animation or visual polish.

Stop after the G2 report requested in `CODEX-03-G2-ACCEPTANCE-CHECKLIST.md`.

---

# 6. Working style

Before a meaningful phase, briefly report:

1. what you are about to build,
2. why it is next,
3. files involved,
4. invariant protected,
5. how you will verify it.

Then implement.

After the phase, report concisely:

```text
Changed:
Tests:
Observed:
G1:
G2:
Risks:
Next:
```

Do not continue through a failed gate as though it passed.
