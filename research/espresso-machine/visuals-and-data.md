---
topic: Visual and data requirements
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
chunk: visuals
related-chunks:
  - 02-the-pump-and-pressure.md
  - 03-the-boiler-and-temperature.md
  - 06-the-extraction-curve.md
---

## Summary

Three first-party visuals, each hand-built (no manufacturer art). Data is typed
in `src/lib/espresso.ts`; all numbers trace to `numbers-and-units.md`.

## 1. Cutaway SVG (`Cutaway.tsx`)

**Purpose:** show the flow path and let the reader see where each component sits.

**Flow path (label order):** water reservoir → pump (vibratory/rotary) →
over-pressure valve branch (back to tank) → boiler / heat exchanger → grouphead
(+ thermosiphon loop) → portafilter + basket → puck → cup.

**Behavior:** annotated, hand-drawn SVG; component highlights driven by
scroll/hover state. Reduced-motion: highlights still selectable; no auto-animation
required.

**Claims referenced:** C-03, C-04, C-05, C-14.

**Notes:** original schematic; stylized, not to scale. Brass-group + thermosiphon
loop should be visually distinct from the boiler.

## 2. Pull curve (`PullCurve.tsx`) — the scrubbable interactive

**Purpose:** make the 9-bar / ~25-s window legible across three tracks.

**Axes:** x = time 0–~32 s; y = three stacked/overlaid tracks:
- **Pressure** (bar, 0–10): pre-infusion low (~3 bar) → ramp → plateau ~9 bar →
  gentle decline at the end.
- **Flow** (mL/s, 0–~3): ~0 during saturation → rise → settle; inverse-coupled to
  pressure through a fixed bed (Darcy).
- **Temperature** (°C, ~88–96): nearly flat at the group target; slight dip during
  the initial cold-puck contact, recovering.

**Interaction:** draggable time cursor; readout of all three values at the cursor
instant; three phases annotated (pre-infusion · the 9-bar window · decline).

**Reduced-motion (plan acceptance):** disable the scrubbing animation but keep
the full curves and a static/clickable cursor so all data stays visible and
explorable.

**Data:** synthetic *reference* profile (clearly labeled illustrative), values
within cited ranges. Encode as sampled points in `espresso.ts`
(`PULL_CURVE: { t, pressure, flow, temp }[]`). Mark the phase boundaries.

**Claims referenced:** C-14, C-03, C-05, C-10, C-06b.

## 3. Boiler comparison (`BoilerComparison.tsx`)

**Purpose:** contrast single / HX / dual on the axes that matter.

**Rows (machine classes):** Single boiler · Heat exchanger · Dual boiler.
**Columns:** brew temp control · simultaneous brew+steam · ritual required ·
relative stability · typical use.

**Data:** typed table in `espresso.ts` (`BOILERS: BoilerClass[]`). Values from
chunk 03.

**Claims referenced:** C-05, C-06.

## Data structures to define in `src/lib/espresso.ts`

- `STANDARDS` — SCA vs INEI canonical numbers (C-01, C-02) with sources.
- `COMPONENTS` — cutaway node list: id, label, one-line role, source.
- `PULL_CURVE` — sampled `{ t, pressure, flow, temp }` reference profile +
  `PULL_PHASES` boundaries.
- `BOILERS` — three machine classes with comparison fields + sources.
- `SOURCES` — canonical source list for `#sources` (Cameron & Hendon, INEI, SCA,
  Illy & Navarini, FRI 2018).

## Honesty notes for review

- Pull curve is explicitly an illustrative reference, not a logged shot.
- Cutaway is a stylized schematic, not to scale, hand-drawn for Looking Glass.
- No 18–22 % EY espresso claim (see `numbers-and-units.md` do-not-use).
