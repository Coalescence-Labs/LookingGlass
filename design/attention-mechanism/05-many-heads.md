---
section: "§ IV — Many heads, many jobs"
pattern: L-CARD-GRID
research-chunks:
  - research/attention-mechanism/02-multi-head-attention.md
  - research/attention-mechanism/05-attention-heads-interpretability.md
claim-ids: [C-05, C-06, C-11, C-12, C-13]
status: draft
---

## Teaching goal

After § IV the reader knows transformers run many attention heads in parallel,
each on a slice of the model, and that heads specialise — some track word order,
some grammar, some long-range patterns (induction heads).

## Layout

- Section wrapper: `shell pb-24 md:pb-32`; § chrome, right label "Five short
  notes" or "What the heads do".
- Intro lede explaining the split (512 → 8 × 64) (`C-05`, `C-06`).
- L-CARD-GRID: `grid gap-4 md:grid-cols-2 md:gap-5`, `Reveal delay={i*0.08}`.
  Reuse the WhyItMatters card style (`border border-line p-6 md:p-7`,
  `rgba(15,15,18,0.6)`, `type-mono-sm text-accent` anchor + serif title + body).
- Mobile: single column.

## Content

### Prose beats

1. Intro: rather than one big attention, the model splits its width into heads —
   eight heads of 64 dims in the original, total cost like one full head
   (`C-05`, `C-06`).
2. Cards (4):
   - **The split** — what multi-head is; concat + final projection W_O
     (`C-05`, `C-06`).
   - **Where vs what** — each head factors into a QK circuit (where to look) and
     an OV circuit (what to copy) (`C-11`).
   - **Heads specialise** — previous-token, determiner→noun, verb→subject,
     coreference; many heads are even prunable (`C-12`).
   - **Induction heads** — complete [A][B]…[A] → [B]; a big part of in-context
     learning; built from a previous-token head + a matching head (`C-13`).
3. Tie back: "the three heads you switched between above are toy versions of
   these specialists."

### Stat callouts

| Label | Value | Source claim |
|-------|-------|--------------|
| Original model | 8 heads × 64 dims = 512 | C-06 |

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| § chrome | M-REVEAL | 0 |
| Intro | M-REVEAL | 0.08 |
| Cards | M-REVEAL | i*0.08 |

## Cross-links

- Back-reference to § III heatmap heads.

## Acceptance (section-level)

- [ ] Explains multi-head with 512 = 8×64 (C-05, C-06)
- [ ] QK/OV circuit framing (C-11)
- [ ] Specialisation + induction heads cited to interpretability work (C-12, C-13)
- [ ] No Grok anywhere (house rule) — n/a, no model comparison here
