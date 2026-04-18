---
title: Concept — How attention actually works
status: not-started
category: concept
effort: M
series: "I — On language models"
last-updated: 2026-04-17
---

## Context

Series I currently covers tokens (Concept 01), models (02), and context
windows (03). The next natural piece is attention — the mechanism that
makes transformers work, and the part that readers of Concept 03 often
ask about next ("when you say the model 'attends' — what does that
actually mean?").

The piece should cover: query/key/value projections, scaled dot-product
attention, multi-head attention, why the softmax, positional information
(RoPE and alternatives), and the quadratic cost that forces context-window
trade-offs. All of this is formalised in Vaswani et al. "Attention is
All You Need" (2017); cite it generously.

Risk: attention is famously hard to explain without equations. The piece
should use a *worked example* with a short, concrete input sequence and
trace one attention head end-to-end.

## Goal

Ship `/attention` as Concept 05, continuing Series I. Includes an
interactive attention-matrix visual where the reader can hover a token
and see which other tokens it attends to, with the weights rendered as
a heatmap.

## Approach

1. **Research.** Write `research/attention.md` with a side-by-side of the
   original Vaswani paper, the Annotated Transformer (Rush 2018), and
   Anthropic's interpretability work on attention heads.
2. **Worked example.** Pick an 8–12 token sentence. Pre-compute attention
   weights for 2–3 heads using a small open model (e.g. Gemma 2B or Llama
   3 1B) via transformers.js or an offline export. Ship the weights as a
   static JSON — no live inference on the page.
3. **Data.** `src/lib/attention.ts` — shape: `{ tokens: string[]; heads:
   { id: number; label: string; weights: number[][] }[] }`.
4. **Visuals.**
   - Token strip at top; hover a token → its row in the matrix lights up;
     other tokens shaded by weight.
   - Head selector (three heads, each with a short editorial caption:
     "this one tracks subject-verb agreement", etc.).
   - Small equation card showing softmax(QKᵀ/√d)V for readers who want it.
5. **Tie back.** Cross-link to Concept 03 (context window) for the
   quadratic cost discussion.

## Files

**Create:**
- `research/attention.md`
- `src/lib/attention.ts` — static weight data.
- `public/data/attention-weights.json` — pre-computed matrix.
- `src/components/attention/Heatmap.tsx`
- `src/components/attention/HeadSelector.tsx`
- `src/components/attention/Equation.tsx`
- `src/app/attention/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add Concept 05.

## Acceptance

- [ ] `bun run build` clean.
- [ ] Heatmap interaction works on touch and mouse.
- [ ] No runtime inference — all weights precomputed and bundled.
- [ ] The equation renders correctly; alt-text describes it for
      screen readers.
- [ ] Reduced motion collapses hover transitions.

## References

- Vaswani et al., "Attention Is All You Need" (2017) — arxiv 1706.03762.
- Rush, "The Annotated Transformer" (2018) —
  https://nlp.seas.harvard.edu/annotated-transformer/
- Anthropic, "A Mathematical Framework for Transformer Circuits" (2021).
- Internal: `src/app/context-window/page.tsx` for cross-reference.
