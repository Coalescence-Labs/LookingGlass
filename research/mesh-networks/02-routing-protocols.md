---
topic: "Routing — reactive, proactive, and delay-tolerant"
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 02
related-chunks:
  - 01-physical-layer.md
  - 03-identity-and-security.md
---

## Summary

Once packets can hop, something has to decide *which* hop. Three philosophies
divide the field. **Reactive** protocols (AODV, RFC 3561) discover a route only
when there's traffic for it, flooding a Route Request and waiting for a Reply;
cheap when idle, latent on first use. **Proactive** protocols (OLSR, RFC 3626;
BATMAN‑adv) keep routes ready at all times by gossiping continuously; instant to
use, constant chatter. **Delay-tolerant** networking (DTN, RFC 4838/5050/9171)
gives up on end-to-end paths entirely and stores-carries-forwards bundles until
a link appears. The article's interactive models routing as Dijkstra
shortest-path over the *currently live* links — a deliberate teaching
abstraction; real meshes compute paths in a distributed way, and some (like
Meshtastic) just flood.

## Method

- IETF RFC 3561 (AODV), read 2026-06-17 — reactive operation, RREQ/RREP/RERR, destination sequence numbers.
- IETF RFC 3626 (OLSR), read 2026-06-17 — proactive link-state, multipoint relays (MPRs), partial topology flooding.
- Wikipedia, *B.A.T.M.A.N.* (cites Linux kernel docs), read 2026-06-17 — layer-2 routing, OGMs, decentralised topology knowledge, kernel since 2.6.38.
- Wikipedia, *Delay-tolerant networking* (cites RFC 4838/5050/9171), read 2026-06-17 — store-carry-forward; AODV/DSR fail without end-to-end path.
- Meshtastic, *Overview* (docs), read 2026-06-17 — managed flooding, hop limit, duplicate suppression.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-10 | AODV is reactive: routes discovered on demand via RREQ/RREP; destination sequence numbers guarantee loop freedom | high | RFC 3561 | — | "Ad hoc On-Demand Distance Vector" |
| C-11 | OLSR is proactive link-state; multipoint relays cut flooding overhead | high | RFC 3626 | — | Routes always ready |
| C-12 | BATMAN-adv routes at layer 2; no single node holds the full topology; uses originator messages; in mainline Linux since 2.6.38 | high | Wikipedia BATMAN (kernel docs) | — | "best direction," not full path |
| C-13 | DTN store-carry-forwards bundles; classic AODV/DSR can't form routes without an end-to-end path | high | Wikipedia DTN | RFC 4838 | Bundle Protocol RFC 9171 (BPv7) |
| C-14 | Dijkstra shortest-path over live links is a valid teaching model for "the route reroutes / fails" | high | (modelling choice) | — | Real meshes are distributed |
| C-15 | Meshtastic uses managed flooding, not shortest-path routing | high | Meshtastic docs | — | Rebroadcast-if-unseen, hop limit |

## Findings

### 1. Reactive — AODV asks only when it must (C-10)

AODV ("Ad hoc On-Demand Distance Vector," RFC 3561) keeps no route it isn't
using. When a node needs to reach a new destination, it *broadcasts* a Route
Request (RREQ); the request floods outward, range-limited by a TTL, until it
reaches the destination or a node with a fresh route, which returns a Route
Reply (RREP). Route Errors (RERR) tear down broken paths. Destination sequence
numbers ensure the protocol never forms a loop. The trade: near-zero overhead
when idle, but a discovery delay the first time you talk to someone new.

### 2. Proactive — OLSR and BATMAN keep the map warm (C-11, C-12)

OLSR (RFC 3626) is the opposite stance: every node continuously exchanges
topology information so a route is always ready. Its key optimisation is the
*multipoint relay* — each node designates a subset of neighbours to forward its
broadcasts, so link-state floods don't blow up. BATMAN-adv, born in the German
Freifunk community to replace OLSR at scale, goes further: it routes at OSI
layer 2 and deliberately *decentralises knowledge* — no node holds the whole
topology. Each node only learns the best *direction* toward a destination by
counting originator messages (OGMs) and noting which neighbour they arrived
through, then hands the packet one hop that way. batman-adv has shipped in the
mainline Linux kernel since 2.6.38.

### 3. Delay-tolerant — when there's no path at all (C-13)

Sometimes there's no contemporaneous end-to-end path — sparse nodes, deep
space, a town reachable only when someone drives between them. Reactive and
proactive protocols both fail here because both assume a route can exist *now*.
DTN (RFC 4838) instead stores a *bundle*, carries it physically or opportunistically,
and forwards it when a link appears — "store, carry, forward." The Bundle
Protocol (RFC 5050, now BPv7 / RFC 9171) is the standard; it began as the
Interplanetary Internet and now also describes terrestrial sneakernet.

### 4. Why the interactive uses Dijkstra (C-14, C-15)

The page's `TopologyDemo` computes the route as a *shortest path over the
currently active links* (Dijkstra). This is honest as a teaching device: it
shows exactly what every routing family is trying to approximate — get the
packet from client to gateway over surviving links, and report failure when no
path remains. It is **not** a claim that meshes run centralised Dijkstra. Note
the contrast explicitly: Meshtastic, the most popular hobby mesh, doesn't
compute paths at all — it floods, rebroadcasting any packet it hasn't seen and
decrementing a hop limit until it expires.

## Implications for the article

- Short answer can lean on the reactive/proactive/DTN trichotomy.
- `ProtocolCompare` matrix: discovery latency vs idle overhead vs partition tolerance.
- Add a `#sources` note clarifying Dijkstra is a model, real protocols differ (C-14/C-15) — protects accuracy.

## Sources

1. IETF — RFC 3561, *Ad hoc On-Demand Distance Vector (AODV) Routing*. https://datatracker.ietf.org/doc/html/rfc3561
2. IETF — RFC 3626, *Optimized Link State Routing Protocol (OLSR)*. https://datatracker.ietf.org/doc/html/rfc3626
3. IETF — RFC 4838, *Delay-Tolerant Networking Architecture*. https://datatracker.ietf.org/doc/html/rfc4838
4. IETF — RFC 9171, *Bundle Protocol Version 7*. https://datatracker.ietf.org/doc/html/rfc9171
5. Wikipedia — *B.A.T.M.A.N.* https://en.wikipedia.org/wiki/B.A.T.M.A.N.
6. Wikipedia — *Delay-tolerant networking*. https://en.wikipedia.org/wiki/Delay-tolerant_networking
7. Meshtastic — *Overview*. https://meshtastic.org/docs/overview/

## Open questions

- [ ] None blocking.
