---
title: Concept 04 — Solar life cycle
status: in-progress
category: concept
effort: L
series: "II — Mechanisms of the world"
last-updated: 2026-04-20
---

## Context

Series II opens with the sun — the literal archetype of a mechanism people
live alongside without looking inside. The piece should cover: birth from
nebular collapse, the main sequence (where the sun is now), the red-giant
turn, helium flash, horizontal branch, AGB, planetary nebula, and the
white-dwarf end-state.

Audience expects literary clarity and rigor. Every number cited to a
primary source (NASA fact sheet, peer-reviewed paper, or IAU). Watch for
the common misconceptions: the sun is not *burning*; fusion ≠ combustion;
the sun's current remaining lifetime is often misreported (it's ~5 Gyr of
main-sequence left, not 5 Gyr total).

This piece also seeds Series II — so the series entry itself needs to
land in `src/lib/concepts.ts`.

## Goal

Ship `/solar-life-cycle` as Concept 04, opening Series II, with at least
one visual that makes the timescale felt (not just stated).

## Approach

1. **Research first.** Write `research/solar-life-cycle.md` with every
   number sourced before any code. Use NASA Sun Fact Sheet, Iben's stellar
   evolution review (1991), and Schaller et al. 1992 evolutionary tracks
   as the core references.
2. **Data layer.** Create `src/lib/solar.ts` with typed stages:
   `{ name, startGyr, durationGyr, coreT_MK, coreRho_kgm3, radiusR_sun,
   luminosityL_sun, blurb, citation }`.
3. **Visuals.**
   - A log-scale Gyr timeline across the full ~13 Gyr lifespan with the
     sun's current position marked.
   - A radius × luminosity trace (the HR-diagram path, simplified).
   - Both animated with state-driven CSS transitions. Follow the pattern
     in `src/components/motion/Reveal.tsx` — no Motion 12 `whileInView`
     due to the Next 16 / React 19 hydration bug.
4. **Page** follows the rhythm of `src/app/one-million-tokens/page.tsx`:
   PageHeader → short-answer stat → § sections per life phase → sources.
5. **Series II registration.** Add a `SERIES` entry and the concept entry
   in `src/lib/concepts.ts`. Update the About page's series card list.

## Files

**Create:**
- `research/solar-life-cycle.md`
- `src/lib/solar.ts`
- `src/components/solar/StageTimeline.tsx`
- `src/components/solar/HRPath.tsx`
- `src/components/solar/StageCard.tsx`
- `src/app/solar-life-cycle/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add Series II + Concept 04.

## Acceptance

- [ ] `bun run lint` and `bun run build` both clean.
- [ ] Page renders above-the-fold immediately (no blank Reveal state).
- [ ] Every numeric claim on the page cites a primary source in the
      "Sources & notes" section.
- [ ] Timeline + HR path work at ≤ 480px and ≥ 1024px.
- [ ] Prefers-reduced-motion collapses animations.
- [ ] Landing page shows the new concept grouped under **Series II**.
- [ ] About page's § III series list includes Series II.
- [ ] All prose original; all diagrams first-party SVG/CSS.

## References

- NASA Sun Fact Sheet — https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
- Iben, *Stellar Evolution Physics* (Cambridge Univ. Press, 2012) — replaces the earlier ApJS 76 (1991) pointer; the 2012 book is the fuller treatment referenced in the research notebook.
- Christensen-Dalsgaard, *Stellar Structure and Evolution* (Aarhus lecture notes, 2008).
- Schaller et al., "New grids of stellar models" (1992) — A&AS 96, 269. (Numbers proxied from NASA + Christensen-Dalsgaard where Schaller table access is unavailable; cells flagged in `solar.ts`.)
- Internal: `src/app/one-million-tokens/page.tsx` (page rhythm).
- Internal: `src/components/motion/Reveal.tsx` (motion pattern).
