---
name: article-review
description: >-
  Reviews a completed Looking Glass concept article before merge. Fact-checks
  every claim against research, verifies external links, runs lint/build/test,
  and audits accessibility. Produces a structured report in reviews/<slug>/.
  Use when an article is implemented and needs sign-off, or as the reviewer
  pass for concept plan PRs.
---

# Article review

Use this skill on a **completed concept article** — after implementation,
before the maintainer merges. The reviewer should be a **separate agent
session** from the implementer (same rule as [`plan-to-pr`](../plan-to-pr/SKILL.md)).

Output is a durable report in `reviews/<slug>/` that the implementer can work
through item by item.

## When to run

- A concept page exists under `src/app/<slug>/` and the implementer requests
  review.
- Session B of `plan-to-pr` for a **`plans/concepts/`** plan — attach this
  skill instead of (or alongside) the generic [`reviewer-brief.md`](reviewer-brief.md).
- User asks to fact-check, link-check, or a11y-audit a live article.

## Inputs (required)

1. **Slug** — e.g. `solar-life-cycle` (route `/solar-life-cycle`)
2. **Plan** — `@plans/concepts/<slug>.md` (Acceptance = contract)
3. **Research** — `@research/<slug>/` (claim ledger, source map, chunks)
4. **Design** — `@design/<slug>/` (if it exists — expected section layout)
5. **Implementation** — inspect on the feature branch:

| Path | Purpose |
|------|---------|
| `src/app/<slug>/page.tsx` | Prose, metadata, sources section |
| `src/components/<slug>/` | Interactives |
| `src/lib/<slug>.ts` | Data layer |
| `public/data/<slug>-*` | Precomputed JSON |
| `src/lib/concepts.ts` | Archive entry |

6. **Reference articles** — skim one sibling page for citation and a11y norms.

## Output

Create **`reviews/<slug>/review-YYYY-MM-DD.md`** using
[`review-report-template.md`](review-report-template.md).

For large articles, split appendices:

- `fact-check.md` — full claim ledger table
- `links.md` — URL status table

Set frontmatter `verdict: approve | approve-with-nits | request-changes`.

## Review workflow

Work in order. Do not skip a phase because an earlier phase passed.

### Phase 1 — Scope the surface

1. Read plan **Acceptance** and **Goal**.
2. List every file in the article's implementation footprint (table above).
3. Read `#sources` on the page and the research source map.
4. Note the branch and commit SHA under review.

```bash
git rev-parse HEAD
git diff origin/develop...HEAD --stat
```

### Phase 2 — Fact check

**Goal:** every factual claim on the page is sourced, accurate, and
traceable to research.

#### 2a. Extract claims

Walk the page and components. Record:

- Every **number** (with units) shown in prose, stats, or interactives
- Every **named entity** (model, stage, protocol, standard)
- Every **comparative statement** ("faster", "larger", "first")
- Every **date / version** ("April 2026", "GPT-5.4")
- Data in `src/lib/<slug>.ts` and JSON that feeds the UI

Use the research **claim ledger** (`research/<slug>/README.md` and
`numbers-and-units.md`) as the expected set. Flag:

- **Orphan claims** — on page but not in research
- **Orphan research** — in research but not reflected on page (may be OK)
- **Stale claims** — research or lib `VERIFIED_DATE` older than plan expects

#### 2b. Cross-check sources

For each page-worthy claim (or a representative sample if >30 claims, but
**never skip** hero stats, short-answer figures, or interactive axis bounds):

1. Find the research chunk + claim ID.
2. Open the **primary source** URL from the research source map.
3. Re-fetch or re-read the source (same day as review).
4. Record: **Match** / **Drift** / **Unverifiable** / **Unsourced**.

Prefer provider docs, papers, and standards over tertiary sources. If the page
 cites a number that differs from research, the review fails unless the
 implementer documents why in `#sources`.

#### 2c. Data layer integrity

Verify rendered output matches lib/JSON:

- Constants in `src/lib/<slug>.ts` match research numbers
- Interactive derivations (sliders, simulations) use the same constants as prose
- No hardcoded magic numbers in components that contradict lib
- `concepts.ts` title/subtitle/kicker match plan

#### 2d. House rules

- Original prose (no scraped third-party text in demos/transcripts)
- No Grok in AI-series content
- Primary sources listed in `#sources` for every major claim category
- Hedge language where data is approximate ("about", "roughly")

Document findings in the report **Fact check** section. Use
[`fact-check-template.md`](fact-check-template.md) for the ledger table.

### Phase 3 — Link verification

**Goal:** every external URL returns a successful response and points at the
 intended resource.

#### 3a. Collect URLs

```bash
SLUG=solar-life-cycle   # replace
rg -o 'https?://[^"'\''`\s\)]+' \
  "src/app/${SLUG}/" \
  "src/components/${SLUG}/" \
  "src/lib/${SLUG}.ts" \
  2>/dev/null | sort -u
