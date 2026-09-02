# Elastic Web — G3A Manual Visual Acceptance Check

## Purpose

This checklist closes the only remaining G3A gap:

> Confirm that the deployed UI visibly behaves as the tested render model says it should.

The deployed app is:

```text
https://elastic-web-g1-probe.netlify.app/
```

Code-level G3A requirements already pass.

Current status:

```text
G1 = PARTIAL
G2 = PASS
G3A = PARTIAL
```

Do not change application code during this check unless you discover an actual visual defect.

---

# 1. What this check is validating

The tests already prove the state model and projection logic.

This check validates the human-visible layer:

```text
S0
→ submit S1 intent
→ visually correct S1
→ submit S2 intent
→ visually correct S2
```

You are checking that the deployed UI makes the semantic state understandable to a human.

---

# 2. Open the deployed app

Open:

```text
https://elastic-web-g1-probe.netlify.app/
```

Prefer a fresh/private browser window.

Do not use cached assumptions from an earlier build.

---

# 3. S0 check

Before entering an intent, verify:

- [ ] The page loads without visible errors.
- [ ] The workspace looks like a credible research/publisher page rather than an intentionally broken demo.
- [ ] The Intent Bar is visible and usable.
- [ ] Paper/research content is visible.
- [ ] Video/transcript content is represented.
- [ ] References/dataset/publisher content are present according to the current default state.
- [ ] The capability indicator displays `15` derived active capabilities.
- [ ] The synthetic fixture disclosure is visible but unobtrusive.
- [ ] No unexpected layout overlap or clipped content.
- [ ] No unnecessary animation occurs.

Record:

```text
S0 visual check: PASS / FAIL
Notes:
```

---

# 4. S1 check

Submit exactly:

> Help me understand the methodology in this paper.

Verify:

- [ ] The submission visibly changes the workspace.
- [ ] Methodology becomes the clear focal content.
- [ ] Methodology is rendered at higher semantic resolution, not merely enlarged.
- [ ] The detailed Methodology structure is visible, including the authored subsections required by the fixture.
- [ ] Results, References and Dataset appear as supporting Context.
- [ ] Video/transcript content is visibly reduced to Peripheral treatment.
- [ ] Publisher content is moved to/preserved in the Drawer.
- [ ] Rationale labels are visible for meaningful promotion/demotion.
- [ ] Capability indicator changes to `12`.
- [ ] No content required by the state appears to have disappeared.
- [ ] The user can still understand where demoted content went.
- [ ] No obvious visual jump, overlap, or broken reading order.

Record:

```text
S1 visual check: PASS / FAIL
Observed capability count:
Notes:
```

---

# 5. S2 check

Submit exactly:

> Compare the methodology with what the author says in the video.

Verify:

- [ ] The workspace visibly changes again.
- [ ] Paper and video/transcript are simultaneously legible as the active comparison.
- [ ] Transcript segments 05–08 receive focal treatment.
- [ ] Surrounding transcript segments 01–04 and 09–12 remain visible as Context rather than disappearing.
- [ ] References and Dataset recede to Peripheral treatment.
- [ ] Publisher content remains in the Drawer.
- [ ] The visual hierarchy clearly communicates “comparison” rather than a generic document list.
- [ ] `compare_sources` appears in the derived active capability list.
- [ ] Capability indicator shows `13`.
- [ ] Rationale labels remain understandable.
- [ ] No obvious clipping, overflow, broken layout, or unreadable text.
- [ ] The UI still feels like one workspace, not two unrelated panels.

Record:

```text
S2 visual check: PASS / FAIL
Observed capability count:
compare_sources visible in capability list: YES / NO
Notes:
```

---

# 6. G3A pass rule

Mark G3A PASS only if:

```text
S0 = PASS
S1 = PASS
S2 = PASS
```

and there is no visual defect that undermines the demo story.

Small cosmetic issues do not block G3A.

Examples of non-blocking issues:

- spacing could be better,
- typography is not final,
- color is not final,
- transitions are instant,
- drawer styling is plain.

Blocking issues include:

- wrong zone placement,
- wrong capability count,
- focal content not visually obvious,
- transcript 05–08 not distinguishable in S2,
- content disappearing unexpectedly,
- intent submission not updating the deployed state,
- broken layout/overflow that makes the demo hard to understand.

---

# 7. DECISIONS.md entry

If the check passes, append:

```md
## 2026-08-30 — G3A deployed visual acceptance

### Environment

- URL: `https://elastic-web-g1-probe.netlify.app/`
- Browser:
- Device/viewport:

### S0

```text
PASS
Capability count: 15
```

Notes:
<notes>

### S1

Intent:

`Help me understand the methodology in this paper.`

```text
PASS
Capability count: 12
```

Observed:
- Methodology visibly focal at higher semantic resolution.
- Results/References/Dataset presented as context.
- Transcript content peripheral.
- Publisher content preserved in drawer.

Notes:
<notes>

### S2

Intent:

`Compare the methodology with what the author says in the video.`

```text
PASS
Capability count: 13
compare_sources: active
```

Observed:
- Paper/video comparison visually legible.
- Transcript segments 05–08 focal.
- Surrounding transcript segments retained as context.
- References/Dataset peripheral.
- Publisher preserved in drawer.

Notes:
<notes>

### Gate status

```text
G3A = PASS
```

### Status

```text
LOCKED — deployed functional semantic UI accepted
```
```

If any blocking issue is found, append the exact defect and keep:

```text
G3A = PARTIAL
```

---

# 8. Result to send back

Send:

```text
S0: PASS / FAIL
S1: PASS / FAIL
S2: PASS / FAIL

Capability counts observed:
S0:
S1:
S2:

compare_sources visible in S2:
YES / NO

Visual defects:
<none / list>

G3A:
PASS / PARTIAL
```
