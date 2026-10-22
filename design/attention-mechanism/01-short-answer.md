---
section: "Short answer"
pattern: L-SHORT-ANSWER
research-chunks:
  - research/attention-mechanism/01-qkv-and-scaled-dot-product.md
  - research/attention-mechanism/numbers-and-units.md
claim-ids: [C-01, C-02, C-06]
status: draft
---

## Teaching goal

After this section the reader understands that attention is each token reading
every other token and keeping a weighted blend of what's relevant — a soft
lookup, not magic.

## Layout

```
┌───────────────────────────────────────────────┐
│ The short answer            │  In one line     │
│ type-display-m with         │  BigNumber-ish   │
│ italic accent spans         │  + rule + note   │
└───────────────────────────────────────────────┘
```

- Wrapper: `shell pb-20 md:pb-28`
- Grid: `grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16`
- Right column: a stat block (the equation in words / the QKV triple) + rule + note
- Mobile: single column, right block below

## Content

### Prose beats (not final copy)

1. Attention = every token looks at every other token and pulls in a weighted
   blend of what matters to it (`C-01`, `C-02`).
2. Load-bearing accent spans: "reads every other token", "keeps what's
   relevant". (`C-02`)
3. Right column: the three vectors named — query (what I'm looking for), key
   (what I offer), value (what I hand over). (`C-01`)

### Stat callouts / pull quotes

| Label | Value | Source claim |
|-------|-------|--------------|
| The three vectors | Query · Key · Value | C-01 |
| In the original model | 8 heads · 64 dims each | C-06 |

## Motion

| Element | Pattern | delay | notes |
|---------|---------|-------|-------|
| Whole block | M-REVEAL | 0 | above the fold; Reveal triggers on mount |

## Cross-links

- Inline link "a token is a three-quarter-word chunk" → `/one-million-tokens`
  (matches Concept 03's pattern of linking tokens back to Concept 01).

## Acceptance (section-level)

- [ ] Reframes attention as a weighted lookup in one sentence
- [ ] Names query/key/value
- [ ] Numbers (8, 64) trace to C-06
