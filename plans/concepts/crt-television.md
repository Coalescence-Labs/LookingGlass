---
title: Concept — How a CRT painted television with one dot
status: not-started
category: concept
effort: M
series: "III — Everyday machines"
last-updated: 2026-06-17
---

## Context

An entire generation watched television on cathode-ray tubes — and almost
none of them could explain what was happening inside the glass. Not a
picture stored on the screen, but **one electron beam** racing left to
right, top to bottom, turning phosphor on and off faster than the eye
integrates. Horizontal sync, vertical retrace, persistence of vision, and
the shadow mask on colour tubes are all legible once you see the dot move.

This is vanishing knowledge. CRTs are gone from living rooms, but the
scanning model still underlies how raster displays think about frames,
pixels, and refresh. A natural companion to `rendering-levels` (how a
renderer sees) from the display side.

## Goal

Ship `/crt-television` as a Concept in Series III, with a phosphor-grid
demo where the reader scrubs the electron beam across the raster and
watches a low-resolution image resolve from a single flying dot.

## Approach

1. **Research.** Write `research/crt-television/` citing primary sources:
   NTSC/PAL timing specs (line rate, field rate), textbook treatments of
   CRT deflection (Horowitz & Hill, *The Art of Electronics*), and
   manufacturer application notes on shadow-mask Trinitron vs aperture
   grille if colour is covered briefly.
2. **Data.** `src/lib/crt.ts` — reference raster (e.g. 32×24 logical
   phosphor grid), precomputed frame buffer, timing constants with claim
   IDs; no need to simulate full analogue deflection physics.
3. **Visuals.**
   - Phosphor grid with decay (phosphor persistence slider).
   - Flying-dot scrubber: drag beam position or play scan; image builds.
   - Optional overlay: horizontal/vertical retrace intervals (beam off).
   - Short colour sidebar: three guns / shadow mask at conceptual level.
4. **Page** follows existing concept rhythm; cross-link to
   `rendering-levels` when live.

## Files

**Create:**
- `research/crt-television/`
- `src/lib/crt.ts`
- `src/components/crt/PhosphorGrid.tsx`
- `src/components/crt/BeamScrubber.tsx`
- `src/app/crt-television/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry under Series III.

## Acceptance

- [ ] `bun run build` clean.
- [ ] Beam scrubber makes the “one dot paints all” idea visceral.
- [ ] Line rate / field rate / refresh figures cited to primary sources.
- [ ] Reduced-motion: static frames at scan start, middle, end.
- [ ] No actual high-voltage or vacuum-tube operational detail — display
      mechanism only.

## References

- ITU-R BT.470 (PAL) / BT.1700 — field and line structure.
- Horowitz & Hill — CRT deflection and sync (conceptual).
- Internal: `plans/concepts/rendering-levels.md` for renderer companion.
