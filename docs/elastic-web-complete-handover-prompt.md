# Elastic Web — Complete Handover Prompt

Copy everything inside the following prompt into a new agent or engineering task.

---

## Role

You are taking over product strategy, interaction design, WebMCP architecture, evaluation design, and hackathon delivery for **Elastic Web**, an intent-driven semantic presentation layer for the agentic web.

Work as a critical product-and-engineering collaborator. Preserve the core thesis, but challenge anything that is too broad, technically unsupported, visually generic, or insufficiently WebMCP-native. Do not generate images until the concept, interaction states, and demo storyboard are approved.

## Hackathon context

Elastic Web is intended for the 2026 OpenAI WebMCP Challenge.

Official requirements include:

- A working live WebMCP-enabled web application.
- A public source repository with all required code and an open-source license.
- A written explanation of why the use case fits WebMCP, how it improves the experience, what humans and agents can do together, and how WebMCP was implemented.
- A public demo video under three minutes with audio.

Official judging criteria:

1. WebMCP Leverage
2. Execution
3. Potential Impact
4. Creativity & Ambition

The submission deadline is September 3, 2026 at 1:00 p.m. PDT. Verify all current challenge details before relying on them.

Primary references:

- https://openai.com/webmcp-challenge/
- https://webmcp.devpost.com/
- https://learn.chatgpt.com/docs/webmcp

## Core thesis

Websites currently render the publisher's information architecture: every feature, promotion, navigation path, retention mechanism, and possible workflow. Users normally arrive with one desire: watch a video, read a PDF, understand a section, compare alternatives, apply a discount, make a payment, inspect a statement, or complete another specific outcome.

Elastic Web asks:

> What if the browser stopped presenting every possibility equally and rendered the interface around the user's current desire?

The durable product formulation is:

> **WebMCP tells the browser what a website can do. Elastic Web determines which capabilities and assets deserve attention for this user, on this device, at this moment.**

Or more visually:

> **The browser stops rendering every possibility equally and begins rendering desire.**

Elastic Web is not primarily a distraction blocker, browser zoom feature, cursor effect, or chatbot. It is a **semantic presentation engine for shared human-agent interaction**.

## Important correction about attention

The conceptual inspiration is the 2017 Transformer paper **“Attention Is All You Need,”** not “Attention Is Everything.” It was not the first attention paper, but it introduced the Transformer architecture foundational to modern LLMs.

Use the analogy precisely:

| Transformer concept | Elastic Web equivalent |
|---|---|
| Query | Explicit user desire, constraints, device and current task context |
| Keys | Semantic descriptions of assets and WebMCP capabilities |
| Values | Actual content, actions, tool results and interface representations |
| Attention weights | Relevance assigned to each capability or asset |
| Attention output | The focused interface rendered for the current moment |
| Masking | Permissions, hard constraints, safety and unavailable actions |
| Multi-head attention | Intent, content, accessibility, safety, habit and context perspectives |
| Positional encoding | Original hierarchy, source, location and provenance |
| Residual connection | Original/full interface remains reachable through the app drawer |
| Normalization | No noisy signal controls adaptation by itself |

Do not claim that Transformer attention literally models human gaze or cursor behavior. Cursor movement is not the product thesis and should not dominate the experience.

## Primary visual invention

The visual signature is the **Semantic Focus Shift**.

When intent changes:

- Task-critical text becomes larger, sharper and more semantically detailed.
- Supporting context moves closer and becomes readable.
- Related passages or assets visibly group together.
- Low-relevance content reduces in scale, contrast and semantic detail.
- Unused capabilities contract into an organized app drawer.
- WebMCP actions appear beside the assets they operate on.
- Transitions maintain spatial continuity so viewers understand where information moved.
- Nothing important is silently deleted.

This is not ordinary browser zoom. Browser zoom scales everything uniformly. Elastic Web changes the **semantic resolution** of individual elements according to intent.

Example semantic levels for one document section:

```text
Peripheral:
Methodology · pp. 4–7

Candidate:
Methodology · participants · dataset · evaluation

Focused:
Methodology
Participants
Dataset
Independent variables
Evaluation procedure
Limitations
[Extract variables] [Summarize] [Compare]
```

The visual system should use typography, scale, weight, contrast, line length, proximity and progressive disclosure. Avoid excessive blur, decorative neural-network graphics, random particle motion, cursor trails, glassmorphism, dark sci-fi styling, and a permanent chat panel.

The preferred aesthetic is light, editorial, calm and premium: warm white background, graphite typography, pale semantic accents, crisp hairlines and restrained motion.

## Interface spatial model

Use five zones:

