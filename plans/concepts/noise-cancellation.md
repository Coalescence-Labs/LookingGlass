---
title: Concept — How noise-cancelling headphones work
status: not-started
category: concept
effort: M
series: "III — Everyday machines"
last-updated: 2026-06-17
---

## Context

Active noise cancellation feels like subtraction magic: the headphone
"hears" the world and makes it quieter. The piece should cover:
destructive interference, feedforward vs feedback ANC paths, why low
frequencies cancel better than high, latency budgets, and the limit of
cancellation (phase mismatch, leakage, personal fit). Passive isolation
(damping) vs active (anti-phase) should be clearly separated.

Pairs with `adaptive-music` (audio systems) but is physics-first, not
composition-first.

## Goal

Ship `/noise-cancellation` as a Concept in Series III, with a wave
superposition demo where the reader adjusts phase and amplitude to see
cancellation vs reinforcement, plus a block diagram of the ANC loop.

## Approach

1. **Research.** Write `research/noise-cancellation/` citing Bose ANC
   patents (primary), IEC 60268 headphone measurement notes, and
   accessible acoustics texts (Everest, Kuttruff) for interference
   principles.
2. **Data.** `src/lib/anc.ts` — synthetic wave samples (sine + noise),
   precomputed anti-phase signals, frequency-response curves for
   "cancels well" vs "can't cancel" bands.
3. **Visuals.**
   - Two-wave canvas: noise + anti-noise → residual; phase slider.
   - Block diagram: mic → DSP → driver with latency callout.
   - Frequency band chart: ANC effectiveness vs passive damping.
4. **Page** uses Web Audio for the demo (synthesised tones only — no
   copyrighted audio). Mute/opt-in; captions describe the effect.

## Files

**Create:**
- `research/noise-cancellation/`
- `src/lib/anc.ts`
- `src/components/anc/WaveSuperposition.tsx`
- `src/components/anc/AncLoopDiagram.tsx`
- `src/app/noise-cancellation/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry under Series III.

## Acceptance

- [ ] `bun run build` clean.
- [ ] Wave demo: phase slider shows null (cancellation) at ~180°.
- [ ] No autoplay; explicit opt-in; keyboard controls for phase.
- [ ] Feedforward vs feedback paths labeled on diagram with citations.
- [ ] Reduced-motion: static waveform snapshots at 0°/180°.

## References

- Bose ANC patent family (feedforward/feedback hybrid) — USPTO.
- Kuttruff — *Room Acoustics* (interference fundamentals).
- Internal: `src/app/adaptive-music/page.tsx` for Web Audio patterns.
