---
title: Concept — How an espresso machine works
status: not-started
category: concept
effort: L
series: "III — Everyday machines"
last-updated: 2026-04-17
---

## Context

An espresso machine is a small, contained thermodynamic system that nine
bar-pressurised, 93 °C water through a ~7 g bed of ground coffee in 25–30
seconds. Nothing about that sentence is obvious. The piece should cover:
the boiler (single, dual, heat-exchanger), the pump (vibratory vs rotary),
the grouphead, the portafilter and puck, the thermosiphon or PID loop,
pre-infusion, and the extraction curve itself.

Tension to resolve: enthusiasts often speak in folklore ("the crema is
the flavour"). The piece should separate mechanism from ritual, without
dismissing either.

This opens Series III — the series entry itself needs to land in
`src/lib/concepts.ts`.

## Goal

Ship `/espresso-machine` as a Concept in Series III, with a cutaway
diagram and an interactive extraction curve that makes the 9-bar /
25-second window legible.

## Approach

1. **Research.** Write `research/espresso-machine.md`. Primary sources:
   SCA (Specialty Coffee Association) brewing standards, Hendon et al.
   "Systematically Improving Espresso" (2020), Cameron et al. "Systematic
   solutions to the extraction variability problem" (2020), and machine
   manufacturer service manuals for the mechanism diagrams.
2. **Data.** `src/lib/espresso.ts` — typed structures for machine classes
   (single-boiler, HX, dual-boiler), components, and reference pull
   parameters (pressure, temperature, dose, yield, time).
3. **Visuals.**
   - Cutaway SVG of the flow path, annotated, with state-driven highlights
     as the reader scrolls through each component.
   - Interactive pull-curve: x-axis time (0–35 s), y-axis pressure,
     temperature, flow rate. Scrub to see how pre-infusion, ramp, and
     decline shape the extraction.
4. **Page** follows the rhythm of existing concept pages.
5. **Series III registration.** Add `SERIES` entry; add concept entry.

## Files

**Create:**
- `research/espresso-machine.md`
- `src/lib/espresso.ts`
- `src/components/espresso/Cutaway.tsx` — annotated SVG cutaway.
- `src/components/espresso/PullCurve.tsx` — scrubbable extraction graph.
- `src/components/espresso/BoilerComparison.tsx` — single vs HX vs dual.
- `src/app/espresso-machine/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add Series III + this concept.

## Acceptance

- [ ] `bun run build` clean.
- [ ] Cutaway diagram hand-drawn (SVG), not sourced from a manufacturer.
- [ ] Pull-curve interactive: dragging the time cursor updates all
      three tracks.
- [ ] Every pressure / temperature / time figure cited.
- [ ] Mobile-responsive; reduced-motion collapses scrubbing animations
      but keeps the data visible.
- [ ] Landing page groups the concept under **Series III**.

## References

- SCA Brewing Standards — https://sca.coffee/research
- Hendon, Cameron, et al. "Systematically Improving Espresso" (2020) —
  Matter 2, 631–648.
- Internal: any live concept page for structure.
