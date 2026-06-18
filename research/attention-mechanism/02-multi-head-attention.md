---
topic: Multi-head attention
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 02
related-chunks:
  - 01-qkv-and-scaled-dot-product.md
  - 05-attention-heads-interpretability.md
---

## Summary

Rather than run one attention over the full model dimension, transformers
split it into several **heads**, each operating on a smaller slice. Each head
has its own W_Q, W_K, W_V, runs scaled dot-product attention independently, and
the outputs are concatenated and passed through a final projection W_O. The
original model used d_model = 512 split into h = 8 heads of d_k = d_v = 64 each,
so the total compute is comparable to a single full-width head. Multiple heads
let the model attend to different relationships at the same time.

## Method

- Vaswani 2017 §3.2.2 (Multi-Head Attention), Table 3 (base hyperparameters).
  Re-read https://arxiv.org/html/1706.03762v4 and NeurIPS PDF, 2026-06-17.
- Cross-checked head-count / dimension arithmetic against the Annotated
  Transformer `MultiHeadedAttention` module (h=8, d_model=512), accessed
  2026-06-17.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-05 | MultiHead = Concat(head_1..head_h)·W_O, head_i = Attention(QW_iQ, KW_iK, VW_iV) | high | Vaswani 2017 §3.2.2 | Annotated Transformer | each head its own projections |
| C-06 | Base transformer: d_model 512, h = 8 heads, d_k = d_v = d_model/h = 64 | high | Vaswani 2017 §3.2.2 + Table 3 | Annotated Transformer | "big" model: d_model 1024, h = 16 |

## Findings

### 1. Splitting the model into heads (C-05, C-06)

Multi-head attention projects Q, K, V h times with different learned matrices
into h subspaces of dimension d_k = d_model / h, runs attention in each, then
concatenates the h outputs and projects with W_O ∈ ℝ^{h·d_v × d_model}. Because
each head is narrower (64 vs 512), the combined cost is "similar to that of
single-head attention with full dimensionality." [Vaswani 2017 §3.2.2]

Base-model numbers (Table 3, row "base"): N = 6 layers, d_model = 512,
d_ff = 2048, h = 8, d_k = d_v = 64. The "big" variant uses d_model = 1024 and
h = 16. [Vaswani 2017 Table 3]

### 2. Why multiple heads (C-05)

A single softmax-weighted average tends to blur distinct signals together.
Separate heads let the model, in the paper's words, "jointly attend to
information from different representation subspaces at different positions."
One head can track short-range word order while another tracks a long-range
dependency, without the two averaging each other out. The functional
specialisation this enables is documented in chunk 05. [Vaswani 2017 §3.2.2]

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Head | One independent attention computation on a d_k-wide subspace | Vaswani 2017 |
| d_model | Width of the residual stream / token embeddings (512 base) | Vaswani 2017 |
| W_O | Output projection mixing concatenated head outputs back to d_model | Vaswani 2017 |

## Implications for the article

- § "Many heads at once" — explain the split with the 512 → 8×64 arithmetic.
  Anchors C-05, C-06.
- Stat candidates: 8 heads, 64 dims/head, 512 d_model (base model).
- The head selector in the heatmap interactive embodies this: switching heads
  shows different attention patterns over the same sentence.

## Sources

1. **Vaswani, A. et al. (2017)** — Attention Is All You Need. NeurIPS 2017.
   arXiv:1706.03762. §3.2.2 Multi-Head Attention; Table 3.
2. **Rush, A. et al. (2018, rev. 2022)** — The Annotated Transformer. Harvard
   NLP. https://nlp.seas.harvard.edu/annotated-transformer/

## Open questions

- None blocking.
