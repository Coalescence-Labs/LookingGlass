---
topic: Numbers and units ledger
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: numbers
---

## Summary

Every quantity that might appear in copy, a stat callout, or the interactive.
Prefer the hedged forms in the "Safe-for-page" column.

## Ledger

| Claim ID | Value | Units | Source A | Source B | Notes | Safe for page |
|----------|-------|-------|----------|----------|-------|---------------|
| N-01 (C-10b) | Tartarus 4, Asphodel 3, Elysium 3 | pieces per biome (Hades) | gameplay.co (Korb) | — | direct quote | yes |
| N-02 (C-10b) | 3 | core stems in Hades intro piece (drum / bass / "everything else") | gameplay.co | — | qualitative anchor | yes |
| N-03 (C-11) | 11 | stems, RDR2 open-world loops | Rockstar Q&A (THR) | Telegraph | settled count | yes |
| N-04 (C-11) | 4–5 | minutes, RDR2 loop length | Telegraph (Jackson) | Mix Online | | yes |
| N-05 (C-11a) | 5 | stems in original Red Dead Redemption (same key & tempo) | Rockstar Q&A | — | the contrast | yes |
| N-06 (C-11c) | ~60 | hours of music composed for RDR2 | Wikipedia (tertiary) | Nerdist | hedge "roughly" | yes — with "roughly" |
| N-07 (C-11c) | ~190 | missions in RDR2 | Wikipedia (tertiary) | Nerdist | hedge "around" | yes — with "around" |
| N-08 (C-07b) | 50–200 | ms, natural ducking fade-in | Amplitude SDK | — | practitioner guidance | yes — with "typically" |
| N-09 (C-07b) | 500–1500 | ms, natural ducking fade-out | Amplitude SDK | — | asymmetric release | yes — with "typically" |
| N-10 (C-13c) | ~5 | ms, minimum gain ramp to declick | velocaption | MDN | demo internal | yes (methods/notes) |
| N-11 | 96 | dB, dynamic range of 16-bit output | Wwise HDR | — | context for HDR | optional |
| N-12 | 0.75 | guitar+bass / bass / neither | n/a | n/a | NOT a number — Hades' 3-way semi-random stem choice (C-10a) | describe in prose, not a stat |

## Demo (synthesised) parameters — internal, not page facts

| Name | Value | Notes |
|------|-------|-------|
| Beat clock | ~96–110 BPM | implementer's choice; quantize stem entries to the beat |
| Stem fade | 120–400 ms | musical crossfade between layer states |
| Duck in / out | ~120 / ~800 ms | demonstrates asymmetric ducking (C-07b) |
| Master default | muted | opt-in; user gesture required (C-13) |

## Notes

- Do **not** put a middleware market-share percentage on the page (unsourced).
  Say "the two dominant" packages (C-09).
- Hades per-piece stem totals are unpublished; keep the "drums on in combat"
  framing qualitative (C-10).
