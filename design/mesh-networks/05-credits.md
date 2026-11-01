---
section: "§ IV — Credits & inspirations + Sources"
pattern: L-CARD-GRID
research-chunks:
  - research/mesh-networks/05-pantheon-and-culture.md
claim-ids: [C-40, C-41, C-42]
status: draft
---

## Teaching goal

The reader sees the cultural lineage credited honestly, and understands the
no-lift discipline: inspiration named, nothing scraped.

## Layout

`shell pb-24 md:pb-32`. Chrome `§ IV` + heading + tag `Credits`. A short intro
sentence, then a `grid md:grid-cols-2 gap-…` of small credit cards
(`L-CARD-GRID`), one per inspiration. Then the standard **Sources & notes**
section (`id="sources"`, `pb-28`).

Mobile: cards stack.

## Content

### Credit cards (original prose; describe, don't quote)

1. **Pantheon** — the most serious recent screen treatment of post-cloud,
   decentralised infrastructure; its Season 2 "Lilypad" intranet mirrors this
   article's thought experiment. Inspiration only — no dialogue, frames, or
   designs (`C-40`).
2. **Walkaway** (Cory Doctorow, 2017) — the political imagination of resilient,
   collectively-built infrastructure (`C-41`).
3. **The cypherpunks** — May, Hughes, Gilmore; the idea that trust can be built
   from cryptography rather than granted by authority (`C-42`).
4. **The 2025–26 cyberpunk revival** — salvaged-hardware, post-everything mood,
   described in our own words; nothing embedded or scraped.

### Sources & notes (`id="sources"`)

Two columns (`md:grid-cols-2`):

- **Protocols & standards** — RFC 3561, RFC 3626, RFC 4838, RFC 9171, LoRa
  Alliance, IEEE 802.15.4, Reticulum manual — `SourceOutboundLink` each.
- **Deployments & methodology** — Guifi stats, NYC Mesh, Meshtastic, BATMAN/
  Freifunk; plus methodology notes:
  - Dijkstra in the demo is a teaching model; real meshes route in a distributed
    way and Meshtastic floods (`C-14`,`C-15`).
  - The topology is a synthetic, illustrative layout — not a real deployment.
  - § III is speculation, clearly labelled.
  - Pantheon and the cyberpunk revival are credited as inspiration; no
    third-party content is reproduced.
  - Verified date line: "Verified June 2026".

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Section chrome | M-REVEAL | 0 |
| Credit cards | M-REVEAL stagger | i*0.08 |
| Sources | M-REVEAL | 0.08 |

## Acceptance (section-level)

- [ ] Pantheon credited; no lifted dialogue/frames/designs.
- [ ] Cyberpunk references in our own prose; nothing scraped.
- [ ] Every major claim category has a primary source link.
