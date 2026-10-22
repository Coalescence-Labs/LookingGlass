---
topic: What espresso is — definition and standards
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 01
related-chunks:
  - 05-extraction-science.md
  - 07-crema-and-folklore.md
---

## Summary

Espresso is defined by a small set of numbers, and two bodies have written
them down. The Specialty Coffee Association's historical definition (as quoted
in the *Matter* paper) is 7–9 g of ground coffee, water at 92–95 °C, ~9–10 bar
of static pressure, 20–30 s of flow, yielding 25–35 mL. The Istituto Espresso
Italiano (INEI) certifies a tighter Italian standard: 7 g ±0.5, exit water
88 °C ±2, 9 bar ±1, 25 s ±2.5, 25 mL ±2.5. Modern cafés routinely run heavier
doses (15–22 g) into larger drinks (30–60 g) on machines that actively control
pressure and temperature. The point for the article: there is a "textbook"
espresso and a "real-world" espresso, and the gap between them is itself the
story.

## Method

- Read Cameron & Hendon 2020 (open PDF), introduction p. 631, for the SCA
  definition and café-recipe ranges. Accessed 2026-06-17.
- Read INEI technical spec via caffenostra.eu reproduction and the IEI
  "Certified Italian Espresso" page. Accessed 2026-06-17.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-01 | SCA historical espresso definition | high | Cameron & Hendon 2020 p.631 | INEI (overlapping ranges) | "historically defined" |
| C-02 | INEI certified espresso spec | high | INEI/IEI spec | caffenostra reproduction | full numeric list |
| C-10 | Café recipes diverge from standard | high | Cameron & Hendon 2020 p.631 | — | 15–22 g dose; 30–60 g out |

## Findings

### 1. The SCA historical definition (C-01)

Cameron & Hendon state it directly: "As historically defined by the Specialty
Coffee Association, an espresso is a 25–35 mL (ca. 20–30 g) beverage prepared
from 7–9 g of ground coffee made with water heated to 92 °C–95 °C, forced
through the granular bed under 9–10 bar of static water pressure and a total
flow time of 20–30 s." They immediately add these "have been grandfathered into
the industry and are significantly detached from the recipes used in most cafés
today."

### 2. The INEI certified standard (C-02)

The Italian Espresso National Institute, founded 1998, certifies "Espresso
Italiano." Its technical specification lists: ground coffee 7 g ±0.5; exit water
temperature 88 °C ±2; drink temperature in cup 67 °C ±3; entry water pressure
9 bar ±1; percolation time 25 s ±2.5; viscosity at 45 °C > 1.5 mPa·s; total fat
> 2 mg/mL; caffeine < 100 mg/cup; volume in cup (incl. foam) 25 mL ±2.5.

### 3. The standard vs the café (C-10)

The same paper notes coffee shops "routinely favor higher dry coffee mass
(15–22 g), resulting in larger volume beverages (30–60 g beverage mass),
produced on machines that dynamically control both water pressure and
temperature." This is the modern espresso most readers actually drink.

## Discrepancies

| Claim ID | Source A says | Source B says | Recommended for page | Rationale |
|----------|---------------|---------------|----------------------|-----------|
| C-01 vs C-02 | SCA: water 92–95 °C | INEI: exit water 88 °C ±2 | "~90–96 °C; measurement point varies" | SCA measures heated water; INEI measures water *exiting the group* — different points |

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| bar | unit of pressure ≈ atmospheric pressure at sea level (100 kPa) | SI |
| percolation time | time water flows through the bed during the shot | INEI |
| brew ratio | dry coffee mass : beverage mass (e.g. 1:2) | Cameron & Hendon 2020 |

## Implications for the article

- Short-answer block: one-sentence definition + the canonical numbers (9 bar,
  ~90 °C, ~25 s, 7–9 g) with both SCA and INEI cited.
- A stat callout contrasting "textbook 7 g / 25 mL" vs "modern café 18 g / 36 g."
- Set up the tension (mechanism vs ritual) resolved in chunk 07.

## Sources

1. **Cameron, M. I., et al. (2020)** — Systematically Improving Espresso. *Matter*
   2, 631–648. https://doi.org/10.1016/j.matt.2019.12.019
2. **Istituto Espresso Italiano** — The Certified Italian Espresso.
   https://inei.coffee/en/The-Certified-Italian-Espresso.html (spec reproduced at
   https://www.caffenostra.eu/welcome/espresso-italiano/). Accessed 2026-06-17.

## Open questions

- [ ] SCA's current (post-revision) espresso parameters, if any — page uses the
  "historically defined" framing, which is the version in the primary literature.
