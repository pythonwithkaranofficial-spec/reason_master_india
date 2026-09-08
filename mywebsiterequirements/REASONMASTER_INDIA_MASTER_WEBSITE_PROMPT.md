# MASTER WEBSITE GENERATION PROMPT — ReasonMaster India

> Copy everything below this line directly into your website/code-generation AI. This single document is the complete, implementation-ready specification for the ReasonMaster India website, reverse-engineered and reconciled from the existing ReasonMaster India Flutter application (package `com.pwk.reasonmaster`, v1.3.0+4), its forensic application audit, its exam/topic/subtopic data structure document, and its existing marketing/reference screenshots.

---

## 1. Project Overview

Build **ReasonMaster India** — a premium, content-rich educational web platform that teaches and drills the **Reasoning** section (Verbal + Non-Verbal + Logical) tested across India's major government and competitive recruitment examinations (SSC, Banking, Insurance, Railway, Defence, Police, Central Government, and State PSC exams).

This is a companion/port of an existing, fully-built Flutter mobile app. The web version is **not a redesign from a blank page** — it is a faithful, improved reconstruction of a verified, working product. Preserve all verified data, structure, and functionality; you may improve visual design, spacing, responsiveness, and code architecture, but you must not invent, remove, or silently alter curriculum data, exam mappings, question structures, or core functional behavior.

The product teaches students to:
- Learn a reasoning **topic** (concept, rules, shortcuts/tricks)
- Study **worked examples** with step-by-step shortcut-based solutions
- Practice with **topic-level MCQs** and a **19,500-question master MCQ bank**
- Understand which topics matter most for **which competitive exam**
- Track their own **progress, accuracy, and weak areas** — entirely on-device, with no login and no backend in this version

The end product must feel like a serious, trustworthy, daily-use study tool for Indian competitive-exam aspirants — not a marketing site, not a game, not a generic SaaS template.

**Working name in code/config:** `reasonmaster-india`
**Display brand:** ReasonMaster India
**Origin platform:** Android (Google Play, developer identity "PWK") — this web build is the platform-independent counterpart.

---

## 2. Brand Identity

**Name:** ReasonMaster India — always written as two words + "India", never abbreviated to "RM" or "Reason Master" in user-facing copy (code identifiers may abbreviate).

**Logo:** Design an original mark expressing reasoning / logical thinking / mastery / structured learning — for example, an abstract mark built from clean geometric primitives implying connected logic nodes, a stylized ascending step/staircase (mastery/progress), or a minimal "brain + circuit path" glyph rendered only in flat solid shapes (no gradients, no 3D bevels, no photographic elements). The mark must:
- Work as a small header/nav icon (down to ~24px)
- Work as a favicon
- Work as a monochrome mark on both light and dark surfaces
- Avoid childish, gamified, or overly literal iconography (no dice, no joystick, no cartoon mascots)
- Be paired with a clean wordmark ("ReasonMaster" in a strong weight + "India" in a lighter/smaller treatment, or a subtle tricolor-inspired accent used tastefully and only as a small underline/dot accent — never a full flag treatment, never overtly patriotic styling)

**Tone of voice:** Encouraging but serious. Direct, exam-focused, respectful of the student's time. No slang, no hype language, no gamer-style exclamation-heavy copy.

---

## 3. Design Philosophy

The product must feel: **Premium + Minimal + Educational + Fast + Professional + Calm.**

A first-time visitor should immediately think: *"This is a complete, trustworthy, professionally built reasoning-preparation platform"* — the kind of tool a serious aspirant bookmarks and returns to daily.

Explicitly avoid the following aesthetic directions:
- Gaming website energy
- Crypto/trading dashboard energy
- Generic interchangeable SaaS template energy
- Obviously AI-generated template energy
- Flashy startup landing-page energy
- 3D application energy
- Overly decorative / illustration-heavy energy
- Childish learning-app energy
- Overloaded Material Design energy

Use the supplied screenshots (subject card grids, topic breakdown pages, exam category grids) as **reference for information hierarchy and interaction patterns only** — reproduce none of them pixel-for-pixel. Elevate them: better spacing, better type scale, better restraint, better accessibility, better responsiveness.

---

## 4. Absolute Visual Restrictions (Hard Constraints)

These are non-negotiable and must be enforced across every component, state, and theme:

**No 3D:**
- No 3D cards, 3D buttons, 3D objects, floating 3D illustrations
- No excessive depth/elevation stacking
- No heavy glassmorphism
- No exaggerated drop shadows

**No gradients — anywhere, ever:**
- No linear, radial, mesh, conic gradients
- No gradient buttons, backgrounds, cards, borders, or gradient text
- All color must be flat, solid fills

**General:** No decorative shapes/blobs, no unnecessary floating elements, no stock illustration filler. Every visual element must justify its presence.

---

## 5. Colour System

Build a centralized, token-based, solid-color-only palette. Direction: academic navy + refined blue + a restrained saffron/gold accent + clean neutrals, giving a subtle, sophisticated Indian identity without becoming a flag treatment or looking political.

Define these design tokens (name them consistently in code, e.g. CSS variables / a theme config) for **both light and dark themes**:

| Token | Purpose |
|---|---|
| `color-primary` | Academic navy (e.g. deep blue ~`#1E40AF` family) — primary actions, active nav, brand |
| `color-secondary` | Supporting refined blue, slightly lighter/desaturated |
| `color-accent` | Saffron/gold accent (e.g. ~`#F59E0B` family) — used sparingly: highlights, badges, streaks, key CTAs |
| `color-background` | App base background |
| `color-surface` | Card/panel surface |
| `color-surface-elevated` | Modal/dropdown/popover surface, one step up from `surface` |
| `color-border` | Hairline borders/dividers |
| `color-text-primary` | Primary reading text |
| `color-text-secondary` | Supporting text |
| `color-text-muted` | Metadata, timestamps, low-emphasis labels |
| `color-success` | Correct-answer / positive states |
| `color-warning` | Medium-difficulty / caution states |
| `color-error` | Incorrect-answer / destructive states |
| `color-info` | Informational banners/badges |

Difficulty badges follow a consistent solid-color system across the whole site (mirroring the existing app): **Easy → success green**, **Medium → accent gold/amber**, **Hard → error red** — always paired with the text label ("Easy"/"Medium"/"Hard"), never color alone.

Contrast target: minimum 4.5:1 for body text, and prefer the app's own verified >14:1 high-contrast surface pairing where feasible. No token may be used inconsistently — audit for stray hex values.

---

## 6. Typography

- Font family: **Poppins** for headings/display, **Inter** for body/UI text (both via a performant web font loading strategy — self-hosted or `font-display: swap`).
- Establish a clear modular type scale distinguishing: page title, section title, topic title, question text, answer-option text, explanation text, metadata/caption text, supporting/body text.
- Avoid ultra-thin weights; avoid oversized marketing-style display type. This is a study tool, not a landing page — type should read comfortably for long practice sessions.
- Ensure the scale is responsive (fluid or breakpoint-based) and remains legible at small mobile sizes and during long question-reading sessions.

---

## 7. Light / Dark / Automatic Theme Behavior

Implement a full, genuinely-designed (not inverted) theme system with three modes:

1. **Light**
2. **Dark**
3. **Automatic** — follows time of day: **06:00–18:00 → Light**, **18:00–06:00 → Dark**, evaluated against the user's local device time.

Rules:
- If the user manually picks Light or Dark, that manual choice **persists and is not overridden** by the clock — Automatic only applies when explicitly selected.
- Theme preference persists locally (see §24) and is restored on next visit without flash-of-wrong-theme (apply the theme before first paint where possible).
- Every screen, component, card, modal, quiz/question interface, chart, icon, and interactive/focus/hover/disabled state must be explicitly designed for both themes — not derived by CSS `invert()` or naive filter tricks.

---

## 8. Complete Information Architecture

```
REASONMASTER INDIA
 └── Exam Categories (8)
      └── Competitive Exams (64)
           └── Exam → Topic Priority Mapping
                └── Master Reasoning Topics (39, shared/reusable)
                     └── Subtopics (46)
                          ├── Concept / Rules / Shortcuts
                          ├── Worked Examples (207 total)
                          ├── Embedded Topic Practice Questions (844 total)
                          └── Master MCQ Bank (19,500 total; 500 per topic)
```

**Critical architectural rule (do not violate):** A master reasoning topic (e.g. "Analogy") is a single, shared, reusable entity. It is **not** duplicated per exam. Exam-specificity is expressed purely through an **exam → topic mapping/priority layer**, so one curriculum and one question bank serve all 64 exams. See §32 for the concrete data model.

