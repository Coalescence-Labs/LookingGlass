# Components template (`design/<slug>/components.md`)

Inventory of every component the article introduces. Reused shared components
are listed only when props/configuration non-obvious.

```yaml
---
plan: plans/concepts/<slug>.md
date: YYYY-MM-DD
status: draft | reviewed | applied
---
```

## New components

### `<ComponentName>`

| Field | Value |
|-------|-------|
| Path | `src/components/<slug>/<ComponentName>.tsx` |
| Client | yes — `"use client"` |
| Used in | § II (`02-<section>.md`) |
| Pattern | P-TIMELINE |

**Purpose:** one sentence.

**Props**

```ts
type ComponentNameProps = {
  stages: Stage[];
  currentStageId?: string;
  onStageSelect?: (id: string) => void;
};
```

**Data in**

- `Stage[]` from `src/lib/<slug>.ts` — built from claims C-04–C-11
- No fetch; all static

**Motion**

- `useReducedMotion()` gates timeline marker transition
- Stage labels: M-REVEAL stagger inside parent (optional)
- Do not use `whileInView` on timeline labels above fold

**Accessibility**

- `<section aria-label="…">`
- Stage buttons: `aria-pressed` for selected stage
- Timeline described by visible text + `aria-label` on track

**Responsive**

- Desktop: horizontal timeline
- Mobile: vertical stack, stages as accordion

---

### `<AnotherComponent>`

… repeat per component …

## Reused components

| Component | Configuration |
|-----------|---------------|
| `PageHeader` | index=`"04"`, kicker=`"On …"`, title/lede from plan |
| `StatRow` | § III — items array sketched below |
| `BigNumber` | short answer — value from C-04 |

## Data module (`src/lib/<slug>.ts`)

```ts
// Export list with brief description per export

export type Stage = { … };

export const STAGES: Stage[] = [ … ];  // claims C-04–C-11

export function formatGyr(n: number): string { … }
```

## Static assets

| Path | Contents | Size estimate |
|------|----------|---------------|
| `public/data/<slug>-weights.json` | Precomputed attention matrix | ~12 KB |

## Page orchestration notes

`src/app/<slug>/page.tsx` stays a Server Component. Import client
components only for interactives. Keep `TEXT_STATS`-style arrays inline or
in lib depending on size.

## Applied

```
## Applied
- YYYY-MM-DD · commit <sha>
```
