---
topic: How noise-cancelling headphones work
plan: plans/concepts/noise-cancellation.md
date: 2026-11-01
agent: cursor
status: draft
slug: noise-cancellation
---

## Summary

Active noise cancellation (ANC) invents a second sound — an anti-noise —
and plays it so that, at the eardrum, the two pressure waves cancel by
**destructive interference**. Commercial headphones usually combine
**passive isolation** (the cup or tip blocking sound mechanically) with
**active** paths: a **feedforward** mic outside the cup that acts before
noise arrives, and/or a **feedback** mic inside that senses residual
noise near the ear. Lower frequencies cancel more readily; at higher
frequencies, wavelength shrinks relative to mic–driver spacing and
phase error grows until active cancellation fails. Latency, fit, and
leakage set hard limits. Measurement standards (IEC 60268-24) separate
passive, active, and total insertion loss so claims stay comparable.

## Research questions

1. What physical principle makes “anti-noise” work?
2. How do feedforward and feedback ANC differ, and why hybrid designs?
3. Why does ANC work better on bass than treble?
4. What limits cancellation in real headphones (latency, fit, leakage)?
5. How should we separate passive isolation from active cancellation in
   prose and visuals?

## Chunk index

| File | Scope | Status |
|------|-------|--------|
| `01-destructive-interference.md` | Superposition, phase, nulls | draft |
| `02-feedforward-vs-feedback.md` | Mic placements, hybrid loops | draft |
| `03-frequency-and-latency.md` | Band limits, delay budgets | draft |
| `04-passive-vs-active.md` | Isolation vs ANC; measurement | draft |
| `numbers-and-units.md` | Quantified claims ledger | draft |
| `misconceptions.md` | Myths vs mechanism | draft |
| `visuals-and-data.md` | Interactive requirements | draft |

## Source map

| Claim area | Primary sources |
|------------|-----------------|
| Interference | Wave physics (standard); article demos use synthesized sines |
| Feedforward / feedback / hybrid | Bose patents US9445184B2, US8693700, US9747887B2; JASA hybrid ANR (Streeter et al., 2004) |
| Measurement | IEC 60268-24:2023; ETSI TS 103 640; Audio Precision headphone notes |
| Frequency limits | US9445184B2 discussion of path length vs frequency |

## Open questions

- Exact group-delay budgets for consumer hybrids vary by product; treat
  latency as qualitative + order-of-magnitude (sub-ms DSP + acoustic path)
  unless a specific model is measured.
- Personal-fit profile selection (US9747887) is worth a short callout but
  not a full interactive.

## Downstream use

Cite claim IDs (C-xx) from chunk files in page `#sources` and in
`src/lib/anc.ts` comments where numbers appear.
