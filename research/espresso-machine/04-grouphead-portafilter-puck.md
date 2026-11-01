---
topic: Grouphead, portafilter, puck, and pre-infusion
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 04
related-chunks:
  - 05-extraction-science.md
  - 06-the-extraction-curve.md
---

## Summary

The grouphead is where heated, pressurized water meets the coffee. Ground coffee
goes in the portafilter basket, is leveled and tamped into a "puck," and locked
into the group. Water enters, saturates the bed (pre-infusion), then the pump
brings full pressure and percolation begins. The puck is the system's resistor:
its grind size and packing set permeability and therefore flow rate. Notably,
careful café experiments found that **tamp force barely moves yield or shot
time** once the bed is level — within the range tested, an automated 98 N tamp
showed no appreciable variation. Pre-infusion — a brief low-pressure wetting
phase — exists to wet the puck evenly before full pressure, reducing channeling.

## Method

- Cameron & Hendon 2020: tamp-force result (p. on brewing espresso) and
  pre-infusion discussion (model validity note). Accessed 2026-06-17.
- Vendor explainers (E61 group, pre-infusion) for mechanism, cross-checked.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-13 | tamp force barely affects shot time/EY | high | Cameron & Hendon 2020 | — | tested range; 98 N standardized |
| C-14 | pre-infusion = low-pressure wetting before full pressure | high | Cameron & Hendon 2020 (pre-infusion note) | vendor explainers | reduces channeling |
| C-14b | grind sets bed permeability → flow | high | Cameron & Hendon 2020 | — | finer = slower, to a point |

## Findings

### 1. The puck as resistor (C-14b)

"Once compacted into a granular bed, the particle size distribution plays a role
in controlling the permeability of the bed and consequently the flow rate. A
decreased flow rate can be achieved … by decreasing the water pressure, grinding
finer, packing the bed more tightly, using more coffee, or some combination."
Grind is the dominant lever in practice.

### 2. Tamping is overrated (C-13)

The authors "explored a range of tamp pressures but did not observe an
appreciable variation in shot time or EY," standardizing on a 98 N automated
tamp. The job of the tamp is to *level* the bed, not to add resistance — a
useful myth-buster for the article.

### 3. Pre-infusion (C-14)

"Coffee particulates remain dry until they are connected to the extraction
apparatus, at which point water is rapidly introduced to the bed, serving to wet
the entire puck and stabilize the particle temperature." The authors flag the
wetting (pre-infusion) stage as its own modeling problem, separate from steady
percolation. Practically: a gentle low-pressure soak wets the puck uniformly so
that, when full pressure arrives, water doesn't carve channels.

### 4. The group and basket

The portafilter holds the basket (a perforated metal filter). On E61 machines
the group is a heavy brass body kept warm by the thermosiphon (chunk 03). A
dispersion screen spreads incoming water across the puck top.

## Implications for the article

- § The flow path / cutaway: portafilter + basket + puck + dispersion screen.
- Myth-buster callout: "Tamp like you mean it" is mostly ritual (C-13).
- Pre-infusion sets up the *first phase* of the pull curve (chunk 06).

## Sources

1. **Cameron, M. I., et al. (2020)** — Systematically Improving Espresso.
   *Matter* 2, 631–648. https://doi.org/10.1016/j.matt.2019.12.019
2. **Coffeeionado** — E61 vs Saturated Group Head.
   https://www.coffeeionado.com/blogs/the-academy/e61-vs-saturated-group-head-whats-the-difference-3
   Accessed 2026-06-17.

## Open questions

- [ ] Quantitative pre-infusion durations vary widely by machine (often a few
  seconds); page describes it qualitatively as "a few seconds."
