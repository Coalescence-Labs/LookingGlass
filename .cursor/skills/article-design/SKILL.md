---
name: article-design
description: >-
  Designs a Looking Glass concept article before implementation. Produces a
  design/<slug>/ folder with section specs, component inventory, motion plan,
  and interactive patterns — informed by research and existing live articles.
  Run after article-research and before plan-to-pr. Use when the user asks to
  design an article, plan visuals/interactives, or architect a new concept page.
---

# Article design

Use this skill **after research, before code** when starting a concept article
from `plans/concepts/`. Output is a durable design folder that tells the
implementer exactly how to build the page — layout, motion, interactives, data
shapes, and accessibility — using the full HTML/React/Motion stack the site
already has.

Downstream [`plan-to-pr`](../plan-to-pr/SKILL.md) assumes `design/<slug>/`
exists with index `status: draft` or better.

## When to run

- `research/<slug>/` exists (from [`article-research`](../article-research/SKILL.md)).
- User attaches `@plans/concepts/<slug>.md` and asks to design the article.
- Research is done but no page architecture has been decided yet.

Do **not** skip to implementation without a design pass when the article has
any interactive, visual, or multi-section structure (i.e. every concept plan).

## Inputs (required)

1. **Plan** — `@plans/concepts/<slug>.md`
2. **Research** — `@research/<slug>/` (index + chunks; especially
   `visuals-and-data.md` and `numbers-and-units.md`)
3. **Live references** — read at least two sibling pages and their components:

| Article | Page | What to steal |
|---------|------|---------------|
| Concept 01 | `src/app/one-million-tokens/page.tsx` | Short-answer grid, StatRow, TokenScale slider, BookSpines |
| Concept 02 | `src/app/model-comparison/page.tsx` | ModelCard grid, PriceChart, TaskPicker |
| Concept 03 | `src/app/context-window/page.tsx` | ViewportDemo, ChatFallout simulation, cross-links |

Also read shared infrastructure:

- `src/app/globals.css` — type scale, colors, shell
- `src/components/site/PageHeader.tsx` — header rhythm
- `src/components/motion/Reveal.tsx` — scroll reveal (safe default)
- `src/lib/motion.ts` — easing tokens

## Output layout

Create **`design/<slug>/`**:

```
design/<slug>/
  README.md           # index — architecture, motion strategy, file map
  01-<section>.md     # one file per major § (matches article flow)
  02-<section>.md
  ...
  components.md       # every new component: props, data, a11y, motion
  copy-outline.md     # optional — prose beats keyed to claim IDs
```

Use [`design-spec-template.md`](design-spec-template.md) for the index and
[`section-template.md`](section-template.md) for each section file.
Pattern vocabulary lives in [`pattern-catalog.md`](pattern-catalog.md).

## Design principles (from live articles)

These are non-negotiable. Every design must honour them.

### Page rhythm

Every concept page follows the same spine:

1. **`PageHeader`** — index, kicker, title (`SplitWords`), lede
2. **Short answer** — `shell` section, `border-t border-line`, two-column grid
   (`md:grid-cols-[1.3fr_1fr]`), italic `text-accent` highlights in
   `type-display-m`
3. **Numbered § sections** — `§ I`, `§ II`, … each with:
   - Section chrome: flex header, `border-b border-line`, right-side
     `type-mono-sm` label ("Interactive", "April 2026", etc.)
   - Lede paragraph (`type-lede max-w-2xl`)
   - Primary content (prose, visual, or interactive)
4. **Sources** — `id="sources"`, verified date, `SourceOutboundLink` for
   external URLs, cross-links to sibling concepts

Spacing: sections use `shell pb-24 md:pb-32`; short answer uses
`pb-20 md:pb-28`; sources use `pb-28`.

### Motion strategy

Use motion to **teach**, not decorate. Pick the right tool:

| Need | Tool | Where used |
|------|------|------------|
| Scroll-enter fade/slide | `Reveal` | Section intros, stat rows, prose blocks |
| Title word stagger | `SplitWords` | PageHeader only |
| Live value changes | `motion` + `useReducedMotion` | Sliders, counters, toggles |
| Count-up numerals | `BigNumber` | Hero stats in short-answer column |
| Decorative entrance | `motion` `whileInView` | **Only** `aria-hidden` decor (e.g. BookSpines) |

**Hydration rule:** Do **not** use Motion `whileInView` for above-the-fold or
content-critical elements. Use `Reveal` (IntersectionObserver + CSS
transition) instead — see `plans/concepts/solar-life-cycle.md`. BookSpines is
the exception: decorative, `aria-hidden`, below the fold.

**Reduced motion:** Every client component calls `useReducedMotion()` and
skips or instantiates animations. Global CSS also collapses transitions in
`prefers-reduced-motion`.

**Stagger:** Section content uses `Reveal delay={0.08}` / `0.15`; list items
use `delay={i * 0.05}` or `0.06`.

### Interactives

