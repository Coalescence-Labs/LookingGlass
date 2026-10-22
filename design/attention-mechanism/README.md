---
topic: How attention actually works
plan: plans/concepts/attention-mechanism.md
research: research/attention-mechanism/
date: 2026-06-17
agent: cursor
status: draft
slug: attention-mechanism
route: /attention
concept-index: "05"
series-id: language-models
---

## Summary

The reader should leave able to picture attention as a soft lookup: every token
asks a question (its query), every token answers (its key), and the best matches
hand over their content (their value). The page builds that picture in prose,
formalises it in one equation card, then lets the reader *operate* it — hovering
tokens in a real attention matrix and switching between heads that each do a
different job. It closes with the two facts that constrain everything downstream:
position has to be added separately (RoPE), and attending to every pair of tokens
costs n², which is why context windows (Concept 03) are finite. The emotional
arc: "this sounded like magic; it's a weighted average I can poke at."

## Page architecture

```
PageHeader (index 05, kicker "On attention")
  └─ Short answer (L-SHORT-ANSWER)
§ I — Query, key, value (L-PROSE-GRID)
§ II — The equation (EquationCard, prose-only)
§ III — The attention matrix (P-HEATMAP — Heatmap + HeadSelector) ← primary interactive
§ IV — Many heads, many jobs (L-CARD-GRID)
§ V — Position, and the quadratic price (L-PROSE-GRID + cross-link)
Sources (id="sources")
```

## Section index

| File | § | Pattern | Primary teaching goal |
|------|---|---------|----------------------|
| `01-short-answer.md` | — | L-SHORT-ANSWER | Attention = each token pulling in what's relevant from the others |
| `02-query-key-value.md` | § I | L-PROSE-GRID | The three vectors and the lookup metaphor |
| `03-the-equation.md` | § II | EquationCard (static) | softmax(QKᵀ/√d_k)V, piece by piece |
| `04-attention-matrix.md` | § III | P-HEATMAP | Hover a token, see what it attends to; heads differ |
| `05-many-heads.md` | § IV | L-CARD-GRID | Heads specialise; induction heads complete patterns |
| `06-position-and-cost.md` | § V | L-PROSE-GRID | Position added separately (RoPE); n² cost caps windows |

## Motion strategy

Standard `Reveal` for every section's chrome (delay 0) and intro lede
(delay 0.08), and stagger for the §IV card grid (`delay={i * 0.08}`). The
heatmap (`Heatmap.tsx`) is the only Motion-using client component: cell
highlight/dim and the live-caption swap use short transitions gated by
`useReducedMotion()`. No `whileInView` anywhere (no decorative entrances on this
page). The equation card is static. Title uses `SplitWords` via `PageHeader`
only.

## File map (implementation)

**Create**

- `src/app/attention/page.tsx`
- `src/lib/attention.ts`
- `src/components/attention/Heatmap.tsx`
- `src/components/attention/HeadSelector.tsx`
- `src/components/attention/Equation.tsx`
- `public/data/attention-weights.json`

**Modify**

- `src/lib/concepts.ts` — add Concept 05 entry

## concepts.ts entry (draft)

```ts
{
  index: "05",
  slug: "attention",
  title: "How does attention actually work?",
  subtitle:
    "Every token in a sentence quietly reads every other one, then keeps what's relevant. That reading step is attention — the engine inside every transformer.",
  kicker: "On attention",
  seriesId: "language-models",
  status: "live",
  readingTime: "9 min",
}
```

Note: route/slug is `attention` (not `attention-mechanism`), per plan Goal
("Ship `/attention`"). The plan/research/design folders keep the
`attention-mechanism` slug; the live route is `/attention`.

## Research traceability

| § | Research chunks | Key claim IDs |
|---|-----------------|---------------|
| Short answer | `01`, `numbers-and-units.md` | C-01, C-02 |
| § I | `01-qkv-and-scaled-dot-product.md` | C-01 |
| § II | `01-qkv-and-scaled-dot-product.md` | C-02, C-03, C-04 |
| § III | `02`, `05`, `visuals-and-data.md` | C-02, C-04, C-12 |
| § IV | `02-multi-head-attention.md`, `05` | C-05, C-06, C-11, C-12, C-13 |
| § V | `03-positional-information.md`, `04-quadratic-cost.md` | C-07, C-08, C-09, C-10 |

## Accessibility summary

- One `<h1>` (PageHeader). § headings are `<h2>`; card titles `<h3>`.
- Heatmap: token controls are `<button>`s with `aria-pressed`; the selected
  token's strongest target announced via `aria-live="polite"` caption. Each
  matrix cell carries an `aria-label` ("the → cat: 0.62") and shows the number
  as text, so meaning is never colour-only.
- Head selector: `role="tablist"` / buttons with `aria-pressed`; ≥44px targets.
- Equation: rendered as styled text with a full-sentence `aria-label`/visually
  available description; not an image.
- Reduced motion: `useReducedMotion()` collapses cell transitions and caption
  swaps to instant; global CSS already zeroes transitions.

## Open design questions

1. **[resolved]** Real vs illustrative weights → illustrative, disclosed in
   `#sources` (see `research/.../visuals-and-data.md`). Plan forbids runtime
   inference; environment has no model runtime.
2. **[nice-to-have]** Could add a second example sentence later; ship one for
   v1 to keep JSON small and the interaction focused.

## Applied

```
## Applied
- 2026-06-17 · PR #NNN · shipped at src/app/attention/page.tsx
```
