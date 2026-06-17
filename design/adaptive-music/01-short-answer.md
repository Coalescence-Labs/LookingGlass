---
section: "Short answer"
pattern: L-SHORT-ANSWER
research-chunks:
  - research/adaptive-music/01-dynamic-audio-taxonomy.md
  - research/adaptive-music/02-vertical-layering.md
claim-ids: [C-01, C-02]
status: draft
---

## Teaching goal

After this section the reader understands that a modern game score is **not a
recording that plays** — it is a set of separable **stems** plus rules the
engine follows to assemble a piece live, in response to game state.

## Layout

```
Reveal
  grid md:grid-cols-[1.3fr_1fr] border-t border-line pt-12 md:pt-16
    Left:  type-mono-sm "The short answer"
           type-display-m with italic text-accent on the load-bearing phrase
    Right: stat block 1 — "What it reacts to" → "game state, not a button" (C-01)
           rule
           stat block 2 — "What it's made of" → "stems, mixed live" (C-02)
```

- Section wrapper: `shell pb-20 md:pb-28`
- Mobile: single column; stat blocks stack under the statement.

## Content

### Prose beats (not final copy)

1. A game score is a **system, not a recording**: the same scene can sound
   sparse or full depending on what you're doing (`C-02`).
2. It reacts to **game state** — enemy proximity, health, mission phase — not
   directly to a button press; that's the interactive/adaptive split (`C-01`).
3. The italic accent phrase carries the reframe, e.g. *"a decision tree that
   only becomes a piece while you play."*

### Stat callouts

| Label | Value | Source claim |
|-------|-------|--------------|
| What it reacts to | Game state, not a keypress | C-01 |
| What it's made of | Stems, remixed in real time | C-02 |

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Whole block | M-REVEAL | 0 |

## Cross-links

- Forward-reference § I ("drive it yourself").

## Acceptance (section-level)

- [ ] States the system-not-recording idea in one sentence
- [ ] Accent span on the load-bearing phrase
- [ ] Both stat blocks trace to C-01 / C-02
```
