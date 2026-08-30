# Elastic Web — Start Here

**Final build pack, v2. Supersedes all earlier drafts.** Read this file, then `07-build-plan.md`, then start coding.

---

## 1. What we are building, in plain language

A web page has one set of things on it. Today everybody sees all of them at the same weight — the article, the video, the references, the newsletter box, the related links. The page is organised around what the publisher offers, not around what you came to do.

Elastic Web changes that. You state your goal. The page re-renders around it: what you need becomes large and fully detailed, supporting evidence moves next to it, everything else contracts or folds into a drawer. Nothing is deleted, everything reverses in one click, and every change carries a one-line reason you can expand into the numbers behind it.

That half is a good adaptive reading interface. The half that makes it a WebMCP project is this: **the same decision governs what the agent can do.** When the newsletter box is demoted, `subscribe_newsletter` becomes unavailable. When a second source comes into focus, `compare_sources` becomes available — a capability that did not exist for the agent a moment earlier. The human interface and the agent's capability surface are two projections of one attention state, and both parties can read the same reasons for it.

## 2. The architecture thesis — use this sentence everywhere

> **Attention state governs both interface prominence and agent capability availability — registration where the host supports it, eligibility always.**

That phrasing matters and §4 explains why. Do not weaken it to "attention level determines tool registration"; that version is not true under all browsers.

```
                    Explicit user intent
                            │
                  Deterministic attention engine
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  Human rendering    Capability eligibility   Rationale ledger
  focused/context/   ├── authoritative guard        │
  peripheral/drawer  └── best-effort registration   │
        └───────────────────┴───────────────────────┘
                            │
                  Human pin / reject / undo
                            │
                        (feeds back)
```

**The invariant that defines the product:** the layout and the agent's permissions are projections of the *same committed attention state*. They can never disagree. There is a test for this in `04-architecture.md` and it is the highest-priority test in the suite.

## 3. The metaphor: semantic foveation

In graphics, *foveated rendering* draws full detail where the eye looks and progressively less toward the periphery — it's what makes VR viable. Elastic Web does that to meaning instead of pixels. The section you need renders at full semantic resolution; the section you don't renders as a single line.

Use "semantic foveation" as the mechanism name throughout. It tells a technical audience in two words that this is not browser zoom, and three of the seven judges work on browsers and rendering.

**Product name stays Elastic Web.** Fovea was considered and rejected: it is heavily used in software (ArchVision FOVEA, get-fovea.app, apps.fovea.cc, foveacentral.com, and a `fovea` web-components compiler on GitHub). Renaming three days out costs more than it gains. Revisit after the hackathon with real trademark research.

**Positioning line:** *Elastic Web — an intent-driven interface built on semantic foveation.*
**Closing line:** *The browser stops displaying every possibility equally. It brings the right information — and the right capabilities — into focus.*

## 4. The specification nuance everything depends on

Per the WebMCP spec, `registerTool` notifies **other documents** of a tool change. Whether the browser's built-in agent receives a fresh observation is **implementation-defined**. Issue #230 proposed mandating it with MUST and was **closed as not planned**.

So you cannot assume ChatGPT's agent notices mid-session that your surface changed. Do not architect around hoping it does. Architect so it doesn't matter:

| Gate | Mechanism | Host-dependent? |
|---|---|---|
| **Eligibility** | Executor checks attention state at call time | **No — authoritative** |
| **Registration** | `registerTool` / `AbortController.abort()` | Yes — best effort |

Both ship. Registration changes are spec-correct and stronger where supported. Eligibility is what the demo actually rests on. Full design in `02-tool-manifest.md` §3.

This is not damage control — it's a better product. A tool that refuses with a structured reason and a remedy *teaches the agent the rule*, which is a more interesting interaction than one that silently disappears.

## 5. Why this fits WebMCP (the answer to the judged question)

WebMCP gives a page a **second consumer**. Before it, a page had one output surface: pixels for a human. Now it has two, and nothing in the standard says they must be governed by the same logic.

Elastic Web says they should be. Consequences that are not possible without WebMCP:

- **The agent can read why the interface looks the way it does.** `get_attention_state` returns the score breakdown and the rationale record. The agent isn't interpreting a screenshot; it reads the reasoning the human sees.
- **The agent can reshape the interface and be overruled.** It proposes; the human pins, rejects, undoes. Both land in one ledger, in one vocabulary.
- **Capabilities come into existence from intent.** `compare_sources` exists only when two sources are in focus together. The user's goal changes what is *possible*, not only what is visible.