---

## 9. Navigation

All navigation must be real and functional — no decorative dead buttons.

- Every menu item, card, tab, topic, exam, question, button, back control, breadcrumb, search result, filter, setting, and toggle must either perform its stated action or be visibly, honestly marked as not-yet-available (never silently do nothing).
- Use proper client-side routing with real, shareable, deep-linkable URLs (e.g. `/topics/analogy`, `/exams/ssc-cgl`, `/practice/analogy/medium`).
- Browser Back/Forward must behave naturally and predictably; refreshing any route must not lose or break the page.
- No dead-end screens — every screen offers a clear next action (continue, retry, browse related, go home).
- Global header navigation: Home, Verbal Reasoning, Non-Verbal Reasoning, Exams, Bookmarks, Stats, Settings, plus persistent Search and Theme toggle.
- Mobile: a compact top bar plus a bottom tab bar or slide-out menu covering the same primary destinations; ensure comfortable touch targets (≥44px).

---

## 10. Page-by-Page Requirements

1. **Splash/Initial Load** — see §29. Brand mark, brief prepare-content state, then straight to Home.
2. **Home** — see §10a.
3. **Verbal Reasoning hub** — grid of the 25 verbal topics, grouped into logical subject clusters (see §12 grouping), each topic card shows name, icon, difficulty badge(s), subtopic count.
4. **Non-Verbal Reasoning hub** — grid of the 14 non-verbal topics, grouped into clusters (Patterns & Series, Spatial & 3D, Visual Analysis — as validated by the reference screenshots), same card treatment.
5. **Topic Detail** — see §10b.
6. **Subtopic view** (where a topic has multiple subtopics) — subtopic list/tabs within the topic detail experience.
7. **Worked Example Viewer** — see §16.
8. **Practice screen** — see §15.
9. **Exam Categories / Exam List** — see §11.
10. **Exam Detail** — see §11.
11. **MCQ Hub** — entry point to the master 19,500-question bank: pick topic(s), difficulty, question count.
12. **MCQ Configuration** — session setup (topic/exam scope, difficulty mix, question count: 10/20/30, instant-feedback vs. end-of-session review).
13. **MCQ Session (Active Test)** — live question-by-question interface with timer, progress, hint, bookmark toggle, exit-confirmation.
14. **MCQ Result** — see §21/§15.
15. **Bookmarks** — see §19.
16. **Stats/Performance** — see §20/§21.
17. **Settings** — see §23.
18. **404/Invalid Route** — friendly, on-brand not-found page with navigation back into the app.

### 10a. Home Page Structure
Not a random card wall — a guided dashboard:
1. Header/nav + branding + search
2. Hero/primary entry: "Continue where you left off" if local progress exists (topic name, % progress, Continue button) — **only render this if real local progress data exists; never fake it**
3. Quick Practice — fast entry to a short mixed-topic session, built from real local question data
4. Verbal Reasoning entry (with topic count)
5. Non-Verbal Reasoning entry (with topic count)
6. Your Performance summary (accuracy, sessions completed, streak) — only if data exists, otherwise a genuine empty state inviting first practice
7. Weak Topics / Recommended practice — only if enough attempts exist to compute this (see §22)
8. Exam Preparation — browse by category entry point
9. Footer — About, Privacy, brand mark, quick links

### 10b. Topic Detail Experience
Each of the 39 topics gets a consistent, professional detail page containing (as available in the data): title, category (Verbal/Non-Verbal), one-line summary, concept/explanation, key rules, shortcuts/tricks, subtopic list, worked examples, embedded practice questions, exam relevance (which exams weight this topic and how), and a clear "Practice this topic" CTA. Use tabs, accordions, or sectioned cards only where they genuinely aid scanning — do not over-design a single learning page.

---

## 11. Exam Architecture

**8 Exam Categories, 64 Exams total** (verified counts — treat as authoritative):

| Category | Exam Count |
|---|---:|
| SSC | 7 |
| Banking | 14 |
| Insurance | 7 |
| Railway | 6 |
| Defence | 6 |
| Police | 11 |
| Central Government | 6 |
| State PSC | 7 |
| **Total** | **64** |

