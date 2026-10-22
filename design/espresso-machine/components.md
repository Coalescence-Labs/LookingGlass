---
topic: Component inventory
plan: plans/concepts/espresso-machine.md
design: design/espresso-machine/
date: 2026-06-17
---

## New components (`src/components/espresso/`)

### `Cutaway.tsx` — client

Hand-drawn SVG cross-section of the flow path with selectable nodes.

```ts
// no props; reads FLOW_NODES from @/lib/espresso
export function Cutaway(): JSX.Element
```

- **State:** `activeId` (string), `pinned` (boolean).
- **Data:** `FLOW_NODES: { id, label, role, detail, claim }[]`.
- **A11y:** SVG `role="img"` + `<title>`/`<desc>`; nodes are focusable buttons
  with `aria-label` and `aria-current`; explainer `aria-live="polite"`; arrow-key
  navigation between nodes.
- **Motion:** `useReducedMotion`; decorative flow-dash `aria-hidden`, disabled on
  reduce; node highlight = CSS transition; explainer text M-VALUE-PULSE.
- **Mobile:** stepper buttons (≥44px) + tappable nodes; explainer stacks below.

### `PullCurve.tsx` — client

Scrubbable three-track extraction curve (pressure / flow / temperature vs time).

```ts
export function PullCurve(): JSX.Element
```

- **State:** `index` (number → into PULL_CURVE).
- **Data:** `PULL_CURVE: { t, pressure, flow, temp }[]`, `PULL_PHASES[]`.
- **Control:** range input bound to `index` (keyboard + touch), `aria-label`,
  `aria-valuetext` ("12 s · 9.0 bar · 2.1 mL/s · 93 °C").
- **Render:** responsive SVG polylines (3), gridlines, phase bands, time cursor +
  per-track dots; legend chips with live values.
- **A11y:** SVG `role="img"` + `<title>`/`<desc>`; values mirrored in text legend;
  phase caption `aria-live`.
- **Motion:** value pulse + (optional) cursor easing gated by `useReducedMotion`;
  no autoplay in MVP.
- **Reduced motion:** curves + legend + instant cursor remain (plan acceptance).

### `BoilerComparison.tsx` — client

Three selectable cards (single / HX / dual) with an updating explainer.

```ts
export function BoilerComparison(): JSX.Element
```

- **State:** `activeId` (string).
- **Data:** `BOILERS: { id, name, essence, brewTemp, steamTemp, simultaneous,
  stability, ritual, detail, source }[]`.
- **A11y:** cards are `<button>`s with `aria-pressed`; explainer `aria-live`;
  units in text; ✓/✗ have text equivalents (`aria-label`).
- **Motion:** active-card border transition; explainer pulse; reduced-motion gated.
- **Mobile:** cards stack; selection by tap.

## Reused components

| Component | Use here |
|-----------|----------|
| `PageHeader` | header (index 04, kicker "On machines", title, lede) |
| `Reveal` | every section intro, prose block, stat, list row |
| `BigNumber` | § IV stat callouts (≤2 count-ups) |
| `SourceOutboundLink` | `#sources` external links |

No `StatRow` strictly required (myth list + boiler cards are bespoke), but its
markup rhythm is the reference for the § V myth list.

## Page (`src/app/espresso-machine/page.tsx`) — server

- `export const metadata` (title + description).
- Imports the three client components + `PageHeader`, `Reveal`, `BigNumber`,
  `SourceOutboundLink`, and data from `@/lib/espresso`.
- Renders: PageHeader → short answer → § I–§ V → `#sources`.
- All prose is original, written at implementation; copy beats in `copy-outline.md`.

## Data module (`src/lib/espresso.ts`)

Exports: `STANDARDS`, `FLOW_NODES`, `PULL_CURVE`, `PULL_PHASES`, `BOILERS`,
`SCIENCE_STATS`, `MYTHS`, `SOURCES`, plus small format/lookup helpers. Every
numeric field carries (in a comment or a `claim` field) its research claim ID.
