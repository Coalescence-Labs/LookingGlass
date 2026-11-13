---
topic: Frequency limits and latency
plan: plans/concepts/noise-cancellation.md
date: 2026-11-01
agent: cursor
status: draft
chunk: 03
related-chunks:
  - 01-destructive-interference.md
  - 02-feedforward-vs-feedback.md
---

## Summary

ANC is strongest at low frequencies where wavelengths are long compared
with headset geometry and phase is easier to match. As frequency rises,
path delay between mic and driver rotates phase; past some band,
cancellation collapses or can even worsen the sound. Passive acoustic
propagation delay plus DSP latency must stay small relative to the
period of the highest frequency you intend to cancel.

## Method

- US9445184B2 — qualitative bandwidth limit from mic–speaker spacing.
- Audio Precision headphone measurement note — example where active
  attenuation is effective below ~1.5 kHz and less helpful higher
  (illustrative, not universal).
- Wave relation: period \(T = 1/f\); 1 kHz → 1 ms period.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-20 | Feedback ANC cancels lower frequencies more readily; above some frequency cancellation becomes impractical due to phase lag from mic–speaker distance. | high | US9445184B2 | | |
| C-21 | Passive 1 kHz tone has a 1 ms period; delays of a fraction of a millisecond are large phase errors at that frequency. | high | \(T=1/f\) | | Pedagogy |
| C-22 | Published example measurement: active attenuation strong below ~1.5 kHz, weaker / less than passive alone in a mid band (~1.5–4 kHz) for that setup. | medium | Audio Precision AppNote (Fig. 25 discussion) | | Label as example, not all headphones |
| C-23 | Streeter et al. hybrid lab system reported strong active reduction in roughly 50–800 Hz for their circumaural test. | medium | Streeter et al. 2004 | | Lab headset, not consumer SKU |

## Findings

### Wavelength vs geometry

At 100 Hz, wavelength in air is ~3.4 m — headset dimensions are a tiny
fraction. At 5 kHz, wavelength is ~7 cm — comparable to cup geometry,
so spatial variation and phase mismatch grow.

### Latency budget (pedagogy)

To keep phase error under ~30° at frequency \(f\), delay should stay under
about \(T/12 = 1/(12f)\). At 500 Hz that is ~0.17 ms; at 2 kHz ~0.04 ms.
Real systems manage band-limited filters rather than perfect wideband
anti-phase.

## Implications for the page

- Frequency band chart: schematic “ANC effective” vs “passive dominates”
  with hedge that exact crossover is product-dependent.
- Latency callout on loop diagram in microseconds–milliseconds language.

## Open questions

- Avoid quoting specific dB for unnamed consumer models without a
  primary measurement citation.
