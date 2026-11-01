---
title: Concept — How QR codes encode and self-correct
status: not-started
category: concept
effort: M
series: "III — Everyday machines"
last-updated: 2026-06-17
---

## Context

QR codes are everywhere — menus, tickets, payments — but the square is
doing serious work: mode indicators, version sizing, Reed–Solomon error
correction, mask patterns, and finder alignment structures. The piece
should decode a real payload byte-by-byte at a readable level, then show
why you can scratch off 30% and it still scans.

Great fit for Looking Glass: invisible structure made legible, with a
grid interactive that beats any static diagram.

## Goal

Ship `/qr-codes` as a Concept in Series III, with an interactive matrix
where the reader toggles damage, mask pattern, or version and watches
correction succeed or fail.

## Approach

1. **Research.** Write `research/qr-codes/` citing ISO/IEC 18004, the
   Thonky QR tutorial (cross-check against spec), and Reed–Solomon
   references (primary papers or J.S. Reed & G. Solomon 1960).
2. **Data.** `src/lib/qr.ts` — encode/decode a short fixed payload
   (e.g. `https://lookingglass…`) in TypeScript; precompute codewords
   and correction blocks for the demo version.
3. **Visuals.**
   - Zoomable module grid with hover annotations (finder, timing, format).
   - Damage brush or preset occlusions; show correction syndromes
     conceptually (color recovered modules).
   - Payload bytes panel updating as modules are read.
4. **Page** keeps math light; lead with "what each region does."

## Files

**Create:**
- `research/qr-codes/`
- `src/lib/qr.ts`
- `src/components/qr/ModuleGrid.tsx`
- `src/components/qr/DamageDemo.tsx`
- `src/app/qr-codes/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry under Series III.

## Acceptance

- [ ] `bun run build` clean.
- [ ] Encoder/decoder implemented in-repo for one fixed version (e.g. V1–M).
- [ ] Damage demo: at least three occlusion levels with pass/fail outcome.
- [ ] Every capacity / ECC figure cited to ISO/IEC 18004.
- [ ] Reduced-motion: static before/after damage comparison available.

## References

- ISO/IEC 18004 — QR Code bar code symbology specification.
- Reed & Solomon — "Polynomial Codes over Certain Finite Fields" (1960).
- Internal: any concept page with a grid/canvas interactive for patterns.
