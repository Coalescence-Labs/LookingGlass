# Research

Structured findings produced by research plans in `plans/research/`.

One markdown file per topic. Filename is kebab-case of the topic and
matches the plan that commissioned the work where applicable.

## File format

```yaml
---
topic: What was researched
plan: plans/research/<filename>.md
date: YYYY-MM-DD
agent: claude-code | cursor | human
status: draft | reviewed | applied
---
```

Body (in order):

1. **Summary** — top-line findings in ≤ 150 words. Written for a reader
   who hasn't read the rest of the file.
2. **Method** — what was actually checked. Include the exact commands,
   URLs, or tools used so the work is reproducible.
3. **Findings** — ordered by severity or relevance. Each finding has a
   short title, a description, and (if applicable) a source citation.
4. **Sources** — every external URL or internal file cited. Prefer primary
   sources (provider docs, peer-reviewed papers, standards bodies).
5. **Recommendations** — concrete next steps, each with a repo-relative
   file path and a short description of the change.
6. **Open questions** — anything unresolved or worth a second pass.

## How downstream work uses these files

Implementation plans and commits should cite findings explicitly:
*"per `research/<file>.md`, §Findings 2"*. This keeps the trail from
primary source → research note → code change legible.

When a recommendation ships, update the file's frontmatter `status` to
`applied` and append a closing line at the end of the file:

```
## Applied
- 2026-05-03 · commit abc1234 · addressed Findings 2, 3
- 2026-05-10 · commit def5678 · addressed Finding 1 (partial)
```

Unapplied findings remain in the file until they're either addressed or
explicitly marked stale.

## Why this folder exists

Research has to outlive the conversation that produced it. A finding
tucked into a chat history can't be cited, updated, or picked up by a
different agent. A file in `research/` can.
