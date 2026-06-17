---
section: "§ II — The equation"
pattern: EquationCard (static)
research-chunks:
  - research/attention-mechanism/01-qkv-and-scaled-dot-product.md
claim-ids: [C-02, C-03, C-04]
status: draft
---

## Teaching goal

After § II the reader can read `softmax(QKᵀ/√d_k)V` left to right and say what
each piece does: QKᵀ scores every pair, ÷√d_k keeps the scores tame, softmax
turns them into weights that sum to one, ×V blends the values.

## Layout

- Section wrapper: `shell pb-24 md:pb-32`; § chrome with right label "For the
  curious".
- One `Equation` card: standard interactive chrome
  (`border border-line p-6 md:p-10`, `background: rgba(15,15,18,0.6)`).
- Inside: the equation centered in `type-display-m`/serif, then a 4-row
  breakdown — each piece (`QKᵀ`, `÷ √d_k`, `softmax`, `× V`) with a one-line
  gloss in `type-body`, left rule per row.
- Mobile: equation scales down (clamp via type-display-m); breakdown stacks.

## Content

### Prose beats

1. Intro lede: the whole mechanism is one line of algebra; here's how to read it
   (`C-02`).
2. Breakdown rows:
   - `QKᵀ` — every query dotted with every key: a grid of raw match scores
     (`C-02`).
   - `÷ √d_k` — shrink the scores so the softmax keeps learning; in the original
     model √d_k = 8 (`C-03`).
   - `softmax` — turn each row of scores into weights that are positive and sum
     to one (`C-04`).
   - `× V` — use those weights to blend the value vectors into the output
     (`C-02`).

### Stat callouts

| Label | Value | Source claim |
|-------|-------|--------------|
| Scaling divisor | √d_k = 8 (base model) | C-03 |

## Interactive spec

Static (no controls). The `Equation` component renders the formula as styled
text, not an image.

### Accessibility

- The equation has a full-sentence text description available to screen readers
  (`aria-label` on the formula wrapper, or visually-hidden span):
  "Attention of Q, K, V equals softmax of Q times K transpose, divided by the
  square root of d sub k, times V."
- Each breakdown row is plain text — readable in DOM order.

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| § chrome | M-REVEAL | 0 |
| Intro | M-REVEAL | 0.08 |
| Card | M-REVEAL | 0.15 |

## Cross-links

- None.

## Acceptance (section-level)

- [ ] Equation rendered as text with full alt description (plan Acceptance)
- [ ] Each of the four pieces glossed in one line
- [ ] √d_k = 8 traces to C-03
