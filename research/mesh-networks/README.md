---
topic: "Mesh networks (and what we'd build if the stack fell)"
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
agent: cursor
status: draft
slug: mesh-networks
---

## Summary

A mesh network carries traffic by relaying it node-to-node instead of routing
everything through a central tower or exchange. Two questions organise the
research. **First, the mechanism:** the physical layer sets the trade (LoRa
buys range with bandwidth — 0.3–50 kbps over tens of km; IEEE 802.15.4 buys
years of battery with 250 kbit/s over tens of metres; Wi‑Fi mesh buys
throughput at the cost of reach). On top of the radio, routing protocols
split into *reactive* (AODV — RFC 3561, find a route only when you need it),
*proactive* (OLSR — RFC 3626, and BATMAN‑adv, keep routes ready in advance),
and *delay‑tolerant* (DTN — RFC 4838/5050, store‑carry‑forward when no end‑to‑end
path exists). Identity is the quiet hard part: without certificate
authorities, real systems fall back to a web of trust (PGP) or
cryptographic‑identity stacks like Reticulum (destinations are truncated
SHA‑256 hashes of public keys). Three deployments prove it works at very
different scales — Guifi.net (~37.6k working nodes), NYC Mesh (~70 hubs +
supernodes, a volunteer ISP), Meshtastic (LoRa hobby mesh, managed flooding).

**Second, the speculation:** if the centralised stack vanished, a grounded
rebuild reuses exactly these pieces — LoRa for long‑haul, BATMAN‑adv for
neighbourhood density, DTN sneakernet across regions, web‑of‑trust identity.
What does not survive: streaming‑grade latency, CDN‑era apps, centralised
payments. § III on the page must be labelled speculation throughout.

## Research questions

1. What does the physical layer choose for you? (LoRa vs 802.15.4 vs Wi‑Fi mesh)
2. How does multi-hop routing actually work — reactive, proactive, delay‑tolerant?
3. How do you do identity and security without certificate authorities?
4. What do real mesh deployments look like at small, medium, and large scale?
5. What did *Pantheon* and the cyberpunk revival get right, and where's the licence?
6. What would a grounded bottom-up rebuild of the stack actually look like?

## Chunk index

| File | Scope | Status |
|------|-------|--------|
| `01-physical-layer.md` | LoRa, 802.15.4, Wi‑Fi mesh — the range/bandwidth/power trade | draft |
| `02-routing-protocols.md` | Reactive (AODV), proactive (OLSR, BATMAN‑adv), DTN, and why we model with Dijkstra | draft |
| `03-identity-and-security.md` | CA/PKI vs web of trust vs Reticulum cryptographic identity | draft |
| `04-deployments.md` | Guifi.net, NYC Mesh, Meshtastic, Freifunk | draft |
| `05-pantheon-and-culture.md` | *Pantheon*, *Walkaway*, cypherpunk lineage, cyberpunk revival | draft |
| `06-speculative-rebuild.md` | The grounded thought experiment for § III | draft |
| `numbers-and-units.md` | Quantified claims ledger | draft |
| `visuals-and-data.md` | TopologyDemo / ProtocolCompare / DeploymentMap data needs | draft |

## Source map

Each Tier A/B source listed once; chunks cite by short name.

| Short name | Tier | Type | URL / citation | Cited in chunks |
|------------|------|------|----------------|-----------------|
| RFC 3561 (AODV) | A | IETF standard | https://datatracker.ietf.org/doc/html/rfc3561 | 02 |
| RFC 3626 (OLSR) | A | IETF standard | https://datatracker.ietf.org/doc/html/rfc3626 | 02 |
| RFC 4838 (DTN arch) | A | IETF informational | https://datatracker.ietf.org/doc/html/rfc4838 | 02, 06 |
| RFC 9171 (BPv7) | A | IETF standard | https://datatracker.ietf.org/doc/html/rfc9171 | 02, 06 |
| LoRa Alliance — LoRaWAN 1.0.3 | A | spec | https://lora-alliance.org/wp-content/uploads/2020/11/lorawan1.0.3.pdf | 01 |
| Semtech — LoRa & LoRaWAN | A | vendor primer | https://www.semtech.com/uploads/technology/LoRa/lora-and-lorawan.pdf | 01 |
| Lee & Choi 2020 (LoRa SF) | B | peer-reviewed (Sensors) | https://pmc.ncbi.nlm.nih.gov/articles/PMC7070984/ | 01 |
| IEEE 802.15.4‑2006 | A | IEEE standard | https://people.ece.ubc.ca/edc/7860/data/802.15.4-2006.pdf | 01 |
| Reticulum Manual | A | project docs | https://reticulum.network/manual/understanding.html | 03, 06 |
| Wikipedia — Web of trust | B | encyclopaedia | https://en.wikipedia.org/wiki/Web_of_trust | 03, 06 |
| Wikipedia — B.A.T.M.A.N. | B | encyclopaedia (cites kernel docs) | https://en.wikipedia.org/wiki/B.A.T.M.A.N. | 02, 04 |
| Wikipedia — Delay-tolerant networking | B | encyclopaedia (cites RFCs) | https://en.wikipedia.org/wiki/Delay-tolerant_networking | 02, 06 |
| Guifi.net — network stats | A | operator data | https://guifi.net/en/guifi/menu/stats/growthmap | 04, numbers |
| Wikipedia — Guifi.net | B | encyclopaedia | https://en.wikipedia.org/wiki/Guifi.net | 04 |
| NYC Mesh — Hubs wiki | A | operator docs | https://wiki.nycmesh.net/books/5-networking/page/hubs | 04 |
| NYC Mesh — site | A | operator | https://www.nycmesh.net/ | 04 |
| Meshtastic — Overview | A | project docs | https://meshtastic.org/docs/overview/ | 01, 02, 03, 04 |
| Wikipedia — Pantheon (TV series) | B | encyclopaedia | https://en.wikipedia.org/wiki/Pantheon_(TV_series) | 05 |
| Wikipedia — Cypherpunk | B | encyclopaedia | https://en.wikipedia.org/wiki/Cypherpunk | 05 |
| Wikipedia — Walkaway (novel) | B | encyclopaedia | https://en.wikipedia.org/wiki/Walkaway_(Doctorow_novel) | 05 |

