---
topic: How noise-cancelling headphones work
plan: plans/concepts/noise-cancellation.md
research: research/noise-cancellation/
date: 2026-11-01
agent: cursor
status: draft
slug: noise-cancellation
---

## Architecture

Route `/noise-cancellation` · Series III · concept index **10**.

| § | Title | Interactive |
|---|-------|-------------|
| Short answer | What ANC is | — |
| I | Two waves, one ear | `WaveSuperposition` |
| II | The ANC loop | `AncLoopDiagram` |
| III | Why bass yields first | Frequency band chart (inline or component) |
| IV | Passive is not active | Copy + table |
| Sources | Citations | SourceOutboundLink |

## Motion

- `Reveal` on section headers and ledes.
- Wave demo: CSS/canvas redraw; honor `useReducedMotion` with static 0°/180° frames.
- No autoplay audio.

## File map

| Path | Role |
|------|------|
| `src/lib/anc.ts` | Wave math, band sketch data, source list |
| `src/components/anc/WaveSuperposition.tsx` | Phase slider + opt-in tone |
| `src/components/anc/AncLoopDiagram.tsx` | FF/FB block diagram |
| `src/app/noise-cancellation/page.tsx` | Article |
| `src/lib/concepts.ts` | Entry 10 |

## A11y

- Phase control: `<input type="range">` + arrow keys.
- Audio gated behind explicit Start / Mute.
- Diagram: text labels, not colour alone.
