---
section: "§ II — The field today"
pattern: P-MAP-PINS
research-chunks:
  - research/mesh-networks/04-deployments.md
claim-ids: [C-30, C-31, C-32, C-33]
status: draft
---

## Teaching goal

After § II the reader knows mesh networks are real and running at three very
different scales — continental commons, borough ISP, backpack net.

Still part of the first labelled half ("What a mesh actually is").

## Layout

`shell pb-24 md:pb-32`. Chrome `§ II` + heading + tag `The field today`.
Then `DeploymentMap` (full-width panel) followed by three/four short prose
blocks, one per deployment, in a `grid md:grid-cols-2 gap-…` or stacked list.

Mobile: map scales full-width; deployment blocks stack.

## Content

### Prose beats

- Guifi.net: ~37,600 working nodes, ~73,000 km of links, a Catalan commons since
  2004 — proof a region can own its infrastructure (`C-30`).
- NYC Mesh: a volunteer ISP since 2014, ~70 hubs into data-centre supernodes,
  OSPF inside and BGP at the edge, 450+ installs in 2024 (`C-31`).
- Meshtastic: cheap LoRa radios, managed flooding, ~30-packet buffer, encrypted
  channels — a mesh in a backpack, no internet required (`C-32`).
- Freifunk: Germany's free-network movement, where BATMAN was born (`C-33`).

### Stat callouts

| Label | Value | Source claim |
|-------|-------|--------------|
| Guifi.net | ~37,600 nodes · ~73,000 km | C-30 |
| NYC Mesh | ~70 hubs · since 2014 | C-31 |
| Meshtastic | LoRa · since 2020 | C-32 |

## Interactive spec — DeploymentMap (`P-MAP-PINS`, new)

### Reader actions

- Hover / focus a pin → tooltip/callout with name, scale, protocol, year, link.
- Pins are also links to each project's site (`SourceOutboundLink`).

### Data

- `DEPLOYMENTS` from `src/lib/mesh.ts`: `{ name, country, scale, protocol,
  yearFounded, url, x, y }[]` — `x/y` are illustrative SVG coords on a stylised
  world projection (state "illustrative, not geodetic" in caption).

### UI chrome

- Standard panel. Stylised SVG world outline (hand-drawn paths, `aria-hidden`),
  pins as focusable buttons/links with accent dots.
- A **text list** of deployments duplicates the pins (SR + no-JS friendly and
  doubles as the § II prose anchor).

### Mobile & touch

- Map keeps aspect ratio; pins ≥ 44px hit area; tooltip becomes inline expansion
  or the text list carries it.

### Accessibility

- `<svg role="img" aria-label="Stylised world map with mesh-network locations">`.
- Each pin: `aria-label="Guifi.net — Catalonia, Spain"`.
- Country/scale conveyed in text, never colour alone.

### Reduced motion

- No pin pulse animation; pins static.

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Section chrome | M-REVEAL | 0 |
| Map panel | M-REVEAL | 0.15 |
| Deployment blocks | M-REVEAL stagger | i*0.06 |

## Cross-links

- Pins link out to operator sites via `SourceOutboundLink` (tracked).

## Acceptance (section-level)

- [ ] Four deployments present with sourced figures.
- [ ] Map is first-party SVG, no tile provider.
- [ ] Text list mirrors pins for a11y.