Build an **Exam Category** landing (grid of the 8 categories, each opening its exam list) and an **Exam Detail** page per exam showing: exam name, short name, conducting body (where available), a short description, and its reasoning-topic relevance broken into **High / Medium / Low priority** topic groups, each linking into the shared master-topic pages, plus a "Practice for this exam" entry point that configures an MCQ/practice session scoped to that exam's high-priority topics first.

**Full exam roster by category** (names verified from source materials — use exactly these; do not invent additional exams or rename them):

- **SSC (7):** SSC CGL, SSC CHSL, SSC CPO, SSC MTS, SSC GD, SSC Stenographer, SSC Selection Post
- **Banking (14):** SBI PO, SBI Clerk, IBPS PO, IBPS Clerk, IBPS RRB PO / Officer Scale I, IBPS RRB Clerk / Office Assistant, IBPS RRB Officer Scale II, IBPS RRB Officer Scale III, RBI Grade B, RBI Assistant, SEBI Grade A, NABARD Grade A, NABARD Grade B, and one additional banking/regulatory profile (14th) whose authoritative record lives in the app's `exam_meta.json`
- **Insurance (7):** LIC AAO, LIC ADO, NIACL AO, NIACL Assistant, OICL AO, UIIC AO, GIC Assistant Manager
- **Railway (6):** RRB NTPC, RRB Group D, RRB ALP, RRB JE, RPF SI, RPF Constable
- **Defence (6):** AFCAT, CDS, NDA, CAPF, INET, Coast Guard
- **Police (11):** Delhi Police, Delhi Police Constable, Delhi Police SI, UP Police Constable, UP Police SI, Bihar Police Constable, Bihar Police SI, MP Police Constable, MP Police SI, Maharashtra Police, Rajasthan Police
- **Central Government (6):** UPSC CSAT, DSSSB, ESIC, EPFO, FCI, IB ACIO
- **State PSC (7):** UPPSC, BPSC, MPPSC, MPSC, TNPSC, WBPSC, RPSC RAS

