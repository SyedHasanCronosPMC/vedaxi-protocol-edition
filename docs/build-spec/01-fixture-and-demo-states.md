# 01 — Fixture & Demo States

Define the exact states in the demo and the call that causes each transition *before* building anything. Everything here is a decision.

---

## 1. Fixture

**Topic: thermal comfort and cognitive performance in naturally ventilated offices.**

Legible in one sentence ("hot offices make people work worse"), authorable by you at speed, genuinely nuanced, and it produces a natural conflict between a hedged paper and a confident talk.

**Author all content yourself.** The rules require the submission to be your original work, solely owned, and not infringing third-party rights. Synthetic content also lets you plant the exact disagreement the demo needs, and keeps the repo cleanly licensable.

### Required: label the fixture as synthetic

A judge could reasonably read "34 participants, 4–11% effect" as findings from a real study. Add a quiet, permanent marker:

> *Synthetic research fixture created for the WebMCP Challenge. No real study is depicted.*

Put it under the workspace title or in an About panel, and repeat it in the README. Small type, always present.

Do **not** plaster "FAKE DATA" across the interface — that damages the demo and isn't the point. The goal is that nobody can think you are presenting invented findings as external evidence. It also strengthens the IP story in your submission.

### Assets

| id | Kind | Contents |
|---|---|---|
| `paper` | Document | ~2,500 words. Abstract, Introduction, Methodology, Results, Discussion, Limitations. Methodology has 5 subsections: Participants, Setting, Instrumentation, Independent variables, Analysis procedure. |
| `video` | Video + transcript | 6-minute conference talk by the first author. ~12 timestamped segments. |
| `references` | Reference list | 14 citations, 4 cited from Methodology. |
| `dataset` | Data table | ~20 rows: demographics and the temperature/task-score matrix. Content only — no tool. |
| `publisher` | Publisher block | Newsletter signup, related videos, share controls, more-from-author. |

### The planted disagreement — author this precisely

- **Video segment 07 (~03:10):** the speaker says a 2 °C rise above neutral cuts task performance by "about 8 percent."
- **Paper, Results §4.2:** measured effect 4–11%, wide confidence intervals.
- **Paper, Limitations §6:** one climate zone, 34 participants, three weeks; explicitly declines to generalise.

The agent surfaces this at 1:25. The human resolves it by assigning evidentiary authority. That is the strongest thirty seconds in the submission.

### Element granularity

Attention is scored per **element**: each paper section (6) and Methodology subsection (5), each transcript segment (12), the reference list plus its Methodology-cited subset, the dataset table, and each publisher component (4). **~30 elements** — enough to look real, small enough to hand-tune at 11pm on Tuesday.

---

## 2. Capability counts by state

17 capabilities exist. 8 are spine (always active). 9 are conditional. See `02-tool-manifest.md` for preconditions.

