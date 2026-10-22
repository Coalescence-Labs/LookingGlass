---
section: "§ I — The mechanism"
pattern: P-GRAPH-SIM + P-COMPARISON-STRIP
research-chunks:
  - research/mesh-networks/01-physical-layer.md
  - research/mesh-networks/02-routing-protocols.md
  - research/mesh-networks/03-identity-and-security.md
claim-ids: [C-01, C-02, C-03, C-04, C-05, C-10, C-11, C-12, C-13, C-14, C-15, C-20, C-21, C-22]
status: draft
---

## Teaching goal

After § I the reader can (a) name the physical-layer trade, (b) tell reactive
from proactive from delay-tolerant routing, (c) understand identity without a
CA, and — through the interactive — *see* a route reroute and then fail.

This section is the first labelled half: **"What a mesh actually is."**

## Layout

`shell pb-24 md:pb-32`. Section chrome (`L-SECTION-CHROME`): `§ I` + heading +
right tag `Interactive`. Then four sub-beats in reading order:

1. **Physical layer** — prose + a compact 3-row trade table (LoRa / 802.15.4 /
   Wi‑Fi mesh). `grid md:grid-cols-3 gap-4` mini-cards.
2. **Routing** — prose + `ProtocolCompare` (centralised / star / mesh).
3. **The interactive** — `TopologyDemo` (centrepiece). Full-width panel.
4. **Identity** — prose + a two-column CA-vs-web-of-trust contrast.

Mobile: cards and compare strip stack to one column; topology panel scales to
full width with a horizontally-stable square SVG viewBox.

## Content

### Prose beats

- Physical layer is the first decision: LoRa = 0.3–50 kbps but tens of km
  (`C-01`,`C-03`); 802.15.4 = 250 kbit/s, ~10–100 m, years of battery
  (`C-04`,`C-05`); Wi‑Fi mesh = throughput at the cost of reach. Pick two of
  {range, bandwidth, power} (`C-02`).
- Routing splits three ways: AODV discovers on demand (`C-10`); OLSR/BATMAN keep
  routes ready, with BATMAN deliberately giving no node the full map (`C-11`,
  `C-12`); DTN stores-carries-forwards when there's no path at all (`C-13`).
- The demo models routing as shortest-path over live links — a teaching device;
  real meshes are distributed and Meshtastic just floods (`C-14`,`C-15`). Say so.
- Identity is the hard part: the web trusts 100+ CA roots (`C-20`); a mesh leans
  on a web of trust (`C-21`) or cryptographic identity like Reticulum, where a
  destination *is* a hash of a public key (`C-22`).

### Stat callouts

| Label | Value | Source claim |
|-------|-------|--------------|
| LoRa | 0.3–50 kbps · ~15 km LOS | C-01, C-03 |
| 802.15.4 | 250 kbit/s · ~10–100 m | C-04, C-05 |
| BATMAN-adv | in Linux since 2.6.38 | C-12 |

## Interactive spec — TopologyDemo (`P-GRAPH-SIM`, new)

### Reader actions

- Click / tap any node → toggle it failed (removed from the active graph).
- The route from the fixed `client` to the fixed `gateway` recomputes
  (Dijkstra over active links) and redraws.
- Readout shows: hop count, and **Reachable / Unreachable**.
- A "Reset" button restores all nodes.

### UI chrome

- Standard panel: `border border-line p-6 md:p-10`, bg `rgba(15,15,18,0.6)`.
- SVG graph fills the panel (responsive square-ish viewBox, e.g. 0 0 100 72).
- Live path drawn in accent gold; inactive links dim; failed nodes hollow/X.
- Readout row below: `type-mono-sm` labels + `type-numeral` hop count.

### Data

- `MESH_TOPOLOGY` from `src/lib/mesh.ts` — `{ nodes: Node[]; links: Link[] }`,
  generated deterministically (seeded), ~36 nodes.
- `route(topology, failed)` → `{ path: string[]; hops: number; reachable: boolean }`
  via Dijkstra over active links.

### Mobile & touch

- Nodes are ≥ ~28–44px touch targets (use an invisible larger hit area around
  the visual dot). Panel reflows; readout wraps.

### Accessibility

- Each node = `<button aria-label="Node 12, active — tap to fail" aria-pressed>`.
- Status line uses `aria-live="polite"` to announce hop count / reachability.
- Reachability shown by **text + icon**, not colour alone.
- `<svg role="img" aria-label="Mesh topology; client at lower-left, gateway at upper-right">`.

### Reduced motion

- No animated path dash; route updates instantly. Topology fully readable static.

## Interactive spec — ProtocolCompare (`P-COMPARISON-STRIP`)

- Three inline-SVG mini-diagrams: centralised hub, star, mesh.
- Static matrix: topology × {single point of failure, path diversity, discovery
  latency, idle overhead, partition tolerance}. Qualitative cells (text/●○).
- Optional: clicking a diagram highlights its column. Acceptable static.
- A11y: table is a real `<table>` with headers; diagrams `aria-hidden` with the
  table carrying the meaning.

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Section chrome | M-REVEAL | 0 |
| Intro lede | M-REVEAL | 0.08 |
| Cards / compare / topology | M-REVEAL (container) | 0.15 |
| Inside interactives | CSS transitions only | — |

## Cross-links

- Link "what falls out" idea to `/context-window` only if natural; not required.

## Acceptance (section-level)

- [ ] Deleting a bridge node changes the path; deleting enough marks Unreachable.
- [ ] Dijkstra-as-model caveat present (→ `#sources`).
- [ ] All physical-layer numbers trace to C-01..C-05.
- [ ] Reduced motion + keyboard verified.
