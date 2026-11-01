---
topic: "Visuals and data — what the interactives need"
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
agent: cursor
status: draft
chunk: visuals
related-chunks:
  - 02-routing-protocols.md
  - 04-deployments.md
---

## Summary

Three first-party visuals, all rendered in-house (SVG + state-driven CSS
transitions, no external tile providers, no Motion `whileInView` for
content-critical elements per the Next 16 / React 19 hydration note). Data is
either synthesised deterministically (topology) or hand-placed (map coords).

## 1. TopologyDemo (centrepiece)

**Teaching goal:** a reader who deletes nodes *sees* multi-hop routing reroute,
and *sees* it fail when the graph partitions — the thing prose can't convey.

- **Data:** synthetic topology of ~36 nodes on a fixed 2D grid-ish layout with
  small deterministic jitter (seeded, no randomness at runtime so SSR/CSR match).
  Links connect nodes within a radius. One node tagged `client`, one `gateway`.
- **Interaction:** click/tap a node → toggle it "failed." Recompute the route
  from client → gateway with **Dijkstra over active links** (hop-count weights).
  Redraw the path; show hop count and a reachable/unreachable status.
- **Honesty note (→ `#sources`):** Dijkstra is a teaching model; real meshes
  route in a distributed way (AODV/OLSR/BATMAN), and Meshtastic floods (C-14,
  C-15).
- **Reduced motion:** path redraw is instant (no animated dash) under
  `prefers-reduced-motion`; static topology stays fully readable.
- **A11y:** each node is a `<button>` with `aria-label` ("Node N, active/failed,
  click to toggle"); status announced via `aria-live`; reachability conveyed by
  text + icon, not colour alone.
- **Claims:** C-10, C-14, C-15.

## 2. ProtocolCompare

**Teaching goal:** the same payload behaves differently on a centralised vs star
vs mesh topology; surface the trade-offs.

- **Data:** small static matrix (qualitative) — topology × {single point of
  failure, path diversity, discovery latency, idle overhead, partition
  tolerance}. Three mini-diagrams (centralised hub, star, mesh) drawn as inline
  SVG.
- **Interaction:** optional — select a topology to highlight its row/diagram.
  Acceptable to be a static labelled comparison (no required state).
- **Claims:** C-10, C-11, C-12, C-13.

## 3. DeploymentMap

**Teaching goal:** these are real, and they're everywhere.

- **Data:** hand-placed pins on a stylised SVG world projection (no tiles). Each
  pin = one `DEPLOYMENTS` record (name, country, scale descriptor, protocol,
  year, url). Coords are illustrative, not geodetically exact (state in caption).
- **Pins:** Guifi.net (Catalonia), NYC Mesh (New York), Freifunk (Germany),
  Meshtastic (global/distributed — render as a diffuse marker or legend item).
- **A11y:** pins are focusable buttons / links with labels; the map SVG is
  `role="img"` with a description; a text list duplicates the pins for SR users.
- **Claims:** C-30, C-31, C-32, C-33.

## Shared rules

- Interactive panel chrome: `border border-line p-6 md:p-10`, background
  `rgba(15,15,18,0.6)` — matches live articles.
- All numerals trace to `numbers-and-units.md`.
- Colours from existing tokens (accent gold for the live path; bone/dim for
  inactive); never colour-only meaning.
