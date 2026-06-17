---
name: ship-article
description: >-
  End-to-end Looking Glass concept article pipeline from a Linear ticket to an
  open PR on develop. Claims the ticket and plan, branches from develop, runs
  research → design → implement → humanize → review, fixes blockers, pushes,
  and opens a PR. Maintainer merges manually after reviewing the PR. Use when
  the user gives a Linear issue, article topic, or asks to ship/build a concept.
---

# Ship article

Orchestrates the full concept-article pipeline from **Linear ticket → open PR
on `develop`**. One article per run. Executes every child skill in order; the
maintainer reviews the PR manually — **do not merge**.

## Child skills (run in this order)

| Step | Skill | Output |
|------|-------|--------|
| 1 | [`article-research`](../article-research/SKILL.md) | `research/<slug>/` |
| 2 | [`article-design`](../article-design/SKILL.md) | `design/<slug>/` |
| 3 | Implement (plan + design) | `src/app/<slug>/`, components, lib |
| 4 | [`article-humanize`](../article-humanize/SKILL.md) | polished copy + `humanize/<slug>/` |
| 5 | [`article-review`](../article-review/SKILL.md) | `reviews/<slug>/` — fix **Critical** before PR |
| 6 | Open PR | GitHub PR → `develop` |

Implementation details for git/PR mechanics also follow
[`plan-to-pr`](../plan-to-pr/SKILL.md) where they don't conflict with this
skill.

## Preconditions

- **`develop`** is the base branch (`git fetch origin develop`).
- **Linear MCP** authenticated in Cursor (`mcp_get_tools` on server `Linear`
  must not show `needsAuth`). See [`linear-integration.md`](linear-integration.md).
- **`gh`** CLI authenticated for PR creation (`gh auth status`), or create the
  PR in the GitHub UI using the pushed branch.
- A matching **concept plan** exists: `plans/concepts/<slug>.md`.
- Child skill folders exist under `.cursor/skills/` (merge skill PRs if missing).

## Input

Provide **one** of:

| Input | Example |
|-------|---------|
| Linear issue ID | `COA-42`, `LG-123` |
| Linear issue URL | `https://linear.app/…/issue/COA-42/…` |
| Topic + issue | "Ship the solar life cycle article — Linear COA-42" |
| Plan path | `@plans/concepts/solar-life-cycle.md` (resolve slug from filename) |

The ticket title/description should match a plan in `plans/concepts/`. If no
plan exists, **stop** and ask the maintainer to add one before shipping.

## Output

1. Feature branch `plan/<slug>` pushed to origin
2. **Draft or ready PR** into `develop` with summary, artifacts, and review verdict
3. Linear issue **In Progress** at start → **In Review** (or equivalent) with PR link at end
4. Run log: `ship/<slug>/run-YYYY-MM-DD.md` ([template](run-log-template.md))
5. Plan remains `status: in-progress` until the maintainer merges (then `done`)

**Out of scope for this skill:** merging the PR, marking Linear Done, or
post-merge plan cleanup (maintainer handles after manual review).

---

## Phase 0 — Resolve topic

1. **Fetch the Linear issue** via MCP (see [`linear-integration.md`](linear-integration.md)).
2. Record: identifier, title, description, URL, current status.
3. **Derive slug:**
   - Prefer slug in ticket description (`slug: solar-life-cycle`) or labels
   - Else kebab-case from title ("Solar life cycle" → `solar-life-cycle`)
   - Else match ticket title to a plan under `plans/concepts/`
4. Confirm `plans/concepts/<slug>.md` exists. Read it fully.
5. Confirm slug is not already **live** in `src/lib/concepts.ts` with
   `status: "live"` (unless explicitly refreshing an existing article).
6. Write `ship/<slug>/run-YYYY-MM-DD.md` scaffold (frontmatter + empty phase table).

---

## Phase 1 — Linear + git setup

### 1a. Linear → In Progress

Update the issue **before** writing code:

