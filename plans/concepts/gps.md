---
title: Concept — How GPS knows where you are
status: not-started
category: concept
effort: M
series: "III — Everyday machines"
last-updated: 2026-06-17
---

## Context

GPS is invisible infrastructure: billions of devices depend on it daily,
yet most readers cannot explain trilateration, why four satellites are
needed, or why general relativity matters for civilian timing. The piece
should cover: satellite constellation geometry, pseudorange measurement,
atomic-clock drift, the navigation solution (least squares / Kalman
filter at a conceptual level), and error sources (ionosphere,
multipath, urban canyon).

Pairs naturally with `mesh-networks` (decentralised vs centralised
infrastructure) without overlapping routing content.

## Goal

Ship `/gps` as a Concept in Series III, with an interactive map where
the reader drops satellites, adjusts clock error, and watches the
position uncertainty ellipse grow or shrink.

## Approach

1. **Research.** Write `research/gps/` with primary sources: GPS
   Interface Specification (IS-GPS-200), NOAA/NASA educational material,
   Ashby (2003) on relativistic corrections, and FAA GPS primer docs.
2. **Data.** `src/lib/gps.ts` — reference satellite positions for a
   fixed scenario, precomputed ranges, error budgets.
3. **Visuals.**
   - Top-down map with user position blob and satellite lines of sight.
   - Sliders: satellite count (3 vs 4+), clock bias, ionospheric delay.
   - Uncertainty ellipse updates live from simplified geometry.
4. **Page** follows existing concept rhythm; cite every timing/distance
   figure.

## Files

**Create:**
- `research/gps/`
- `src/lib/gps.ts`
- `src/components/gps/SatelliteMap.tsx`
- `src/components/gps/ErrorBudget.tsx`
- `src/app/gps/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry under Series III.

## Acceptance

- [ ] `bun run build` clean.
- [ ] Interactive: removing a satellite or increasing clock error visibly
      degrades fix quality.
- [ ] Relativity correction explained in plain language with a cited
      microsecond → meter conversion.
- [ ] No live GNSS API — all geometry precomputed/static.
- [ ] Mobile-responsive; reduced-motion keeps data visible without
      animated scrubbing.

## References

- GPS Interface Specification IS-GPS-200 — https://www.gps.gov/technical/
- Ashby, "Relativity in the Global Positioning System" (2003).
- Internal: `src/app/mesh-networks/page.tsx` for infrastructure tone.
