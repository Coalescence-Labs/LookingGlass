# Humanize passes

Voice and prose polish reports for concept articles, produced by the
[`article-humanize`](../.cursor/skills/article-humanize/SKILL.md) skill.

Unlike research or design folders, this skill **edits copy in the repo** and
logs what changed here for traceability.

```
humanize/<slug>/
  pass-YYYY-MM-DD.md    # before/after notes, AI tells removed, open items
```

When the pass is merged, set frontmatter `status: applied`.
