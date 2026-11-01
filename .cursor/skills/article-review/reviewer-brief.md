# Reviewer output format (article review)

Use these headings **exactly** in `reviews/<slug>/review-YYYY-MM-DD.md` and in
chat when handing back to the implementer.

## Verdict

One of: **Approve**, **Approve with nits**, **Request changes**.

One sentence rationale.

## Critical (must fix before merge)

Blockers only:

- Wrong or unsourced factual claim (cite claim ID + file:line)
- Dead or misdirected external link (URL + status code)
- `bun run lint` / `build` / `test` failure introduced by this branch
- WCAG **critical** or **high** a11y finding on the article route
- Plan acceptance item **Not met**

Empty if none.

## Fact check

Summary counts: Match / Drift / Unsourced / Unverifiable.

Link to `fact-check.md` if the full ledger is long. Otherwise inline table:

| Claim ID | Page location | Status | Evidence |
|----------|---------------|--------|----------|
| C-04 | short answer | Match | NASA fact sheet 2026-06-17 |

## Links

Summary: N checked, N passed, N failed.

| URL | Status | Final URL | Linked from | Notes |
|-----|--------|-----------|-------------|-------|

Failed links are always **Critical**.

## Build & CI

```
bun run lint   → exit 0
bun run build  → exit 0
bun test       → exit N passed
```

Note any warnings worth fixing. Record commit SHA reviewed.

## Accessibility

Findings by severity:

### Critical / High

- …

### Medium / Low

- …

### Not run (if applicable)

- Keyboard / screen reader — reason

## Suggestions

Optional polish. Not blockers.

## Questions

For implementer or maintainer.

## Acceptance mapping

| Plan acceptance bullet | Status | Evidence |
|------------------------|--------|----------|
| `bun run build` clean | Met | exit 0 on abc1234 |
| Every numeric claim cites primary source | Partial | § II missing citation |

Status: **Met** / **Partial** / **Not met**

## Rules

- Reviewer session must be independent from implementer.
- Re-fetch primary sources; do not trust research files blindly if dated.
- Run curl/link checks and build commands — do not mark pass without output.
- **Request changes** if any Critical item exists.
