---
topic: Passive isolation vs active cancellation
plan: plans/concepts/noise-cancellation.md
date: 2026-11-01
agent: cursor
status: draft
chunk: 04
related-chunks:
  - 02-feedforward-vs-feedback.md
  - 03-frequency-and-latency.md
---

## Summary

**Passive** isolation is physical: seals, foam, mass, and cup geometry
that block or damp sound without electronics. **Active** cancellation
adds anti-noise. Standards define insertion loss with ANC off vs on so
readers can separate the two. Marketing often conflates them; the page
must not.

## Method

- IEC 60268-24:2023 — terms: active insertion loss, total insertion loss,
  measurements with ANC on/off on HATS/ATF.
- ETSI TS 103 640 — passive / active / total insertion loss definitions.
- Bose patents noting passive noise reduction of environmental sounds at
  higher audible frequencies alongside ANR (e.g. US8571228 family notes).

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-30 | Passive attenuation is measured with headphones fitted and ANC off vs open ear. | high | IEC 60268-24 | ETSI TS 103 640 | |
| C-31 | Active insertion loss compares ANC on vs ANC off with headphones fitted. | high | IEC 60268-24 | ETSI TS 103 640 | |
| C-32 | Total insertion loss combines physical occlusion and active reduction (ANC on vs open ear). | high | IEC 60268-24 | ETSI TS 103 640 | |
| C-33 | Passive isolation tends to matter more at higher frequencies; ANC contributes most at lower frequencies. | medium | AP AppNote example | Physics / patents | Hedge: product-dependent |

## Findings

### Language

Say “isolation” or “seal” for passive; “cancellation” or “anti-noise” for
active. “Noise cancelling headphones” as a product category usually means
both.

### Fit

Leakage around the seal undermines both passive blocking and the
acoustic plant the controller assumes (US9747887 profiles exist partly
because ears differ).

## Implications for the page

- Explicit § separating passive vs active.
- Chart stacking schematic passive vs active contribution by band.

## Open questions

None blocking.
