---
topic: Dynamic, interactive, and adaptive audio
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 01
related-chunks:
  - 02-vertical-layering.md
  - 03-horizontal-resequencing.md
---

## Summary

The vocabulary the field uses comes largely from **Karen Collins**. She calls
any sound that changes in relation to gameplay **dynamic audio**, then splits it
in two by what triggers the change. **Interactive audio** responds directly to
player input (press jump, hear a jump). **Adaptive audio** responds to game
state managed by the engine — a timer, enemy proximity, health, mission phase —
not to a button press. Game *music* that reacts at runtime is therefore
"dynamic music," and most of it is adaptive. This is the single distinction the
article should anchor on: a game score is written to be *assembled* during play,
not played back.

## Method

- WebFetch / search 2026-06-17:
  - *From Pac-Man to Pop Music* (ed. Collins, Routledge 2008), PDF text —
    definitions of dynamic / interactive / adaptive.
  - *Game Sound* (Collins, MIT Press 2008) — same taxonomy, expanded.
  - Collins, "An Introduction to Procedural Music in Video Games",
    Contemporary Music Review 28(1) 2009, DOI 10.1080/07494460802663983 —
    procedural vs adaptive distinction.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-01 | Dynamic audio = umbrella term; interactive (player input) + adaptive (game state) | high | Collins 2008 (Pac-Man) | Collins 2008 (Game Sound) | Collins' own definition |
| C-01a | Adaptive example: SMB timer speeds the music near time-out | high | Collins 2008 (Pac-Man) | — | classic illustration |
| C-01b | "Procedural music" = composition evolving by rules at runtime (generative or transformational) | medium | Collins 2009 (Procedural) | — | broader than adaptive; out of article scope but worth a footnote |

## Findings

### 1. The dynamic umbrella (C-01)

Collins: developers' games music is "dynamic, or audio that changes in relation
to what happens in the game, encompassing both interactive and adaptive audio."
The split is by **trigger**:

- **Interactive audio** — "sound events that occur in reaction to a player's
  input… press a button to make the [character] jump, and the jumping elicits a
  sound."
- **Adaptive audio** — "occurs in reaction to game-play… in response to timings
  or other parameters set by the game's engine, rather than directly in response
  to the player."

### 2. Why the distinction matters for the article (C-01a)

The canonical adaptive example is the *Super Mario Bros.* time-out: a timer the
engine owns speeds up the music. No button caused it; the *state* did. This is
the mental model for the whole piece — the score watches variables and
responds. Our demo's three drivers (tension, combat, discovery) are exactly
such engine parameters.

### 3. Procedural music is a cousin, not a synonym (C-01b)

Collins (2009) defines procedural music as composition that "evolves in real
time according to a specific set of rules," via generative or transformational
algorithms. Adaptive music usually recombines **pre-composed** material;
procedural music can *generate* it. The article should keep focus on the
adaptive/recombination model (what Hades, RDR2, Destiny actually do) and
mention generative only in passing.

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Dynamic audio | Sound that changes with gameplay | Collins 2008 |
| Interactive audio | Triggered by direct player input | Collins 2008 |
| Adaptive audio | Triggered by engine/game state | Collins 2008 |
| Stem | A separable instrumental layer of a piece | chunk 02 |

## Implications for the article

- Open the short answer with the recording-vs-system framing and the
  interactive/adaptive split (C-01).
- Use the "the engine watches a variable" idea to motivate the three sliders.
- Footnote procedural/generative as a related but distinct idea (C-01b).

## Sources

1. **Collins, K. (ed.) (2008)** — *From Pac-Man to Pop Music: Interactive Audio
   in Games and New Media.* Routledge. (Definitions, Introduction.)
2. **Collins, K. (2008)** — *Game Sound: An Introduction to the History,
   Theory, and Practice of Video Game Music and Sound Design.* MIT Press.
3. **Collins, K. (2009)** — "An Introduction to Procedural Music in Video
   Games." *Contemporary Music Review* 28(1), 5–15. DOI 10.1080/07494460802663983.

## Open questions

- [ ] None blocking. Exact page numbers omitted (PDF copies); quotes verbatim
      from fetched text.
