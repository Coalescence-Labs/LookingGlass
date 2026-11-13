---
topic: Destructive interference
plan: plans/concepts/noise-cancellation.md
date: 2026-11-01
agent: cursor
status: draft
chunk: 01
related-chunks:
  - 03-frequency-and-latency.md
  - visuals-and-data.md
---

## Summary

Sound pressure at a point is the sum of arriving waves. Two tones of the
same frequency and amplitude cancel when they are ~180° out of phase
(destructive interference) and reinforce when they align (constructive).
ANC invents that second wave electronically so the sum at the ear is
near zero for the targeted noise band.

## Method

- Standard wave superposition (acoustics textbooks: Kuttruff *Room
  Acoustics*; Everest *Master Handbook of Acoustics* — principles of
  interference).
- Bose patent language: anti-noise / inverse acoustic noise that
  “substantially cancels” at a location (US9445184B2).
- Plan requires synthesised demo only (no copyrighted audio).

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-01 | Two equal-amplitude sinusoids of identical frequency sum to near zero when phase difference is π (180°). | high | Wave equation / interference textbooks | US9445184B2 (inverse / out-of-phase compensating signal) | Demo target for phase slider |
| C-02 | Partial phase or amplitude mismatch leaves a residual (beats / incomplete null). | high | Interference fundamentals | Demo math | |
| C-03 | ANC cancels by superposition at the ear, not by “absorbing” energy into a void. | high | US9747887B2 (“destructively interfere with ambient sound”) | Physics | Misconception guard |

## Findings

### Null at anti-phase

For \(p_1 = A\sin(\omega t)\) and \(p_2 = A\sin(\omega t + \phi)\), the
resultant amplitude is \(2A\cos(\phi/2)\). At \(\phi = \pi\), amplitude
is zero. Real ANC approximates this over a band with filters, not a
single tone.

### Residual is the product

Anything the controller mis-estimates — wrong amplitude, wrong phase,
or noise that arrived after the prediction window — remains as residual
pressure at the eardrum.

## Implications for the page

- Wave demo: noise + anti-noise traces + sum; phase slider 0–360° with
  clear null near 180°.
- Copy: “subtraction” is metaphor; mechanism is interference.

## Open questions

None blocking.
