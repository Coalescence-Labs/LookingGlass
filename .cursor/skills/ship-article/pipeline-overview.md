# Pipeline overview

End-to-end flow for [`ship-article`](SKILL.md).

```mermaid
flowchart TD
  A[Ergon ticket / topic] --> B[Phase 0: Resolve slug + plan]
  B --> C[Phase 1: Ergon In Progress + branch plan/slug]
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
  J --> K[Phase 8: Ergon In Review + walkable handoff]
  K --> L[Phase 9: Handoff to maintainer]
  L --> M[Maintainer manual PR review]
  M --> N[Maintainer merge + Ergon Done]
```

## Actors

| Actor | Responsibility |
|-------|----------------|
| **ship-article agent** | Phases 0–9; open PR; no merge |
| **Maintainer (human)** | Review PR on GitHub; request changes or merge; adjust copy; mark Ergon Done |

## Branches

- **Base:** `develop`
- **Feature:** `plan/<slug>` (e.g. `plan/solar-life-cycle`)
- **Not used:** merge to `main` in this pipeline

## Tracking

Issue tracking is **Ergon** (MCP `user-ergon`), project **Looking Glass**, team **COA**.
Never use Linear for tickets, status, or comments.

## Invoking

| Input | How |
|-------|-----|
| Ergon issue | `@ship-article` skill + issue ID/URL (`COA-123`) |
| Plan path | `@ship-article` + `@plans/concepts/<slug>.md` |
| Topic name | Resolve to plan + Ergon ticket before Phase 1 |

See [`ergon-integration.md`](ergon-integration.md) for MCP details.
