---
topic: Visual and data brief — attention-matrix heatmap
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
agent: cursor
status: draft
chunk: visuals
related-chunks:
  - 01-qkv-and-scaled-dot-product.md
  - 05-attention-heads-interpretability.md
---

## Summary

The page's primary interactive is an **attention-matrix heatmap** over one
short worked-example sentence, with a **head selector** (three heads) and
hover/tap to highlight a token's attention row. All weights are precomputed and
shipped as static JSON — no runtime inference (plan Acceptance).

## Honesty note (important for review)

The build environment has no model runtime and the plan forbids runtime
inference. The shipped weights are therefore **illustrative**: hand-authored
matrices that depict the documented head taxonomies from Clark 2019, Voita 2019,
and Elhage 2021 (C-12, C-13), not weights extracted from one specific model run.
Each row is a valid probability distribution (non-negative, sums to ~1.00), so
the visual behaves exactly like real attention. The article's `#sources` must
state this plainly. This mirrors the site's existing convention (Concept 03's
viewport essay is original illustrative prose, disclosed in its sources).

## Worked example sentence (10 tokens)

```
index: 0     1    2    3    4     5     6        7     8     9
token: The   cat  sat  on   the   mat   because  it    was   tired
```

Chosen because it exhibits several documented relationships in one short span:
determiner→noun (The→cat, the→mat), subject→verb (cat→sat), preposition→object
(on→mat), and a pronoun with a clear antecedent (it→cat) for the coreference
head.

## Heads and captions (grounded)

| Head | Label | Editorial caption (basis) | Pattern |
|------|-------|---------------------------|---------|
| 0 | Previous-token | "Tracks word order — each token looks one step back." (Clark 2019 fixed positional offsets; Elhage 2021 previous-token head) | Mass on offset −1 |
| 1 | Syntactic | "Links words that grammatically belong together — articles to their nouns, the verb to its subject." (Clark 2019 determiner/direct-object heads) | Dependency pairs |
| 2 | Coreference | "Resolves what a pronoun refers back to — 'it' points to 'cat'." (Clark 2019 coreference heads) | it→cat dominant |

## Weight matrix construction rules (reproducible)

Each head is a 10×10 row-stochastic matrix `weights[dest][src]`. Rules:

**Head 0 — Previous-token.** Row i: 0.80 on token i−1, 0.14 on token i (self),
remaining 0.06 spread uniformly over other tokens. Row 0 (no predecessor):
0.88 self, 0.12 spread.

**Head 1 — Syntactic.** Salient pairs get the dominant mass (~0.6–0.7), self
gets ~0.15, remainder spread:
- The(0) → cat(1); the(4) → mat(5)  (determiner → noun)
- cat(1) → sat(2)  (subject → verb)
- sat(2) → cat(1)  (verb → subject)
- on(3) → mat(5)  (preposition → object)
- mat(5) → on(3)
- because(6) → sat(2)  (clause → main verb)
- it(7) → cat(1)  (pronoun subject → verb's subject, syntactic)
- was(8) → tired(9); tired(9) → it(7)
Tokens without a strong syntactic partner default to self-dominant.

**Head 2 — Coreference.** Mostly self-dominant (~0.7 self) EXCEPT it(7) → cat(1)
at ~0.82; "was"(8) and "tired"(9) lean toward it(7)/cat(1) lightly to show the
predicate following the resolved referent. Remainder spread.

All rows normalised to sum to 1.00 (±0.01 rounding) before shipping.

## Data shape (plan §3)

```ts
type AttentionHead = { id: number; label: string; caption: string; weights: number[][] };
type AttentionExample = { tokens: string[]; heads: AttentionHead[] };
```

Ship as `public/data/attention-weights.json`; typed accessor + constants in
`src/lib/attention.ts`.

## Interaction / a11y brief

- Hover or focus a token (row) → that row's weights light up across the matrix;
  other rows dim. Tap on touch.
- Colour scale: ink → accent (gold) by weight. Never colour-only: each cell
  shows the numeric weight as text and `aria-label`, and the strongest target
  is named in a live caption.
- Keyboard: tokens are buttons in a row; arrow/tab navigation; Enter/focus
  selects. Selected token announced via `aria-live`.
- Reduced motion: cross-fade/scale transitions collapse to instant.
- Equation card alt-text: "Attention of Q, K, V equals softmax of Q times K
  transpose divided by the square root of d sub k, times V."

## Sources

- Clark et al. 2019 (arXiv:1906.04341); Voita et al. 2019 (arXiv:1905.09418);
  Elhage et al. 2021 (transformer-circuits.pub/2021/framework); Olsson et al.
  2022 (arXiv:2209.11895). Full refs in `05-attention-heads-interpretability.md`.
