---
topic: "The thought experiment — a grounded post-stack rebuild"
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 06
related-chunks:
  - 01-physical-layer.md
  - 02-routing-protocols.md
  - 03-identity-and-security.md
---

## Summary

This chunk is the evidence base for § III, which is **speculation** and must be
labelled as such on the page. The discipline: every speculative move is built
from a *real* component already established in chunks 01–03, so the scenario is
grounded even though the outcome is hypothetical. A bottom-up rebuild after the
centralised stack vanished would reuse: **LoRa for long-haul** (range over
bandwidth, C-01/C-03), **BATMAN-adv for neighbourhood density** (layer-2,
self-configuring, C-12), **DTN sneakernet for trans-regional traffic**
(store-carry-forward when no path exists, C-13), and a **web-of-trust /
Reticulum identity layer** instead of certificate authorities (C-21/C-22). What
would *not* survive: streaming-grade latency, CDN-era web apps, and centralised
payments.

## Method

- Synthesis of chunks 01–03 (physical layer, routing, identity). No new external
  sources; all building blocks are sourced there.
- Framing discipline drawn from the plan's "Labeling discipline" section.

## Claims

This chunk introduces **no new factual claims** for the page. § III reuses
C-01, C-03, C-12, C-13, C-21, C-22 as *premises* and draws speculative
*conclusions* from them. The conclusions are explicitly not facts.

| ID | Premise reused | Speculative conclusion (label as such) |
|----|----------------|----------------------------------------|
| S-1 | LoRa: long range, tiny bandwidth (C-01, C-03) | "A plausible long-haul backbone is LoRa: kilobits, but kilometres." |
| S-2 | BATMAN-adv: self-configuring layer-2 mesh (C-12) | "Neighbourhood density would likely run something BATMAN-shaped." |
| S-3 | DTN: store-carry-forward (C-13) | "Trans-regional traffic would fall back to delay-tolerant sneakernet." |
| S-4 | Web of trust / Reticulum (C-21, C-22) | "Identity would be cryptographic, not certificate-authority-issued." |
| S-5 | Latency/throughput limits of all the above | "Streaming, CDN apps, and centralised payments would not survive intact." |

## Findings

### 1. The labelling rule

Per the plan: any sentence in § III not verifiable today must *read* as
speculation. Use "a plausible rebuild would…", "one answer that survives the
constraints is…", "you'd probably…". Never state a future scenario as current
fact. The page should carry a visible "Speculative — not reportage" label on the
section, mirroring the live-article pattern of a right-aligned `type-mono-sm`
section tag.

### 2. What's salvageable (S-1..S-4)

The argument's strength is that nothing here is invented: LoRa long-haul,
BATMAN-adv density, DTN bridging, and cryptographic identity all *exist and run
today* (chunks 01–04). The speculation is only in *composing* them into a
replacement stack — a recombination, not a fantasy.

### 3. What doesn't survive (S-5)

Honesty about loss is what keeps the section from being techno-utopian. A mesh
of kilobit long-haul links and store-carry-forward bridges cannot deliver
streaming-grade latency, can't host CDN-era single-page apps, and has no native
home for centralised card payments. The rebuild is a *different* internet —
slower, choppier, message-shaped — not a like-for-like restoration.

## Implications for the article

- § III gets a persistent "Speculative — not reportage" tag and hedged verbs.
- A small "survives / doesn't survive" two-column contrast is the natural visual.
- Cross-link § III identity back to § I (C-21/C-22) so speculation rests on the
  mechanism the reader just learned.

## Sources

No new sources; see chunks 01–03.

## Open questions

- [ ] None. Risk here is *tone* (must stay labelled), handled in implementation +
  humanize + review.
