---
topic: The quadratic cost of attention
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 04
related-chunks:
  - 02-multi-head-attention.md
  - 03-positional-information.md
---

## Summary

Because every token attends to every other token, the score matrix QKᵀ has one
entry for each pair of positions — n² entries for a sequence of length n. Both
the compute and the memory of vanilla attention therefore grow with the square
of the sequence length. Doubling the context roughly quadruples the attention
cost. This quadratic wall is the engineering reason context windows are
finite and expensive (Concept 03). FlashAttention removes the memory blow-up —
it computes the *exact* same attention but never materialises the full n×n
matrix, tiling the work so memory grows linearly in n while staying
mathematically identical.

## Method

- Vaswani 2017 §4 (Table 2, "Complexity per Layer" = O(n²·d) for self-attention),
  re-read 2026-06-17.
- Dao et al., "FlashAttention: Fast and Memory-Efficient Exact Attention with
  IO-Awareness", arXiv:2205.14135 (NeurIPS 2022). Read abstract + §1 + IO
  complexity theorem via arXiv, 2026-06-17.
- Cross-link target: `src/app/context-window/page.tsx` (the context-window
  concept and "lost in the middle").

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-09 | Self-attention cost grows quadratically with sequence length: O(n²) | high | Vaswani 2017 §4 Table 2 | Dao 2022 §1 | full n×n score matrix |
| C-10 | FlashAttention computes exact attention but reduces memory to linear in n by tiling and not storing the n×n matrix | high | Dao 2022 abstract + §3 | NeurIPS 2022 camera-ready | "less memory—linear in sequence length" |

## Findings

### 1. Where the n² comes from (C-09)

The score matrix QKᵀ is n×n: row i, column j is how much token i attends to
token j. Forming it is Θ(n²·d) work and, naively, Θ(n²) memory. Vaswani 2017's
Table 2 lists self-attention's complexity per layer as O(n²·d), versus O(n·d²)
for a recurrent layer — attention trades sequence-length scaling for
parallelism. As n grows, the n² term dominates: 2× the tokens ≈ 4× the
attention work. [Vaswani 2017 §4]

### 2. Why this caps context windows (C-09)

This is the cost pressure behind finite context windows: the model *could*
attend over more tokens, but the quadratic term makes very long sequences
expensive in time and memory. It connects directly to Looking Glass Concept 03
(context windows) — the window's size is bounded partly by this scaling.

### 3. FlashAttention: same math, less memory (C-10)

FlashAttention is "IO-aware": it splits Q, K, V into blocks and computes the
softmax incrementally (tiling), so it never writes the full n×n matrix to GPU
high-bandwidth memory. It recomputes intermediates in the backward pass instead
of storing them. The result is **exact** attention (not an approximation) with
memory linear in n and large wall-clock speedups (the paper reports up to ~7.6×
on GPT-2). The FLOP count is unchanged — only memory traffic drops. [Dao 2022]

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| n | Sequence length (number of tokens) | Vaswani 2017 |
| O(n²) | Cost grows with the square of sequence length | Vaswani 2017 |
| IO-aware | Algorithm designed around memory-access cost, not just FLOPs | Dao 2022 |

## Implications for the article

- § "Position, and the quadratic price" — close the article with the n²
  intuition (every pair of tokens = a cell in the matrix), then the payoff:
  this is why windows are finite; FlashAttention rescues memory but not the
  fundamental scaling. Anchors C-09, C-10.
- Cross-link to `/context-window` for the window-size discussion.
- Stat candidate: "2× tokens ≈ 4× attention work."

## Sources

1. **Vaswani, A. et al. (2017)** — Attention Is All You Need. §4, Table 2.
   arXiv:1706.03762.
2. **Dao, T. et al. (2022)** — FlashAttention: Fast and Memory-Efficient Exact
   Attention with IO-Awareness. NeurIPS 2022. arXiv:2205.14135.

## Open questions

- None blocking.
