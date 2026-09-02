# Elastic Web — G1 Status & Manual WebMCP Verification

## Status

```text
G1 = PARTIAL
```

This is intentional and honest.

The current environment cannot truthfully prove what the actual WebMCP-capable ChatGPT browser/session discovers or executes.

Do not infer G1 success from:

- visible page text,
- source code,
- DOM inspection,
- the probe's status panel,
- network accessibility,
- build success.

Those prove the page exists and contains WebMCP code, but not what the ChatGPT WebMCP client discovers.

---

# 1. Verified evidence

Public probe:

```text
https://elastic-web-g1-probe.netlify.app/
```

Verified:

- public deployment exists,
- Vite + React + TypeScript probe exists,
- A/B/C registration logic exists,
- B/C → D swap exists without reload,
- project builds,
- lint runs,
- deployment is reachable,
- repository has G1 commits.

---

# 2. Evidence still required

A future WebMCP-capable ChatGPT session must establish:

```text
INITIAL
Exact discovered tools: <actual names>
A execution result: <actual tool result>

AFTER SWAP — NO RELOAD
Exact discovered tools: <actual names>
```

The goal is to **observe behavior**, not force a preferred result.

---

# 3. Operational A/B/C classification

Use this classification.

## Outcome A

First post-swap agent turn sees:

```text
A + D
```

and no longer exposes B/C.

Interpretation:

> Host refreshes the observed capability surface by the first post-change turn.

## Outcome B

First post-swap turn is stale, but a later fresh turn sees:

```text
A + D
```

Interpretation:

> Host refresh is delayed/turn-scoped.

## Outcome C

After 2–3 fresh post-swap turns, the observed surface remains stale.

Interpretation:

> Dynamic registration cannot be relied on for prompt host observation.

This is not an architecture failure because Elastic Web treats executor eligibility as authoritative.

---

# 4. Exact manual test

Inside the actual WebMCP-capable ChatGPT browser/session:

Open:

```text
https://elastic-web-g1-probe.netlify.app/
```

Send:

> Inspect the WebMCP/site tools exposed by this page. Do not infer from the visible UI. Tell me the exact tool names currently available, then invoke tool A once and report its actual result.

Record:

```text
Discovery:
Execution:
```

Then click the probe's swap control.

Do not reload or navigate.

Send:

> Without reloading the page, inspect the site's available WebMCP tools again. Tell me the exact tool names you can access now. Do not infer them from the page text.

If stale, send one further fresh observation request.

If B is still believed to exist, optionally test:

> Invoke tool B now and report the exact tool result or failure.

That stale-handle result is useful host-behavior evidence.

---

# 5. DECISIONS.md template

When the test is eventually available, append something like:

```md
## G1 WebMCP observation test — YYYY-MM-DD

Environment:
- ChatGPT Desktop/app version:
- Model/configuration:
- URL: https://elastic-web-g1-probe.netlify.app/

Initial observation:
- Tools seen:
- A execution: PASS / FAIL
- Actual result:

After B/C → D swap without reload:
- First post-swap turn saw:
- Second post-swap turn saw:
- Stale B invocation result:

Classification:
- Outcome A / B / C

Engineering consequence:
- Eligibility remains authoritative.
- Registration remains best-effort.
- Host-specific note:
```

---

# 6. Engineering consequence while G1 is partial

Do not block host-independent G2 engineering.

Proceed with:

- shared command layer,
- committed attention state,
- deterministic scoring,
- declarative capability rules,
- capability eligibility,
- `deriveToolSurface()`,
- executor guards,
- rationale,
- undo,
- S0→S1→S2 state logic,
- tests.

Do not claim:

- ChatGPT tool discovery,
- ChatGPT tool execution,
- dynamic refresh,
- `toolchange` observation.

Those claims remain pending until measured.