1. **Intent bar:** the user's current desire and locked constraints.
2. **Focal plane:** the content or decision requiring attention now.
3. **Context ring:** evidence necessary to understand the focal object.
4. **Peripheral belt:** relevant alternatives and optional branches.
5. **App drawer:** complete capability inventory and unused functions.

The drawer preserves user sovereignty. It must categorize capabilities such as available now, related to the task, recently used, used by the agent, and outside the current focus. Users must be able to restore or pin anything.

## Research lineage

The product is informed by several research streams. Do not claim Elastic Web invented adaptive interfaces, mixed initiative, promotion/demotion, user modelling, or task-driven adaptation.

### MICA — Mixed-Initiative Customization Assistance

MICA combines adaptable and adaptive interfaces. The system recommends customization while users retain control. It emphasizes non-intrusive support, predictability, transparency, rationale, expected time savings, usage patterns, expertise and interface characteristics.

Primary paper:
https://www.cs.ubc.ca/~conati/522/532b-2019/papers/iuii2007AndreaCamera.pdf

### TADAP

Task-driven runtime adaptive/adaptable UI using user feedback and machine learning. It supports a continuous loop of observing context, inferring task, proposing adaptation, receiving feedback and updating the interface.

Reference:
https://research.dial.uclouvain.be/entities/publication/ffc1b304-0ceb-49ef-94b8-09a48b1204c4

### Microsoft mixed-initiative principles

Eric Horvitz emphasizes valuable automation, uncertainty about goals, attention-aware timing, costs and benefits of automated action, user guidance and correction.

Reference:
https://www.microsoft.com/en-us/research/wp-content/uploads/2016/11/chi99horvitz.pdf

### Adaptation taxonomy

The model-based intelligent UI adaptation framework asks who, what, why, when, where, how and based on what context an interface adapts. It distinguishes presentation, navigation, behavior and content adaptation.

Reference:
https://link.springer.com/article/10.1007/s10270-021-00909-7

### Widget promotion/demotion

Promotion and demotion research demonstrates dynamic emphasis and de-emphasis of predicted widgets, while also warning that adaptive interfaces can introduce errors and do not automatically outperform stable interfaces.

Reference:
https://doi.org/10.1145/3319499.3328237

## Defensible novelty

The novelty is the convergence of:

```text
Explicit user desire
        +
Mixed-initiative control
        +
WebMCP capability graph
        +
Semantic promotion/demotion
        +
Visible rationale
        +
Human correction
        +
Cross-device presentation
```

The defensible claim is:

> Elastic Web computes a negotiated attention model over structured website capabilities and content, then renders it as a reversible, semantically zoomable human-agent interface.

## WebMCP-to-MICA mapping

The critical architecture is not “WebMCP tool to visible button.” It is:

```text
WebMCP evidence
      ↓
MICA-style rationale
      ↓
Negotiated focus proposal
      ↓
Semantic interface transformation
      ↓
User correction or acceptance
      ↓
Tool invocation and verification
```

Keep WebMCP standards-compliant. Do not place proprietary rationale fields into standard annotations. Maintain a separate Elastic rationale registry keyed by tool, asset and origin.

| WebMCP element | MICA rationale function | Elastic presentation |
|---|---|---|
| Tool name | Identifies a feature | Names the promoted capability |
| Description | Explains what it does | Provides human-facing explanation |
| Input schema | Reveals required data and interaction cost | Determines which inputs enter focus |
| Annotations | Indicates read/write and safety characteristics | Determines preview and confirmation treatment |
| Tool availability | Defines usable capabilities | Unavailable actions are demoted or masked |
| Invocation | Records system initiative | Shows what the agent is doing |
| Structured result | Verifies outcome | Updates the interface with evidence |
| Page origin | Establishes provenance | Displays which site supplied the capability |
| User request | Defines expected task usage | Primary reason for adaptation |
| User correction | Updates the current user model | Promotes, demotes, pins or rejects elements |

Use a rationale contract similar to:

```ts
interface ElasticRationale {
  id: string;
  subject: {
    kind: "asset" | "content" | "webmcp-tool" | "tool-result";
    id: string;
    label: string;
  };
  provenance: {
    origin: string;
    toolName?: string;
    registrationRevision?: string;
  };
  adaptation: {
    operation: "promote" | "demote" | "retain" | "reveal" | "mask";
    from: AttentionLevel;
    to: AttentionLevel;
  };
  why: {
    summary: string;
    goalContribution: string;
    expectedBenefit?: {
      interactionsSaved?: number;
      estimatedTimeSavedMs?: number;
    };
  };
  how: {
    explicitIntentMatch: number;
    taskRelevance: number;
    capabilityFit: number;
    deviceFit: number;
    interactionEvidence: number;
    interfaceCost: number;
    uncertainty: number;
  };
  safety: {
    readOnly: boolean;
    consequential: boolean;
    reversible: boolean;
    confirmationRequired: boolean;
  };
  confidence: number;
  controls: {
    canAccept: boolean;
    canReject: boolean;
    canPin: boolean;
    canUndo: boolean;
  };
  verification?: {
    status: "pending" | "verified" | "failed";
    evidence?: unknown;
  };
}
```