- **Status** → team workflow state for in-progress (often `In Progress` /
  `Started`). Discover valid states via Linear MCP if unsure.
- **Comment** on the issue:

  ```text
  Agent started ship-article pipeline.
  Plan: plans/concepts/<slug>.md
  Branch: plan/<slug> (will push shortly)
  ```

If Linear MCP is unavailable, **stop** and ask the user to authenticate or
update the ticket manually; do not proceed silently.

### 1b. Branch from develop

Cloud agents and local clones:

```bash
git fetch origin develop
git checkout develop
git pull origin develop
git checkout -b plan/<slug>
```

Use `plan/<slug>` (matches existing article branches like `plan/solar-life-cycle`).

### 1c. Claim the plan

In `plans/concepts/<slug>.md` frontmatter:

```yaml
status: in-progress
last-updated: YYYY-MM-DD
```

Commit:

```bash
git add plans/concepts/<slug>.md ship/<slug>/run-*.md
git commit -m "chore(<slug>): claim plan and start ship-article pipeline"
```

---

## Phase 2 — Research

Follow [`article-research`](../article-research/SKILL.md) **completely**.

- Attach `@plans/concepts/<slug>.md`
- Produce `research/<slug>/` with index, chunks, source map, claim ledger
- Index `status: draft` minimum before continuing

Commit:

```bash
git add research/<slug>/
git commit -m "research(<slug>): cross-referenced findings for concept article"
```

Update run log: Phase 2 ✅, commit SHA.

---

## Phase 3 — Design

Follow [`article-design`](../article-design/SKILL.md) **completely**.

- Inputs: plan + `research/<slug>/`
- Produce `design/<slug>/` (index, section specs, `components.md`)
- Read live reference pages (Concepts 01–03)

Commit:

```bash
git add design/<slug>/
git commit -m "design(<slug>): page architecture and interactive specs"
```

Update run log: Phase 3 ✅.

---

## Phase 4 — Implement

Build the article per **plan Acceptance**, **design spec**, and house rules in
`plans/README.md`.

### Implementation checklist

- [ ] `src/app/<slug>/page.tsx` — PageHeader, short answer, § sections, `#sources`
- [ ] `src/components/<slug>/` — interactives per design
- [ ] `src/lib/<slug>.ts` — typed data; numbers from research claim IDs
- [ ] `src/lib/concepts.ts` — series + concept entry
- [ ] `public/data/` — precomputed JSON if design requires (no runtime inference)
- [ ] Original prose only; cite sources in `#sources`
- [ ] Motion: `Reveal` for content; `useReducedMotion` in client components
- [ ] No dev server — verify with build only

### Verify

```bash
bun install   # if needed
bun run lint
bun run build
bun test
```

All must exit 0. Fix failures before committing.

Commit in logical chunks if large, or one commit:

```bash
git add src/ public/data/  # paths per plan
git commit -m "feat(<slug>): ship concept article page and interactives"
```

Update run log: Phase 4 ✅, acceptance self-check.

---

## Phase 5 — Humanize

Follow [`article-humanize`](../article-humanize/SKILL.md).

- Rewrite AI-shaped copy; **facts unchanged**
- Log pass in `humanize/<slug>/pass-YYYY-MM-DD.md`
- Re-run `bun run lint && bun run build`

Commit:

```bash
git add src/ humanize/<slug>/
git commit -m "humanize(<slug>): polish prose voice"
```

Update run log: Phase 5 ✅.

---

## Phase 6 — Review (automated gate)

Follow [`article-review`](../article-review/SKILL.md) in **this same session**
(self-review is acceptable for the automated gate; the maintainer still reviews
the PR manually afterward).

- Fact-check against `research/<slug>/`
- Curl-check external links
- Re-run lint / build / test
- A11y checklist on the article route
- Write `reviews/<slug>/review-YYYY-MM-DD.md` with verdict

### If verdict is **Request changes**

1. Fix every **Critical** item
2. Re-run review phases that failed
3. Commit fixes (`fix(<slug>): address review criticals`)
4. Repeat until verdict is **Approve** or **Approve with nits**

