# 08 — Demo & Submission

---

## 1. Video

Under 3:00, public on YouTube, audio required. **Target 2:35–2:40, not 2:50.** A single slow transition or hesitation takes 2:50 over the limit, and judges are not required to watch past three minutes. Record at 1440p or higher; compression destroys 12px type.

**Treat this as a primary deliverable.** The rules state judges are not required to test the project and may judge solely from the text, images and video. With ~4,000 entrants, many will.

### The three moments a judge must remember

1. The page reorganised around intent.
2. `compare_sources` became available because a second source entered focus.
3. The human set authority; the agent preserved that judgment.

Everything else supports those three. If a line doesn't serve one of them, cut it.

---

**0:00–0:12 — The problem**

*Show S0. Touch nothing.*

> "A paper, a talk by the author, references, data — and everything the publisher wants you to see. All at the same weight, all the time. The page is organised around what the publisher offers, not what you came to do."

**0:12–0:35 — First transformation**

*Type: "Help me understand the methodology in this paper." Then stop talking.*

*1.4s transition. Two full seconds of silence.*

> "This isn't zoom. Methodology is now rendered at higher semantic resolution: one line has become five actionable subsections. Results and cited references moved alongside it. The newsletter and related videos went to the drawer, and each one says why."

*Product first, metaphor second. Do not say "semantic foveation" here — the judge needs to see the outcome before they get the name for it. Introduce the term once, at 2:18 or in the close.*

**0:35–0:52 — The WebMCP proof**

*Click the capability indicator.*

> "That same decision governs what the agent can do. Fifteen capabilities were active on load. Now twelve — and different ones. The newsletter capability went away with the newsletter box. One attention state, two surfaces."

*Do not linger. Do not explain the architecture here.*

**0:52–1:20 — The hero moment**

*Type: "Compare the methodology with what the author says in the video."*

> "The paper contracts, the video expands, matching transcript segments come into focus."

*Indicator moves to 13.*

> "And `compare_sources` is now available. It wasn't a moment ago — it requires two sources in focus together. This capability did not exist for the agent until my intent brought a second source into the task."

**1:20–1:45 — Human authority**

*Agent calls `compare_sources`, surfaces the conflict.*

> "The agent found the disagreement. The talk says a two-degree rise costs about eight percent. The paper measured four to eleven, and says it won't generalise beyond one climate zone."

*Say: "Prioritize the peer-reviewed paper, but preserve the video's explanation."*

> "The agent found it. I decide which source carries more authority. It executes that judgment by pinning the paper to focus and the video to context — and notice what preserve means here. The video isn't ranked below the paper. It has a minimum attention level and cannot be silently demoted."

**1:45–2:03 — Reversibility**

*Open drawer, show "used by the agent", restore the newsletter (13 → 14), undo.*

> "Nothing was deleted. Everything demoted is here with its reason and a one-click restore — including everything the agent touched. Restore it and the capability returns. Adaptive interfaces have a bad history. Reversibility isn't a feature here, it's the licence to adapt at all."

**2:03–2:18 — Accessibility and device**

*Toggle reduced motion, then narrow the viewport.*

> "Under reduced motion the adaptation still happens and still explains itself — it just arrives instantly. Tab order follows attention, so reading order and attention order are the same thing. On a phone, the same state stacks sequentially."

**2:18–2:33 — Evidence**

*Show the eval table.*

> "Ten deterministic tasks against the same page with all seventeen capabilities available permanently. Median capability-surface reduction of [X] percent, with task success unchanged. We call the mechanism semantic foveation — detail allocated where attention is, the way foveated rendering allocates pixels. Reproducible with one command."

**2:33–2:40 — Close**

> "WebMCP gives agents structured access to the web. Elastic Web gives humans and agents a shared interface structured around intent."
>
> "The browser stops displaying every possibility equally. It brings the right information — and the right capabilities — into focus."

### If the observation spike returned outcome C

Swap the 0:35 beat: call `compare_sources` too early, show the structured refusal with its remedy, then satisfy it. Arguably the better demo — the agent visibly learns the rule rather than being silently constrained by it.

---

## 2. Written description

Replace every bracket with a measured number.

---

**Elastic Web — an intent-driven interface built on semantic foveation**

**Why this use case is a strong fit for WebMCP**

WebMCP gives a page a second consumer. Before it, a page had one output surface: pixels for a human. Now it has two — pixels, and a typed capability surface for an agent. Nothing in the standard requires them to be governed by the same logic.

Elastic Web argues they should be. It maintains one attention model over the page's content and capabilities and renders it twice: as a visual interface for the human, and as a capability surface for the agent. When something is demoted, its capabilities become unavailable. When two sources come into focus together, a comparison capability comes into existence.

**How it creates a better user experience**

The page is organised around the user's stated goal instead of the publisher's information architecture. Borrowing from foveated rendering in graphics, semantic detail is allocated where attention is and reduced elsewhere.

