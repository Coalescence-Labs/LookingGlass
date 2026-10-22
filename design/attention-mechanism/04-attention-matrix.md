---
section: "§ III — The attention matrix"
pattern: P-HEATMAP
research-chunks:
  - research/attention-mechanism/02-multi-head-attention.md
  - research/attention-mechanism/05-attention-heads-interpretability.md
  - research/attention-mechanism/visuals-and-data.md
claim-ids: [C-02, C-04, C-12]
status: draft
---

## Teaching goal

After § III the reader has *operated* attention: hovering a token shows the row
of weights it spreads over the sentence, and switching heads shows that
different heads attend to different things.

## Layout

```
┌──────────────────────────────────────────────────────────┐
│ § chrome  "§ III  The attention matrix"     "Interactive" │
├──────────────────────────────────────────────────────────┤
│ intro lede (type-lede max-w-2xl)                          │
├──────────────────────────────────────────────────────────┤
│ Heatmap panel (interactive chrome)                        │
│  ┌─ HeadSelector (3 buttons)  ──────────────────────────┐ │
│  │ token strip (row of buttons)                         │ │
│  │ ┌───────────── matrix grid 10×10 ─────────────────┐  │ │
│  │ │ rows = "from" token, cols = "to" token          │  │ │
│  │ └─────────────────────────────────────────────────┘  │ │
│  │ live caption: "'it' attends most to 'cat' (0.82)"    │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

- Section wrapper: `shell pb-24 md:pb-32`
- Panel: `border border-line p-5 md:p-8`, `background: rgba(15,15,18,0.6)`
- Matrix: CSS grid, `grid-template-columns: repeat(10, 1fr)`; cells square via
  aspect-ratio. Row + column token labels in `type-mono-sm`.
- Mobile (≤480px): the 10×10 grid is small but legible; allow horizontal scroll
  wrapper if needed; token strip wraps. Tap selects a row.

## Content

### Prose beats

1. Intro: this is one short sentence run through attention; each row shows where
   that word "looks". Hover a word (`C-02`, `C-04`).
2. Note that rows sum to one — it's a distribution, a soft choice (`C-04`).
3. Switching heads = watching three different specialists read the same sentence
   (`C-12`). Captions name what each head tracks.

### Stat callouts

None — the matrix is the payload.

## Interactive spec

### Pattern

`P-HEATMAP` — see pattern-catalog.md.

### Reader actions

- Hover / focus a token in the strip (or a row label) → that row's cells
  brighten by weight; other rows dim. Live caption updates with the strongest
  target and its weight.
- Click a head button → matrix re-renders with that head's weights; caption
  updates.
- On touch: tap a token to select its row (sticky until another tap).

### UI chrome

- HeadSelector: three buttons, `type-mono-sm`, same style as TokenScale presets
  (`border border-line bg-glass px-3 py-1.5`, hover/active → accent). Selected
  has `aria-pressed=true` + accent border.
- Cells: background interpolated ink→accent by weight; weight printed in the
  cell at `text-[0.6rem]` tabular numerals for larger screens, hidden on very
  small but kept in `aria-label`.

### Data

```ts
type AttentionHead = { id: number; label: string; caption: string; weights: number[][] };
type AttentionExample = { tokens: string[]; heads: AttentionHead[] };
```

- Static JSON: `public/data/attention-weights.json` — `tokens` (10) + 3 heads
  each with a 10×10 row-stochastic matrix. Construction rules in
  `research/.../visuals-and-data.md`.
- Lib: `src/lib/attention.ts` — re-exports the typed data + `weightColor()`
  helper + `strongestTarget(row)` helper.

### Mobile & touch

- Token buttons ≥44px tall where feasible; matrix cells shrink but remain
  tappable as a fallback (selection primarily via the token strip).
- Horizontal scroll only if the grid overflows at very small widths.

### Accessibility

- Region `aria-label="Attention matrix for the sentence: The cat sat on the mat
  because it was tired"`.
- Token strip buttons: `aria-pressed`, label = token text + "row".
- Each cell: `aria-label="<from> attends to <to>: <weight>"`; weight also shown
  as text (never colour-only).
- Live caption: `aria-live="polite"`.
- Keyboard: Tab to head buttons and token buttons; Enter/Space select; the
  selected row is reflected in the caption.
- Reduced motion: cell brighten/dim and caption swap become instant.

## Motion

| Element | Pattern | delay | notes |
|---------|---------|-------|-------|
| § chrome | M-REVEAL | 0 | |
| Intro | M-REVEAL | 0.08 | |
| Heatmap | — | mount visible | no whileInView; internal transitions gated by useReducedMotion |

## Cross-links

- Forward reference: "the three heads here each do a different job — more in § IV".

## Acceptance (section-level)

- [ ] Hover/focus highlights a row; works mouse + touch + keyboard (plan
      Acceptance: works on touch and mouse)
- [ ] Head selector switches between 3 heads
- [ ] Weights are precomputed JSON — no runtime inference (plan Acceptance)
- [ ] Cell meaning available as text + aria-label, not colour alone
- [ ] Reduced motion collapses hover transitions (plan Acceptance)