```

Also collect URLs from:

- `src/lib/*.ts` records (e.g. `ModelSpec.sources`)
- `#sources` section of `page.tsx`
- Research source map (spot-check key sources cited on page)

Include `SourceOutboundLink` and plain `<a href="https://…">` targets.

#### 3b. Check each URL

Run HTTP checks (reviewer must execute, not assume):

```bash
check_url() {
  local url="$1"
  local code
  code=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 20 \
    -A 'LookingGlass-LinkCheck/1.0' "$url" 2>/dev/null || echo "000")
  echo "$code $url"
}
export -f check_url
# paste URLs, one per line:
# printf '%s\n' "https://…" | xargs -I{} bash -c 'check_url "$@"' _ {}
```

Record for each URL:

| Field | Notes |
|-------|-------|
| Status | 2xx = pass; 3xx note final destination; 4xx/5xx/000 = fail |
| Final URL | After redirects |
| Linked from | file:line or section name |
| Claim / context | why this link is on the page |

**Pass criteria:** all source links return **2xx** or a stable **3xx** to the
correct document. Flag `403` from bot-blocking hosts — retry with browser
`WebFetch` or note **Manual verify required** with evidence.

Internal links (`/context-window`, `#sources`) — verify route exists and
anchor IDs match.

Document in report **Links** section; use `links.md` if >15 URLs.

### Phase 4 — CI / build verification

**Goal:** the branch passes the same checks CI would run.

Run on the **review branch** (must execute commands):

```bash
bun install          # if node_modules may be stale
bun run lint
bun run build
bun test
```

Also check:

- [ ] No TypeScript errors surfaced during build
- [ ] New route appears in build output (search build log for `/<slug>`)
- [ ] If `.github/workflows/` exists, read workflows and confirm the same
      commands run in CI — note any gap

**Do not** start `bun run dev` unless the user explicitly overrides house rules.

Record exact commands, exit codes, and any warnings in **Build & CI**.
Failures are **Critical** unless clearly pre-existing on `develop` (note
evidence: run same command on `develop` to compare).

### Phase 5 — Accessibility audit

**Goal:** the article meets WCAG 2.2 AA intent for the checks below.

Audit **the article route** and its components. Use automated tools where
possible, then manual passes.

#### 5a. Automated (run if available)

```bash
# Optional — install if not present; skip gracefully if network blocked
npx --yes @axe-core/cli http://localhost:3000/<slug>
```

If no dev server is allowed, run **static** checks and manual keyboard/SR
review on built HTML is not available — rely on manual + code inspection.

Static/code inspection checklist (always run):

| Check | How |
|-------|-----|
| One `<h1>` | `page.tsx` + `PageHeader` — only one h1 per page |
| Heading order | No skipped levels in section headings |
| Interactive labels | Every `<input>`, `<button>`, chart has `aria-label` or visible `<label>` |
| Decorative visuals | SVGs/decoration use `aria-hidden` |
| Focus visible | `:focus-visible` in `globals.css`; interactive borders on focus |
| Reduced motion | `useReducedMotion()` in client components; `@media (prefers-reduced-motion)` in CSS |
| Colour-only meaning | Status not conveyed by gold/accent alone — text/icon backup |
| Touch targets | Buttons/controls ≥44px where feasible on mobile |
| Link purpose | Link text describes destination (not "click here") |

#### 5b. Keyboard navigation (manual)

On the built page (maintainer may need to run dev — or reviewer uses preview URL if provided):

1. Tab through entire page in DOM order
2. Reach every interactive control without mouse
3. Operate sliders with arrow keys
4. Focus ring visible on all focusable elements
5. No keyboard traps in modals/panels

If reviewer cannot run the live page, mark **Keyboard** as **Not run —
code review only** and list controls that need manual verification.

#### 5c. Screen reader (manual or code review)

- Page title (`metadata.title`) matches `<h1>` topic
- `SplitWords` title exposes `aria-label` on wrapper
- Interactive regions announce purpose
- Dynamic values (slider outputs) either visible text or `aria-live` where needed
- Simulations (`ChatFallout`, steppers) — buttons have clear names

Reference severity levels from `plans/research/accessibility-audit.md`:
**critical / high / medium / low**.

Document in **Accessibility** section with file paths for each finding.

### Phase 6 — Design & acceptance

1. Map each plan **Acceptance** bullet → Met / Partial / Not met.
2. If `design/<slug>/` exists, confirm each § section and primary interactive
   were implemented.
3. Check cross-links to sibling concepts work.
4. Confirm `concepts.ts` entry and landing page grouping (if in Acceptance).

### Phase 7 — Verdict & handoff

Fill [`reviewer-brief.md`](reviewer-brief.md) output format in the report.

| Verdict | When |
|---------|------|
| **Approve** | All Critical empty; fact-check and links pass; build green |
| **Approve with nits** | Only Suggestions-level items remain |
| **Request changes** | Any Critical: wrong fact, dead link, build fail, a11y critical/high |

Post handoff to implementer:

- Report path
- Verdict
- Critical count
- Commands to re-run after fixes

**Do not** approve merge if verdict is **Request changes**.

## Verification checklist (reviewer)

- [ ] Report written to `reviews/<slug>/review-YYYY-MM-DD.md`
- [ ] Every acceptance criterion explicitly mapped
- [ ] Fact-check ledger complete (or sample justified for huge pages)
- [ ] All external URLs checked with recorded status codes
- [ ] `bun run lint`, `build`, `test` executed with results recorded
- [ ] A11y section covers keyboard, labels, motion, headings
- [ ] Verdict matches findings severity
- [ ] Independent session — reviewer did not implement the same branch

## Integration with plan-to-pr

For concept plans, Session B should:

1. Attach this skill + `@plans/concepts/<slug>.md`
2. Check out implementer's branch
3. Run all phases above
4. Block PR ready-to-merge if **Request changes**

Generic engineering plans continue using [`reviewer-brief.md`](../plan-to-pr/reviewer-brief.md) only.

## Additional resources

- Report template: [review-report-template.md](review-report-template.md)
- Fact-check ledger: [fact-check-template.md](fact-check-template.md)
- Output format: [reviewer-brief.md](reviewer-brief.md)
- A11y reference plan: [`plans/research/accessibility-audit.md`](../../../plans/research/accessibility-audit.md)
- Review folder conventions: [`reviews/README.md`](../../../reviews/README.md)
