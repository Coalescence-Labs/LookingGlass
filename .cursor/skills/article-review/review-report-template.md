# Review report template (`reviews/<slug>/review-YYYY-MM-DD.md`)

```yaml
---
topic: <Article title>
slug: <slug>
route: /<slug>
plan: plans/concepts/<slug>.md
research: research/<slug>/
design: design/<slug>/          # omit if missing
date: YYYY-MM-DD
agent: cursor | claude-code | human
branch: plan/<slug> | cursor/…
commit: <sha>
verdict: approve | approve-with-nits | request-changes
status: open | resolved
---
```

## Verdict

**Approve** | **Approve with nits** | **Request changes**

<Rationale in one sentence.>

## Critical (must fix before merge)

- [ ] …

*(None.)*

## Fact check

**Summary:** N claims checked — N match, N drift, N unsourced, N unverifiable.

See [`fact-check.md`](fact-check.md) for full ledger.

| Claim ID | Page location | Status | Evidence |
|----------|---------------|--------|----------|
| C-01 | `page.tsx` short answer | Match | … |

## Links

**Summary:** N URLs checked — N passed, N failed.

| URL | Status | Final URL | Linked from | Notes |
|-----|--------|-----------|-------------|-------|
| https://… | 200 | … | `page.tsx:347` | OK |

## Build & CI

```text
bun run lint  → exit ?
bun run build → exit ?
bun test      → exit ?
```

<Warnings or notes. CI workflow parity if `.github/workflows/` exists.>

## Accessibility

### Critical / High

- …

### Medium / Low

- …

### Manual passes

| Pass | Result | Notes |
|------|--------|-------|
| Keyboard navigation | Pass / Fail / Not run | |
| Screen reader | Pass / Fail / Not run | |
| Reduced motion | Pass / Fail | |

## Suggestions

- …

## Questions

- …

## Acceptance mapping

| Plan acceptance bullet | Status | Evidence |
|------------------------|--------|----------|
| | Met / Partial / Not met | |

## Resolved

*(Fill when findings are addressed.)*

```
- YYYY-MM-DD · commit <sha> · fixed Critical 1, 2; link re-check pass
```