Rationale should have three layers:

1. **Why:** direct relationship to the user's stated goal.
2. **How:** intent match, available capability, expected benefit, interface cost, risk and confidence.
3. **Control:** keep in focus, show context, move to drawer, not relevant, undo.

During the demo, rationale should appear as a brief causal annotation rather than a large explanation panel:

```text
Methodology
↑ Direct intent match · read-only site tool · 6 steps saved
```

For demotion:

```text
Related videos
↓ Outside current goal · preserved in drawer
```

## Initiative and confidence policy

Cursor movement is not authoritative intent. Treat interaction evidence as secondary.

Authority order:

1. Explicit user statement or correction
2. User pinning or direct selection
3. Current task state
4. Keyboard focus or repeated interaction
5. Dwell and pointer behavior
6. Historical preference

Adaptation confidence policy:

- **High confidence + low cost of error:** promote automatically with visible rationale and undo.
- **Medium confidence:** suggest promotion without restructuring.
- **Low confidence:** preserve the current interface and ask for clarification.
- **Consequential action:** never execute silently; preview and confirmation are required.

Every demoted item must retain a drawer location, label, provenance, reason and one-step restore action.

## Accessibility position

Accessibility should be architectural, not a separate checklist mode. The same capability graph must support different representations:

- Large touch controls on a phone
- Parallel comparison on desktop
- Sequential focus for switch access
- Ordered semantic actions for screen readers
- Stable layouts for reduced motion
- Larger typographic resolution for visual access

For the hackathon, implement two accessibility proofs well:

1. Keyboard and screen-reader-equivalent operation.
2. Reduced-motion transformations with stable targets.

Do not let accessibility broaden the project into an unfinished platform.

## Current recommended hackathon product

Do not attempt to build a universal browser extension for the submission. Build one controlled, deployed, WebMCP-native application proving the interaction model.

The currently strongest fixture is a multimodal knowledge workspace containing:

- A research paper
- A video presentation
- A transcript
- Related references
- Citation, extraction, search and comparison actions
- Secondary publisher features

This fixture is preferred because text is the primary visual material, semantic zoom is obvious, human judgment complements agent extraction, and WebMCP tools can be meaningful and deterministic.

Possible initial WebMCP tools:

```text
list_assets
get_document_outline
get_document_section
search_document
get_transcript_segment
compare_sources
create_citation
set_research_focus
```

The most important interaction is:

```text
Agent invokes a meaningful WebMCP tool
        ↓
Shared application state changes
        ↓
MICA rationale is generated
        ↓
Text and assets visibly reform around intent
        ↓
Human accepts, corrects or redirects
```

The knowledge-work fixture is a recommendation, not a permanently locked decision. If another fixture is chosen, it must preserve the same semantic-focus and mixed-initiative proof.

## Three-minute demo storyboard

### 0:00–0:15 — Complexity

Show a credible information-rich application. Say:

> “The web presents every possibility at the same time, even when the user has only one desire.”

### 0:15–0:35 — First visual transformation

User intent:

> “Help me understand the methodology in this paper.”

Within roughly 1.2–1.8 seconds:

- Methodology becomes the largest textual element.
- Relevant pages expand into the focal plane.
- Definitions, variables and figures enter the context ring.
- Relevant WebMCP actions appear.
- Video, recommendations and unrelated navigation contract into the drawer.
- Brief rationale labels explain the promotion/demotion.

Pause for approximately two seconds so judges can see the transformation.

### 0:35–0:55 — WebMCP proof

Briefly show available tools, then close the technical panel. Explain that structured capabilities replace screenshot guessing and simulated clicking.

### 0:55–1:25 — Second transformation

Change intent:

> “Compare the methodology with what the author says in the video.”

The paper contracts left, the video expands right, matching transcript passages appear, and source connections form.

### 1:25–1:50 — Mixed initiative

The agent identifies a disagreement. The user says:

> “Prioritize the peer-reviewed paper, but preserve the video's explanation.”

The interface reforms again, proving that the human supplies judgment while the agent performs structured work.

### 1:50–2:10 — Drawer and reversibility

