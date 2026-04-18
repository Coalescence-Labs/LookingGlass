---
title: Concept — Mesh networks (and what we'd build if the stack fell)
status: not-started
category: concept
effort: L
series: "III — Everyday machines"
last-updated: 2026-04-17
---

## Context

Two ambitions in one piece, explicitly labeled so the reader always
knows which they're reading:

1. **The mechanism.** How a mesh network actually works: multi-hop
   routing, the difference between reactive protocols (AODV) and
   proactive ones (OLSR, BATMAN-adv), delay-tolerant networking for
   non-reliable links, and the physical-layer trade-offs of LoRa vs
   Wi-Fi mesh vs 802.15.4. Real deployments today (NYC Mesh, Guifi,
   Freifunk, Meshtastic community nodes, Reticulum).
2. **The speculation.** A grounded thought experiment: if the
   centralised stack (cell networks, trans-Atlantic fibre, consumer
   ISPs) vanished tomorrow, what would a bottom-up rebuild actually
   look like? What's salvageable? What protocols scale? What security
   and identity models survive without a CA system?

Cultural ether the piece draws from (credited, not copied):

- *Pantheon* (AMC+/Netflix, 2022–2023, creator Craig Silverstein) —
  Maddie's mesh-network arc in Season 2 is the most serious piece of
  screen fiction about decentralised post-cloud infrastructure in
  years. Reference it as inspiration; **do not** lift dialogue, frame
  grabs, or visual designs.
- The 2025–2026 cyberpunk revival on TikTok and Are.na — "what does a
  patched-together, post-everything tech stack look like" aesthetic.
  Describe the vibe in our own words; never scrape or embed content.
- The cypherpunk lineage (May, Hughes, cypherpunk mailing list) and
  Cory Doctorow's *Walkaway* (2017) for the political imagination of
  resilient bottom-up infrastructure.

## Goal

Ship `/mesh-networks` as a Concept in Series III. The piece reads as a
single editorial with two clearly-labeled halves: "What a mesh
actually is" and "What a mesh could be." Centrepiece is an interactive
mesh topology where the reader can delete nodes and watch traffic
reroute — or fail — in real time.

## Approach

1. **Research.** Write `research/mesh-networks.md` with:
   - Protocol specs cited (RFC 3561 for AODV, RFC 3626 for OLSR,
     BATMAN-adv documentation).
   - Three real deployments studied in depth (NYC Mesh — community
     ISP; Guifi.net — Catalan mesh at ~40k nodes; Meshtastic — LoRa
     hobbyist network).
   - A section on *Pantheon*'s mesh treatment: what's technically
     grounded in the show, what's dramatic license.
   - A short "cyberpunk aesthetic" note on the 2025–26 revival,
     written from observation — which sub-genres, which themes, which
     are reaches toward something real.

2. **Data.** `src/lib/mesh.ts`:
   - Typed topology: `{ nodes: Node[]; links: Link[] }` with spatial
     positions so the topology can render deterministically.
   - Routing function: given source, destination, failed nodes →
     shortest path (Dijkstra over active links). Used by the
     interactive demo.
   - Reference deployment data: `{ name, country, nodeCount, protocol,
     yearFounded, url }[]`.

3. **Visuals.**
   - **`TopologyDemo`** — 30–60 node graph on a spatial layout. Click a
     node to simulate failure; the routed path from a designated
     "client" to a designated "gateway" re-computes and re-draws. Show
     hop count and whether reachability held.
   - **`ProtocolCompare`** — side-by-side of centralised, star, and
     mesh topologies with a latency/resilience trade-off matrix.
   - **`DeploymentMap`** — simplified world map with pins on the real
     meshes studied. No external tile provider; render a stylised
     SVG projection ourselves.
   - All state-driven CSS transitions; follow `Reveal` pattern. No
     Motion 12 `whileInView` due to the known Next 16 / React 19
     hydration bug.

4. **Page structure.**
   - PageHeader (kicker "On infrastructure").
   - **Short answer** — one-sentence definition; what a mesh is not.
   - **§ I — The mechanism.** Physical layer → routing → identity →
     failure modes. Includes `TopologyDemo` + `ProtocolCompare`.
   - **§ II — The field today.** `DeploymentMap`; three paragraphs on
     NYC Mesh, Guifi, Meshtastic.
   - **§ III — The thought experiment.** Clearly labeled "Speculative
     — not reportage." What a bottom-up rebuild could reasonably look
     like: LoRa long-haul backbones, BATMAN-adv for neighbourhood
     density, delay-tolerant sneakernet for trans-regional traffic,
     a web-of-trust identity layer replacing CAs. What doesn't
     survive: streaming-grade latency, CDN-era web apps, centralised
     payments.
   - **§ IV — Credits and inspirations.** Name-check *Pantheon*, the
     cyberpunk revival, Doctorow's *Walkaway*, cypherpunk lineage.
     Explain what was lifted as *inspiration* and what was invented
     here.
   - Sources & notes.

5. **Labeling discipline.** Any sentence in § III that is not
   technically verifiable today needs to read as speculation. Use
   framing like "a plausible rebuild would…", "one answer that
   survives the constraints is…". Never conflate future scenarios with
   current fact.

## Files

**Create:**
- `research/mesh-networks.md`
- `src/lib/mesh.ts` — topology, routing, deployment data.
- `src/components/mesh/TopologyDemo.tsx`
- `src/components/mesh/ProtocolCompare.tsx`
- `src/components/mesh/DeploymentMap.tsx`
- `src/app/mesh-networks/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry (Series III).

## Acceptance

- [ ] `bun run lint` and `bun run build` both clean.
- [ ] Interactive topology: deleting a bridge node changes the routed
      path; deleting enough nodes marks the destination unreachable.
- [ ] Every technical claim in §§ I–II cites a protocol spec or
      deployment's own docs.
- [ ] § III is unambiguously labeled speculation. A reader can't
      accidentally quote a future scenario as fact.
- [ ] *Pantheon*: credited as inspiration; no dialogue, frames, or
      character designs appear on the page.
- [ ] Cyberpunk TikTok / Are.na references are described in our own
      prose; nothing scraped or embedded.
- [ ] Reduced-motion collapses routing animations; the static
      topology remains readable.
- [ ] Landing page groups the concept under **Series III**.

## Cross-references

- Works as a thematic sibling to the future "adaptive music" piece
  (`plans/concepts/adaptive-music.md`) — both about systems that only
  become themselves at runtime.
- A future piece on *identity without certificate authorities* (web of
  trust, key transparency) could branch from § III.

## References

### Protocol specs
- RFC 3561 — AODV routing. https://datatracker.ietf.org/doc/html/rfc3561
- RFC 3626 — OLSR. https://datatracker.ietf.org/doc/html/rfc3626
- B.A.T.M.A.N-adv — https://www.open-mesh.org/projects/batman-adv/wiki
- LoRaWAN spec — https://lora-alliance.org/resource_hub/lorawan-specification-v1-1/
- Reticulum Network Stack — https://reticulum.network/

### Real deployments
- NYC Mesh — https://www.nycmesh.net/
- Guifi.net — https://guifi.net/
- Freifunk — https://freifunk.net/
- Meshtastic — https://meshtastic.org/

### Inspirations (not lifted)
- *Pantheon* (AMC+/Netflix, 2022–2023), dir. Craig Silverstein.
  Maddie's Season 2 arc.
- Cory Doctorow, *Walkaway* (2017). Tor Books.
- Cypherpunk mailing list archive — https://mailing-list-archive.cryptoanarchy.wiki/
- 2025–26 cyberpunk revival on TikTok / Are.na — describe in our own
  words; do not scrape.

### Internal
- `src/components/motion/Reveal.tsx` — motion pattern.
- `src/app/one-million-tokens/page.tsx` — page rhythm.
