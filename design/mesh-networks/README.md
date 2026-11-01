---
topic: "Mesh networks (and what we'd build if the stack fell)"
plan: plans/concepts/mesh-networks.md
research: research/mesh-networks/
date: 2026-06-17
agent: cursor
status: draft
slug: mesh-networks
series: "III — Everyday machines"
---

## Page architecture

Standard Looking Glass spine (see `/context-window`, `/one-million-tokens`):

1. **PageHeader** — index `04`, kicker `On infrastructure`, title, lede.
2. **Short answer** (`01-short-answer.md`) — `L-SHORT-ANSWER`: what a mesh is /
   is not, with a stat column (hops + the reactive/proactive/DTN trichotomy).
3. **§ I — The mechanism** (`02-mechanism.md`) — physical layer → routing →
   identity → failure. Hosts `TopologyDemo` (centrepiece) and `ProtocolCompare`.
4. **§ II — The field today** (`03-field-today.md`) — `DeploymentMap` + prose on
   Guifi / NYC Mesh / Meshtastic / Freifunk.
5. **§ III — The thought experiment** (`04-thought-experiment.md`) — **labelled
   speculation**. "Survives / doesn't survive" contrast.
6. **§ IV — Credits & inspirations** (`05-credits.md`) — Pantheon, Walkaway,
   cypherpunk, cyberpunk revival. No lifted content.
7. **Sources & notes** — `id="sources"`.

The two "labeled halves" the plan asks for: § I–II are **the mechanism** (with a
visible "What a mesh actually is" framing), § III is **the speculation** ("What a
mesh could be"). Each § chrome carries a right-aligned `type-mono-sm` tag —
"Interactive", "The field today", "Speculative — not reportage", "Credits".

## Motion strategy

- `Reveal` for all section chrome, ledes, prose, panels (delays 0.08 / 0.15).
- `SplitWords` only in PageHeader (built in).
- `TopologyDemo`, `ProtocolCompare`, `DeploymentMap`: client components with
  state-driven CSS transitions; **no Motion `whileInView`** (Next 16 / React 19
  hydration note in plan). Mount-visible.
- `useReducedMotion()` in every client component: path redraw / pin pulse become
  instant; static topology + map remain fully readable.

## File map

**Create:**
- `src/app/mesh-networks/page.tsx` — Server Component; orchestration + prose + `#sources`.
- `src/lib/mesh.ts` — topology, Dijkstra routing, deployments, protocol matrix.
- `src/components/mesh/TopologyDemo.tsx` — `"use client"`.
- `src/components/mesh/ProtocolCompare.tsx` — `"use client"`.
- `src/components/mesh/DeploymentMap.tsx` — `"use client"`.

**Modify:**
- `src/lib/concepts.ts` — add Series III + concept entry.

No `public/data/` needed — topology is generated deterministically in `mesh.ts`
(seeded, no runtime randomness, so SSR and CSR agree).

## concepts.ts entry (sketch)

```ts
// SERIES += { id: "everyday-machines", roman: "III",
//   title: "Everyday machines",
//   blurb: "The systems we live inside — taken apart and held to the light." }
// concepts += { index: "04", slug: "mesh-networks",
//   title: "How does a mesh network actually work?",
//   subtitle: "...", kicker: "On infrastructure",
//   seriesId: "everyday-machines", status: "live", readingTime: "9 min" }
```

## Section index

| File | Section | Pattern | Interactive |
|------|---------|---------|-------------|
| `01-short-answer.md` | Short answer | L-SHORT-ANSWER | — |
| `02-mechanism.md` | § I — The mechanism | P-GRAPH-SIM + P-COMPARISON-STRIP | TopologyDemo, ProtocolCompare |
| `03-field-today.md` | § II — The field today | P-MAP-PINS | DeploymentMap |
| `04-thought-experiment.md` | § III — The thought experiment | L-PROSE-GRID (survives/doesn't) | — |
| `05-credits.md` | § IV — Credits & inspirations + Sources | L-CARD-GRID / prose | — |

## Stress-test (Phase 3 checklist)

- [x] Short-answer has a teachable insight + stat column.
- [x] Every research chunk maps to a § (01→I, 02→I, 03→I, 04→II, 05→IV, 06→III).
- [x] ≥1 interactive (three).
- [x] No content-critical `whileInView`.
- [x] All numbers cite claim IDs.
- [x] Mobile layout specified per section/interactive.
- [x] Sources structure defined.
- [x] Cross-links identified (siblings: `/context-window`; future identity piece).
- [x] File map complete.
- [x] `concepts.ts` entry sketched (Series III).
