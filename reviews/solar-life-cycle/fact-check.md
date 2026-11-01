---
slug: solar-life-cycle
review: reviews/solar-life-cycle/review-2026-10-22.md
date: 2026-10-22
---

## Summary

| Status | Count |
|--------|-------|
| Match | 22 |
| Drift (fixed this pass) | 8 |
| Unsourced (fixed) | 1 |
| Unverifiable (hedged) | 2 |

## Claims

| Claim ID | Claim (short) | Page / component | Primary source | Status | Notes |
|----------|---------------|------------------|----------------|--------|-------|
| C-01 | Age ~4.6 Gyr | short answer, timeline Now | NASA Science Sun facts | Match | Fact Sheet alone lacks age; page now cites NASA Science |
| C-02 | MS lifetime ~10 Gyr | short answer, stages | NASA Science / NASA Expert | Match | Detailed tracks ~10–11 Gyr; hedged in Sources |
| C-03 | Remaining MS ~5.5 Gyr | short-answer numeral | derived C-01+C-02 | Match | 0.05+10−4.6 = 5.45 → ~5.5 |
| C-04 | “Little under halfway” MS | short answer / timeline | NASA “little less than halfway” | Match | (4.6−0.05)/10 ≈ 0.455 |
| C-05 | Teff now 5772 K | HR Now | NASA Fact Sheet | Match | |
| C-06 | ZAMS L ≈ 0.7 L☉ | stage card + HR | Sackmann 1993 | Match (fixed) | Was consistent; end-of-MS was wrong |
| C-07 | MS L 0.7 → 1.3 / “+30% ZAMS→turnoff” | stage + § III | Sackmann 1993 | Drift→fixed | True rise ~0.7→~2.2; +30% is vs *today* over a few Gyr, not ZAMS→turnoff |
| C-08 | MS R 0.9 → 1.2 | stage card | Sackmann 1993 | Drift→fixed | Updated to 0.9 → ~1.6 |
| C-09 | Core T ~13–16 MK | stage card | NASA center 15.7 MK + tracks | Match (tightened) | |
| C-10 | RGB tip R ~100 R☉ | stage card | Sackmann tip ~170 R☉ | Drift→fixed | Now ~170; Mercury engulfed |
| C-11 | RGB tip L ~2000 L☉ | stage + HR | Sackmann ~2300 | Drift→fixed | |
| C-12 | RGB past Mercury | RGB blurb | Sackmann 1993 | Match | |
| C-13 | AGB “past current orbit” / Earth engulfed | page § III | Sackmann + later tide papers | Drift→fixed | Tip ~0.9–1 AU; Earth fate model-dependent |
| C-14 | AGB R ~200 R☉, L ~3000+ | stage card | Sackmann | Match | Hedged as model-dependent |
| C-15 | HB ~0.12 Gyr, L~50, R~10 | stage card | Sackmann ~0.1 Gyr | Match | Order-of-magnitude |
| C-16 | Helium flash seconds–minutes, surface quiet | stage card | CD / Iben | Match | Internal runaway |
| C-17 | PN ~20 kyr | duration cell | standard PN lifetime | Match | Schematic |
| C-18 | WD R ~0.01 R☉ | stage card | Earth-radius remnant | Match | |
| C-19 | WD cooling “100 Gyr” as the duration | short answer / timeline | cooling literature ~10¹¹–10¹² yr | Drift→fixed | Schematic axis kept; copy hedges longer cooling |
| C-20 | WD remnant “most of a solar mass” | WD blurb | Sackmann M_f≈0.54 M☉ | Drift→fixed | Now “roughly half a solar mass after envelope loss” |
| C-21 | Habitability 0.1–1 Gyr from solar brightening | § III | Kasting-class + Sackmann L(t) | Match | Intentionally OoM; sources note |
| C-22 | Fusion ≠ combustion | short answer / misconceptions | NASA / pedagogy | Match | |
| C-23 | “Four-fifths of luminous career is MS” | StageTimeline | duration arithmetic | Drift→fixed | MS ≈ 93% of pre-WD luminous career → “nearly all” |
| C-24 | Collapse ~50 Myr, Hayashi | stage card | CD / standard PMS | Match | Model-dependent |
| C-25 | HR Late MS L=1.6 | HRPath | Sackmann mid/late | Drift→fixed | Late MS point now L=2.2 near turnoff |
| C-26 | Hertzsprung/Russell 1911/1913 convention | HR caption | historical | Match | Qualitative |

## Drift details (pre-fix)

1. **§ III “luminosity climbs roughly 30% from zero-age to turnoff”** — contradicted both by `solar.ts` (0.7→1.3 already ~86%) and by Sackmann (0.7→2.2). Replaced with factor-of-three framing; kept ~30% brighter than *today* within a few Gyr for habitability.
2. **MS card L/R** — end-of-MS understated; aligned to Sackmann order of magnitude.
3. **RGB tip R~100** — understated vs ~170 R☉ tip that engulfs Mercury.
4. **AGB past “the current orbit”** — ambiguous/overconfident for Earth; hedged.
5. **WD “most of a solar mass”** — final WD ~0.54 M☉ after mass loss.
6. **WD “hundred-billion-year cooling” as definitive** — schematic OK; models continue longer.
7. **“Four-fifths” MS share** — arithmetic false; fixed.
8. **Sources attributed age/MS life to Fact Sheet** — Fact Sheet has Teff/L/central T only; age/lifetime from NASA Science.

## Unsourced on page (pre-fix)

- Age / MS lifetime attributed solely to Fact Sheet → split NASA Fact Sheet vs NASA Science.

## Lib / JSON cross-check

| Field | `src/lib/solar.ts` (after) | Research draft | Page | Match? |
|-------|----------------------------|----------------|------|--------|
| SUN_CURRENT_AGE_GYR | 4.6 | 4.6 | Yes | Yes |
| MS durationGyr | 10 | ~10 | Yes | Yes (NASA wording) |
| MS L span | 0.7 → ~2 | 0.7 → 1.3 (stale) | Updated prose | Yes |
| RGB tip R | ~170 | ~100 (stale) | Updated | Yes |
| WD durationGyr | 100 schematic | ~100 | Hedged copy | Yes |
| HR Now Teff | 5772 | — | Yes | Yes |

## Spot-check log

1. **NASA Sun Fact Sheet** — fetched 2026-10-22 — Teff 5772 K, L, central T 1.571×10⁷ K; **no age/lifetime**.
2. **NASA Science Sun facts** — 200 — age ~4.6 Gyr formation; ~5 Gyr remaining / little less than halfway.
3. **Sackmann et al. 1993** PDF via ADS articles — 200 — MS ~11 Gyr, L 0.7→2.2, RGB tip ~170 R☉ / 2300 L☉, AGB tip ~213 R☉, WD ~0.54 M☉.
4. **Schaller et al. 1992** PDF — 200 — grid context.
5. **Christensen-Dalsgaard notes** — live Aarhus URL 404; Wayback PDF 200 (2024-07-12 snapshot).
6. **Iben CUP product page** — 200.
7. **IAU.org** — 200 (old naming path 404; unused on stage cards).