## 6. Verified facts — checked against the official rules

| | |
|---|---|
| Deadline | **Wed 3 Sep 2026, 1:00pm PDT** = **00:00 Thu 4 Sep, Dubai** |
| Field size | ~3,980 registered participants (moves daily) |
| Judging period | 4 Sep 10:00 PT → 21 Sep 17:00 PT. **Live URL must stay up, free and unrestricted that whole time.** |
| Stage One | Pass/fail: reasonably fits the theme, reasonably applies WebMCP |
| Stage Two | WebMCP Leverage · Execution · Potential Impact · Creativity & Ambition. Equally weighted. |
| **Tiebreak** | **Highest WebMCP Leverage score wins ties** — it is the first listed criterion |
| Judges testing | **"Judges are not required to test the Project and may choose to judge based solely on the text description, images, and video."** |
| Required | Live URL · public repo with OSS license **visible in the About section** · text description answering four specific questions · public YouTube video **under 3:00** with audio |
| API | `document.modelContext.registerTool()` — not `navigator.modelContext` |
| Test browsers | ChatGPT desktop in-app browser (WebMCP by default), or Chrome 149+ with `chrome://flags/#enable-webmcp-testing` |
| Netlify credits | 3,000 free — request by **1 Sep, 12:00 PT** |
| Post-deadline | Submission cannot be altered after close. Project must keep functioning as depicted in the video. **Tag and freeze; branch for further work.** |

### Gotchas that cost hours

1. **Model matters.** ChatGPT site tools work with **GPT-5.6 Sol** or **Terra**. **GPT-5.6 Luna has WebMCP disabled.** Check this before debugging anything else.
2. Not available on Enterprise or Edu workspaces. Use a personal account.
3. Update the ChatGPT desktop app to the latest version.
4. **A tool that changes attention state can unregister itself mid-call.** In Chromium today, unregistering a tool unconditionally aborts in-flight executions (spec issue #218, open, Agenda+). Defer surface mutation until the response settles — `04-architecture.md` §5.
5. Tool names: letters, numbers, underscores, hyphens, dots only.
6. `registerTool` throwing is almost always a malformed `inputSchema` or an invalid name.
7. Install the Model Context Tool Inspector extension; use the Chrome DevTools WebMCP panel.
8. Commit continuously with dated messages — the rules require evidence of work done during the period.

### ChatGPT desktop is the authoritative environment

The rules say judges may test in ChatGPT's in-app browser **or** Chrome 149+ with the flag, and both are legitimate. But ChatGPT's site-tools implementation lives in the desktop app's built-in browser, and that is the default judging surface.

**Chrome success alone does not prove your submission works.** Use Chrome for DevTools, the WebMCP panel, inspection and API experimentation. Make the ChatGPT desktop browser your acceptance gate — G1 requires it, and so should every check afterwards.

### What "judges may not test it" changes

Not "build a worse app" — WebMCP Leverage and Execution are both scored partly from code. It means **the video and written description are primary deliverables with their own time budget**, not Wednesday-afternoon paperwork. With ~4,000 entrants, many judges will triage from the video alone.

## 7. The pack

| File | Locks |
|---|---|
| `01-fixture-and-demo-states.md` | Content, five states, every transition, exact capability counts |
| `02-tool-manifest.md` | 17 tools, tiers, eligibility guard, code |
| `03-attention-policy.md` | Deterministic scoring, thresholds, hysteresis, overrides |
| `04-architecture.md` | Types, pipeline, `deriveToolSurface`, the five tests |
| `05-ui-motion-accessibility.md` | Zones, semantic levels, motion, a11y |
| `06-eval-harness.md` | 10 cases, baseline, the defensible claim |
| `07-build-plan.md` | Hour-by-hour, gates, cut order |
| `08-demo-and-submission.md` | Video script, written description, checklist |
| `09-security.md` | CSP, annotations, lifecycle integrity |

## 8. Tonight

Verify the environment and run the observation spike. Nothing else. `07-build-plan.md` has it as a checklist.

Then build `deriveToolSurface()` and its five tests. Both renderers consume it; get it right and the rest is assembly.
