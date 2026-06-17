# Design index template (`design/<slug>/README.md`)

```yaml
---
topic: <Article title from plan>
plan: plans/concepts/<slug>.md
research: research/<slug>/
date: YYYY-MM-DD
agent: cursor | claude-code | human
status: draft | reviewed | applied
slug: <slug>
route: /<slug>
concept-index: "04"          # from plan, if assigned
series-id: <series-id>       # e.g. language-models
---
```

## Summary

≤ 150 words. The design intent — what the reader will *feel* and *understand*
after scrolling the page, and what the primary interactive teaches.

## Page architecture

```
PageHeader
  └─ Short answer (L-SHORT-ANSWER)
§ I — <title> (<pattern-id>)
§ II — <title> (<pattern-id>)
§ III — …
Sources (id="sources")
```

## Section index

| File | § | Pattern | Primary teaching goal |
|------|---|---------|----------------------|
| `01-short-answer.md` | — | L-SHORT-ANSWER | |
| `02-<topic>.md` | § I | P-VIEWPORT | |
| `03-<topic>.md` | § II | P-TIMELINE | |

## Motion strategy

One paragraph: where Reveal stagger applies, which client components use
Motion, reduced-motion approach, any decorative M-DECOR-STAGGER elements.

## File map (implementation)

**Create**

- `src/app/<slug>/page.tsx`
- `src/lib/<slug>.ts`
- `src/components/<slug>/<Component>.tsx`
- `public/data/<slug>-*.json` (if any)

**Modify**

- `src/lib/concepts.ts` — series + concept entry

## concepts.ts entry (draft)

```ts
{
  index: "04",
  slug: "<slug>",
  title: "",
  subtitle: "",
  kicker: "",
  seriesId: "",
  status: "live",
  readingTime: "N min",
}
```

## Research traceability

| § | Research chunks | Key claim IDs |
|---|-----------------|---------------|
| Short answer | `numbers-and-units.md` | C-01, C-04 |
| § I | `01-<chunk>.md` | C-07–C-12 |

## Accessibility summary

- Interactive aria-labels (list)
- Keyboard paths
- Reduced motion behaviour
- Screen-reader notes for visuals

## Open design questions

1. **[blocker]** …
2. **[important]** …

## Applied

```
## Applied
- YYYY-MM-DD · PR #NNN · shipped at src/app/<slug>/page.tsx
```
