# Chunk file template

Copy this structure into each numbered chunk under `research/<slug>/`.
Replace placeholders; delete optional sections if empty (do not leave
"N/A" placeholders).

```yaml
---
topic: <Short topic title — matches one article section>
plan: plans/concepts/<slug>.md
date: YYYY-MM-DD
agent: cursor | claude-code | human
status: draft | reviewed | applied
chunk: <NN>                    # e.g. 03 — matches filename prefix
related-chunks:                # cross-links within the same research folder
  - 02-<other-topic>.md
  - 04-<other-topic>.md
---
```

## Summary

≤ 120 words. What a reader needs to know from this chunk alone.

## Method

What was checked, reproducibly:

- URLs fetched (with access date)
- Papers (title, authors, year, DOI or arXiv ID)
- Search queries or tools used
- Internal files read (`src/app/...`, prior `research/...`)

## Claims

Stable IDs for anything that may appear on the page. Implementers cite these.

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-01 | | high / medium / low | | | |
| C-02 | | | | | |

**Confidence:**

- **high** — two Tier A/B sources agree, or one Tier A with no serious dispute
- **medium** — two sources agree but one is Tier B, or single Tier A
- **low** — single Tier B, or conflicting sources with a recommended resolution

## Findings

Narrative detail supporting the claims. Use subheadings per mechanism or
subtopic. Inline citations as `[Author Year]` or `[Source short name]` matching
the Sources section.

### 1. <Finding title>

Description. Tie back to claim IDs (`C-01`).

### 2. <Finding title>

…

## Discrepancies

Skip this section if none.

| Claim ID | Source A says | Source B says | Recommended for page | Rationale |
|----------|---------------|---------------|----------------------|-----------|
| C-03 | | | | |

## Terminology

Optional. Definitions, symbols, units conventions used in this chunk.

| Term | Definition | Source |
|------|------------|--------|
| | | |

## Implications for the article

Bullets only — what the writer/builder should do with this research:

- Suggested § heading or kicker
- Stat callout candidates (link claim IDs)
- Visual ideas (link to `visuals-and-data.md` if separate)
- Cross-links to other Looking Glass concepts (`src/app/...`)

## Sources

Full references for this chunk. Prefer primary.

1. **Author et al. (Year)** — Title. Journal/publisher. DOI or URL.
2. **Organization** — Document title. URL. Accessed YYYY-MM-DD.

## Open questions

- [ ] Unresolved item — what would resolve it

## Applied

Append when the article ships (see `research/README.md`):

```
## Applied
- YYYY-MM-DD · commit <sha> · claims C-01, C-02 on page
```
