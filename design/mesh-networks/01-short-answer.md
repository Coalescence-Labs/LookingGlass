---
section: "Short answer"
pattern: L-SHORT-ANSWER
research-chunks:
  - research/mesh-networks/02-routing-protocols.md
claim-ids: [C-10, C-11, C-13]
status: draft
---

## Teaching goal

After this section the reader understands that a mesh carries traffic by
relaying it node-to-node — there is no centre — and that the interesting
question is *how each node decides where to send the next hop*.

## Layout

`L-SHORT-ANSWER`: `shell pb-20 md:pb-28`, `border-t border-line pt-12`,
`grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16`.

- Left: `type-display-m` definition with `italic text-accent` on the load-bearing
  phrase ("relays it, hop by hop").
- Right: stat column — a hero numeral + the three routing stances.

Mobile: single column, stat block stacks under the definition.

## Content

### Prose beats

1. A mesh is a network with no centre: every node is also a relay, so a message
   travels hop by hop across whatever links are up (`C-10`).
2. What a mesh is *not*: not the same as your home "mesh Wi‑Fi" kit (that still
   backhauls to one ISP); not magic — it trades speed and simplicity for
   resilience.
3. The real question is routing: discover routes on demand (reactive), keep them
   ready (proactive), or carry messages until a link appears (delay-tolerant)
   (`C-10`, `C-11`, `C-13`).

### Stat callouts

| Label | Value | Source claim |
|-------|-------|--------------|
| Hero numeral | "0" (centres) — or "hop by hop" framing | — |
| Routing stances | reactive · proactive · delay-tolerant | C-10, C-11, C-13 |

(Use a short hero like "No centre" rather than a fake metric; the stat column
lists the three stances with one-line glosses.)

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Whole block | M-REVEAL | 0 |

## Cross-links

- None required here; § I carries the depth.

## Acceptance (section-level)

- [ ] Defines mesh + "is not" without reading further.
- [ ] Trichotomy traces to C-10/C-11/C-13.
