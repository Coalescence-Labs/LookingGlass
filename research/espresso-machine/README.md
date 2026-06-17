---
topic: How an espresso machine works
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
slug: espresso-machine
---

## Summary

Espresso is a small, contained thermodynamic event: roughly 7–9 g of finely
ground coffee, wetted and then driven by ~9 bar of water at ~90–96 °C, yielding
a 25–40 g beverage in 20–30 s. Every word of that has a mechanism behind it.
**Pressure** comes from a pump — a buzzing electromagnetic vibratory piston
(~60 strokes/s) in home machines, or a smooth rotary vane pump in commercial
ones — capped by an over-pressure valve near 9–10 bar. **Heat** comes from a
boiler held within a degree or two of target; the three classic architectures
(single boiler, heat exchanger, dual boiler) are three different answers to one
problem: a single vessel cannot be at brew temperature and steam temperature at
once. **Resistance** comes from the puck: a tamped granular bed whose grind
size sets permeability and therefore flow.

The counter-intuitive heart of the piece is extraction science. Cameron, Hendon
et al. (*Matter*, 2020) showed that grinding *finer* past a critical point
*lowers* yield, because fine beds channel — water carves preferential paths and
extraction goes uneven. Their fix inverts café folklore: grind coarser, dose
less, and chase yield with brew ratio rather than time. Crema, meanwhile, is a
real CO₂ emulsion, not a proxy for quality.

## Research questions

1. What *is* espresso, quantitatively — and whose standard says so? → `01`
2. How does the machine make ~9 bar, and what shapes the pressure? → `02`
3. How is brew water held at temperature, and why are there three boiler types? → `03`
4. What happens in the grouphead, portafilter, and puck — including pre-infusion? → `04`
5. What does the science say about extraction yield, grind, and channeling? → `05`
6. What does a real pull look like as curves of pressure, flow, and temperature over time? → `06`
7. What is crema, actually — and which espresso beliefs are folklore? → `07`

## Chunk index

| File | Scope | Status |
|------|-------|--------|
| `01-what-is-espresso.md` | Definition, SCA & INEI standards, the system as thermodynamics | draft |
| `02-the-pump-and-pressure.md` | Vibratory vs rotary pumps, 9 bar, over-pressure valve | draft |
| `03-the-boiler-and-temperature.md` | Single / HX / dual boiler, thermosiphon, PID | draft |
| `04-grouphead-portafilter-puck.md` | Group, basket, puck prep, pre-infusion | draft |
| `05-extraction-science.md` | EY, brew ratio, channeling, Cameron/Hendon model | draft |
| `06-the-extraction-curve.md` | Pressure/flow/temperature tracks over time; profiling | draft |
| `07-crema-and-folklore.md` | Crema composition; mechanism vs ritual | draft |
| `numbers-and-units.md` | Quantified claims ledger | draft |
| `misconceptions.md` | Myths vs mechanism | draft |
| `visuals-and-data.md` | Interactive/visual requirements tied to claim IDs | draft |

## Source map

| Short name | Tier | Type | URL / citation | Cited in chunks |
|------------|------|------|----------------|-----------------|
| Cameron & Hendon 2020 | A | peer-reviewed paper | Cameron, Morisco, Hofstetter, Uman, Wilkinson, Kennedy, Fontenot, Lee, Hendon, Foster. "Systematically Improving Espresso: Insights from Mathematical Modeling and Experiment." *Matter* 2, 631–648 (2020). https://doi.org/10.1016/j.matt.2019.12.019 · open copy: https://pages.uoregon.edu/chendon/publications/2020/74.%20Matter,%20Espresso%20extraction.pdf | 01, 04, 05, 06, numbers, misconceptions |
| INEI / IEI | A | standards body | Istituto Espresso Italiano, "The Certified Italian Espresso." https://inei.coffee/en/The-Certified-Italian-Espresso.html · technical spec via https://www.caffenostra.eu/welcome/espresso-italiano/ | 01, 03, 07, numbers |
| SCA (via Cameron & Hendon) | A | standards body | Specialty Coffee Association historical espresso definition, quoted in Cameron & Hendon 2020, p. 631 | 01, 05, numbers |
| Illy & Navarini 2011 | A | peer-reviewed review | Illy, Navarini. "Neglected Food Bubbles: The Espresso Coffee Foam." *Food Biophysics* 6, 335–348 (2011). https://pmc.ncbi.nlm.nih.gov/articles/PMC3140933/ | 07, numbers, misconceptions |
| Nunes-Coimbra crema study 2018 | B | peer-reviewed paper | "Investigation of the factors that affect the volume and stability of espresso crema." *Food Research International* (2018). https://www.sciencedirect.com/science/article/abs/pii/S0963996918307105 | 07, numbers |
| Clive Coffee — pumps | C | retailer explainer | "The Pump: The Heart of Your Espresso Machine." https://clivecoffee.com/blogs/learn/the-pump-the-heart-of-your-espresso-machine | 02 |
| Coffeeionado — boilers | C | retailer explainer | "Single Boiler vs Heat Exchanger vs Dual Boiler." https://www.coffeeionado.com/blogs/the-academy/single-boiler-vs-heat-exchanger-vs-dual-boiler-espresso-machines-whats-the-difference | 03 |
| Coffee Scholars — boilers | C | explainer | "Single Boiler vs. Heat Exchanger vs. Dual Boiler." https://coffeescholars.com/single-boiler-vs-heat-exchanger-vs-dual-boiler/ | 03 |