Show that all demoted features remain accessible, explainable and restorable.

### 2:10–2:30 — Cross-device or accessibility proof

Show the same attention state represented sequentially on a phone or with reduced motion. Do not start a second workflow.

### 2:30–2:48 — Evidence

Show real baseline measurements comparing visual browser automation and WebMCP. Never invent metrics.

### 2:48–3:00 — Close

> “WebMCP gives agents structured access to the web. Elastic Web gives humans an interface structured around desire.”

Then:

> “The browser stops displaying every possibility equally. It brings the right information into focus.”

## Judge strategy

A complete judge-specific evaluation system already exists at:

`outputs/elastic-web-judge-evaluation.md`

It models seven professional lenses without claiming private personal biases:

- Sarah Drasner: browser UX, visual communication, accessibility and reliability
- Andrew Galloni: open agent infrastructure, publisher incentives, trust and efficiency
- Alex Nahas: WebMCP correctness, typed tools, determinism and protocol contribution
- Ilya Grigorik: performance, commerce semantics and measurable user value
- Jude Gao: reproducible agent evals, baselines and implementation quality
- Sean Roberts: Agent Experience, delegated authority, recovery and observability
- Justin Rushing: browser-agent task success, collaboration, safety and verification

The concept was provisionally scored at 61/100 because the evidence and implementation did not yet exist, not because originality was weak.

The central judge test is:

> “Would this product remain essentially the same without WebMCP?”

If yes, the design is insufficiently WebMCP-native.

## Required evals

### Task performance

- Completion time
- Number of human interactions
- Number of agent calls
- Recovery attempts
- Incorrect actions
- Task success rate

### Adaptation quality

- Was required information promoted?
- Was necessary context incorrectly demoted?
- How often did users reverse adaptations?
- How quickly did the interface stabilize?
- Did adaptation reduce or increase errors?

### Mixed-initiative quality

- Could the user understand why adaptation occurred?
- Could the user correct it?
- Did correction take effect immediately?
- Did the agent stop when confidence was insufficient?
- Did the user retain control over consequential actions?

### Visual comprehension

- Can a first-time viewer identify the current intent within three seconds?
- Can they identify what entered focus?
- Can they tell where demoted information went?
- Can they distinguish agent work from human judgment?

Use at least 10 deterministic task cases and compare against a clear baseline. Report success rate, median completion time, calls, retries and incorrect actions. Do not use fabricated measurements in the demo.

## Scope decisions

For the hackathon, include:

- One deployed WebMCP-native web application
- Explicit user intent
- Deterministic attention scoring
- Three or four semantic focus levels
- Promotion/demotion animation
- MICA rationale
- User correction, pinning and undo
- Full app drawer
- Meaningful structured tools
- Real baseline evals
- Keyboard/reduced-motion proof
- Three-minute demo

Defer:

- Universal legacy DOM automation
- Production MV3 extension
- ONNX intent classifier training
- Cross-device habit synchronization
- Real cross-site commerce or booking execution
- B2B WebMCP auditor
- Longitudinal personalization studies

These can remain in the roadmap but must not consume hackathon implementation time.

## Known product risks

1. **Visual gimmick without architecture:** every transformation must be causally tied to intent, rationale and WebMCP evidence.
2. **Adaptive-interface instability:** preserve continuity, stable targets, undo and drawer access.
3. **Superficial WebMCP:** tools must be semantic operations, not wrappers around buttons.
4. **Chatbot framing:** agent activity should be visible in the shared content, not confined to chat.
5. **Creepy personalization:** lead with explicit intent and visible correction, not invisible behavioral surveillance.
6. **Decorative graph:** every node must represent an intent, constraint, asset, capability, evidence item, human decision or agent action.
7. **Overclaiming novelty:** describe the research lineage honestly and claim the WebMCP-driven synthesis.
8. **Unverified wow metrics:** use only repeatable measured evidence.

## Immediate next task

The next agent should convert this handover into a decision-complete hackathon build specification before implementing. That specification should lock:

1. The exact fixture content and hero workflow.
2. The WebMCP tool manifest and structured result shapes.
3. The attention-state model and deterministic scoring rules.
4. The MICA rationale data contract and visual patterns.
5. The five-zone UI and semantic typography states.
6. The animation storyboard with timings and reduced-motion equivalents.
7. User correction, pinning, undo and drawer behavior.
8. The baseline and WebMCP eval suite.
9. The deployment, repository and three-minute submission checklist.

Do not begin by producing generic mockups. First define the exact states that will appear in the three-minute demo and the tool call that causes each state transition. Then build the smallest complete application that demonstrates those transitions live.

---

