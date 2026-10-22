---
topic: Numbers and units ledger
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
chunk: numbers
related-chunks:
  - 01-what-is-espresso.md
  - 02-the-pump-and-pressure.md
  - 03-the-boiler-and-temperature.md
  - 05-extraction-science.md
  - 07-crema-and-folklore.md
---

## Summary

Every quantity that may appear in copy, a stat callout, the cutaway, or the pull
curve, with sources. Numbers require a Tier A/B source; hardware mechanism prose
may use Tier C but no number rests on Tier C alone.

## Ledger

| Claim ID | Value | Units | Source A | Source B | Notes | Safe for page |
|----------|-------|-------|----------|----------|-------|---------------|
| C-01 dose | 7–9 | g (dry) | SCA via Cameron & Hendon 2020 | INEI (7 g ±0.5) | "textbook" | yes |
| C-01 temp | 92–95 | °C (heated water) | SCA via Cameron & Hendon 2020 | — | measurement point: heated water | yes |
| C-01 pressure | 9–10 | bar | SCA via Cameron & Hendon 2020 | INEI (9 ±1) | static pressure | yes |
| C-01 time | 20–30 | s | SCA via Cameron & Hendon 2020 | INEI (25 ±2.5) | percolation | yes |
| C-01 yield vol | 25–35 | mL | SCA via Cameron & Hendon 2020 | INEI (25 ±2.5) | beverage volume | yes |
| C-02 exit temp | 88 ±2 | °C | INEI | — | water exiting the group | yes |
| C-02 cup temp | 67 ±3 | °C | INEI | — | drink in cup | yes |
| C-02 viscosity | >1.5 | mPa·s @45 °C | INEI | — | body | yes (optional) |
| C-02 fat | >2 | mg/mL | INEI | — | optional | yes (optional) |
| C-02 caffeine | <100 | mg/cup | INEI | — | optional | yes (optional) |
| C-03 | ≈130 | psi (= 9 bar) | Clive Coffee | unit conversion (9 bar = 130.5 psi) | intuition | yes |
| C-03b | ≈9 | atm (= 9 bar) | unit conversion | — | intuition | yes |
| C-04 | ~60 | strokes/s (vibratory) | Clive Coffee | Coffeeionado | "about 60×/s" | yes |
| C-05 brew | 90–96 | °C (group) | Coffee Scholars | Brew Precision | range across designs | yes |
| C-05 steam | 125–135 | °C (steam boiler) | Coffee Scholars | Brew Precision | dry steam | yes |
| C-06 | ~±1 | °C (PID/dual brew) | Brew Precision | Coffee Scholars | saturated+PID tighter | yes |
| C-07 | ~30 | % of dry mass (extraction ceiling) | Cameron & Hendon 2020 | — | "experimental upper limit" | yes |
| C-09 | up to 25 | % less coffee per shot | Cameron & Hendon 2020 | — | downdosing at equal EY | yes |
| C-10 dose | 15–22 | g (café) | Cameron & Hendon 2020 | — | modern recipes | yes |
| C-10 bev | 30–60 | g (café beverage) | Cameron & Hendon 2020 | — | modern recipes | yes |
| C-12 frac | ≥10 | % of cup volume (crema) | Illy & Navarini 2011 | FRI 2018 | connoisseur | yes |
| C-12 persist | ≥2 | min (crema lifetime) | Illy & Navarini 2011 (Illy & Viani) | FRI 2018 | quality cue | yes |
| C-11 droplets | 90 | % of oil droplets <10 μm | Illy & Navarini 2011 | — | emulsion fineness | yes |
| C-11 fragments | 2–5 | μm (cell-wall fragments) | Illy & Navarini 2011 | — | suspended solids | yes |
| C-11 TSS | ~52.5 | g/L (total soluble solids, 30 mL arabica) | Illy & Navarini 2011 | — | concentration | yes (optional) |
| C-11 OW | 0.2–0.3 | % volume fraction (O/W emulsion) | Illy & Navarini 2011 | — | optional | yes (optional) |

## Conversions used

- 1 bar = 100 kPa ≈ 1 atm (sea level) = 14.5038 psi → 9 bar = 130.5 psi.
- These conversions are arithmetic, not cited claims.

## Do-not-use

- **18–22 % EY "golden" band**: that is an SCA *brewed/filter* Golden Cup figure,
  not an espresso standard in the primary sources here. Do not present it as the
  espresso target. Use ~30 % ceiling + "peak EY" framing instead.
- Any single hard mL/s flow-rate number — no primary source gives one for a
  "standard" shot; derive flow qualitatively.
