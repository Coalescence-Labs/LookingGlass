# Index template (`research/<slug>/README.md`)

The index is the entry point for the whole research folder. Create it in
Phase 1; finish it in Phase 3.

```yaml
---
topic: <Article title from plan>
plan: plans/concepts/<slug>.md
date: YYYY-MM-DD
agent: cursor | claude-code | human
status: draft | reviewed | applied
slug: <slug>
---
```

## Summary

≤ 200 words. Top-line findings across all chunks — written for an implementer
who will not read every file before starting the page.

## Research questions

Answered by the chunk files listed below.

1. …
2. …
3. …

## Chunk index

| File | Scope | Status |
|------|-------|--------|
| `01-<topic>.md` | One-line description | draft / reviewed |
| `02-<topic>.md` | | |
| `numbers-and-units.md` | Quantified claims ledger | |
| `misconceptions.md` | Myths vs mechanism | |
| `visuals-and-data.md` | Interactive/visual requirements | |

## Source map

Each Tier A/B source listed once. Chunks cite into this list by short name.

| Short name | Tier | Type | URL / citation | Cited in chunks |
|------------|------|------|----------------|-----------------|
| NASA Sun Facts | A | fact sheet | https://… | 01, 03, numbers |
| Iben 1991 | A | paper | ApJS 76, 55 | 02, 04 |

## Claim ledger (page-worthy)

Master list of IDs referenced across chunks. Detail lives in chunk files.

| ID | Claim (short) | Value / note | Chunk | Safe for page |
|----|---------------|--------------|-------|---------------|
| C-01 | | | `03-main-sequence.md` | yes |
| C-02 | | | `numbers-and-units.md` | yes — use low bound |

## Recommended article outline

Map planned § sections to research chunks.

1. **§ …** — `01-<topic>.md`, claims C-01–C-03
2. **§ …** — `02-<topic>.md`
3. **Sources & notes** — pull from Source map

## Visual / data brief

What the build phase needs from research (not implementation specs):

| Visual | Purpose | Key claims | Data available? |
|--------|---------|------------|-----------------|
| Timeline | Show Gyr scale | C-04, C-07 | yes — see numbers |
| HR path | Radius vs luminosity | C-12 | partial — see open Q2 |

## Discrepancies (cross-chunk)

Only items that span multiple chunks or affect article framing.

1. …

## Open questions

Ranked: **blocker** / **important** / **nice-to-have**

1. **[blocker]** …
2. **[important]** …

## Handoff notes

Optional. Branch name, date completed, known gaps for the implementer.

## Applied

```
## Applied
- YYYY-MM-DD · PR #NNN · research consumed by src/app/<slug>/page.tsx
```
