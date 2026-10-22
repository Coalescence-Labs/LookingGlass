---
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
status: draft
---

## New components

### `TopologyDemo`

| Field | Value |
|-------|-------|
| Path | `src/components/mesh/TopologyDemo.tsx` |
| Client | yes — `"use client"` |
| Used in | § I (`02-mechanism.md`) |
| Pattern | P-GRAPH-SIM (new) |

**Purpose:** let the reader delete nodes and watch the client→gateway route
reroute over live links, or fail when the graph partitions.

**Props**

```ts
type TopologyDemoProps = {
  // none required; reads MESH_TOPOLOGY from lib.
};
```

**Data in**

- `MESH_TOPOLOGY: MeshTopology` from `src/lib/mesh.ts` (deterministic).
- `route(topology, failedIds)` from lib → `{ path, hops, reachable }`.
- Local state: `Set<string>` of failed node ids.

**Motion**

- `useReducedMotion()` gates the path-draw transition (instant when reduced).
- CSS transitions on link/path opacity + stroke; no Motion `whileInView`.

**Accessibility**

- `<svg role="img" aria-label="…">`; nodes are `<button>` with `aria-label` +
  `aria-pressed`; status `aria-live="polite"`; reachability text+icon.

**Responsive**

- Square-ish responsive viewBox; nodes have enlarged invisible hit areas (≥44px
  effective on touch); readout wraps on mobile.

---

### `ProtocolCompare`

| Field | Value |
|-------|-------|
| Path | `src/components/mesh/ProtocolCompare.tsx` |
| Client | yes — `"use client"` (optional highlight state) |
| Used in | § I (`02-mechanism.md`) |
| Pattern | P-COMPARISON-STRIP |

**Purpose:** contrast centralised / star / mesh topologies on resilience and
routing trade-offs.

**Props**

```ts
type ProtocolCompareProps = {};
```

**Data in**

- `TOPOLOGY_COMPARISON` from `src/lib/mesh.ts` — rows of qualitative cells.
- Three small inline-SVG diagrams (centralised, star, mesh).

**Accessibility**

- Real `<table>` with `<th scope>`; diagrams `aria-hidden`; meaning lives in the
  table text.

**Responsive**

- Table scrolls horizontally on narrow screens or reflows to stacked cards.

---

### `DeploymentMap`

| Field | Value |
|-------|-------|
| Path | `src/components/mesh/DeploymentMap.tsx` |
| Client | yes — `"use client"` (hover/focus callout) |
| Used in | § II (`03-field-today.md`) |
| Pattern | P-MAP-PINS (new) |

**Purpose:** locate real meshes on a first-party stylised world map.

**Props**

```ts
type DeploymentMapProps = {};
```

**Data in**

- `DEPLOYMENTS: Deployment[]` from `src/lib/mesh.ts`.

**Accessibility**

- `<svg role="img" aria-label="…">`; world outline `aria-hidden`; pins focusable
  links/buttons with labels; a parallel text list mirrors pins.

**Responsive**

- Aspect-ratio-locked SVG; pins ≥44px hit area; callout becomes inline on mobile;
  text list always present.

## Reused components

| Component | Configuration |
|-----------|---------------|
| `PageHeader` | index=`"04"`, kicker=`"On infrastructure"`, title/lede |
| `Reveal` | section chrome, ledes, panels — delays 0.08 / 0.15 |
| `SourceOutboundLink` | all external links (sources + map pins) |

## Data module (`src/lib/mesh.ts`)

```ts
export type MeshNode = { id: string; x: number; y: number;
  role?: "client" | "gateway" };
export type MeshLink = { a: string; b: string };
export type MeshTopology = { nodes: MeshNode[]; links: MeshLink[] };

export const MESH_TOPOLOGY: MeshTopology;          // deterministic, ~36 nodes
export function route(t: MeshTopology, failed: Set<string>):
  { path: string[]; hops: number; reachable: boolean };  // Dijkstra/BFS over live links

export type Deployment = { name: string; country: string; scale: string;
  protocol: string; yearFounded: number | null; url: string; x: number; y: number };
export const DEPLOYMENTS: Deployment[];            // C-30..C-33

export type CompareRow = { metric: string;
  centralised: string; star: string; mesh: string };
export const TOPOLOGY_COMPARISON: CompareRow[];    // C-10..C-13

export type PhyRow = { name: string; rate: string; range: string; note: string };
export const PHY_LAYERS: PhyRow[];                 // C-01..C-05
```

All numbers trace to `research/mesh-networks/numbers-and-units.md`.

## Static assets

None — topology generated in `mesh.ts` deterministically (seeded), so SSR/CSR
agree without `public/data/`.

## Page orchestration notes

`src/app/mesh-networks/page.tsx` stays a Server Component: metadata, PageHeader,
prose, `#sources`, and imports of the three client interactives. Series III entry
added to `src/lib/concepts.ts`.
