---
topic: How an espresso machine works
plan: plans/concepts/espresso-machine.md
research: research/espresso-machine/
date: 2026-06-17
agent: cursor
status: draft
slug: espresso-machine
---

## Page architecture

Concept 04 — opens **Series III — Everyday machines**. Route `/espresso-machine`.
Follows the standard concept spine: `PageHeader` → short answer → numbered §
sections → `#sources`. Server Component page orchestrates static prose and three
bespoke client interactives.

| # | Section | Pattern | Interactive? | Research |
|---|---------|---------|--------------|----------|
| — | Short answer | L-SHORT-ANSWER | no | 01 (C-01, C-02) |
| § I | The flow path | P-DIAGRAM-CUTAWAY | yes — `Cutaway` | 02, 03, 04 (C-03–C-05, C-14) |
| § II | The pull | P-SLIDER-LINEAR (scrub) + custom curve | yes — `PullCurve` | 06 (C-14, C-03, C-05, C-10) |
| § III | Three boilers, one problem | L-CARD-GRID / stat-table | yes — `BoilerComparison` | 03 (C-05, C-06) |
| § IV | What the science actually says | L-PROSE-GRID + stat callouts | no | 05 (C-07–C-09, C-13) |
| § V | Mechanism and ritual | L-PROSE-GRID + myth list | no | 07 (C-11, C-12) |
| — | Sources & notes | standard `#sources` | no | all |

## Section files

```
design/espresso-machine/
  README.md              ← this file
  01-short-answer.md
  02-flow-path-cutaway.md
  03-the-pull-curve.md
  04-boilers.md
  05-science.md
  06-crema-ritual.md
  components.md
  copy-outline.md
```

## Motion strategy

- `Reveal` for every section intro, prose block, and stat (delays 0.08 / 0.15;
  list items `i * 0.05`–`0.06`).
- `SplitWords` only via `PageHeader`.
- `BigNumber` for **one** hero stat (the "9" bar in the short answer or the
  "25 %" downdosing figure in § IV — pick one; spec uses § IV).
- Client interactives (`Cutaway`, `PullCurve`, `BoilerComparison`) use
  `motion` + `useReducedMotion`; value changes use M-VALUE-PULSE.
- No content-critical `whileInView`. Cutaway's idle "flow" shimmer is decorative
  and `aria-hidden`, disabled under reduced motion.

## Data layer (`src/lib/espresso.ts`)

All typed; every number cites a claim ID from `research/espresso-machine/`.

- `STANDARDS` — SCA vs INEI canonical figures (C-01, C-02) + sources.
- `FLOW_NODES` — ordered cutaway components: `{ id, label, role, detail, claim }`.
- `PULL_CURVE` — sampled `{ t, pressure, flow, temp }[]` reference profile.
- `PULL_PHASES` — `{ id, label, tStart, tEnd, note }[]` (pre-infusion · plateau · decline).
- `BOILERS` — three classes with comparison fields + sources.
- `SCIENCE_STATS` — callout figures (C-07, C-09).
- `SOURCES` — canonical source list for `#sources`.

No `public/data/` JSON needed — data is small and static; keep it in the lib.

## File map (for implementer)

**Create**
- `src/app/espresso-machine/page.tsx`
- `src/lib/espresso.ts`
- `src/components/espresso/Cutaway.tsx`
- `src/components/espresso/PullCurve.tsx`
- `src/components/espresso/BoilerComparison.tsx`

**Modify**
- `src/lib/concepts.ts` — add `SERIES` entry `everyday-machines` (roman III) +
  concept 04 entry.

## `concepts.ts` entry (sketch)

```ts
// SERIES — append:
{
  id: "everyday-machines",
  roman: "III",
  title: "Everyday machines",
  blurb: "The ordinary objects that turn out to be small, exact machines — starting with the one on the kitchen counter.",
}

// concepts — append:
{
  index: "04",
  slug: "espresso-machine",
  title: "How an espresso machine works",
  subtitle: "Nine bars of pressure, water a few degrees off boiling, and seven grams of coffee — a contained thermodynamic event that resolves in under half a minute.",
  kicker: "On machines",
  seriesId: "everyday-machines",
  status: "live",
  readingTime: "9 min",
}
```

## Cross-links

- Link "pressure" / "thermodynamic" intuition lightly; no hard dependency on
  other concepts (this opens a new series).
- Sources section cross-links sibling concepts' `#sources` convention only.

## Open design questions

1. Cutaway interaction model: **hover + click-to-pin on desktop; tap-to-cycle /
   stepper on mobile**. Decided — see `02-flow-path-cutaway.md`.
2. PullCurve: scrub via range input bound to time index (keyboard-accessible),
   not pointer-only. Decided — see `03-the-pull-curve.md`.
