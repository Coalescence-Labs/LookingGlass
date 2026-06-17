---
topic: The extraction curve — pressure, flow, temperature over time
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 06
related-chunks:
  - 02-the-pump-and-pressure.md
  - 03-the-boiler-and-temperature.md
  - 05-extraction-science.md
---

## Summary

A shot is not a single event but a trajectory. Plotted against time (0 to
~25–35 s), three tracks tell the story. **Pressure** typically rises from low
(pre-infusion soak) to a plateau near 9 bar, then — on profiling machines —
declines toward the end. **Flow rate** starts near zero while the dry puck
saturates, rises as channels open, and is the inverse partner of pressure
(higher pressure → faster flow through a given bed). **Temperature** at the group
should be nearly flat (~90–96 °C); its steadiness is exactly what good boiler
design buys (chunk 03). The reader-facing point: the famous "9 bar / ~25 s"
numbers describe a *window* the curve passes through, not a constant the machine
holds from the first drop.

## Method

- Synthesized from: pump ramp behavior (chunk 02), pre-infusion (chunk 04),
  boiler stability (chunk 03), and the *Matter* paper's pressure/flow coupling
  (Darcy flux ∝ overpressure; shot time ∝ 1/pressure). The curve *shapes* are
  qualitative and well-established; the page presents a synthetic reference
  curve, not a measurement of one machine. Accessed 2026-06-17.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-14 | pre-infusion = low-pressure first phase | high | Cameron & Hendon 2020 | chunk 04 | wets puck |
| C-06b | flow ∝ pressure for a fixed bed (Darcy) | high | Cameron & Hendon 2020 (Darcy flux) | — | "Darcy flux increased in direct proportion" to overpressure |
| C-05c | group temperature ~flat across the shot on good machines | high | chunk 03 sources | — | the goal of PID/dual boiler |

## Findings

### 1. Three tracks, one timeline

- **Pressure (bar):** 0 → low pre-infusion (~2–4 bar or line pressure) → ramp →
  plateau ~9 bar → optional decline (profiling). On a basic vibratory machine the
  ramp itself is the pump building from a low start (chunk 02).
- **Flow (mL/s):** ~0 during saturation → rises as the bed gives way → settles.
  The paper formalizes the coupling: increasing pump overpressure increases the
  Darcy flux "in direct proportion," while shot time falls inversely. So pressure
  and flow are two views of the same hydraulics through a fixed puck.
- **Temperature (°C):** target ~90–96 °C at the group, ideally flat. Variation of
  even ~2 °C measurably shifts flavor (chunk 03), which is why the track's
  flatness is a quality signal.

### 2. Why the window matters (C-14, C-10)

The canonical "9 bar, ~25 s" is the cruise portion of the curve. Pre-infusion
(start) and decline (end) live outside it. Modern machines "dynamically control
both water pressure and temperature" (Cameron & Hendon), i.e. they *profile* —
shaping pressure over time deliberately, e.g. a gentle pre-infusion to reduce
channeling, then a decline to limit late bitter extraction.

### 3. Reduced-motion / data-first design

The scrubbable interactive should let the reader move a time cursor and read all
three tracks at that instant. Under `prefers-reduced-motion`, the animated
scrub collapses but the curves and the read-out values must remain fully visible
and explorable (per plan acceptance).

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| pressure profiling | deliberately varying pressure over the shot | Cameron & Hendon 2020 ("dynamically control") |
| Darcy flux | volumetric flow per area through a porous bed | Cameron & Hendon 2020 |
| pre-infusion | low-pressure wetting phase before the main pull | Cameron & Hendon 2020 |

## Implications for the article

- § The pull: home of the `PullCurve` scrubbable interactive (3 tracks vs time).
- Be explicit in copy that the reference curve is illustrative/synthetic, shaped
  to cited behavior — not a logged shot from one machine (honesty for review).
- Annotate three phases on the curve: pre-infusion · plateau (the 9-bar window) ·
  decline.

## Sources

1. **Cameron, M. I., et al. (2020)** — Systematically Improving Espresso.
   *Matter* 2, 631–648. https://doi.org/10.1016/j.matt.2019.12.019 (Darcy flux ∝
   overpressure; shot time ∝ 1/pressure; dynamic pressure/temperature control).
2. Internal cross-refs: `02-the-pump-and-pressure.md`,
   `03-the-boiler-and-temperature.md`, `04-grouphead-portafilter-puck.md`.

## Open questions

- [ ] No single primary source gives a canonical numeric pressure(t)/flow(t)
  curve for a "standard" shot; shapes are well-known qualitatively. Page labels
  the curve as a reference/illustrative profile with values inside cited ranges.
