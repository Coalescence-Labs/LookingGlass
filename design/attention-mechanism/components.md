---
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
status: draft
---

## New components

### `Heatmap`

| Field | Value |
|-------|-------|
| Path | `src/components/attention/Heatmap.tsx` |
| Client | yes — `"use client"` |
| Used in | § III (`04-attention-matrix.md`) |
| Pattern | P-HEATMAP |

**Purpose:** the page's primary interactive — a token strip + 10×10 attention
matrix where hovering/selecting a token highlights its row, with a head selector
switching between three precomputed heads.

**Props**

```ts
type HeatmapProps = {
  example?: AttentionExample; // defaults to ATTENTION_EXAMPLE from lib
};
```

**State (internal)**

- `headId: number` (default 0)
- `selected: number | null` — currently highlighted "from" token (row)

**Data in**

- `AttentionExample` from `src/lib/attention.ts` (re-exports JSON). No fetch.

**Motion**

- `useReducedMotion()` gates cell opacity/scale transition and caption swap.
- No `whileInView`. Internal transitions only, on user interaction.

**Accessibility**

- Wrapping region `aria-label` names the sentence.
- Token strip: `<button aria-pressed>` per token; pointer + keyboard select.
- Cells: `aria-label="<from> attends to <to>: <weight>"`; weight as text.
- Live caption `aria-live="polite"` naming strongest target.
- Renders `HeadSelector` as the control row.

**Responsive**

- Desktop: full grid with per-cell numerals.
- Mobile: numerals hidden (kept in aria-label); selection via token strip; grid
  may scroll horizontally inside an overflow wrapper at very small widths.

---

### `HeadSelector`

| Field | Value |
|-------|-------|
| Path | `src/components/attention/HeadSelector.tsx` |
| Client | yes — `"use client"` |
| Used in | inside `Heatmap` (§ III) |
| Pattern | button group |

**Purpose:** three buttons to choose the active head; shows the head label and
(below the matrix, via Heatmap) its editorial caption.

**Props**

```ts
type HeadSelectorProps = {
  heads: { id: number; label: string }[];
  activeId: number;
  onSelect: (id: number) => void;
};
```

**Motion**

- None beyond hover colour transition (CSS).

**Accessibility**

- Buttons with `aria-pressed`; ≥44px touch target; accent border on active.

**Responsive**

- Wraps to multiple rows on narrow screens (`flex flex-wrap gap-2`).

---

### `Equation`

| Field | Value |
|-------|-------|
| Path | `src/components/attention/Equation.tsx` |
| Client | no — server component (static) |
| Used in | § II (`03-the-equation.md`) |
| Pattern | EquationCard |

**Purpose:** render `softmax(QKᵀ/√d_k)V` as styled text with a full-sentence
description for screen readers, plus a four-row breakdown.

**Props**

```ts
type EquationProps = {}; // self-contained; copy lives inside
```

**Accessibility**

- Formula wrapper has a visually-hidden full-sentence description (or
  `aria-label`); the visible glyphs are `aria-hidden` to avoid garbled SR
  read-out of `QKᵀ/√d_k`.
- Breakdown rows are plain readable text.

**Responsive**

- Equation uses `type-display-m` (clamps down on mobile); breakdown stacks.

---

## Reused components

| Component | Configuration |
|-----------|---------------|
| `PageHeader` | index=`"05"`, kicker=`"On attention"`, title/lede from § header |
| `Reveal` | section chrome (0), ledes (0.08), card stagger (i*0.08) |
| `SourceOutboundLink` | every external citation in `#sources` |

## Data module (`src/lib/attention.ts`)

```ts
export type AttentionHead = {
  id: number;
  label: string;
  caption: string;   // editorial, grounded in Clark/Voita/Elhage
  weights: number[][]; // 10×10 row-stochastic
};
export type AttentionExample = {
  tokens: string[];
  heads: AttentionHead[];
};

// Imported from public/data/attention-weights.json (typed) OR defined here and
// the JSON generated to match. Single source of truth: the JSON file; lib casts
// + re-exports it. (Decision: define canonical data in attention.ts, write the
// identical object to public/data/attention-weights.json so both exist as the
// plan's Files require; a test asserts they match.)

export const ATTENTION_EXAMPLE: AttentionExample;

export const MODEL_DIMS = { dModel: 512, heads: 8, dHead: 64, scale: 8 } as const; // C-06, C-03

export function weightColor(w: number): string;        // ink→accent by weight
export function strongestTarget(row: number[]): number; // argmax index
```

## Static assets

| Path | Contents | Size estimate |
|------|----------|---------------|
| `public/data/attention-weights.json` | `{ tokens: string[10], heads: [3 × {id,label,caption,weights:10×10}] }` | ~8–10 KB |

## Page orchestration notes

`src/app/attention/page.tsx` is a Server Component: metadata, PageHeader, static
prose for all sections, the `Equation` server component, and the `Heatmap`
client component imported for § III. Section prose written inline (like
context-window). Numbers (8, 64, 512, √d_k=8) come from `MODEL_DIMS` /
`numbers-and-units.md`.

## Applied

```
## Applied
- 2026-06-17 · commit <sha>
```
