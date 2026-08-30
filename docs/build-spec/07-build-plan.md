# 07 — Build Plan

**Now:** Sunday 30 Aug 2026, evening, Dubai (UTC+4)
**Deadline:** Wed 3 Sep, 1:00pm PDT = **00:00 Thu 4 Sep, Dubai**
**Available:** four days, ~40 working hours

---

## The three gates

| Gate | When | Condition | If failed |
|---|---|---|---|
| **G1** | Sun 23:00 | A tool registers and executes in ChatGPT's in-app browser | Stop. Debug the environment. Nothing else matters. |
| **G2** | Mon 23:00 | `set_intent` → attention state changes → **DOM changes and eligibility changes** | Cut to two states (S0→S1). Ship a smaller true thing. |
| **G3** | Tue 20:00 | Deployed URL works from a clean machine; S0–S3 reliable | **Feature freeze.** Everything after is video, writeup, submission. |

**G2 deliberately does not require registration changes to propagate.** Eligibility is the authoritative gate; registration is best-effort. If you make G2 the registration test, a host behaviour you don't control can block your build.

**S4 is not in G3.** It is the last thing cut from the video, but the product keeps it.

---

## Sunday night (3–4h) — Prove the environment

Only goal is G1. Do not write UI.

- [ ] Update ChatGPT desktop app. **Switch to GPT-5.6 Sol or Terra — Luna has WebMCP disabled.** Confirm a personal (not Enterprise/Edu) account.
- [ ] Install the Model Context Tool Inspector extension; open the Chrome DevTools WebMCP panel
- [ ] `npm create vite@latest elastic-web -- --template react-ts`; deploy hello-world to Netlify **tonight**
- [ ] Register one trivial tool on the deployed URL. Call it from ChatGPT's browser. **See it work.**
- [ ] **The observation spike** (below)
- [ ] `git init`, MIT LICENSE, first commit with a real message
- [ ] Request Netlify's 3,000 free credits — form closes **1 Sep, 12:00 PT**

### The observation spike

Register A, B, C. Have the agent list them. Then abort B and C, register D. **Without reloading, ask again.** Does it see A + D?

| Outcome | Meaning | Action |
|---|---|---|
| **A.** Sees A + D immediately | Host refreshes on tool change | Film the capability indicator changing live |
| **B.** Sees A + D next turn | Refresh is turn-scoped | Fine — structure the demo around discrete turns anyway |
| **C.** Still sees A, B, C | Observation not propagating | **Change nothing about the plan.** Eligibility already covers it; narrate availability through tool results instead of counts. |

The spec does not mandate an observation on tool change — it notifies *other documents*, and agent notification is implementation-defined. Issue #230 asked to make it a MUST and was **closed as not planned**. Outcome C is legitimate and permanent, not a bug to wait out.

**Build the eligibility guard Monday morning regardless of the result.** It is not contingency work.

---

## Monday (10–12h) — The engine

**Morning**
- [ ] Author fixture content. **Plant the 8% vs 4–11% disagreement precisely.** Add the synthetic-fixture disclosure.
- [ ] ~30 elements with alias sets and all three `SemanticLevels` (~3.5h; highest-leverage block in the build)
- [ ] `types.ts`, `eligibility.ts` (CAPABILITY_RULES), `deriveToolSurface.ts`, `renderModel.ts`
- [ ] **The six tests from `04-architecture.md` §7. Write invariants 5 and 6 first.**
- [ ] `applyIntent.ts` — the one command layer both the intent bar and `set_intent` call

**Afternoon**
- [ ] `score.ts` and `commit.ts`. Verify against the transition table in `01` §4 — counts must come out 15 / 12 / 13 / 13 / 14.
- [ ] Eight spine tools registered and callable
- [ ] **The `gated()` eligibility wrapper on every focus-gated tool**
- [ ] **`withExecutionGuard` + `queueSurface`** — deferred surface mutation, `04` §5
- [ ] Registration wired to attention changes (best-effort path)

**22:00 Dubai — community office hours** (11:00 PT, Mon 31 Aug)

Go with one question, already written:

> "For a WebMCP app that changes its registered tool surface based on shared application state — can we rely on the ChatGPT in-app browser agent observing a tool change between turns, or should apps maintain a stable discovery surface and enforce state-dependent availability inside tool execution?"

Precise, names the real ambiguity, and either answer saves hours. Ask early; office hours run out of time.

**Late**
- [ ] Five zones, static, no motion. Semantic levels rendering from data.
- [ ] `set_intent` end to end. **G2.**

---

## Tuesday (10–12h) — The product

**Morning**
- [ ] Rationale labels with expand to the seven terms
- [ ] Drawer: three required categories, restore working
- [ ] `pin_element`, `restore_capability`, `undo_last_adaptation` from both human UI and agent calls
- [ ] `compare_sources` emerging at S2
- [ ] Capability indicator

**Afternoon**
- [ ] Motion: 1.4s batched transition, asymmetric onset
- [ ] Reduced-motion path
- [ ] Keyboard order = attention order; `aria-live` announcements
- [ ] Mobile stack
- [ ] Security: CSP, annotations, revision guard (`09-security.md`)

**Evening**
- [ ] Eval harness, both conditions, `results.json`
- [ ] Deploy. Open on a machine that has never seen it. **G3. Feature freeze.**
- [ ] **Rehearse the demo once, timed.** If it runs over 2:40, cut tonight, not tomorrow.

---

## Wednesday (8h) — Ship

**Morning — the real deadline, 5–6h**
- [ ] Rehearse twice more, timed
- [ ] Record. Expect 4–6 takes. Budget 3 hours including edit.
- [ ] Upload to YouTube, **public**, verify it plays in incognito

**Midday**
- [ ] Written description (draft in `08`)
- [ ] README: eval table, setup, architecture diagram, `registerTool` snippet
- [ ] LICENSE **visible in the About section** — explicit requirement, trivially checked
- [ ] Repo public; fresh clone → `npm install && npm run dev` verified

**Before submitting**
- [ ] `git tag webmcp-challenge-final && git push --tags`
- [ ] **Freeze production.** Further work happens on a branch.

The rules are explicit: the submission cannot be altered after close, and the project must keep functioning as depicted in the video, freely accessible, **through 21 September**. A well-meant Thursday deploy is a rules problem.

**Submit by 20:00 Dubai.** Four hours of buffer. Devpost will be slow.

---

## Cut order

1. Dataset asset and any dataset UI
2. `create_citation` and all of Tier 2
3. `share_asset` and `list_related_videos` — **keep `subscribe_newsletter`**
4. Mobile layout (mention responsiveness in the writeup instead)
5. Expanded seven-term rationale panel (keep the inline one-line label)
6. 10 eval cases → 5
7. Motion → instant state swaps
8. S4 beat in the video (keep it in the product)

**Never cut:** `set_intent`, `get_attention_state`, `compare_sources`, `pin_element`, `undo_last_adaptation`, the drawer, the inline rationale label, the eligibility guard, the capability indicator, real eval numbers.

That list is the minimum coherent product. Everything above the line is decoration.

---

## The three ways this fails

**1. UI before the capability layer works.** Wednesday arrives with a beautiful page no agent can use, and WebMCP Leverage — one of four equally weighted criteria, and the tiebreaker — scores near zero. G1 and G2 are hard gates.

**2. Video left to Wednesday afternoon.** Three minutes with audio takes 3–4 hours for a first-timer. Most underestimated task in every hackathon. G3 is a freeze, not a suggestion.

**3. Scope creep into the roadmap.** Universal DOM automation, MV3 extension, ONNX classifier, cross-device sync, real commerce, longitudinal studies — every one is interesting and every one loses you Execution, which explicitly asks for a complete, coherent product experience rather than a technical proof of concept.

---

## Daily discipline

- Commit at every checkbox with a real message — the rules require evidence of work in period
- Deploy at the end of every session
- Keep `DECISIONS.md`, one line per non-obvious choice. It becomes the writeup and costs nothing.
- **Stop revising strategy.** The next useful information comes from a real tool executing in a deployed app, not another design document.