**Source-of-truth rule:** the provided exam/topic structure document gives each exam's relevant topic *areas* (not yet with explicit High/Medium/Low weighting). Where the app's own `exam_meta.json` is available to the generation system, it is the authoritative source for exact per-exam topic IDs and priority levels and must be used verbatim. Where it is not available, derive a reasonable static local dataset from the topic-area lists supplied in the source document (each exam's listed reasoning areas → mapped to the closest matching master topic IDs from §12/§13, defaulted to "high" priority for topics explicitly named for that exam), and clearly mark this dataset as replaceable once `exam_meta.json` is supplied. Never present invented exams, invented conducting bodies, or invented mappings as verified fact.

---

## 12. Topic Architecture (39 Master Topics)

Topics are split into **Verbal Reasoning (25)** and **Non-Verbal Reasoning (14)**. Each master topic is a single reusable entity with a stable ID (kebab/snake case), used identically across every exam that references it.

**Verbal Reasoning — 25 topics** (id): Analogy (`analogy`), Classification (`classification`), Series Completion (`series_completion`), Coding-Decoding (`coding_decoding`), Blood Relations (`blood_relations`), Direction Sense (`direction_sense`), Ranking/Order & Sequence (`ranking_order`), Alphabet Test (`alphabet_test`), Syllogism (`syllogism`), Statement & Conclusion (`statement_conclusion`), Statement & Argument (`statement_argument`), Statement & Assumption (`statement_assumption`), Course of Action (`course_of_action`), Cause & Effect (`cause_and_effect`), Linear Seating (`seating_linear`), Circular Seating (`seating_circular`), Floor Puzzles (`puzzles_floor`), Box Puzzles (`puzzles_box`), Scheduling Puzzles (`puzzles_scheduling`), Data Sufficiency (`data_sufficiency`), Inequality (`inequality`), Input-Output (`input_output`), Logical Venn Diagrams (`logical_venn_diagrams`), Analytical Reasoning (`analytical_reasoning`), Critical Reasoning (`critical_reasoning`).

**Non-Verbal Reasoning — 14 topics** (id): Mirror Images (`mirror_images`), Water Images (`water_images`), Paper Folding (`paper_folding`), Paper Cutting (`paper_cutting`), Embedded Figures (`embedded_figures`), Figure/Pattern Completion (`figure_completion`), Counting Figures (`counting_figures`), Cubes & Dice (`cubes_and_dice`), Non-Verbal Series (`nonverbal_series`), Odd Figure Out (`odd_figure_out`), Grouping of Identical Figures (`grouping_figures`), Analytical Figure Classification (`analytical_figure_classification`), Mathematical Operations (`mathematical_operations`), Missing Character in Matrix/Grid (`missing_character`).

For hub-page visual grouping (validated against the reference screenshots), cluster related topics under light category headers — e.g. Verbal: "Language Basics," "Coding & Sequences," "Relations & Directions," "Advanced Verbal"; Non-Verbal: "Patterns & Series," "Spatial & 3D," "Visual Analysis"; and a broader "Logical Reasoning" grouping (Puzzles, Deductive Logic, Mathematical Logic, Advanced Logic) for the seating/puzzle/statement-based topics, matching the existing app's information hierarchy. These are presentation-layer groupings only — they do not change the flat 39-topic master data model.

---

## 13. Subtopic Architecture (46 Subtopics)

Each master topic has 1–3 subtopics; total verified count is **46** across all 39 topics. Full topic → subtopic matrix (authoritative — reproduce exactly):

| Topic | Subtopics |
|---|---|
| Analogy | Word Analogy; Number Analogy; Letter Analogy |
| Classification | Word Classification; Number Classification |
| Series Completion | Number Series; Alphabet Series |
| Coding-Decoding | Letter Coding; Number Coding |
| Blood Relations | Direct Blood Relation; Coded Blood Relation |
| Direction Sense | Simple Direction; Shadow Direction |
| Ranking, Order & Sequence | Ranking & Order |
| Alphabet Test | Letter & Word Arrangement; Dictionary Order |
| Syllogism | Syllogism Core |
| Statement & Conclusion | Statement & Conclusion Core |
| Statement & Argument | Statement & Argument Core |
| Statement & Assumption | Statement & Assumption Core |
| Course of Action | Course of Action Core |
| Cause & Effect | Cause & Effect Core |
| Linear Seating | Linear Seating Core |
| Circular Seating | Circular Seating Core |
| Floor Puzzles | Floor Puzzle Core |
| Box Puzzles | Box Puzzle Core |
| Scheduling Puzzles | Scheduling Puzzle Core |
| Data Sufficiency | Data Sufficiency Core |
| Inequality | Inequality Core |
| Input-Output | Input-Output Core |
| Logical Venn Diagrams | Logical Venn Diagram Core |
| Analytical Reasoning | Analytical Reasoning Core |
| Critical Reasoning | Critical Reasoning Core |
| Mirror Images | Mirror Images Core |
| Water Images | Water Images Core |
| Paper Folding | Paper Folding Core |
| Paper Cutting | Paper Cutting Core |
| Embedded Figures | Embedded Figures Core |
| Figure/Pattern Completion | Figure Completion Core |
| Counting Figures | Counting Figures Core |
| Cubes & Dice | Cubes & Dice Core |
| Non-Verbal Series | Non-Verbal Series Core |
| Odd Figure Out | Odd Figure Out Core |
| Grouping of Identical Figures | Grouping of Identical Figures Core |
| Analytical Figure Classification | Analytical Figure Classification Core |
| Mathematical Operations | Mathematical Operations Core |
| Missing Character in Matrix/Grid | Missing Character Core |

Where a topic has a single "Core" subtopic, do not force artificial multi-tab UI — render its content directly under the topic page.

---

## 14. MCQ Architecture

Master MCQ bank: **39 topics × 500 questions = 19,500 MCQs**, plus **844 embedded topic-level practice questions**, plus **207 worked examples**.

Canonical MCQ schema (preserve field names/shape when generating local data):

```json
{
  "questionText": "string",
  "options": ["string", "string", "string", "string"],
  "correctIndex": 0,
  "difficulty": "easy | medium | hard",
  "hint": "string",
  "explanation": "string",
  "examTags": ["examId", "..."],
  "topicId": "string",
  "subtopicId": "string",
  "figureRef": "optional — reference to an SVG/diagram asset for non-verbal questions"
}
```

Do not expose this internal shape to the student — render it through a clean question/option UI. Difficulty distribution for generated sessions should follow the app's verified **25% easy / 50% medium / 25% hard** balance unless the student explicitly filters by difficulty. Implement anti-repetition tracking so a student is not shown the same question repeatedly within a short window (the source app tracks roughly the last 500 seen per topic — replicate the intent: avoid immediate repeats, not necessarily the exact number).

---

## 15. Practice System

Support, as available from the underlying data:
- Topic practice and subtopic practice
- Exam-based practice (scoped to an exam's mapped topics, high-priority first)
- Difficulty selection (easy/medium/hard/mixed)
- Session lengths: 10 / 20 / 30 questions
- Instant answer feedback mode (mark correct/incorrect immediately, show explanation) and a review-at-end mode
- Detailed explanations per question
- Weak-topic practice (from §22)
- Question navigation (next/previous within a session where mode allows)
- Live score + accuracy calculation
- Session completion → Result screen: circular accuracy gauge, performance band (Outstanding / Great Job / Good Attempt / Keep Improving / Keep Practicing — mirroring the app's verified five-band system), restrained success micro-animation on completion, and one-tap "Practice Wrong Questions" retry plus "Practice Again" and "Continue Learning" actions.

The active question interface itself must be clean and distraction-free: question, options, difficulty badge, hint toggle, bookmark toggle, and (in the live-session variant) a running timer and question counter — nothing else competing for attention.

---

## 16. Worked Examples

**207 worked examples** across the 39 topics. Each example presents: the question, a clear step-by-step solution, an explanation of the reasoning, the shortcut/trick where one exists, and the final answer — laid out with strong visual hierarchy (numbered/staged steps, not one dense paragraph) so it can be scanned quickly, not just read linearly.

---

## 17. Non-Verbal Visual Questions

Every non-verbal question that depends on visual perception (mirror/water images, paper folding/cutting, embedded figures, cubes & dice, figure series, missing character, etc.) must render as **actual visual content** — inline SVG or generated vector diagrams — never as a text description standing in for a diagram. Figures must stay crisp at any zoom level and scale correctly on both mobile and desktop without layout shift or overflow. Where the source app uses custom vector "painters" for geometric figures (cubes, mirror reflections, water surfaces, matrix completion, triangle counting, paper fold/punch, missing character, series rotation), replicate the same eight rendering categories as SVG components on the web.

---

## 18. Search

Implement genuine, fast client-side search across topics, subtopics, exams, and (where feasible) question text — with a real input, real ranked results grouped by type (Topic / Exam / Question), and direct navigation into the matching result. No placeholder search box.

---

## 19. Bookmarks

Students can bookmark and un-bookmark individual questions, view a dedicated Bookmarks page, open a bookmarked question, and start a practice session built from bookmarked questions only. Persist entirely locally (see §24).

---

## 20. Progress

Track and surface (locally, per student, no login required): topics started/completed, subtopic-level progress, and a "Continue Learning" pointer to the last active topic/session — shown on Home only when real data exists.

---

## 21. Statistics

Provide genuinely useful, locally computed stats — never decorative filler charts:
- Questions attempted / correct / incorrect
- Overall accuracy
- Per-topic accuracy
- Per-difficulty accuracy
- Strong topics / weak topics
- Recent activity / recent sessions
- Best session performance

Every chart or number shown must help the student decide what to study next.

---

## 22. Weak-Topic System

Compute weak topics purely from locally stored attempt history: if a topic's accuracy falls below a configurable threshold (default **60%**, matching the verified app behavior) **and** has enough attempts to be meaningful, flag it as weak and surface a "Practice Weak Topics" action that builds a session from those topics. No backend, no AI scoring — pure local computation.

---

## 23. Settings

A polished settings page with, at minimum:

**Appearance:** Automatic / Light / Dark (see §7)
**Reading:** font/text size control if supported by the design system
**Practice:** instant-answer-feedback toggle, sound toggle, auto-next toggle
**Data:** Reset Progress, Reset Bookmarks, Reset All Data — each behind a clear confirmation dialog before destructive action
**Info/links:** About, Privacy, Share — as simple navigational entries; do not wire up anything requiring a backend beyond simple static/navigational behavior in this version.

---

## 24. Local Persistence

No backend in this version. Use browser-local persistence:
- **IndexedDB** (or an equivalent robust local database layer) for larger structured data: content cache, progress, bookmarks, practice history
- **localStorage** acceptable for small lightweight preferences (theme choice, simple settings flags)
- Store: theme preference, progress, bookmarks, practice/session history, settings

Architect the persistence layer behind a clean interface/service so it can later be swapped for a real backend without touching UI code (see §33).

---

## 25. Responsive Design

Full professional support for desktop, laptop, tablet, and mobile — with layouts purpose-built per breakpoint, not a shrunk desktop view. Navigation must stay usable at every size; touch targets must stay comfortable; typography must stay readable; the question/practice interface in particular must work excellently on phones, since most students will practice there.

---

## 26. Accessibility

- Full keyboard navigation with visible focus states
- Semantic HTML and proper ARIA labeling throughout
- Sufficient color contrast in both themes
- Responsive/scalable text
- Accessible forms, buttons, and screen-reader-friendly navigation
- Correctness/incorrectness must never be communicated by color alone — always pair with a symbol and text (e.g. "✓ Correct" / "✕ Incorrect")

---

## 27. Performance Optimization

The site must never feel slow, heavy, bloated, unresponsive, or janky. Target:
- Fast initial render, lazy loading, code splitting
- Efficient routing and state management, memoization where it matters
- Virtualization for long lists (e.g. large question sets, exam lists) where useful
- Optimized/compressed assets
- Minimal, justified dependencies
- Efficient search/filter/statistics computation, avoiding synchronous loading of the full 19,500-question dataset when a scoped subset will do
- Interactions should feel immediate at every step (topic browse → practice → results).

---

## 28. Animation & Micro-interaction Rules

Animation is welcome only where it improves comprehension or feedback — short, smooth, restrained, purposeful: fades, slides, reveals, page transitions, hover/focus/selection states, progress indication, success confirmation. Apply subtle, intentional micro-interactions to buttons, cards, topic/answer selection, bookmark toggling, theme switching, filters, and quiz completion.

Explicitly avoid: excessive bouncing, spinning decoration, 3D rotation, parallax overload, flashy/attention-grabbing transitions, or animated backgrounds that distract from studying.

---

## 29. Error / Empty / Loading States

**Loading:** no blank white screens — use lightweight skeletons or progress indicators; if large local datasets need initializing, load progressively/in batches rather than freezing the UI. Splash experience is minimal: brand mark + brief "preparing content" state on first load only; subsequent visits should load fast with no forced delay.

**Empty states:** every major section needs a real, on-brand empty state — no bookmarks yet, no practice history yet, no search results, no progress yet, no questions available, no matching exams — each with a clear next action, never a broken/blank layout.

**Error handling:** gracefully handle missing content, malformed data, empty question sets, an unavailable topic, an invalid route, missing images, or corrupted local data — always with a clear recovery action. The student should never be left on an unexplained blank screen.

---

## 30. Technology Recommendation

Do **not** use Flutter Web. Use a modern, stable, high-performance stack such as:
- **React + Next.js + TypeScript**
- Modern CSS / Tailwind CSS where genuinely useful for velocity and consistency (respecting the token system in §5)
- Lightweight component libraries only where they add real value — no dependency bloat for its own sake

Choose the concrete architecture (rendering strategy, state management, data layer) to optimize performance, responsiveness, maintainability, scalability, accessibility, smooth navigation, and future offline/local-data extensibility. Do not add technology purely to look sophisticated.

---

## 31. Code Architecture

- Clean, modular file structure with clear naming
- Reusable, strongly-typed (TypeScript) components and data models
- Reusable hooks/utilities for shared logic (theme, persistence, session state, statistics)
- Centralized theme tokens (§5) and centralized routing
- Clean, predictable state management (session state, progress state, settings state kept distinct and composable)
- No giant monolithic components, no duplicated logic, no inline style chaos, no hard-coded repeated magic values, no fake/TODO-stubbed core functionality.

---

## 32. Data Architecture

Maintain a strict separation of concerns:

**Content layer** (static/local, versionable): categories → exams → exam-topic mappings; topics → subtopics → worked examples → embedded practice questions → MCQs.

**Application state layer** (local, per-device): progress, bookmarks, settings, practice-session history, theme.

**Presentation layer**: components, pages, layouts, styles — consumes the above two layers but never embeds content or state directly.

Concrete recommended shape:

```
categories
  └── exams
        └── exam_topic_mapping (topicId, priority: high|medium|low)
              └── topics (shared, not duplicated per exam)

topics
  ├── subtopics
  ├── worked_examples
  ├── embedded_practice_questions
  └── mcqs (topicId, subtopicId, difficulty, examTags[])
```

**The single most important rule:** a master topic (e.g. "Analogy") must exist exactly once. It is never re-created per exam. Example of what NOT to do:

```
SSC CGL   → Analogy   (own copy)
IBPS PO   → Analogy   (own copy)
SBI PO    → Analogy   (own copy)
```

Correct model — one shared topic, referenced by many exams:

```
Analogy (master topic, single entity)
  ├── referenced by: SSC CGL (high)
  ├── referenced by: IBPS PO (high)
  ├── referenced by: SBI PO (high)
  ├── referenced by: Railway exams (varies)
  └── referenced by: Police exams (varies)
```

This lets one curriculum and one question bank serve all 64 exams without duplication.

---

## 33. Future Backend Compatibility

Do not implement authentication, accounts, or a backend now — but architect for it. Concretely:
- Wrap all persistence behind an interface (e.g. a `ProgressStore`/`BookmarkStore`/`SettingsStore` abstraction) so a future backend/cloud-sync implementation can be swapped in without touching UI components.
- Keep content data structurally ready for an eventual API (i.e., the local JSON/IndexedDB shapes should map cleanly onto future REST/GraphQL resources).
- Leave clear, unused-but-planned extension points (not built, just structurally anticipated) for: authentication, cloud sync, user accounts, backend-driven question updates, online exams/leaderboards, subscriptions, analytics, and personalized recommendations.

---

## 34. Explicitly Excluded V1 Features

Do **not** implement any of the following in this version — they will be added later by the product owner:

Login, signup, authentication (including Firebase auth), user accounts, social profiles, backend authentication, cloud synchronization, leaderboards, ads/AdMob/banner/interstitial/rewarded advertisements, payment or subscription systems, backend question APIs, AI recommendation APIs, or any unnecessary backend infrastructure.

This version is strictly a **frontend, local-data-first** educational platform.

---

## 35. QA / Testing Requirements

Before considering the build complete, verify:

**Navigation:** every major route works; back/forward navigation works; refresh works; deep links work; no dead buttons.

**Practice:** all answer choices are selectable and function correctly; correct-answer detection, scoring, and accuracy are computed correctly; question counter, session completion, results, and retry all work.

**Bookmarks:** add, remove, persistence, and viewing all function correctly.

**Statistics:** all calculations update correctly; topic accuracy, overall accuracy, and weak-topic identification are correct.

**Themes:** Light, Dark, Automatic, manual override, and persistence all work; every component is correctly themed in both modes.

**Responsive:** verified on mobile, tablet, desktop, and large desktop.

**Accessibility:** verified via keyboard-only navigation, focus visibility, contrast checks, semantic structure, screen-reader labeling, and touch target sizing.

**Performance:** verified for initial load, route transitions, question rendering, large list handling, search, filtering, theme switching, and statistics computation — the site must stay responsive even with the full content dataset loaded.

---

## 36. Acceptance Criteria

The build is acceptable only when all of the following are true:

1. All 8 exam categories and 64 exams from §11 are present and correctly categorized.
2. All 39 master topics (25 verbal + 14 non-verbal) and all 46 subtopics from §12–§13 are present, correctly grouped, and not duplicated per exam.
3. The master-topic-shared-across-exams data model from §32 is implemented, not the per-exam-duplicate anti-pattern.
4. Worked examples, embedded practice questions, and the MCQ bank are wired to real local content matching the schema in §14, at whatever content volume the generation system is able to seed (structurally ready for the full 207 / 844 / 19,500 counts even if placeholder content is used for bulk volume).
5. Every visual restriction in §4 (no 3D, no gradients) is enforced with zero exceptions, auditable via the token system in §5.
6. Light, Dark, and time-based Automatic theming all work exactly as specified in §7, with manual override persisting.
7. Every navigation element is functional per §9; no dead ends.
8. Practice, MCQ sessions, results, bookmarks, statistics, and weak-topic detection all function correctly against real local data, per §15/§19/§21/§22.
9. The site is fully responsive (§25) and meets the accessibility bar (§26) on all major breakpoints.
10. None of the explicitly excluded V1 features from §34 are present.
11. The codebase follows the architecture, data-separation, and future-backend-readiness principles in §31–§33.
12. The product visually and behaviorally reads as "Premium educational UX + minimal visual design + solid colours only + zero gradients + zero 3D + excellent performance + complete functionality + responsive design + accessibility + future scalability" — the north star for this entire specification.

---

*End of Master Website Generation Prompt for ReasonMaster India.*
