---
topic: Visuals and data requirements
plan: plans/concepts/noise-cancellation.md
date: 2026-11-01
agent: cursor
status: draft
---

## Interactives

### 1. Wave superposition (`WaveSuperposition`)

- Two unit-amplitude sines: “noise” and “anti-noise”.
- Controls: phase 0–360° (keyboard accessible), optional amplitude of anti-noise.
- Display: three traces or noise/anti/sum; residual meter.
- Audio: Web Audio oscillators, **opt-in unmute**, no autoplay.
- Reduced motion: static snapshots at 0° and 180°.

Data: generated in `src/lib/anc.ts` (sample arrays or analytic draw).

### 2. ANC loop diagram (`AncLoopDiagram`)

- Blocks: Outside mic (FF) → DSP; Inside mic (FB) → DSP; Driver; Ear (sum).
- Latency callout on path.
- Labels citing C-10, C-11, C-12.

### 3. Frequency effectiveness chart

- Schematic bars/curves: ANC contribution vs passive by band.
- Hedge copy: illustrative, not a product scorecard (C-22).

## Non-goals

- No copyrighted cabin/train recordings.
- No brand shootouts.
