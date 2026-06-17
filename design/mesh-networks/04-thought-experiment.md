---
section: "§ III — The thought experiment"
pattern: L-PROSE-GRID
research-chunks:
  - research/mesh-networks/06-speculative-rebuild.md
claim-ids: [C-01, C-03, C-12, C-13, C-21, C-22]
status: draft
---

## Teaching goal

After § III the reader can imagine a grounded bottom-up rebuild — and knows
exactly which parts are real components and which parts are speculation.

This is the **second labelled half: "What a mesh could be."**

## Layout

`shell pb-24 md:pb-32`. Chrome `§ III` + heading + **right tag `Speculative —
not reportage`** (visible, persistent). A short framing lede that names the
section as a thought experiment. Then:

- A "survives / doesn't survive" two-column contrast (`grid md:grid-cols-2`),
  each column a titled list.
- Prose beats for the four salvageable building blocks, each hedged.

Mobile: columns stack; the speculation tag stays visible above the heading.

## Content

### Framing (must read as speculation)

Open with an explicit frame: "The rest of this section is a thought experiment,
not reporting. Every building block below exists today; the speculation is only
in composing them." Use hedged verbs throughout ("a plausible rebuild would…",
"you'd probably…", "one answer that survives the constraints is…").

### Prose beats (all hedged)

1. Long-haul backbone → LoRa: kilobits, but kilometres (`C-01`,`C-03`).
2. Neighbourhood density → something BATMAN-shaped: self-configuring layer-2
   mesh, no node holding the whole map (`C-12`).
3. Trans-regional traffic → delay-tolerant sneakernet: store, carry, forward
   (`C-13`).
4. Identity → cryptographic, not certificate-authority-issued: a web of trust
   or Reticulum-style hashes of public keys (`C-21`,`C-22`).

### Survives / doesn't survive

| Survives | Doesn't survive |
|----------|-----------------|
| Messaging, email-shaped traffic | Streaming-grade latency |
| Local/regional services | CDN-era single-page apps |
| Cryptographic identity & signatures | Centralised card payments |

Caption: the rebuild is a *different* internet — slower, choppier,
message-shaped — not a restoration.

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Section chrome + tag | M-REVEAL | 0 |
| Framing lede | M-REVEAL | 0.08 |
| Survives/doesn't grid | M-REVEAL | 0.15 |

## Cross-links

- Forward-reference a future "identity without certificate authorities" piece in
  prose (no link yet — note as future sibling).

## Acceptance (section-level)

- [ ] Section is unambiguously labelled speculation (visible tag + hedged verbs).
- [ ] A reader cannot quote a future scenario as current fact.
- [ ] Each speculative move cites a real building-block claim.
