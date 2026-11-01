# Components — noise-cancellation

## WaveSuperposition

- Props: none (self-contained).
- State: `phaseDeg` (0–360), `started`, `muted`, `antiGain` (0–1, default 1).
- Draw: noise (accent), anti (muted bone), sum (bone) on canvas.
- Audio: two oscillators same freq (~220 Hz), anti phase-offset; gain master.
- Reduced motion: show two static SVG/canvas frames instead of animation loop.

## AncLoopDiagram

- Static SVG/HTML diagram with labeled blocks.
- Caption cites feedforward vs feedback (C-10–C-12).

## Band sketch

- Data from `anc.ts` `BAND_SKETCH`: relative active vs passive contribution by band (illustrative).
