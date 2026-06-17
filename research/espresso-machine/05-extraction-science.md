---
topic: Extraction science — yield, grind, channeling
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 05
related-chunks:
  - 04-grouphead-portafilter-puck.md
  - 06-the-extraction-curve.md
---

## Summary

The industry measures extraction by **extraction yield (EY)**: the fraction of
the dry coffee's mass that dissolves into the cup (measured via refractive
index/TDS). The experimental ceiling is ~30 % of dry mass. Naively, finer grind
= more surface area = higher EY. Cameron & Hendon's model predicts exactly that
*under homogeneous flow* — a monotonic rise as grind gets finer. But experiment
shows a **peak**: past a critical fineness, EY *falls* and variability rises,
because fine beds clog and water finds preferential channels (inhomogeneous
flow). Their prescription inverts café habit: find a tasty shot, then grind
**coarser** and **dose less** (downdosing), navigating yield with brew ratio
rather than time. In a year-long café trial this cut coffee mass per drink by up
to ~25 % at equal yield, sometimes with faster shots (<15 s).

## Method

- Read Cameron & Hendon 2020 in full (open PDF, 752-line extract): summary,
  model assumptions (Eq. 16 saturation, ~30 % ceiling), Figures 3–4 (dose &
  pressure effects, EY-vs-grind peak), brewing-espresso section, café results.
  Accessed 2026-06-17.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-07 | extraction ceiling ~30 % of dry mass | high | Cameron & Hendon 2020 (Eq. 16 region) | — | "experimental upper limit" |
| C-08 | EY peaks then falls as grind gets finer | high | Cameron & Hendon 2020 Fig. 4 | — | inhomogeneous flow at fine settings |
| C-09 | downdosing cuts coffee up to ~25 % at equal EY | high | Cameron & Hendon 2020 (Progress & Potential) | — | also <15 s shots possible |
| C-08b | finer/lower-pressure/less-coffee raises modeled EY | high | Cameron & Hendon 2020 | — | *model*, homogeneous-flow assumption |

## Findings

### 1. What EY is (and how it's measured) (C-07)

"The coffee industry uses extraction yield (EY), a ratio of solvated coffee mass
to the mass of dry coffee used … EY is calculated by first measuring the
refractive index." The paper notes the "experimental upper limit of extraction
is approximately 30 % by mass" — most of the bean is insoluble cellulose.

### 2. The model's clean prediction (C-08b)

"The model predicts that EY can be increased by grinding finer, using lower
pressure water, and/or using less coffee." Under the key assumption of
*homogeneous flow*, EY decreases monotonically as grind gets coarser — i.e.
finer is always better.

### 3. The experimental surprise (C-08)

Reality disagrees: "experimental measurements show a peak in the extraction yield
versus grind setting relationship, with lower extraction yields at both very
coarse and fine settings." Below a critical grind size (their EK43 setting ~1.7),
EY *drops*. The cause: fine beds don't flow evenly — "inhomogeneous flow is
operative at fine grind settings, resulting in poor reproducibility and wasted
raw material." At 9 bar the fine beds clogged outright, so café trials dropped to
6 bar to access a wider grind range.

### 4. Channeling, in plain terms

When part of the puck is denser (or fines migrate and pack), water takes the path
of least resistance. Those channels over-extract while the rest under-extracts;
the cup is a blend of bitter and sour, and shot-to-shot variation explodes. This
is the mechanism behind most "bad espresso," not human clumsiness.

### 5. The prescription (C-09)

Because EYmax sits at the finest grind that *still* flows evenly, the authors
advise: locate a "tasty point," then grind coarser and reduce dose, dialing yield
with brew ratio (water mass) instead of chasing a 25–30 s clock. A 20 g recipe
could drop to 15 g at the same EY — "up to 25 %" less coffee, with potentially
very fast shots and a more reproducible result. They explicitly suggest
*ignoring brew time* as an independent variable, departing from the SCA's
time-based guidance.

## Discrepancies

| Claim ID | Source A says | Source B says | Recommended | Rationale |
|----------|---------------|---------------|-------------|-----------|
| pressure | model: lower P → higher EY; café ran 6 bar | industry standard 9 bar | present 9 bar as sensory standard; 6 bar as a yield/clog finding | different goals: taste tradition vs measured yield |

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| EY (extraction yield) | dissolved mass ÷ dry coffee mass | Cameron & Hendon 2020 |
| TDS | total dissolved solids; concentration in the cup | coffee industry |
| channeling | uneven flow through preferential paths in the puck | Cameron & Hendon 2020 |
| downdosing | using less dry coffee per shot | Cameron & Hendon 2020 |

## Implications for the article

- § What the science actually says: the centerpiece intellectual payoff.
- Stat callouts: ~30 % ceiling (C-07); up to 25 % less coffee (C-09).
- Visual idea: EY-vs-grind curve with a peak (could be a small inline figure or
  described in copy); channeling diagram in the cutaway.
- Strong myth-buster material for chunk `misconceptions.md`.

## Sources

1. **Cameron, M. I., Morisco, D., Hofstetter, D., Uman, E., Wilkinson, J.,
   Kennedy, Z. C., Fontenot, S. A., Lee, W. T., Hendon, C. H., Foster, J. M.
   (2020)** — Systematically Improving Espresso: Insights from Mathematical
   Modeling and Experiment. *Matter* 2, 631–648.
   https://doi.org/10.1016/j.matt.2019.12.019 (open:
   https://pages.uoregon.edu/chendon/publications/2020/74.%20Matter,%20Espresso%20extraction.pdf)

## Open questions

- [ ] The "golden" EY band often quoted as 18–22 % is an SCA brewed-coffee
  (filter) Golden Cup figure, not stated in this paper for espresso. Do **not**
  assert 18–22 % as an espresso standard on the page without an espresso-specific
  source; use the ~30 % ceiling and "peak EY" framing instead.
