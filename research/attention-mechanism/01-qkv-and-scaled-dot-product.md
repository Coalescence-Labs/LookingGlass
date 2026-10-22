---
topic: Query, key, value and scaled dot-product attention
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 01
related-chunks:
  - 02-multi-head-attention.md
  - 05-attention-heads-interpretability.md
---

## Summary

Self-attention starts by projecting every token's embedding through three
learned weight matrices into a **query**, a **key**, and a **value** vector.
To update one token, its query is compared against the keys of all tokens by
dot product; each score is divided by √d_k and the row is passed through a
softmax, producing weights that sum to one. The output is the weighted sum of
the value vectors. In matrix form for the whole sequence at once:
`Attention(Q,K,V) = softmax(QKᵀ/√d_k)V`. The √d_k divisor stops the dot
products from growing large enough to push the softmax into a region of near-
zero gradient.

## Method

- Read primary paper: Vaswani et al., "Attention Is All You Need",
  arXiv:1706.03762 (NeurIPS 2017), §3.2.1. Fetched
  https://arxiv.org/abs/1706.03762 and the NeurIPS PDF
  (proceedings.neurips.cc/.../3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf),
  2026-06-17.
- Cross-checked equation and reference implementation against the Annotated
  Transformer, https://nlp.seas.harvard.edu/annotated-transformer/ (accessed
  2026-06-17), which reproduces Eq. (1) and gives PyTorch code for `attention`.
- Internal read: `src/app/context-window/page.tsx` (for cross-reference to the
  "lost in the middle" effect and quadratic-cost framing).

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-01 | Each token is projected into a query, a key, and a value vector by learned matrices W_Q, W_K, W_V | high | Vaswani 2017 §3.2 | Annotated Transformer | "packed together into matrices Q, K, V" |
| C-02 | Attention(Q,K,V) = softmax(QKᵀ/√d_k)V | high | Vaswani 2017 Eq. (1) | Annotated Transformer | identical equation in both |
| C-03 | Scaling by 1/√d_k counteracts large dot products that push softmax into tiny-gradient regions | high | Vaswani 2017 §3.2.1 fn.4 | Annotated Transformer | with d_k=64, √d_k=8 |
| C-04 | Softmax converts the row of scores into non-negative weights summing to 1 | high | Vaswani 2017 §3.2.1 | Annotated Transformer | weights "on the values" |

## Findings

### 1. Three vectors per token (C-01)

Each token's embedding x is multiplied by three learned matrices to produce a
query q = xW_Q, a key k = xW_K, and a value v = xW_V. The intuition the paper's
later readers settled on: the **query** is what a token is looking for, the
**key** advertises what each token can offer, and the **value** is the content
a token contributes if it is attended to. Q, K, V are the matrices stacking
these vectors over the whole sequence. [Vaswani 2017 §3.2; Annotated
Transformer]

### 2. The scoring step and the equation (C-02)

The compatibility of a query with a key is their dot product — large when the
two vectors point in similar directions. Stacking all queries against all keys
gives the score matrix QKᵀ (one row per query token, one column per key token).
The full operation is

```
Attention(Q, K, V) = softmax(QKᵀ / √d_k) V
```

i.e. Eq. (1) of Vaswani 2017. The Annotated Transformer's implementation makes
the shapes explicit: `scores = Q @ K.transpose / sqrt(d_k)`, then
`softmax(scores)`, then `@ V`.

### 3. Why divide by √d_k (C-03)

If the components of q and k are independent with mean 0 and variance 1, their
dot product q·k has mean 0 and variance d_k — so it grows with dimension. Large
magnitudes push softmax toward a near-one-hot output where gradients vanish and
learning stalls. Dividing by √d_k rescales the variance back to ~1. With the
original d_k = 64, the divisor is 8. [Vaswani 2017 §3.2.1, footnote 4;
Annotated Transformer]

### 4. Softmax makes a weighting, not a choice (C-04)

Softmax exponentiates and normalises each row of scores so the weights are
non-negative and sum to one. Attention therefore *blends* values rather than
hard-selecting one — it is a soft lookup. A causal (decoder) mask sets future
positions to −∞ before the softmax so they receive zero weight; this is how
autoregressive models avoid peeking ahead. [Vaswani 2017 §3.2.3; Annotated
Transformer masked-fill with −1e9]

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Query (q) | Vector representing what a token is looking for | Vaswani 2017 |
| Key (k) | Vector advertising what a token offers for matching | Vaswani 2017 |
| Value (v) | Vector content a token contributes when attended to | Vaswani 2017 |
| d_k | Dimension of query/key vectors (64 in the base model) | Vaswani 2017 |
| Self-attention | Q, K, V all derived from the same sequence | Vaswani 2017 |

## Implications for the article

- § "Query, key, value" — lead with the lookup metaphor (looking for / offering
  / handing over). Anchor C-01.
- § "The equation" — render `softmax(QKᵀ/√d_k)V` in an equation card with full
  alt-text; explain each piece in one line. Anchors C-02, C-03, C-04.
- Stat candidate: √64 = 8 (the scaling divisor in the base model).
- The soft-lookup framing motivates the heatmap interactive (a row of weights).

## Sources

1. **Vaswani, A. et al. (2017)** — Attention Is All You Need. NeurIPS 2017.
   arXiv:1706.03762. §3.2.1 Scaled Dot-Product Attention, Eq. (1).
2. **Rush, A. et al. (2018, rev. 2022)** — The Annotated Transformer. Harvard
   NLP. https://nlp.seas.harvard.edu/annotated-transformer/

## Open questions

- None blocking.
