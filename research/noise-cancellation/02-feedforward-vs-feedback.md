---
topic: Feedforward vs feedback ANC
plan: plans/concepts/noise-cancellation.md
date: 2026-11-01
agent: cursor
status: draft
chunk: 02
related-chunks:
  - 03-frequency-and-latency.md
  - 04-passive-vs-active.md
---

## Summary

**Feedforward** mics sit outside the cup, sensing noise before it reaches
the ear; the DSP predicts and plays anti-noise through the driver.
**Feedback** mics sit inside, near the driver/ear, sensing residual noise
and driving a loop that tries to null that residual. Hybrids use both.
Each path has stability and bandwidth tradeoffs; patents and JASA work
document hybrid gains.

## Method

- US9445184B2 (Bose) — feedback ANR, multi-mic feedback, bandwidth limits.
- US8693700 (Bose) — adaptive feed-forward with feed-forward + feedback paths.
- US9747887B2 (Bose) — explicit feed-forward + feedback controllers; fit profiles.
- Streeter, Ray, Collier — *Hybrid feedforward-feedback active noise control
  for circumaural headsets*, J. Acoust. Soc. Am. (2004), DOI
  10.1121/1.4782959.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-10 | Feedback ANC places a mic inside the earcup/cavity near the speaker and generates an inverse signal to reduce residual noise. | high | US9445184B2 | US9747887B2 | |
| C-11 | Feedforward ANC senses ambient noise outside and acts preemptively on noise that will reach the ear. | high | US9747887B2 | US8693700 | |
| C-12 | Commercial ANR often combines feedforward and feedback. | high | US9747887B2 | US8693700 | |
| C-13 | Hybrid FF+FB can improve reduction and stability margins vs either alone (lab circumaural results). | medium | Streeter et al. 2004 (JASA) | Patents describe hybrids | Cite as lab example, not universal product claim |
| C-14 | Feedback bandwidth is limited by mic–speaker separation: phase lag grows with frequency. | high | US9445184B2 | Control theory / path delay | |

## Findings

### Feedback

Loop tries to drive sensed residual toward zero. Works best where the
acoustic plant is well behaved; cavity resonances force lower gains
(Streeter et al.). Higher frequencies suffer from path length phase
rotation between speaker and mic (US9445184B2).

### Feedforward

Uses an outside reference. Sensitive to how stationary the noise is and
to the plant model between outside mic and ear (Streeter et al.;
US8693700 adaptive filters).

### Hybrid

Both paths contribute anti-noise; product designs store profiles that
adapt controllers to wearer acoustics (US9747887B2).

## Implications for the page

- Block diagram: Outside mic → FF DSP; Inside mic → FB DSP; both → driver;
  ear as summation point; latency callout on the acoustic + DSP path.
- Label citations on the diagram caption.

## Open questions

None blocking for a conceptual diagram.
