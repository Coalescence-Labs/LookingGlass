---
topic: "The field today — real mesh deployments"
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 04
related-chunks:
  - 01-physical-layer.md
  - 02-routing-protocols.md
---

## Summary

Mesh networking isn't a thought experiment — it runs at three very different
scales. **Guifi.net** (Catalonia, since 2004) is the giant: ~37,600 working
nodes and ~73,000 km of links, a commons-owned regional network. **NYC Mesh**
(since 2014) is a volunteer-run community ISP: ~70 hubs and a handful of
data-centre supernodes, OSPF inside and BGP at the edges, 450+ installs in 2024
alone. **Meshtastic** (since 2020) is the hobbyist LoRa mesh: cheap radios,
managed flooding, a ~30-packet buffer, encrypted channels — no internet
required. **Freifunk**, the German free-network movement, is where BATMAN was
born. Together they bracket what "a mesh" can mean: a continent-scale commons,
a borough-scale ISP, and a backpack-scale off-grid net.

## Method

- Guifi.net network statistics (growthmap), read 2026-06-17 — 37,652 working nodes; 73,133 km total wireless links.
- Wikipedia, *Guifi.net*, read 2026-06-17 — "over 37,000 active nodes, ~71,000 km" (Dec 2021); Catalonia/Valencia; founded 2004.
- NYC Mesh — Hubs wiki + Supernode docs + site + 2024 Year in Review, read 2026-06-17 — ~70 hubs, supernodes in data centres, OSPF/BGP, NAT 10.0.0.0/8, 40 Gbit uplink, 450+ installs.
- Meshtastic, *Overview* (docs), read 2026-06-17 — managed flooding, ~30-packet store, channels/PSK.
- Wikipedia, *B.A.T.M.A.N.*, read 2026-06-17 — Freifunk origin.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-30 | Guifi.net: ~37,652 working nodes, ~73,133 km of wireless links; mostly Catalonia/Valencia; founded 2004 | high | Guifi stats | Wikipedia Guifi | Date the figure (mid-2026) |
| C-31 | NYC Mesh: volunteer community ISP; ~70 hubs + data-centre supernodes; OSPF internal, BGP at edges; 450+ installs in 2024; founded 2014 | high | NYC Mesh wiki/docs | NYC Mesh 2024 review | Supernode 40 Gbit uplink |
| C-32 | Meshtastic: open-source LoRa hobby mesh; managed flooding; ~30-packet store; encrypted channels | high | Meshtastic docs | — | First released 2020 |
| C-33 | Freifunk (German free-network movement) is the birthplace of BATMAN | high | Wikipedia BATMAN | — | OLSR replacement |

## Findings

### 1. Guifi.net — the continental commons (C-30)

Guifi.net began in 2004 in Osona, Catalonia, when rural users built their own
wireless links rather than wait for an ISP. It is now the largest community
network on earth: its live stats show ~37,652 *working* nodes (plus tens of
thousands planned/inactive) and ~73,133 km of wireless links, overwhelmingly in
Catalonia and the Valencian Community. It's governed as a commons — open,
neutral, user-built — and demonstrates that telecom infrastructure can be held
collectively at regional scale.

### 2. NYC Mesh — the volunteer ISP (C-31)

NYC Mesh (founded 2014) is structured more like an ISP than an ad-hoc cloud.
Member rooftops get antennas; nodes aggregate into ~70 *hubs*; hubs connect to a
few *supernodes* sitting in data centres, which peer with the wider internet
over BGP and inject a default route into the mesh's internal OSPF. Supernodes
NAT the mesh's private 10.0.0.0/8 space to public addresses; one supernode runs
a 40 Gbit uplink. In 2024 the all-volunteer org logged 1,852 join requests and
450+ installs. It is deliberately neutral — no user-data collection. (The NYC
*Meshtastic* community at nyme.sh is a separate, LoRa-based project.)

### 3. Meshtastic — the off-grid hobby mesh (C-32)

Meshtastic (2020) runs on cheap LoRa radios paired to a phone over Bluetooth. It
doesn't compute routes: a node rebroadcasts any packet it hasn't already seen,
decrementing a hop limit, retrying up to three times if it hears no
acknowledgement. Each radio buffers ~30 packets when no client is attached.
Channels are encrypted with a pre-shared key. It needs no internet, no
infrastructure, and no permission — the lower bound of what counts as a mesh.

### 4. Freifunk — where the protocol came from (C-33)

Freifunk is Germany's free-network movement, a federation of local community
networks. It matters here because BATMAN — the layer-2 mesh routing protocol now
in the Linux kernel — was created inside Freifunk to replace OLSR at large
scale.

## Discrepancies

| Claim ID | Source A says | Source B says | Recommended for page | Rationale |
|----------|---------------|---------------|----------------------|-----------|
| C-30 | Live stats (2026): 37,652 working / 73,133 km | Wikipedia (Dec 2021): >37,000 / ~71,000 km | Use ~37,600 working nodes, ~73,000 km, dated "mid-2026" | Live operator data is most current |

## Implications for the article

- `DeploymentMap` pins: Guifi (Catalonia), NYC Mesh (New York), Meshtastic
  (global/distributed), Freifunk (Germany).
- Lib `DEPLOYMENTS` records: name, country, nodeCount (or "—" where N/A),
  protocol, yearFounded, url. Node counts: Guifi ~37,600; NYC Mesh ~70 hubs
  (use hubs, not member count); Meshtastic/Freifunk are federations — use "—"
  or a descriptor rather than a false precise number.
- § II prose: continental commons / borough ISP / backpack net framing.

## Sources

1. Guifi.net — network statistics. https://guifi.net/en/guifi/menu/stats/growthmap
2. Wikipedia — *Guifi.net*. https://en.wikipedia.org/wiki/Guifi.net
3. NYC Mesh — *Hubs* (wiki). https://wiki.nycmesh.net/books/5-networking/page/hubs
4. NYC Mesh. https://www.nycmesh.net/
5. Meshtastic — *Overview*. https://meshtastic.org/docs/overview/
6. Wikipedia — *B.A.T.M.A.N.* https://en.wikipedia.org/wiki/B.A.T.M.A.N.

## Open questions

- [ ] NYC Mesh "active node" count is fuzzy (member installs vs nodes); use the
  firmer ~70-hubs figure on the page and describe scale qualitatively.