| State | Active | Inactive |
|---|---|---|
| **S0** | **15** | `compare_sources`, `create_citation` |
| **S1** | **12** | transcript, 3 publisher tools, `compare_sources` |
| **S2** | **13** | 3 publisher tools, `list_references` |
| **S3** | **13** | unchanged (pins don't alter eligibility) |
| **S4** | **14** | newsletter restored |
| **S4→S3** | **13** | undo |

**These numbers must match what is on screen in the video.** Judges pause videos.

The count is **supporting evidence, not the thesis.** What matters more than 15 → 12 is that the *composition* changes completely — six publisher-and-video capabilities out, three paper capabilities in — and that `compare_sources` comes into existence at S2. Narrate composition and emergence, not arithmetic.

---

## 3. The five states

### S0 — Publisher default

All assets at CONTEXT. Nothing FOCUSED. A normal, slightly cluttered content page.

- Intent bar empty, prompting for a goal
- **15 capabilities active**
- No rationale records exist

Make it look like a real publisher page. If it looks like a deliberate strawman, the transformation reads as a trick.

### S1 — Understanding

**Trigger:** `set_intent({ intent: "Help me understand the methodology in this paper" })`

| Element | → Level | Rationale label |
|---|---|---|
| Paper § Methodology + 5 subsections | FOCUSED | ↑ Direct intent match |
| Paper § Results, dataset | CONTEXT | ↑ Required to interpret method |
| Methodology-cited references (4) | CONTEXT | ↑ Cited from focal section |
| Paper § Abstract, Intro, Discussion, Limitations | PERIPHERAL | ↓ Adjacent, not requested |
| Video + all transcript segments | PERIPHERAL | ↓ Same topic, different modality |
| Publisher block (4 components) | DRAWER | ↓ Outside current goal · preserved in drawer |

**15 → 12.** Out: `get_transcript_segment`, `subscribe_newsletter`, `list_related_videos`, `share_asset`. In: `create_citation` (paper now FOCUSED).

Methodology renders at full semantic resolution — five subsection headings where there was one line.

### S2 — Comparison

**Trigger:** `set_intent({ intent: "Compare the methodology with what the author says in the video" })`

| Element | → Level | Rationale label |
|---|---|---|
| Paper § Methodology, § Results | FOCUSED | ↑ Named in intent |
| Video + transcript segments 05–08 | FOCUSED | ↑ Named in intent |
| Transcript segments 01–04, 09–12 | CONTEXT | ↑ Context for matched segments |
| References | PERIPHERAL | ↓ Below focal capacity |

**12 → 13.** In: `get_transcript_segment`, **`compare_sources`**. Out: `list_references`.

`compare_sources` requires **two assets at FOCUSED**. It was unavailable at S0 (assets visible but not attended) and at S1 (only the paper attended). It becomes available here for the first time.

> **Visible ≠ attended.** That rule is what makes the line "this capability did not exist for the agent until your intent brought two sources into the task" literally true. Do not register it at S0 for a bigger opening number.

### S3 — Authority

**Trigger:** the agent calls `compare_sources`, finds the 8% vs 4–11% conflict, and surfaces it. The human says: *"Prioritize the peer-reviewed paper, but preserve the video's explanation."*

```
pin_element({ element_id: "paper.results",     level: "focused" })
pin_element({ element_id: "video.segment.07",  level: "context" })
```

Rationale labels must show the distinction:

- Paper Results — `↑ Pinned by you · protected from demotion`
- Video segment 07 — `↑ Pinned at context · will not be demoted`

**Preserve is a constraint, not a ranking preference.** The video has a minimum attention level and cannot be silently demoted. Say this out loud in the video; it communicates unusually sophisticated agent control in one sentence.

Capability count unchanged at 13 — pins set floors, they do not add capabilities.

### S4 — Drawer and reversal

**Trigger:** human opens the drawer, restores the newsletter component, then undoes.

Restore lifts a demoted element to **CONTEXT**, so `subscribe_newsletter` becomes available again: **13 → 14**. `undo_last_adaptation` returns it: **14 → 13**.

Every drawer entry carries label, origin, demotion reason and a one-step restore. Nothing was deleted. Nothing is unreachable.

This state answers every objection anyone has ever had to adaptive interfaces. Keep it in the product even if it is the last thing cut from the video.

---

## 4. Transition table — the build contract

| From | To | Cause | Becomes available | Becomes unavailable | Count |
|---|---|---|---|---|---|
| — | S0 | load | 15 | — | **15** |
| S0 | S1 | `set_intent` | `create_citation` | transcript, newsletter, related, share | **12** |
| S1 | S2 | `set_intent` | transcript, **`compare_sources`** | `list_references` | **13** |
| S2 | S3 | 2× `pin_element` | — | — | **13** |
| S3 | S4 | `restore_capability` | `subscribe_newsletter` | — | **14** |
| S4 | S3 | `undo_last_adaptation` | — | `subscribe_newsletter` | **13** |

---

## 5. What the fixture is not

- **Not a chat app.** The agent's work appears in the content. No permanent chat column.
- **Not LLM-scored.** Intent parsing may use a model; attention scoring is deterministic, so the eval is reproducible and the demo cannot embarrass you.
- **Not real published material.** All content is yours.
