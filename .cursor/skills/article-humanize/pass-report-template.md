# Pass report template (`humanize/<slug>/pass-YYYY-MM-DD.md`)

```yaml
---
topic: <Article title>
slug: <slug>
plan: plans/concepts/<slug>.md
date: YYYY-MM-DD
agent: cursor | claude-code | human
branch: plan/<slug> | cursor/…
commit: <sha after humanize commit>
status: draft | applied
---
```

## Summary

≤ 100 words. What changed, overall voice direction, any remaining concerns.

## Files edited

| File | Sections touched |
|------|------------------|
| `src/app/<slug>/page.tsx` | lede, § I intro, sources |
| `src/components/<slug>/Foo.tsx` | panel instructions |
| `src/lib/<slug>.ts` | stage blurbs |

## AI tells removed

| Severity | Count fixed | Count deferred |
|----------|-------------|----------------|
| High | | |
| Medium | | |
| Low | | |

### Notable fixes

1. **Before:** "In today's rapidly evolving AI landscape, context windows play a crucial role…"  
   **After:** "A language model reads through a window, not a book."  
   **File:** `page.tsx` lede

2. …

## Before / after samples

### Lede

**Before:** …  
**After:** …

### § I intro

**Before:** …  
**After:** …

## Facts unchanged (verified)

Confirm numbers, model names, dates, and citation URLs were not altered:

- [ ] Short answer figures match `src/lib/<slug>.ts`
- [ ] Sources section citations intact
- [ ] Simulated transcript facts preserved (wording may change)

## Build

```text
bun run lint  → exit ?
bun run build → exit ?
```

## Deferred to review

Items that need fact-check or maintainer judgment:

- …

## Applied

```
- YYYY-MM-DD · PR #NNN · humanize merged with article
```
