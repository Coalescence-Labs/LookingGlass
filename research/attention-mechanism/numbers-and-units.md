---
topic: Numbers and units ledger
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
agent: cursor
status: draft
chunk: numbers
related-chunks:
  - 01-qkv-and-scaled-dot-product.md
  - 02-multi-head-attention.md
  - 04-quadratic-cost.md
---

## Summary

Every quantity that may appear in copy, a stat callout, or the interactive.
All figures are from the base transformer (Vaswani 2017) or are exact
mathematical facts.

## Ledger

| Claim ID | Value | Units | Source A | Source B | Notes | Safe for page |
|----------|-------|-------|----------|----------|-------|---------------|
| C-06a | 512 | dims (d_model) | Vaswani 2017 Table 3 | Annotated Transformer | base model width | yes |
| C-06b | 8 | heads (h) | Vaswani 2017 §3.2.2 | Annotated Transformer | base model | yes |
| C-06c | 64 | dims/head (d_k = d_v) | Vaswani 2017 §3.2.2 | Annotated Transformer | 512 / 8 | yes |
| C-03a | 8 | scaling divisor √d_k | derived | Vaswani 2017 | √64 = 8 | yes |
| C-06d | 6 | encoder/decoder layers (N) | Vaswani 2017 Table 3 | — | base model | yes (context only) |
| C-06e | 2048 | d_ff (feed-forward) | Vaswani 2017 Table 3 | — | base model | yes (context only) |
| C-09a | n² | score-matrix entries | Vaswani 2017 §4 | Dao 2022 | n = sequence length | yes |
| C-09b | ~4× | attention work when tokens double | derived (2² = 4) | Dao 2022 | quadratic scaling | yes |
| C-10a | ~7.6× | FlashAttention speedup on GPT-2 | Dao 2022 §1 | NeurIPS 2022 | wall-clock, hardware-dependent — hedge | yes (with "up to") |
| meta-1 | 2017 | year | Vaswani 2017 | — | "Attention Is All You Need" | yes |
| meta-2 | 2021 | year | Su 2021 | — | RoFormer / RoPE | yes |

## Notes on safe phrasing

- Always write the scaling as "divide by √d_k (8 in the base model)", never
  imply 8 is universal.
- "~7.6×" must carry "up to" and "on GPT-2" — it is hardware- and
  setting-dependent (Dao 2022).
- "2× tokens ≈ 4× work" is the quadratic intuition; fine to state plainly.
- d_model/heads/d_k describe the *original* model; modern models differ, so
  frame as "in the original transformer".
