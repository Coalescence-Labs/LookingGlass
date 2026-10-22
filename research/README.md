# Research

Structured findings that outlive the conversation that produced them.
Two layouts, depending on what commissioned the work.

## Concept articles — `research/<slug>/`

**Run the [`article-research`](../.cursor/skills/article-research/SKILL.md)
skill first** when starting a concept from `plans/concepts/`. Output is a
**folder** (not a single file):

```
research/<slug>/
  README.md              # index — source map, claim ledger, outline
  01-<topic-chunk>.md    # one file per research chunk
  02-<topic-chunk>.md
  numbers-and-units.md   # optional
  misconceptions.md      # optional
  visuals-and-data.md    # optional
```

The slug matches the plan filename and future route (e.g.
`solar-life-cycle` → `research/solar-life-cycle/`).

Each chunk file and the index follow the templates in
`.cursor/skills/article-research/`. Cite chunks in implementation as
*`research/<slug>/03-main-sequence.md`, claim C-04*.

## Standalone research briefs — `research/<file>.md`

Findings from `plans/research/` use a **single markdown file** at the
top level of this folder. Filename is kebab-case of the topic and
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