**Do not open the PR** while Critical items remain.

Update run log: Phase 6 ✅, verdict, review report path.

---

## Phase 7 — Push + open PR

```bash
git push -u origin plan/<slug>
```

Create PR into **`develop`**:

```bash
gh pr create --base develop --head plan/<slug> \
  --title "feat: <plan title from frontmatter>" \
  --body "$(cat <<EOF
## Summary
<1–3 sentences — what the reader gets from this concept>

## Linear
- Issue: <COA-NNN> — <url>

## Artifacts
- Plan: \`plans/concepts/<slug>.md\`
- Research: \`research/<slug>/\`
- Design: \`design/<slug>/\`
- Humanize pass: \`humanize/<slug>/\`
- Review: \`reviews/<slug>/\` — **<verdict>**

## Route
/\`<slug>\`

## Verification
- [x] \`bun run lint\`
- [x] \`bun run build\`
- [x] \`bun test\`
- [x] article-review completed

## Maintainer
PR is ready for **manual review**. Do not auto-merge. Adjust copy or visuals in
follow-up commits on this branch as needed.
EOF
)"
```

If `gh` is unavailable, push and give the compare URL:
`https://github.com/Coalescence-Labs/LookingGlass/compare/develop...plan/<slug>`

Use **draft PR** only if the user or team prefers; default **ready for review**.

Update run log: PR URL, head SHA.

---

## Phase 8 — Linear handoff (post-PR)

Update the Linear issue:

- **Status** → in-review state (e.g. `In Review`, `Review`, or keep `In Progress`
  with PR linked — match team workflow)
- **Comment:**

  ```text
  PR ready for manual review: <PR URL>
  Branch: plan/<slug>
  Review verdict: <Approve | Approve with nits>
  Run log: ship/<slug>/run-YYYY-MM-DD.md
  ```

- **Link PR** in issue if Linear MCP supports attachment/link fields

**Do not** set Linear to Done or plan to `done` — the maintainer does that after
merge and any PR adjustments.

Commit run log final state and push if not already included:

```bash
git add ship/<slug>/
git commit -m "docs(<slug>): ship-article run log with PR link"
git push
```

---

## Phase 9 — Chat handoff

Post to the user:

1. PR link
2. Linear issue link + status
3. Route: `/<slug>`
4. Review verdict summary (nits only, or all clear)
5. Explicit note: **awaiting your manual PR review** — no merge performed

---

## Master checklist

Copy into the run log and check off:

- [ ] Linear issue fetched; slug resolved; plan exists
- [ ] Linear → In Progress + start comment
- [ ] Branch `plan/<slug>` from `develop`
- [ ] Plan claimed `in-progress`
- [ ] `research/<slug>/` complete
- [ ] `design/<slug>/` complete
- [ ] Article implemented; plan acceptance met
- [ ] `bun run lint` / `build` / `test` pass
- [ ] `humanize/<slug>/` pass complete
- [ ] `reviews/<slug>/` — Approve or Approve with nits (no open Criticals)
- [ ] Branch pushed; PR open against `develop`
- [ ] Linear updated with PR link
- [ ] Run log complete in `ship/<slug>/`
- [ ] **Maintainer manual review** — out of scope; not merged

## Failure handling

| Failure | Action |
|---------|--------|
| No plan for topic | Stop; list closest plans in `plans/concepts/` |
| Linear MCP auth | Stop; link [`linear-integration.md`](linear-integration.md) |
| Research blocked | Document in research open questions; continue only if non-blocker |
| Build fails | Fix before next phase; never open PR on red build |
| Review Critical | Fix loop in Phase 6 |
| Push rejected | Pull/rebase on `develop`, retry |

## Additional resources

- Linear MCP: [linear-integration.md](linear-integration.md)
- Run log template: [run-log-template.md](run-log-template.md)
- Pipeline diagram: [pipeline-overview.md](pipeline-overview.md)
- Ship folder: [`ship/README.md`](../../../ship/README.md)
