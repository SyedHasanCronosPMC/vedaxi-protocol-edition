# 09 — Security

Half an hour of work, disproportionate payoff: two judges work on browser and agent safety, and Elastic Web's core mechanic — a capability surface that changes mid-session — is the shape of a published attack class.

---

## 1. Why this matters more here

Recent research describes **Mid-Session Tool Injection**: attackers using third-party scripts to inject or replace tools during an active session. The named lifecycle attacks include tool squatting, tool substitution, unregister-and-re-register exploits, and tool failure combined with re-registration triggered via `AbortSignal`.

That last mechanism is the one you use to compact dormant capabilities. You are not doing anything wrong — you are building on the dynamic tool lifecycle, and that lifecycle is what is under study.

The paper's recommended directions are: bind tool identity to origin, ensure lifecycle consistency, enforce data boundaries for third-party tools, and maintain traceable logs of tool registration and invocation.

You get the fourth for free, because the ledger is the product.

---

## 2. Controls

| Control | Implementation | Cost |
|---|---|---|
| **No third-party script** | CSP `script-src 'self'`. No analytics, no CDN fonts, no embeds. | 5 min |
| **Permissions policy** | `Permissions-Policy: tools=(self)` | 2 min |
| **No `exposedTo`** | Leave unset. Built-in agent default only. | 0 |
| **Revision guard** | Monotonic revision per surface change; stale calls return a structured error directing the agent to re-read `get_attention_state` | 20 min |
| **Spine invariant** | Tier 0 can never be unregistered — enforced in `deriveToolSurface`, covered by a test | done |
| **Bounded output** | Transcript segments return a bounded window, never the full transcript | 10 min |
| **Confirmation on consequential** | `create_citation` previews then confirms, at any confidence | done |

### Annotations

- `readOnlyHint: true` on all Tier 0 reads and Tier 1 fetches
- `untrustedContentHint: true` on `get_transcript_segment`, `list_references`, `list_related_videos`

The second matters conceptually. Chrome's agent guidance names two vectors: **malicious manifests** (hidden instructions in tool names, parameters, descriptions) and **contaminated outputs** — real responses from trustworthy sites carrying malicious instructions inside third-party data such as user comments. Your transcript and reference content is exactly that category even though you authored it. Annotating correctly shows you understand the boundary.

### Netlify headers

```
# public/_headers
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'
  Permissions-Policy: tools=(self)
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

`'unsafe-inline'` for styles only, because semantic type scales are interpolated at runtime. Note the exception in the README rather than hoping nobody looks.

---

## 3. The atomicity caveat, stated honestly

The spec exposes only `registerTool` and `unregisterTool`; the atomic `provideContext()` was removed in the March 2026 revision. A multi-tool swap is **not atomic**, and an agent polling at the wrong moment can observe an intermediate surface.

Mitigations: batch the diff inside a single microtask; unregister before registering so any intermediate state is a valid *subset* rather than a mix of stale and fresh; stamp the revision after the batch completes.

Put this under "Known limitations" in the README. Naming a real constraint in the standard you build on reads as expertise, and one of the judges wrote a browser implementation of it.

---

## 4. Privacy

`interactionEvidence` means recording behaviour. Three lines of policy:

- **Session-scoped only.** No persistence across reloads. Nothing leaves the browser.
- **No network telemetry.** Instrumentation writes to memory and a downloadable JSON for the eval harness. There is no analytics endpoint.
- **Inspectable.** `get_attention_state` exposes exactly what the system believes and why, to both the human and the agent, in the same words.

That last point answers the creepy-personalisation risk: the system's model of you is a document you can read, and so can the agent. Lead with explicit intent, not invisible surveillance.

---

## 5. One paragraph for the writeup

Note the careful wording — it states what *you* do, without claiming a standards consensus that does not exist.

> Elastic Web's capability surface changes during a session, which recent research identifies as an emerging attack surface for WebMCP — tool squatting, substitution, and unregister/re-register exploits. Elastic Web applies defence in depth: origin restriction (no third-party script may execute; no cross-origin tool exposure), lifecycle revisioning for state-version consistency (every capability change increments a monotonic revision that invalidates stale handles), a spine invariant (eight capabilities can never be unregistered, so an agent is never stranded by an adaptation), deferred surface mutation (registration changes are applied only after an in-flight tool execution settles, per spec issue #218), and an auditable ledger recording every registration, invocation and human override with provenance. The transparency layer and the audit log are the same artifact. We do not claim revisioning alone cryptographically identifies a capability; the spec itself notes race conditions around re-registering a name with a different schema.
