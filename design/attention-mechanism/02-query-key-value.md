---
section: "§ I — Query, key, value"
pattern: L-PROSE-GRID
research-chunks:
  - research/attention-mechanism/01-qkv-and-scaled-dot-product.md
claim-ids: [C-01]
status: draft
---

## Teaching goal

After § I the reader can name the three vectors each token produces and what
each is for: query = what I'm looking for, key = what I offer, value = what I'll
hand over if chosen.

## Layout

L-PROSE-GRID: `grid gap-10 md:grid-cols-[0.9fr_1.4fr] md:gap-16`
- Left: `type-display-m` heading with italic accent
- Right: `flex flex-col gap-6 type-body max-w-xl` paragraphs
- Section wrapper: `shell pb-24 md:pb-32`; § chrome via L-SECTION-CHROME
- Mobile: stack heading above prose

## Content

### Prose beats (not final copy)

1. Heading: "First, three vectors." (with italic accent on "three vectors")
2. Each token's embedding is projected three ways into a query, a key, a value
   (`C-01`).
3. The lookup metaphor: a library where every book both asks a question and
   wears a label; the query reads the labels (keys); the best-matching books
   hand over their contents (values). One concrete metaphor only.
4. Self-attention: queries, keys, values all come from the same sentence — the
   tokens interrogate each other (`C-01`).

### Stat callouts / pull quotes

| Label | Value | Source claim |
|-------|-------|--------------|
| Per token | 3 vectors: q, k, v | C-01 |

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| § chrome | M-REVEAL | 0 |
| Heading | M-REVEAL | 0 |
| Prose | M-REVEAL | 0.15 |

## Cross-links

- None required; sets up § II equation and § III matrix.

## Acceptance (section-level)

- [ ] Names query, key, value and their roles
- [ ] One metaphor, not three
- [ ] Traces to C-01