Every change carries a one-line reason; expanding it shows the seven scored terms and the confidence. Nothing is deleted — everything demoted sits in a categorised drawer with provenance and a one-step restore, and any adaptation can be undone. The design never moves targets: it changes salience and semantic detail while holding position, because the HCI literature is clear that spatial instability is where adaptive interfaces lose to static ones.

**What people and agents can do together that was difficult before**

- **The agent can read why the interface looks the way it does.** `get_attention_state` returns the score breakdown and rationale record. It reads the same reasoning shown to the human rather than interpreting a screenshot.
- **The agent can reshape the interface and be overruled.** It proposes; the human pins, rejects or undoes. Both land in one ledger, in one vocabulary. Pinning is a constraint, not a ranking preference — a pinned element has a minimum attention level and cannot be silently demoted.
- **Capabilities come into existence from intent.** `compare_sources` exists only when two sources are in focus together. The user's goal changes what is possible, not just what is visible.
- **A shared, inspectable record.** Every capability change, invocation and human override is logged with provenance and a monotonic revision.

**How we implemented WebMCP**

17 capabilities in three tiers, registered via `document.modelContext.registerTool()`. An 8-tool spine is registered permanently and never unregistered, so an agent can always orient, enumerate what was demoted, and restore it. 8 focus-gated tools and 1 consequential tool are conditioned on attention state.

Availability runs on two paths. **Eligibility** is authoritative: every conditional tool's executor checks the committed attention state at call time and, when unavailable, returns a structured result carrying the reason, a hint, and a remedy naming the tool that would make it available. **Registration** is best-effort: we register and unregister via `AbortController` as attention shifts. We separated these deliberately, because the spec notifies *other documents* of a tool change while agent observation is implementation-defined (issue #230 was closed as not planned). The result is a capability surface that behaves correctly under any host, and a refusal that teaches the agent the rule rather than leaving a capability to silently vanish.

A single pure function, `deriveToolSurface(attentionState)`, produces both the eligibility set and the registration diff; the DOM renderer and the WebMCP layer are both projections of it. A test asserts they can never disagree. Reads carry `readOnlyHint`; every tool returning third-party text carries `untrustedContentHint`. Each surface change increments a revision, and calls against a stale revision are rejected with a structured error.

**Evidence**

[N] deterministic tasks against a baseline of the same page with all 17 capabilities available permanently. [Real numbers.] The claim we make is narrow and measured: intent-conditioned capability surfaces reduce the agent's decision surface without reducing task success. Reproducible with `npm run evals`.

**Honest lineage**

Elastic Web does not claim to have invented adaptive interfaces, mixed-initiative interaction, or promotion and demotion. It builds on MICA, task-driven adaptive UI, Horvitz's mixed-initiative principles, and the adaptive-menu literature — including its warnings. The contribution is the synthesis: a negotiated attention model over structured WebMCP capabilities, rendered as a reversible, semantically foveated interface shared by a human and an agent.

---

## 3. Submission checklist

**Live URL**
- [ ] Deployed, reachable without VPN
- [ ] Works in ChatGPT desktop in-app browser with GPT-5.6 Sol or Terra
- [ ] Works in Chrome 149+ with the flag
- [ ] **Degrades gracefully with no WebMCP** — renders and works, no console errors
- [ ] Opens correctly on a machine that has never seen it

**Repository**
- [ ] Public on GitHub
- [ ] **OSS license visible in the About section** — use standard MIT text verbatim so GitHub detects it; check the rendered page
- [ ] All source, assets, run instructions
- [ ] Fresh clone → `npm install && npm run dev` works
- [ ] README shows `document.modelContext.registerTool({...})` prominently
- [ ] Eval harness and results committed
- [ ] Dated commits 30 Aug – 3 Sep

**Video**
- [ ] 2:35–2:40, under 3:00
- [ ] Public on YouTube, plays in incognito, has audio
- [ ] Covers what you built and how you used WebMCP
- [ ] Capability counts on screen match `01` §2
- [ ] No third-party trademarks or copyrighted music

**Written description** — answers all four required questions; no unmeasured numbers

**Timing and freeze**
- [ ] Submitted by **20:00 Dubai, Wed 3 Sep**
- [ ] Name consistent across repo, URL, video, submission
- [ ] Tagged `webmcp-challenge-final`; production frozen
- [ ] URL stays up, free and unrestricted **through 21 Sep**

**IP** — all fixture content is your original work; dependencies comply with their licenses

---

## 4. Two things most entrants miss

1. **The license in the About section.** Not just a LICENSE file — GitHub surfaces it in the sidebar only when it recognises the text. Look at the rendered repo page.
2. **Whether the live URL works for someone who isn't you.** Private window, different machine, different network. Local storage, a cached build or a stale service worker have ended better projects than this one.
