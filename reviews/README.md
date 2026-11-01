# Reviews

Structured review reports for completed concept articles, produced by the
[`article-review`](../.cursor/skills/article-review/SKILL.md) skill.

Run after implementation (and ideally before merging the article PR). One
report per review pass:

```
reviews/<slug>/
  review-YYYY-MM-DD.md    # full report with verdict
  fact-check.md           # optional — claim ledger if large
  links.md                # optional — URL check results if many links
```

When findings are fixed and the article merges, set frontmatter `status:
resolved` and note the fixing commit or PR in an **Resolved** section.