> Tier-C retailer explainers are used only for **qualitative mechanism**
> description of hardware (how a vibratory pump or a heat exchanger physically
> works), where multiple independent vendors agree. Every **number** on the page
> rests on a Tier A/B source in the ledger.

## Claim ledger (page-worthy)

| ID | Claim (short) | Value / note | Chunk | Safe for page |
|----|---------------|--------------|-------|---------------|
| C-01 | SCA historical espresso definition | 7–9 g in; 92–95 °C; 9–10 bar; 20–30 s; 25–35 mL out | 01 | yes |
| C-02 | INEI certified espresso spec | 7 g ±0.5; exit water 88 °C ±2; 9 bar ±1; 25 s ±2.5; 25 mL ±2.5 | 01 | yes |
| C-03 | 9 bar in familiar units | ≈ 130 psi ≈ 9× atmospheric pressure | 02 | yes |
| C-04 | Vibratory pump stroke rate | ~60 oscillations per second | 02 | yes |
| C-05 | Brew vs steam temperature targets | brew ~90–96 °C; steam boiler ~125–135 °C | 03 | yes |
| C-06 | Dual-boiler / PID brew stability | ~±1 °C (saturated group + PID tighter) | 03 | yes |
| C-07 | Extraction upper limit | ~30 % of dry mass is soluble | 05 | yes |
| C-08 | Channeling onset / fine-grind paradox | yield peaks then falls as grind gets finer | 05 | yes |
| C-09 | Downdosing result | up to ~25 % less coffee per shot at equal yield | 05 | yes |
| C-10 | Café recipes vs standard | 15–22 g dose, 30–60 g beverage, on machines that profile P and T | 01, 06 | yes |
| C-11 | Crema is a CO₂ O/W foam | gas (mostly roast CO₂) in oil-in-water emulsion + fines | 07 | yes |
| C-12 | Crema fraction & persistence | ≥10 % of cup volume; should persist ≥2 min | 07 | yes |
| C-13 | Tamp force barely moves yield | tamp pressure had no appreciable effect on shot time/EY in cafe trials | 04 | yes |
| C-14 | Pre-infusion definition | low-pressure wetting phase before full pressure | 04, 06 | yes |

## Recommended article outline

1. **Short answer** — what espresso is, in one sentence, with the standard numbers (C-01, C-02).
2. **§ I The flow path (cutaway)** — reservoir → pump → boiler → group → puck → cup (C-03–C-05, C-14).
3. **§ II Pressure** — how 9 bar is made and held (C-03, C-04).
4. **§ III Heat** — three boilers, one problem (C-05, C-06); boiler comparison interactive.
5. **§ IV The pull (extraction curve)** — pressure/flow/temperature over time (C-14, C-10); scrubbable interactive.
6. **§ V What the science actually says** — Cameron/Hendon, channeling, downdosing (C-07–C-09, C-13).
7. **§ VI Mechanism vs ritual** — crema and folklore (C-11, C-12).
8. **Sources & notes** — from the Source map.

## Visual / data brief

| Visual | Purpose | Key claims | Data available? |
|--------|---------|------------|-----------------|
| Cutaway SVG | Show the flow path; highlight each component on scroll/hover | C-03–C-05, C-14 | yes — hand-drawn; labels from chunks 02–04 |
| Pull curve (scrubbable) | Make the 9-bar / ~25-s window legible across 3 tracks | C-14, C-03, C-05, C-10 | synthetic reference curve, shape from chunk 06; values within cited ranges |
| Boiler comparison | Contrast single / HX / dual on stability & simultaneity | C-05, C-06 | yes — chunk 03 table |

See `visuals-and-data.md` for exact track shapes and label copy.

## Discrepancies (cross-chunk)

1. **Brew temperature**: SCA says 92–95 °C (water heated); INEI specifies *exit*
   water 88 °C ±2. These measure at different points (boiler/heating vs group
   exit) — not a contradiction. Page should say "~90–96 °C at the group,
   measured conventions vary," citing both. (C-01 vs C-02.)
2. **Pressure for best yield**: the *Matter* model finds yield rises at *lower*
   pressure (they ran café trials at 6 bar to avoid clogging), yet the industry
   standard is 9 bar. Frame 9 bar as the historical/sensory standard, and the
   6-bar result as a model/experiment finding about *yield*, not a new universal
   recipe. (C-01 vs chunk 05.)

## Open questions

1. **[nice-to-have]** Exact published flow-rate value (mL/s) for a "standard"
   shot — most sources give beverage mass/time instead. The page should derive
   flow qualitatively from volume/time, not assert a single cited mL/s number.
2. **[nice-to-have]** SCA's *current* (vs historical) espresso parameters —
   the historical definition is the one quoted in primary literature; note it as
   "historically defined."

## Handoff notes

Branch `plan/espresso-machine`. All numbers used on the page must trace to the
ledger. Hardware mechanism prose may lean on Tier-C vendor explainers only where
they agree; never source a *number* from them.
