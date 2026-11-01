# Pipeline overview

End-to-end flow for [`ship-article`](SKILL.md).

```mermaid
flowchart TD
  A[Linear ticket / topic] --> B[Phase 0: Resolve slug + plan]
  B --> C[Phase 1: Linear In Progress + branch plan/slug]
  C --> D[Phase 2: article-research]
  D --> D2[commit + push]
  D2 --> E[Phase 3: article-design]
  E --> E2[commit + push]
  E2 --> F[Phase 4: Implement + lint/build/test]
  F --> F2[commit + push]
  F2 --> G[Phase 5: article-humanize]
  G --> G2[commit + push]
  G2 --> H[Phase 6: article-review]
  H --> I{Critical issues?}
  I -->|Yes| F
  I -->|No| H2[commit + push review report]
  H2 --> J[Phase 7: Open PR to develop]
  J --> K[Phase 8: Linear In Review + PR comment]
  K --> L[Phase 9: Handoff to maintainer]
  L --> M[Maintainer manual PR review]
  M --> N[Maintainer merge + Linear Done]
```

## Actors

| Actor | Responsibility |
|-------|----------------|
| **ship-article agent** | Phases 0–9; open PR; no merge |
| **Maintainer (human)** | Review PR on GitHub; request changes or merge; adjust copy; mark Linear Done |

## Branches

- **Base:** `develop`
- **Feature:** `plan/<slug>` (e.g. `plan/solar-life-cycle`)
- **Not used:** merge to `main` in this pipeline

## Single session vs split

`ship-article` runs **one continuous agent session** through PR open. Child
skills that recommend separate sessions (e.g. plan-to-pr reviewer) are
collapsed into Phase 6 self-review for automation; the maintainer provides the
final human review on GitHub.

## Entry points

| You have… | Attach to agent |
|-----------|-----------------|
| Linear issue | `@ship-article` skill + issue ID/URL |
| Plan only | `@ship-article` + `@plans/concepts/<slug>.md` |
| Topic name | `@ship-article` + "ship solar life cycle" (agent finds plan) |

## Related docs

- [`plans/README.md`](../../../plans/README.md) — plan format + house rules
- Individual skills under `.cursor/skills/article-*/`
