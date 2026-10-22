---
section: § I — The flow path
pattern: P-DIAGRAM-CUTAWAY
plan: plans/concepts/espresso-machine.md
research:
  - research/espresso-machine/02-the-pump-and-pressure.md
  - research/espresso-machine/03-the-boiler-and-temperature.md
  - research/espresso-machine/04-grouphead-portafilter-puck.md
claims: [C-03, C-04, C-05, C-14]
component: Cutaway
---

## Purpose

Let the reader *see* the path a single sip takes — reservoir to cup — and learn
what each component does. This is the spatial backbone for the rest of the piece
(pressure, heat, and the puck all live on this diagram).

## What the reader understands after using it

Where pressure is made (pump + OPV), where heat is held (boiler/group), and
where resistance lives (the puck) — as one connected system, not a parts list.

## Pattern: P-DIAGRAM-CUTAWAY (`Cutaway` component)

Hand-drawn SVG cross-section, stylized (not to scale), original to Looking Glass.
Flow path, left/top → right/bottom:

1. **Water reservoir** — the cold start (C-14 wetting later).
2. **Pump** — vibratory (≈60 strokes/s) or rotary; makes ~9 bar (C-03, C-04).
3. **Over-pressure valve** — bleed branch back to tank; caps brew pressure.
4. **Boiler / heat exchanger** — heats water to ~90–96 °C; steam side ~125–135 °C (C-05).
5. **Grouphead (+ thermosiphon)** — keeps the brass group at temperature.
6. **Portafilter + basket + puck** — the tamped bed; the system's resistor.
7. **Cup** — crema on top (foreshadow § V).

## Interaction

- **Desktop:** hover a node → it highlights and a label/explainer panel updates;
  click to **pin** a node (keeps panel open). Arrow keys move between nodes.
- **Mobile/touch:** a stepper (`← prev / next →`) plus tappable nodes cycle
  through; explainer panel sits below the diagram.
- Active node is reflected by `aria-current` and an accessible name; the
  explainer panel is an `aria-live="polite"` region.
- Idle state: a faint animated "flow" dash travels the path (decorative,
  `aria-hidden`), **off** under reduced motion.

## Layout

```
section.shell pb-24 md:pb-32
  Reveal: L-SECTION-CHROME  "§ I" / "The flow path"  · right label "Interactive · cutaway"
  Reveal delay 0.08: type-lede max-w-2xl  (one paragraph orienting the diagram)
  Reveal delay 0.15:
    grid md:grid-cols-[1.5fr_1fr] gap-8
      Left:  SVG cutaway (viewBox, responsive width)  — panel chrome border border-line
      Right: explainer panel — active node label (type-heading),
             role line (type-body), the cited figure (type-mono), source hint
```

## Motion

- `Reveal` on chrome/lede/diagram.
- Node highlight: CSS transition on `fill`/`opacity` + M-VALUE-PULSE on the
  explainer text (gated by `useReducedMotion`).
- Flow dash: `<animate>` / CSS `stroke-dashoffset`, `aria-hidden`, disabled when
  `prefers-reduced-motion`.

## Data

`FLOW_NODES: { id, label, role, detail, claim }[]` in `espresso.ts`. Geometry
(x/y/path) lives in the component (SVG is hand-authored), but labels/roles come
from the lib so copy is centralized and citable.

## Mobile

Diagram scales to full width; explainer panel stacks beneath. Stepper buttons
are ≥44px touch targets. Node hit areas padded for touch.

## Accessibility

- SVG has `role="img"` with a `<title>`/`<desc>` summarizing the path.
- Interactive nodes are real `<button>`s (or focusable `<g role="button">`) with
  `aria-label`; keyboard arrow navigation; visible focus ring (global style).
- Explainer is `aria-live="polite"`.

## Reduced motion

Flow shimmer off; highlight transitions instant; all labels/data fully present.
