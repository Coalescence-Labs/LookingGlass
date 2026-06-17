# Run log template (`ship/<slug>/run-YYYY-MM-DD.md`)

```yaml
---
topic: <Article title>
slug: <slug>
plan: plans/concepts/<slug>.md
linear-id: COA-42
linear-url: https://linear.app/…
date: YYYY-MM-DD
agent: cursor | claude-code | human
branch: plan/<slug>
status: in-progress | pr-open | merged
pr-url: 
pr-number: 
head-sha: 
review-verdict: approve | approve-with-nits | request-changes
---
```

## Summary

≤ 100 words. What shipped, PR link, waiting on maintainer manual review.

## Phase log

| Phase | Skill / action | Status | Commit | Notes |
|-------|----------------|--------|--------|-------|
| 0 | Resolve topic | ✅ | | slug from COA-42 |
| 1 | Linear + git setup | ✅ | abc1234 | In Progress |
| 2 | article-research | ✅ | def5678 | 6 chunks |
| 3 | article-design | ✅ | | |
| 4 | Implement | ✅ | | lint/build/test pass |
| 5 | article-humanize | ✅ | | |
| 6 | article-review | ✅ | | Approve with nits |
| 7 | PR opened | ✅ | | #NNN |
| 8 | Linear updated | ✅ | | In Review + comment |
| 9 | Handoff | ✅ | | |

## Linear history

| When | Action | State |
|------|--------|-------|
| start | update_issue | In Progress |
| PR open | create_comment | (PR link) |
| PR open | update_issue | In Review |

## Artifacts

| Path | Status |
|------|--------|
| `research/<slug>/` | complete |
| `design/<slug>/` | complete |
| `humanize/<slug>/` | complete |
| `reviews/<slug>/` | complete |
| `src/app/<slug>/` | complete |

## Verification commands

```text
bun run lint  → exit 0 @ <sha>
bun run build → exit 0 @ <sha>
bun test      → exit 0 @ <sha>
```

## Open items for maintainer

- Nits from review (non-blocking)
- Manual copy/visual adjustments on PR branch

## Merged

*(Maintainer fills after merge.)*

```
- YYYY-MM-DD · PR #NNN merged to develop
- Plan status → done
- Linear → Done
```