## Claim ledger (page-worthy)

| ID | Claim (short) | Value / note | Chunk | Safe for page |
|----|---------------|--------------|-------|---------------|
| C-01 | LoRaWAN data rate | 0.3–50 kbps | 01 | yes |
| C-02 | LoRa modulation | CSS, SF7–SF12 | 01 | yes |
| C-03 | LoRa range | ~2–5 km urban; 15–20 km rural LOS | 01 | yes — hedge |
| C-04 | 802.15.4 2.4 GHz PHY | 250 kbit/s, O‑QPSK/DSSS, 127‑byte frame | 01 | yes |
| C-05 | 802.15.4 range | ~10–100 m | 01 | yes — hedge |
| C-10 | AODV is reactive | on-demand RREQ/RREP; seq numbers for loop freedom | 02 | yes |
| C-11 | OLSR is proactive | link-state via MPRs; routes kept ready | 02 | yes |
| C-12 | BATMAN-adv | layer 2; no node holds full topology; OGMs; in Linux since 2.6.38 | 02 | yes |
| C-13 | DTN | store-carry-forward; Bundle Protocol RFC 4838/5050/9171 | 02 | yes |
| C-15 | Meshtastic routing | managed flooding, not shortest-path | 02 | yes |
| C-20 | CA/PKI centralised | browsers ship 100+ root certs | 03 | yes |
| C-21 | Web of trust | decentralised; PGP, Zimmermann 1992 | 03 | yes |
| C-22 | Reticulum identity | 128-bit truncated SHA-256 destinations; ECC+AES; no CA | 03 | yes |
| C-30 | Guifi.net scale | ~37,652 working nodes; ~73,133 km links | 04 | yes |
| C-31 | NYC Mesh | volunteer ISP; ~70 hubs + supernodes; OSPF/BGP; 450+ installs 2024 | 04 | yes |
| C-32 | Meshtastic | open-source LoRa hobby mesh; ~30-packet store | 04 | yes |
| C-33 | Freifunk / origin | German community nets; birthplace of BATMAN | 04 | yes |
| C-40 | Pantheon | AMC+ 2022 / Prime 2023; Silverstein; Ken Liu; S2 "Lilypad" intranet | 05 | yes |
| C-41 | Walkaway | Cory Doctorow, 2017, Tor Books | 05 | yes |
| C-42 | Cypherpunk lineage | May, Hughes, Gilmore; Manifesto 1993 | 05 | yes |

## Recommended article outline

1. **Short answer** — what a mesh is / is not. Claims C-10..C-13.
2. **§ I — The mechanism** — physical layer (C-01..C-05) → routing
   (C-10..C-15) → identity (C-20..C-22) → failure modes. Hosts `TopologyDemo`
   and `ProtocolCompare`.
3. **§ II — The field today** — `DeploymentMap` + prose on Guifi / NYC Mesh /
   Meshtastic / Freifunk (C-30..C-33).
4. **§ III — The thought experiment** — labelled speculation; builds on
   06-speculative-rebuild.md.
5. **§ IV — Credits & inspirations** — C-40..C-42, *no lifted content*.
6. **Sources & notes** — from Source map.

## Visual / data brief

See `visuals-and-data.md`. Short version:

| Visual | Purpose | Key claims | Data available? |
|--------|---------|------------|-----------------|
| TopologyDemo | Show multi-hop reroute/failure when nodes die | C-10, C-14 | yes — synthesise deterministic topology + Dijkstra |
| ProtocolCompare | Centralised vs star vs mesh trade-offs | C-10..C-13 | yes — qualitative matrix |
| DeploymentMap | Locate real meshes | C-30..C-33 | yes — hand-placed SVG coords |

## Discrepancies (cross-chunk)

1. **Guifi node count** drifts by snapshot date: Wikipedia "over 37,000 / ~71,000 km
   (Dec 2021)"; live stats June 2026 "37,652 working / 73,133 km". Use the
   live-stats figure and date it ("~37,600 working nodes, mid-2026").
2. **LoRa range** varies wildly by terrain. Cite a band (urban vs rural LOS),
   never a single hero number.

## Open questions

1. **[nice-to-have]** Exact 802.11s throughput/range figures — page treats
   Wi‑Fi mesh qualitatively via NYC Mesh gear instead, so non-blocking.
2. **[nice-to-have]** Precise founding years for each deployment — sourced to
   Wikipedia/operator at medium confidence; page hedges with "since the 2000s"
   where exactness is uncertain.

## Handoff notes

Branch `plan/mesh-networks`. All page numbers must trace to a claim ID here.
§ III is speculation and must be framed as such on the page.
