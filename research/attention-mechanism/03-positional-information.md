---
topic: Positional information
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 03
related-chunks:
  - 01-qkv-and-scaled-dot-product.md
  - 04-quadratic-cost.md
---

## Summary

Attention is order-blind: shuffle the tokens and the set of dot products is
unchanged, because the operation treats its input as a set, not a sequence. So
position has to be added separately. The original transformer added fixed
**sinusoidal** signals of geometrically spaced frequencies to the input
embeddings; it also tried learned positional embeddings with near-identical
results. The now-dominant approach is **RoPE** (rotary position embedding),
which rotates each query and key by an angle proportional to its position, so
that the query–key dot product ends up depending only on the *relative*
distance between the two tokens. ALiBi is a simpler alternative that biases
scores by distance.

## Method

- Vaswani 2017 §3.5 (Positional Encoding), Table 3 row (E) (learned vs
  sinusoidal). Re-read 2026-06-17.
- Su et al., "RoFormer: Enhanced Transformer with Rotary Position Embedding",
  arXiv:2104.09864 (v1 Apr 2021; v4 Aug 2022). Read abstract + §3 derivation
  via arXiv and mirror, 2026-06-17.
- Shaw et al. 2018 (arXiv:1803.02155) for relative position representations;
  Press et al. 2021 (ALiBi, arXiv:2108.12409) for the bias alternative.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-07 | The original transformer encodes order with sinusoids of geometrically increasing wavelength, added to embeddings | high | Vaswani 2017 §3.5 | Annotated Transformer | learned embeddings gave ~same BLEU (Table 3 E) |
| C-08 | RoPE rotates Q and K by position-dependent angles, making the q·k dot product depend on relative position (m−n) | high | Su 2021 §3 (abstract + Eq.) | TDS RoPE/ALiBi guide (B) | "encodes absolute position with a rotation matrix and … explicit relative position dependency" |

## Findings

### 1. Why position must be added (C-07)

Self-attention is permutation-equivariant: with no positional signal, "the cat
sat" and "sat the cat" produce the same multiset of attention scores. The
transformer therefore injects position into the token representations before
attention sees them. [Vaswani 2017 §3.5]

### 2. Sinusoidal and learned encodings (C-07)

The base model adds, to each embedding, a vector whose dimensions are sines and
cosines at geometrically spaced frequencies (wavelengths from 2π up to
~10000·2π). The authors hypothesised this lets the model attend by relative
position, since a shift by k is a linear function of the encoding. They report
that a *learned* positional embedding performed essentially identically
(Table 3, row E: 25.7 vs 25.8 BLEU), and chose sinusoids partly for possible
length extrapolation. [Vaswani 2017 §3.5]

### 3. Rotary position embedding (RoPE) (C-08)

RoPE multiplies each query and key by a rotation matrix R whose angle is
proportional to the token's absolute position. Because rotating q by mθ and k
by nθ leaves their dot product equal to that of q rotated by (m−n)θ against an
unrotated k, the resulting attention score depends only on the **relative**
offset m−n and the vectors' content — not on absolute position. RoPE operates
on pairs of dimensions (2D subspaces), each rotated at its own frequency, and
gives a dependency that naturally decays with distance. It is the position
scheme in most current open-weight LLMs. [Su 2021 §3]

### 4. Other relative schemes (context only)

Shaw et al. 2018 added learned relative-position terms inside the score;
ALiBi (Press et al. 2021) adds a fixed, distance-proportional negative bias to
the scores and extrapolates to longer sequences than seen in training. These
are useful as "alternatives" the plan asks for, but RoPE is the headline.

## Discrepancies

| Claim ID | Source A says | Source B says | Recommended for page | Rationale |
|----------|---------------|---------------|----------------------|-----------|
| C-07 | Sinusoidal chosen for extrapolation | Learned ≈ identical results (Table 3 E) | State both: sinusoids originally, ~tied with learned | Avoids overclaiming sinusoids' superiority |

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Positional encoding | Signal added so attention can use token order | Vaswani 2017 |
| RoPE | Rotary position embedding; rotates q,k by position | Su 2021 |
| ALiBi | Attention with Linear Biases; distance penalty on scores | Press 2021 |

## Implications for the article

- § "Position, and the quadratic price" — one tight paragraph: attention is
  order-blind, so position is added; original sinusoids, now usually RoPE which
  encodes *relative* distance by rotation. Anchors C-07, C-08.
- Keep RoPE explanation to the rotation-→-relative-distance intuition; cite Su
  2021. Mention ALiBi only as a one-line alternative.

## Sources

1. **Vaswani, A. et al. (2017)** — Attention Is All You Need. §3.5. arXiv:1706.03762.
2. **Su, J. et al. (2021)** — RoFormer: Enhanced Transformer with Rotary
   Position Embedding. arXiv:2104.09864.
3. **Shaw, P. et al. (2018)** — Self-Attention with Relative Position
   Representations. arXiv:1803.02155.
4. **Press, O., Smith, N., Lewis, M. (2021)** — Train Short, Test Long: Attention
   with Linear Biases (ALiBi). arXiv:2108.12409.

## Open questions

- None blocking.
