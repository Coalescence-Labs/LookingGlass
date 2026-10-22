---
section: § III — Three boilers, one problem
pattern: L-CARD-GRID / stat-table
plan: plans/concepts/espresso-machine.md
research: research/espresso-machine/03-the-boiler-and-temperature.md
claims: [C-05, C-06]
component: BoilerComparison
---

## Purpose

Explain why espresso machines come in three temperaments. The core idea: one
vessel can't be at brew temperature and steam temperature at once — single
boiler, heat exchanger, and dual boiler are three answers.

## What the reader understands after using it

The trade-off triangle: simultaneity (brew + steam), temperature stability, and
the manual ritual each design demands (temperature surfing, cooling flush, or
nothing).

## Pattern: `BoilerComparison` (L-CARD-GRID)

Three cards (Single · Heat exchanger · Dual), selectable. Selecting a card
expands its explainer and visually emphasizes its row of attributes.

- **Cards (grid md:grid-cols-3 gap-5):** each card = name, one-line essence,
  the brew/steam temperature handling, and a compact attribute strip:
  - Simultaneous brew + steam: ✗ / ✓ / ✓
  - Brew stability: oscillates / good (flush) / ±1 °C
  - Ritual: temperature surf / cooling flush / none
- Selecting (click/tap/keyboard) sets an active card; an explainer paragraph
  below updates (`aria-live="polite"`).

Alternative if simpler at build time: a single bordered comparison table
(`StatRow`-like) with the three machines as columns. Cards preferred for the
tactile compare; table is an acceptable fallback. Either way it is interactive
(selection reveals detail) to satisfy "answer what prose can't."

## Layout

```
section.shell pb-24 md:pb-32
  Reveal: L-SECTION-CHROME "§ III" / "Three boilers, one problem" · right label "Compare"
  Reveal 0.08: type-lede max-w-2xl  (the one-vessel-two-temperatures problem; C-05)
  Reveal 0.15:
    grid md:grid-cols-3 gap-5  → three cards (Reveal stagger i*0.06)
    explainer panel below (border-line) updating for the active card
```

## Data

`BOILERS: { id, name, essence, brewTemp, steamTemp, simultaneous, stability,
ritual, detail, source }[]` in `espresso.ts`. Values from chunk 03:
- brew ~90–96 °C (C-05); steam ~125–135 °C (C-05); dual/PID ±1 °C (C-06).

## Motion

- `Reveal` chrome/lede; card stagger `i*0.06`.
- Active card: border/accent transition; explainer M-VALUE-PULSE (reduced-motion gated).

## Mobile

Cards stack to one column; attribute strips remain; explainer below. Selection
still works by tap; ensure ≥44px targets.

## Accessibility

- Cards are `<button>`s in a group; active = `aria-pressed`; explainer `aria-live`.
- Temperature values have units in text, not color-only.

## Reduced motion

Instant card switching; no pulse; all three cards' data visible without selecting
(selection just emphasizes + expands detail).
