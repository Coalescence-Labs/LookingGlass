# Fact-check ledger template (`reviews/<slug>/fact-check.md`)

Optional appendix when the article has many claims. The main report links here.

```yaml
---
slug: <slug>
review: reviews/<slug>/review-YYYY-MM-DD.md
date: YYYY-MM-DD
---
```

## Summary

| Status | Count |
|--------|-------|
| Match | |
| Drift | |
| Unsourced | |
| Unverifiable | |

## Claims

| Claim ID | Claim (short) | Page / component | Research source | Primary URL | Status | Notes |
|----------|---------------|------------------|-----------------|-------------|--------|-------|
| C-04 | Main-sequence lifetime ~10 Gyr | `page.tsx` § II | `03-main-sequence.md` | NASA Sun Facts | Match | fetched 2026-06-17 |
| — | "about eight novels" | short answer | derived from C-01 | Concept 01 | Match | calc verified |

## Drift details

For each **Drift** row, explain what the page says vs what the source says and
recommend which to use.

## Unsourced on page

Claims appearing on the page with no research claim ID — must be sourced or removed before merge.

## Lib / JSON cross-check

| Field | `src/lib/<slug>.ts` | Research | Page display | Match? |
|-------|---------------------|----------|--------------|--------|
| | | | | |

## Spot-check log

Reproducible record of sources re-fetched during review:

1. **NASA Sun Fact Sheet** — `curl -sL …` — 2026-06-17 — used for C-04, C-07
2. …
