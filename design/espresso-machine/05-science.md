---
section: § IV — What the science actually says
pattern: L-PROSE-GRID + stat callouts (BigNumber)
plan: plans/concepts/espresso-machine.md
research: research/espresso-machine/05-extraction-science.md
claims: [C-07, C-08, C-09, C-13]
---

## Purpose

The intellectual payoff. Replace folklore with the Cameron & Hendon (2020)
finding: grinding finer past a point *lowers* yield because beds channel; the fix
is to grind coarser, dose less, and chase yield with brew ratio — counter to café
habit.

## Layout (L-PROSE-GRID)

```
section.shell pb-24 md:pb-32
  Reveal: L-SECTION-CHROME "§ IV" / "What the science actually says" · right label "Matter, 2020"
  Reveal 0.08:
    grid md:grid-cols-[0.9fr_1.4fr] gap-10
      Left:  type-display-m heading with italic accent:
             "Finer isn't *always* more."
      Right: type-body paragraphs (flex flex-col gap-6 max-w-xl):
             1. EY definition + ~30 % ceiling (C-07)
             2. the model's clean prediction vs the experimental peak (C-08)
             3. channeling explained plainly
             4. the prescription: coarser + downdose, navigate by brew ratio (C-09)
             5. tamp-force myth (C-13) — short
  Reveal 0.15:
    stat callouts row (grid md:grid-cols-3 gap-6, border-t border-line pt-8):
      - BigNumber 30 suffix "%"  → "of the bean is all that will ever dissolve" (C-07)
      - BigNumber 25 suffix "%"  → "less coffee per shot, same yield" (C-09)
      - text stat: "Tamp force: ~no effect on yield" (C-13)
```

## Motion

- `Reveal` chrome/grid/stats.
- **One** `BigNumber` count-up emphasis here (the 25 % downdosing figure is the
  memorable one; 30 % can be a second BigNumber or static — spec allows both as
  the two callouts). Keep to ≤2 count-ups.

## Data

`SCIENCE_STATS` in `espresso.ts`: `{ id, value, suffix, caption, claim }[]`.
Numbers: C-07 (30 %), C-09 (25 %). Tamp note C-13 (qualitative).

## Honesty / nuance

- Frame the 6-bar vs 9-bar point carefully (research discrepancy #2): the model
  finds yield rises at lower pressure and their café trials ran at 6 bar to avoid
  clogging; 9 bar remains the sensory standard. One sentence, cited.
- **Do not** state an 18–22 % "golden" EY for espresso (see numbers ledger
  do-not-use). Use the ~30 % ceiling + "peak EY" framing only.

## Mobile

Single column; heading above paragraphs; stat callouts stack.

## Accessibility

`BigNumber` already handles reduced motion (instant final value). Captions are
real text with units.
