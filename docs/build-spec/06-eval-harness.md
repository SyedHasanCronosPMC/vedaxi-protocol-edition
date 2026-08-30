# 06 — Eval Harness

**Never invent a measurement.** Every number in the video and the writeup comes from `evals/results.json`, produced by a script anyone can run. Judges include people who build evals for a living.

---

## 1. The claim — state it precisely

**Wrong claim (do not make it):**
> Smaller tool surfaces make the agent more correct.

You cannot support that. A capable agent may score 10/10 with all 17 capabilities available, and if it does, a claim of improved success is falsified by your own data.

**Right claim:**
> **Intent-conditioned capability surfaces reduce the agent's decision surface without reducing task success.**

That is defensible, measurable, and still interesting — it is the whole argument for exposing capabilities conditionally rather than dumping a manifest. And it survives the most likely outcome, which is parity on success and a modest improvement in calls.

The ideal result looks like:

```
same success · fewer capabilities available · equal or fewer calls · equal or fewer wrong selections
```

Even a slightly *worse* elapsed time is an honest and interesting result, and reporting it costs you nothing with this panel.

---

## 2. Baseline

**Same fixture, same tasks, static full surface — all 17 capabilities available permanently, no adaptation.**

One variable. Do not build a screenshot-driven browser-automation comparison; you don't have the hours and a weak comparison is worse than a clean narrow one. Say in the writeup what the baseline is and what it does not prove.

---

## 3. The ten cases

| # | Task | Success condition |
|---|---|---|
| 1 | "What temperature range did they test?" | Returns the range from Methodology § Independent variables |
| 2 | "How many participants?" | Returns 34, cited to Methodology § Participants |
| 3 | "Summarise the methodology" | Names ≥4 of the 5 subsections |
| 4 | "What does the author claim in the video about the 2 °C effect?" | Returns transcript segment 07 |
| 5 | "Does the video agree with the paper?" | Identifies the 8% vs 4–11% conflict |
| 6 | "What are the study's limitations?" | Returns Limitations §6, mentions single climate zone |
| 7 | "Which references are cited in the methodology?" | Returns exactly the 4 Methodology-cited refs |
| 8 | "Show me the participant demographics" | Returns the dataset table |
| 9 | "Compare the paper's effect size with the video's" | Calls `compare_sources`, returns both figures |
| 10 | "Put the newsletter signup back" | Calls `restore_capability`; capability returns |

Cases 5, 9 and 10 are where the conditions most plausibly differ — but **do not assume they will**. Report what happens.

---

## 4. Metrics, in priority order

| Rank | Metric | Notes |
|---|---|---|
| 1 | **Task success** | Deterministic assertion |
| 2 | **Capabilities available at decision** | The decision-surface number — this is your claim |
| 3 | **Tool calls to completion** | Core efficiency number |
| 4 | **Incorrect tool selections** | Calls to capabilities irrelevant to the task |
| 5 | **Recovery attempts** | Retries after error or empty result |
| 6 | Elapsed time | **See the caveat below** |

### The headline metric

```
capabilityReduction = 1 − (capabilitiesAvailable / 17)
```

Per case, then take the median. At 12 of 17 that reads **29% smaller capability surface**.

It is immediately understandable, it comes straight from `results.json`, and it claims exactly what you can support: irrelevant choices were removed while task completion was preserved. It does not claim the agent got smarter — which you cannot show and do not need.

Report it as: *"Median capability-surface reduction of X%, with task success unchanged at Y/10."* That one sentence is your evidence slot at 2:18.

### The completion-time caveat

A headless harness driving scripted tool calls measures JavaScript execution, not agent decision-making. Under those conditions a millisecond figure is meaningless — you would be benchmarking your own reducer.

**Report elapsed time only if an actual agent run produced it.** Otherwise omit it and say why. Omitting a metric you cannot measure honestly is a stronger signal than reporting one you can't defend.

### Adaptation quality (Elastic condition only)

| Metric | How |
|---|---|
| Required info promoted | Was the answer-bearing element at CONTEXT or above? |
| Necessary context wrongly demoted | Was anything needed for the answer below PERIPHERAL? |
| Reversals | `human_override` events per case |
| Time to stabilise | ms from intent to last attention change |
| Suppressed by hysteresis | Count of changes the dead band prevented — evidence the stability budget works |

---

## 5. Running it

```bash
npm run evals      # both conditions, 10 cases, 3 runs each
                   # → evals/results.json + a markdown summary table
```

Pipeline steps 1–5 run headlessly (they are pure functions); the agent condition is driven through a scripted call sequence. Three runs because model-mediated steps vary; report the median and say so. Keep total runtime under two minutes — if it's slower you'll stop running it, and then it stops being true.

---

## 6. Reporting

One table in the README, one frame in the video.

```
                              Baseline (static)   Elastic (adaptive)
Success rate                        x/10                y/10
Median tool calls                    —                   —
Incorrect selections                 —                   —
Capabilities available at call      17                  ~12
```

**Report honestly even when a row goes the wrong way.** A submission showing one regression and explaining it reads as competent. One where every number favours the author reads as fabricated, and this panel has seen both.

If adaptation comes out neutral for the human, say so, and note it matches the literature: the technique this design builds on was faster than static when accuracy was high and *not significantly slower when it was low*. Bounded downside was the design goal. Hitting it is a result.

---

## 7. Minimum viable version

If Tuesday is going badly:

- 5 cases (keep 3, 5, 7, 9, 10)
- 1 run each
- Two metrics: **tool calls to completion** and **capabilities available at call time**

Twenty minutes, and it still produces a real reproducible number for the only claim you strictly need.
