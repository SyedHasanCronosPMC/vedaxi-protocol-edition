# ChatGPT Desktop — G1 WebMCP Verification

## Purpose

This checklist closes the remaining empirical G1 gap for **Elastic Web**.

The G1 probe is already deployed and implementation-ready at:

```text
https://elastic-web-g1-probe.netlify.app/
```

What remains unverified is specifically how the **actual WebMCP-capable ChatGPT Desktop session**:

1. discovers the page's registered site tools,
2. executes a registered tool,
3. observes a mid-session tool-surface change without reload.

Do not infer any of this from page text, source code, DOM inspection, DevTools, or the probe's own status display.

The evidence must come from the ChatGPT WebMCP client itself.

---

# 1. Current status before this test

Keep the project status as:

```text
G1 = PARTIAL
Target ChatGPT Desktop WebMCP verification = PENDING
Dynamic observation behavior = UNMEASURED
```

Do not mark G1 PASS until this checklist is completed with actual target-environment evidence.

---

# 2. Required environment

Use the actual ChatGPT Desktop environment intended for the challenge.

Before starting:

- Update ChatGPT Desktop to the latest available version.
- Use a WebMCP-capable model/configuration intended for the challenge.
- Do not use a configuration known to disable WebMCP.
- Use the in-app browsing/site-tools environment that exposes WebMCP tools.
- Do not substitute a normal external browser test for this acceptance test.

If the session does not expose site tools/WebMCP capabilities, stop and record:

```text
G1 remains PARTIAL — target WebMCP session unavailable
```

Do not fabricate a result.

---

# 3. Probe behavior being tested

Initial page state is intended to expose:

```text
A
B
C
```

The probe then performs a no-reload swap:

```text
remove B
remove C
register D
```

Expected page-level registration intent after the swap:

```text
A
D
```

The purpose of this test is to determine what ChatGPT itself actually observes.

---

# 4. Evidence rules

## Valid evidence

Valid evidence is:

- exact tool names reported by ChatGPT from the current page,
- actual invocation of tool A through ChatGPT,
- actual tool A result returned to ChatGPT,
- exact post-swap tool names reported by ChatGPT,
- actual invocation result/failure for stale tool B if still observed.

## Invalid evidence

Do NOT accept any of the following as proof of G1:

- visible text on the probe page,
- source-code inspection,
- DOM inspection,
- browser console output alone,
- WebMCP DevTools panel alone,
- network tab alone,
- the probe's own "registered tools" display,
- conventional HTTP/browser reachability,
- build success,
- assumption based on specification behavior.

Those can support debugging, but they do not prove what the ChatGPT WebMCP client discovers.

---

# 5. Step 1 — Open the probe

In the WebMCP-capable ChatGPT Desktop browsing session, open:

```text
https://elastic-web-g1-probe.netlify.app/
```

Do not press the swap control yet.

Do not reload between the initial and post-swap checks unless the test explicitly ends.

---

# 6. Step 2 — Initial tool discovery

Send this exact prompt:

> Inspect the WebMCP/site tools exposed by this page. Do not infer them from the visible UI, page text, DOM, or source code. Tell me the exact tool names currently available to you from this site.

Record the exact answer verbatim.

## Required evidence

Expected intended initial set:

```text
A
B
C
```

Record:

```text
Initial discovered tools:
<exact ChatGPT answer>
```

If ChatGPT does not expose any site tools, stop here.

Status remains:

```text
G1 = PARTIAL
Reason = target session did not expose probe tools
```

---

# 7. Step 3 — Execute tool A

Send this exact prompt:

> Invoke WebMCP/site tool A now. Report the exact returned result. Do not infer the result from the page.

Record:

```text
Tool A invocation:
PASS / FAIL

Exact result:
<verbatim result>
```

## Pass requirement

For the execution component of G1:

- ChatGPT must actually invoke A,
- a real tool result must return.

Merely stating that A exists is not enough.

---

# 8. Step 4 — Perform the no-reload swap

Use the probe's visible swap control to trigger:

```text
B/C → D
```

Important:

- Do not reload.
- Do not navigate away.
- Preserve the same browsing session/page.
- Do not reopen the URL.

Record the approximate time of the swap if convenient.

---

# 9. Step 5 — First post-swap observation

Immediately after the swap, send:

> Without reloading or navigating away, re-observe the WebMCP/site tools exposed by the current page. Tell me the exact tool names available to you now. Do not infer them from visible page text or source code.

Record the answer verbatim:

```text
First post-swap observed tools:
<exact ChatGPT answer>
```

---

# 10. Step 6 — Second post-swap observation if needed

If the first post-swap answer is still stale, send one fresh follow-up turn:

> Re-observe the current page's WebMCP/site tool surface again now. Tell me the exact tool names currently available.

Record:

```text
Second post-swap observed tools:
<exact ChatGPT answer>
```

If still stale, optionally use one more fresh turn.

Do not continue indefinitely.

After 2–3 post-swap observations, classify the host behavior.

---

# 11. Step 7 — Optional stale-handle test

Only perform this if ChatGPT still reports B after the swap.

Send:

> Invoke site tool B now and report the exact result or failure. Do not infer from the page.

Record:

```text
Stale B invocation:
PASS / FAIL / HOST REJECTED / TOOL NOT FOUND

Exact result:
<verbatim result>
```

This is useful evidence about whether a stale observed tool remains callable.

It is not required to classify A/B/C, but it is valuable for the Elastic Web lifecycle design.

---

# 12. A/B/C classification

Use this operational classification.

## Outcome A — refreshed by first post-swap turn

Classify as A if:

