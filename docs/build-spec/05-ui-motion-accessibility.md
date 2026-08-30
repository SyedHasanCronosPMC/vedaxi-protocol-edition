# 05 — UI, Motion & Accessibility

---

## 1. Aesthetic

Light, editorial, calm, premium. Warm white ground, graphite type, pale semantic accents, crisp hairlines, restrained motion.

**Banned** — each of these reads as AI-generated to a panel containing working designers: heavy blur, neural-network decoration, particle fields, cursor trails, glassmorphism, dark sci-fi chrome, purple-to-blue gradients, a permanent chat panel.

The reference feeling is a well-set reading application. If it looks like a research paper that reorganises itself, you have it right.

```css
:root {
  --ground:        #FDFCFA;   /* warm white */
  --ink:           #1A1A18;   /* graphite */
  --ink-muted:     #6B6963;
  --ink-periph:    #A8A59D;
  --rule:          #E6E2DA;
  --accent-focus:  #2F5D50;   /* deep green — promotion */
  --accent-demote: #8A7B5C;   /* warm ochre — demotion */
  --pin:           #B5502E;   /* terracotta — human authority */
}
```

Three semantic colours, one meaning each. Nothing else gets colour.

---

## 2. Five zones

| Zone | Contains | Layout |
|---|---|---|
| **Intent bar** | Current goal, locked constraints, clarifying question when confidence < 0.45 | Full width, top, 64px |
| **Focal plane** | FOCUSED elements at full semantic resolution, actions inline | Centre column, max 5 |
| **Context ring** | CONTEXT elements, grouped with the focal object they support | Right column desktop, below on mobile, max 7 |
| **Peripheral belt** | PERIPHERAL elements, reduced scale and contrast | Bottom strip |
| **App drawer** | Everything demoted, categorised, restorable | Right edge, collapsed |

### Drawer categories

**Required three:**
- Related to this task
- **Used by the agent** ← the differentiator; put it on camera
- Outside current focus

**Optional two** (only if the drawer is done in under an hour): Available now, Recently used.

The drawer proof is `demoted ≠ deleted`, not taxonomy sophistication. "Used by the agent" is where a human audits what happened without reading a log — the ledger surfaced as navigation.

---

## 3. Semantic typography

Attention level maps to a type scale **and** a content representation. Both change. This is the mechanic that separates the product from browser zoom, so it must survive 1080p YouTube compression.

| Level | Size / leading | Weight | Colour | Representation |
|---|---|---|---|---|
| FOCUSED | 20px / 1.6 | 400, headings 600 | `--ink` | Full structure, all subheadings, inline actions |
| CONTEXT | 15px / 1.5 | 400 | `--ink` | Heading + first sentence, expandable |
| PERIPHERAL | 12px / 1.3 | 400 | `--ink-periph` | Single line label with locator |
| DRAWER | 12px | 500 | `--ink-muted` | Label + one-clause reason + restore |

```
PERIPHERAL   Methodology · pp. 4–7

CONTEXT      Methodology · participants · dataset · evaluation

FOCUSED      Methodology
               Participants
               Setting
               Instrumentation
               Independent variables
               Analysis procedure
             [Extract variables] [Summarize] [Compare]
```

---

## 4. Rationale labels

Inline, small, adjacent. Never a modal, never chrome that covers content.

```
Methodology
↑ Direct intent match · read-only site capability

Related videos
↓ Outside current goal · preserved in drawer

Results
↑ Pinned by you · protected from demotion          ← --pin colour
```

Click to expand the seven score terms and the confidence. Labels fade to 40% opacity after 6 seconds so they annotate rather than persist; full opacity on hover or focus.

---

## 5. The capability indicator

Top right, small, dismissible:

```
12 capabilities active · r2
```

Click to expand into the actual list, headed **"Agent capability surface."**

Use **"capabilities active"**, not "tools live" — it reads as product, not debugging chrome. It makes the WebMCP layer visible without cutting to DevTools, it lets you narrate composition changes in the video, and it signals the capability surface is a first-class product surface.

Highest ratio of judge impact to build time in this pack. Ten minutes.

---

## 6. Motion

One transition per intent event. All deltas move together. **1.4s total.**

| Phase | Timing | What happens |
|---|---|---|
| Settle | 0–200ms | Outgoing rationale labels fade. Nothing moves. |
| Reflow | 200–900ms | Zone membership changes; scale and contrast interpolate. `cubic-bezier(0.22, 0.61, 0.36, 1)` |
| Resolve | 900–1300ms | Semantic representation swaps. Promoted content uses **abrupt onset**; demoted content fades. |
| Annotate | 1300–1400ms | Rationale labels appear. |

**The onset asymmetry is evidence-based.** Ephemeral adaptation works because predicted items appear abruptly while non-predicted items fade in — abrupt onset is a stronger attention cue than colour. Promoted content should *arrive*; demoted content should *recede*. Symmetrical timing loses the effect the technique rests on.

**Nothing moves outside a transition.** No idle animation, no ambient motion, no hover parallax. That stillness is what makes the 1.4 seconds land.

---

## 7. Accessibility

Architectural, not a mode. Two proofs done well, not six done badly.

### Proof 1 — Keyboard and screen reader

- `role="region"` with `aria-label` per zone
- **Tab order follows attention:** focal → context → peripheral → drawer. Attention order *is* reading order — the cleanest possible demonstration that the model is real rather than a visual effect.
- Each transition fires `aria-live="polite"`: *"Focus changed. Methodology promoted to focal. Publisher content moved to drawer. 12 capabilities active."*
- Every rationale label reachable; every restore a real button
- The drawer is a landmark, not a hover popup

### Proof 2 — Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  /* No interpolation. Instant state swap.
     A 400ms hairline underline marks changed elements instead of movement. */
}
```

The adaptation still happens and still explains itself; it arrives instantly with a static change marker. Same information, no vestibular load.

Do not build an "Accessibility Mode." Do not expand this into a platform.

---

## 8. Responsive

One breakpoint at 900px. Desktop: zones side by side (parallel comparison). Mobile: zones stack in attention order (sequential focus).

Same attention state, two spatial representations, one media query — because the model is separate from the layout. Do not start a second workflow on mobile in the video; show the same state, differently represented, then cut.
