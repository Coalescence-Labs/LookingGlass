---
section: § V — Mechanism and ritual
pattern: L-PROSE-GRID + myth list
plan: plans/concepts/espresso-machine.md
research:
  - research/espresso-machine/07-crema-and-folklore.md
  - research/espresso-machine/misconceptions.md
claims: [C-11, C-12]
---

## Purpose

Close the piece on the plan's stated tension: separate mechanism from ritual
without dismissing either. Crema is the perfect case — a real, structured foam,
and an over-read quality signal.

## Layout (L-PROSE-GRID + myth list)

```
section.shell pb-24 md:pb-32
  Reveal: L-SECTION-CHROME "§ V" / "Mechanism and ritual" · right label "Crema"
  Reveal 0.08:
    grid md:grid-cols-[0.9fr_1.4fr] gap-10
      Left:  type-display-m with italic accent:
             "The crema is *not* the flavour."
      Right: type-body paragraphs:
             1. what crema physically is — roast CO₂ in an oil-in-water emulsion
                + fines; why pressure makes it and drip doesn't (C-11)
             2. what holds it up — proteins/melanoidins form, polysaccharides
                persist, lipids stabilize (C-11b)
             3. the folklore — ≥10 % of cup, ≥2 min persistence are *visual* cues;
                crema tracks freshness/CO₂, robusta foams more (C-11c, C-12)
  Reveal 0.15:
    "Folklore vs mechanism" list (border-t border-line):
      4–5 myth rows: claim → correction → (tiny source tag)
      e.g. "More crema = better" → freshness/CO₂ proxy, not taste
           "Tamp like you mean it" → levels the bed; ~no yield effect
           "Finer is stronger" → channels past a point
           "Chase 25 seconds" → time is an outcome, not a dial
```

Myth rows: reuse a simple bordered list (like `StatRow` rhythm) — label left
(the myth, serif), correction right (`type-body`), `type-mono-sm` source tag.
This can be inline JSX in the page (no new component needed) driven by a
`MYTHS` array in `espresso.ts`.

## Tone

Respect the craft. The plan: "without dismissing either." Ritual is part of the
pleasure; the point is to know which parts are mechanism and which are habit.

## Data

`MYTHS: { myth, truth, claim }[]` in `espresso.ts`. Crema figures C-11/C-12.

## Motion

`Reveal` chrome/grid/list; list rows stagger `i*0.05`. No bespoke motion.

## Mobile

Single column; myth rows stack label over correction.

## Accessibility

Plain semantic list (`<ul>`/`<li>`); source tags are text. No color-only meaning.
