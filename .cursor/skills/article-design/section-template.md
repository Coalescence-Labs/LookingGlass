# Section template (`design/<slug>/0N-<section>.md`)

One file per major section (short answer counts as `01-short-answer.md`).

```yaml
---
section: "§ I — <title>"    # or "Short answer" for 01
pattern: P-VIEWPORT         # from pattern-catalog.md
research-chunks:
  - research/<slug>/02-<chunk>.md
claim-ids: [C-04, C-05, C-07]
status: draft | reviewed | applied
---
```

## Teaching goal

One sentence: after this section, the reader understands ___.

## Layout

ASCII or description of the grid:

```
┌─────────────────────────────────────────────┐
│ § chrome (L-SECTION-CHROME)                 │
├─────────────────────────────────────────────┤
│ type-lede intro paragraph                   │
├─────────────────────────────────────────────┤
│ [ interactive panel ]                       │
└─────────────────────────────────────────────┘
```

**Tailwind sketch** (key classes only):

- Section wrapper: `shell pb-24 md:pb-32`
- Grid: `grid md:grid-cols-[…] gap-…`
- Mobile collapse: describe what stacks

## Content

### Prose beats (not final copy)

Bullets the implementer expands into original prose. Cite claim IDs.

1. … (`C-04`)
2. … (`C-05`)

### Stat callouts / pull quotes

| Label | Value | Source claim |
|-------|-------|--------------|
| | | C-04 |

## Interactive spec

Skip if prose-only (`pattern: prose-only`).

### Pattern

`P-SLIDER-LOG` — see pattern-catalog.md

### Reader actions

- User does X → Y updates on screen

### UI chrome

- Panel border/background (standard interactive chrome)
- Controls: slider range, buttons, labels (`type-mono-sm`)
- Live outputs: which values animate (`M-VALUE-PULSE`)

### Data

```ts
// Sketch — full types go in components.md
type Stage = {
  name: string;
  startGyr: number;
  // …
};
```

- Static JSON: `public/data/<slug>-….json` — describe contents
- Lib helpers: `src/lib/<slug>.ts` — list functions

### Mobile & touch

- How controls reflow at ≤ 480px
- Touch targets (min 44px where applicable)

### Accessibility

- `aria-label` on interactive region
- Keyboard: Tab order, arrow keys for slider
- Reduced motion: what becomes static

## Motion

| Element | Pattern | delay | notes |
|---------|---------|-------|-------|
| Section chrome | M-REVEAL | 0 | |
| Intro lede | M-REVEAL | 0.08 | |
| Interactive | — | mount visible | no whileInView |

## Cross-links

- Link to `/context-window` because …
- Anchor on sibling `#sources` if methodology shared

## Acceptance (section-level)

- [ ] Teaches the goal without reading other sections
- [ ] All numbers trace to claim IDs listed above
- [ ] Interactive works mouse + touch
- [ ] Reduced motion verified