```text
Initial:
A, B, C

After swap, first post-swap observation:
A, D
```

and B/C are no longer exposed.

Interpretation:

> The ChatGPT host refreshes the observed capability surface by the first post-change turn.

Engineering consequence:

- Dynamic tool-surface compaction can be shown strongly in the demo.
- Executor eligibility remains authoritative anyway.

---

## Outcome B — delayed/turn-scoped refresh

Classify as B if:

```text
Initial:
A, B, C

First post-swap observation:
stale

Later post-swap observation:
A, D
```

Interpretation:

> Host refresh is delayed or turn-scoped.

Engineering consequence:

- Structure the demo around discrete conversational turns.
- Do not rely on immediate observation within the same turn.
- Executor eligibility remains authoritative.

---

## Outcome C — observed surface remains stale

Classify as C if:

```text
Initial:
A, B, C

After 2–3 post-swap observations:
still stale
```

Interpretation:

> Dynamic registration may be spec-correct at the page level but cannot be relied on for prompt host observation in this ChatGPT environment.

Engineering consequence:

- Keep best-effort registration.
- Make executor eligibility the correctness boundary.
- In the demo, emphasize structured refusal/remedy rather than assuming the agent immediately sees tool disappearance/appearance.
- Do not claim that ChatGPT dynamically refreshes the capability surface.

---

# 13. G1 pass criteria

G1 can be marked fully verified only when all three are true:

## Discovery

ChatGPT genuinely reports the site's initial tools.

## Execution

ChatGPT actually invokes tool A and returns its real result.

## Host behavior classification

The post-swap behavior is empirically classified as:

```text
A
B
or
C
```

Important:

> Outcome C is still a valid completed G1 observation.

G1 is not testing whether the host behaves ideally.

G1 is testing what the host actually does.

---

# 14. If discovery fails entirely

If ChatGPT cannot see A/B/C at all:

Do not classify A/B/C.

Record:

```text
G1 = PARTIAL
Initial discovery = FAIL / unavailable
Dynamic observation classification = NOT POSSIBLE
```

Then capture:

- ChatGPT Desktop version,
- model/configuration,
- screenshot if useful,
- any visible site-tools/WebMCP indicators,
- exact error or response.

This becomes an environment/discovery debugging issue, not an application-state result.

---

# 15. Evidence capture checklist

Capture as much of the following as practical:

- [ ] ChatGPT Desktop/app version
- [ ] Model/configuration
- [ ] Date/time
- [ ] Probe URL
- [ ] Initial exact tool list
- [ ] Tool A actual execution result
- [ ] First post-swap exact tool list
- [ ] Second post-swap exact tool list, if needed
- [ ] Stale B result, if applicable
- [ ] A/B/C classification
- [ ] Screenshot(s), optional but useful
- [ ] Any host-specific error text

Do not paraphrase key evidence if you can preserve the exact output.

---

# 16. Exact DECISIONS.md entry

Once the test is complete, append the following block to:

```text
D:\Github\Elastic Web\DECISIONS.md
```

Replace every `<...>` placeholder with actual observed evidence.

```md
## <YYYY-MM-DD> — G1 ChatGPT Desktop WebMCP verification

### Environment

- Date/time: <date/time>
- ChatGPT Desktop/app version: <version>
- Model/configuration: <model/configuration>
- Probe URL: `https://elastic-web-g1-probe.netlify.app/`

### Initial discovery

Exact tools reported by ChatGPT:

```text
<exact tool names>
```

### Tool A execution

Status:

```text
PASS / FAIL
```

Exact result:

```text
<verbatim tool A result>
```

### No-reload surface swap

Probe action:

```text
B/C removed
D registered
No page reload
Same browsing session
```

First post-swap observation:

```text
<exact tool names>
```

Second post-swap observation, if required:

```text
<exact tool names or N/A>
```

### Stale B invocation, if tested

```text
<exact result / failure / N/A>
```

### Host observation classification

```text
Outcome A / Outcome B / Outcome C / NOT CLASSIFIABLE
```

### Interpretation

<One or two sentences describing the observed host behavior only. Do not generalize beyond the tested environment.>

### Engineering consequence

- Capability eligibility remains authoritative.
- WebMCP registration remains best-effort.
- <A: dynamic capability compaction may be shown directly in the demo.>
- <B: demo should use discrete turns for surface refresh.>
- <C: demo should not depend on prompt dynamic surface observation; use eligibility/refusal proof instead.>

### Gate status

```text
G1 = PASS
```

Use `PASS` only if initial discovery, tool A execution, and A/B/C classification were all empirically completed.

If discovery/execution could not be completed, use:

```text
G1 = PARTIAL
```

### Status

```text
LOCKED — empirical host behavior for this tested environment
```
```

---

# 17. Short result format to send back for review

After completing the test, send:

```text
Environment:
ChatGPT Desktop version:
Model/configuration:

Initial tools:
A execution:

First post-swap tools:
Second post-swap tools:

Stale B result:

Classification:
A / B / C

G1:
PASS / PARTIAL
```

Include exact tool result/error text where relevant.

---

# 18. Do not change application architecture during this test

This is an observation exercise.

Do not modify the probe to make a preferred classification appear.

Do not change:

- eligibility policy,
- registration timing,
- probe tool names,
- swap behavior,

until the current behavior has been measured and recorded.

The purpose is to replace assumption with evidence.

---

# 19. Final interpretation rule

Regardless of A, B, or C:

> **Elastic Web keeps capability eligibility authoritative and WebMCP registration best-effort.**

The host observation result changes the **demo strategy**, not the core correctness architecture.