Every interactive should answer: *"What does the reader understand after
playing with this that they couldn't from prose alone?"*

Prefer patterns from [`pattern-catalog.md`](pattern-catalog.md). When inventing
a new pattern, specify:

- Input controls (slider, scroll, stepper, picker, hover)
- What updates in real time
- Data source (`src/lib/`, static JSON in `public/data/`)
- Mobile/touch behaviour
- `aria-label` / keyboard path
- Reduced-motion fallback

Interactive panels share chrome:

```tsx
className="border border-line p-6 md:p-10"
style={{ background: "rgba(15, 15, 18, 0.6)" }}
```

### Data layer

- Typed constants and helpers live in `src/lib/<slug>.ts`
- Precomputed heavy data → `public/data/<slug>-*.json` (no runtime inference)
- Every number on the page traces to a research claim ID

### Typography & colour

Use existing utilities only — do not invent new type classes:

- Display: `type-display-xl`, `type-display-l`, `type-display-m`
- Headings: `type-heading`
- Body: `type-body`, `type-lede`
- Labels: `type-mono`, `type-mono-sm`
- Numbers: `type-numeral`, `BigNumber`
- Accent emphasis: `italic text-accent` inside display type
- Dividers: `rule`, `border-line`, `border-line-2`

### Architecture

- **`page.tsx`** — Server Component; metadata, section orchestration, static
  prose, imports client components
- **`src/components/<slug>/`** — one folder per article for bespoke UI
- Reuse shared: `PageHeader`, `Reveal`, `StatRow`, `SourceOutboundLink`,
  `BigNumber` when they fit
- Mark `"use client"` only where state, effects, or Motion hooks are needed

## Workflow

### Phase 1 — Absorb

1. Read plan Goal and Acceptance criteria — these constrain the design.
2. Read `research/<slug>/README.md` (outline, visual brief, claim ledger).
3. Skim all research chunks; note claim IDs per section.
4. Read two live reference pages **and** open their component folders.
5. List every § section the article needs (from research outline + plan).

Write `design/<slug>/README.md` scaffold: frontmatter, section index, empty
file map.

### Phase 2 — Architect

For each § section, decide:

1. **Purpose** — one sentence teaching goal
2. **Pattern** — from pattern catalog (slider, viewport, simulation, chart,
   stat-table, card-grid, prose-only, level-unlock, …)
3. **Layout** — grid spec, column ratios, mobile collapse
4. **Motion** — which Reveal delays; which motion spans; reduced-motion path
5. **Data** — claim IDs, lib types, static JSON needs
6. **New vs reuse** — existing component or new file

Fill one `0N-<section>.md` per § using the section template.

Write `components.md` with:

- Component name, file path, client/server
- Props interface (TypeScript sketch)
- Data dependencies
- Accessibility notes
- Motion notes

Optionally write `copy-outline.md` — prose beats with claim citations, not
final copy (implementation writes original prose).

### Phase 3 — Stress-test

Walk the design against this checklist before handoff:

- [ ] Short-answer section has a teachable insight + supporting stat column
- [ ] Every research chunk maps to at least one § or visual
- [ ] At least one interactive (unless plan explicitly prose-only)
- [ ] No content-critical `whileInView`
- [ ] All numbers cite research claim IDs
- [ ] Mobile layout specified for every grid and interactive
- [ ] Sources section structure defined
- [ ] Cross-links to sibling concepts identified
- [ ] File map lists every create/modify path for implementer
- [ ] `concepts.ts` entry sketched (index, slug, title, subtitle, kicker, series)

### Phase 4 — Handoff

Post in chat:

- Folder path: `design/<slug>/`
- Section count and primary interactive(s)
- New components vs reused
- Risks or open design questions
- Next step: implement via `plan-to-pr`

Update plan Approach if it still references undifferentiated "Visuals" — point
to `design/<slug>/`.

## Verification checklist

- [ ] `design/<slug>/README.md` with frontmatter, page architecture, file map,
      motion strategy
- [ ] One section file per planned §
- [ ] `components.md` complete with props, data, a11y, motion
- [ ] Pattern catalog references for each interactive
- [ ] Research claim IDs wired through section specs
- [ ] Index `plan:` points at `plans/concepts/<slug>.md`
- [ ] Index `research:` points at `research/<slug>/`

## Citing design during implementation

- *"layout per `design/solar-life-cycle/01-short-answer.md`"*
- *"StageTimeline props from `design/solar-life-cycle/components.md`"*

When the article ships, set index `status: applied`.

## Additional resources

- Index template: [design-spec-template.md](design-spec-template.md)
- Section template: [section-template.md](section-template.md)
- Components template: [components-template.md](components-template.md)
- Interactive patterns: [pattern-catalog.md](pattern-catalog.md)
- Research input: [`research/README.md`](../../../research/README.md)
- Design output conventions: [`design/README.md`](../../../design/README.md)
- Live page references: `src/app/one-million-tokens/`, `src/app/context-window/`,
  `src/app/model-comparison/`
