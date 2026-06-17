---
section: "§ V — Position, and the quadratic price"
pattern: L-PROSE-GRID
research-chunks:
  - research/attention-mechanism/03-positional-information.md
  - research/attention-mechanism/04-quadratic-cost.md
claim-ids: [C-07, C-08, C-09, C-10]
status: draft
---

## Teaching goal

After § V the reader understands two consequences of the design: attention is
order-blind so position is injected separately (sinusoids originally, RoPE now),
and attending to every pair of tokens costs n² — the reason context windows are
finite (Concept 03).

## Layout

- Section wrapper: `shell pb-24 md:pb-32`; § chrome, right label "Two
  consequences".
- Two L-PROSE-GRID sub-blocks (or one grid with two prose columns):
  1. **Position** — heading + 2 short paragraphs.
  2. **The quadratic price** — heading + 2 short paragraphs + cross-link.
- Optional small inline stat ("2× tokens ≈ 4× work").
- Mobile: stacks.

## Content

### Prose beats

1. Position:
   - Attention treats its input as a set — shuffle the words and the scores are
     the same. So order has to be added (`C-07`).
   - Originally sinusoids (learned embeddings worked about as well); now usually
     RoPE, which rotates queries and keys so their dot product depends on the
     *distance* between tokens, not absolute position (`C-07`, `C-08`).
2. Quadratic price:
   - The score matrix has a cell for every pair of tokens — n² of them. Double
     the tokens, quadruple the attention work (`C-09`).
   - That n² wall is why context windows are bounded and pricey; link to
     Concept 03. FlashAttention computes the *same* attention with memory linear
     in n, but the fundamental scaling stays (`C-10`).

### Stat callouts

| Label | Value | Source claim |
|-------|-------|--------------|
| Cost growth | 2× tokens ≈ 4× work | C-09 |

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| § chrome | M-REVEAL | 0 |
| Sub-blocks | M-REVEAL | 0.08 / 0.15 |

## Cross-links

- `/context-window` — "this is the cost pressure behind context windows
  (Concept 03)". Anchor `/context-window#sources` not needed; main route link.

## Acceptance (section-level)

- [ ] Explains why position is separate; names sinusoids + RoPE (C-07, C-08)
- [ ] Explains n² cost and ties to context windows (C-09)
- [ ] FlashAttention hedged correctly (exact, memory linear; FLOPs unchanged) (C-10)
- [ ] Cross-link to /context-window present
