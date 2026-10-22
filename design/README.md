# Design

Article design specs produced by the [`article-design`](../.cursor/skills/article-design/SKILL.md)
skill. One folder per concept, written **after** `research/<slug>/` and **before**
implementation.

```
design/<slug>/
  README.md              # index — page architecture, motion strategy, checklist
  01-<section>.md        # one file per major § section
  02-<section>.md
  components.md          # component inventory + props/data shapes
  copy-outline.md        # optional — prose beats, not final copy
```

The slug matches the plan filename and route (e.g. `solar-life-cycle` →
`/solar-life-cycle`).

Implementation cites design explicitly: *"per
`design/solar-life-cycle/03-main-sequence.md`, interactive spec"*.

When the article ships, set index `status: applied` and append an **Applied**
section with the PR or commit reference.
