---
name: plan-to-pr
description: >-
  Ships a single Looking Glass plan end-to-end: claim it from the plans queue,
  work in an isolated git worktree (or a cloud agent), implement to acceptance,
  run a dedicated reviewer pass in a separate agent session, open a PR against
  develop, and ensure the maintainer is notified. Use when the user wants to
  execute a plan from plans/, run the plan queue, ship planned work, or open a
  PR from a plan without polluting the main working tree.
---

# Plan to pull request

Use this skill when turning one item under `plans/` into a merge-ready pull request against **`develop`**. One plan per run. Split **implementer** and **reviewer** across **separate Cursor agent sessions** so review stays independent.

## Preconditions

- Default base branch for new work is **`develop`** (reconcile with `git remote show origin` if unsure).
- **`gh`** CLI authenticated (`gh auth status`) for PR creation, or create the PR in the GitHub UI using the branch the skill names.
- Plans follow `plans/README.md` (frontmatter includes `status`, `last-updated`).

## Central queue (which plan to take)

The queue is **`plans/**/*.md` excluding `plans/README.md`**.

1. List candidates with `status: not-started` (or `blocked` only if the user explicitly says to unblock).
2. If the user named a path (e.g. `plans/engineering/sitemap-and-robots.md`), use that file after confirming it exists and is not already `done`.
3. Otherwise pick one: prefer **`effort: S`** engineering or research that unblocks other work; otherwise oldest `last-updated` or ask the user to choose.
4. **Claim the plan** before coding: set `status: in-progress` and `last-updated:` to today in that file’s YAML frontmatter. Commit this claim in the **worktree branch** as the first commit if policy allows, or commit on `develop` only if the team agrees—default is **first commit on the feature branch** so the claim travels with the PR.

## Session A — Implementer agent

Open a **new** agent/composer chat. Attach this skill and `@plans/<chosen-file>`.

### A1. Isolation (pick one)

**Git worktree (default, local)**

From the repo root (not inside another worktree), use a sibling path and a branch name derived from the plan slug:

```bash
# Example: plan file plans/engineering/sitemap-and-robots.md → slug sitemap-and-robots
git fetch origin develop
git worktree add ../LookingGlass-worktree-sitemap-and-robots -b plan/sitemap-and-robots origin/develop
cd ../LookingGlass-worktree-sitemap-and-robots
```

Use `plan/<short-slug>` so branch names stay unique. Remove the worktree after merge: `git worktree remove ../LookingGlass-worktree-<slug>` (from main clone, after branch is merged or deleted).

**Cloud agent**

If using Cursor Cloud Agents (or similar): start the agent on **`develop`**, same branch naming `plan/<slug>`, same acceptance criteria. Skip local `worktree` commands; keep the rest of the workflow.

### A2. Implement

Follow the plan’s **Context → Goal → Approach → Files → Acceptance → References**. Honor house rules in `plans/README.md` (primary sources, original prose, design system, no dev server unless the user overrides, verify with `bun run build` when applicable).

### A3. Commit and push

Conventional commits, small logical commits if large. Push the feature branch:

```bash
git push -u origin HEAD
```

### A4. Handoff payload for the reviewer

Write a short **handoff block** (in chat or a scratch file in the worktree the reviewer will read) containing:

- Plan path and branch name.
- `git log develop..HEAD --oneline` summary.
- How you satisfied each **Acceptance** bullet (checkbox list).
- Known risks or intentional exclusions.

Stop Session A here. Do not self-approve merge.

## Session B — Reviewer agent (dedicated)

Open a **new** agent session. Do **not** continue the implementer thread.

Attach:

- This skill (optional but good),
- [`reviewer-brief.md`](reviewer-brief.md),
- `@plans/<same-file>`,
- the implementer handoff (paste or `@` file).

Check out **the same branch** the implementer pushed (read-only review is OK via `git diff origin/develop...HEAD` without checkout if preferred).

### Reviewer output

Produce a structured review: Critical / Suggestions / Questions. Map findings to plan **Acceptance** items. If Critical items exist, **do not** open the PR from this session; list required fixes for the implementer.

If only Suggestions/Questions: implementer may address or respond; re-run a short reviewer pass if behavior changed materially.

## Session A (resume) — Open PR

After reviewer sign-off on merge readiness:

```bash
gh pr create --base develop --head plan/<slug> --title "<imperative title from plan>" --body "$(cat <<'EOF'
## Summary
[1–3 sentences]

## Plan
- File: plans/...

## Review
- Reviewer session: [link or note]
- Outcome: ready for maintainer merge

## Verification
- [ ] bun run build (or as plan specifies)
EOF
)"
```

If `gh` is unavailable, push the branch and give the user the **compare URL** against `develop`.

## Notify coalescencelabs@gmail.com

Prefer **no custom code** until you add an Action:

1. **GitHub account**: Set **Notification email** for the GitHub user/org to `coalescencelabs@gmail.com`, and enable **Participating** or **Watching** for this repo so **new PRs** generate email.
2. **PR body**: `@mention` a GitHub user mapped to that inbox if that user is a bot/human on the repo.
3. **Optional later**: Add `.github/workflows/notify-pr.yml` with Resend or another provider using repo secrets (out of scope for this skill unless requested).

Do not put secrets in the skill file.

## Maintainer (human)

You merge what you want from GitHub into **`develop`**. After merge, in a follow-up commit (main clone or new PR):

- Set the plan’s `status: done` and append the closing note with commit/PR per `plans/README.md`.
- Remove the local worktree when finished.
- If research shipped, update `research/*.md` frontmatter per `research/README.md`.

## Checklist (copy for the implementer)

- [ ] Plan chosen and `in-progress` recorded
- [ ] Worktree or cloud branch from `develop`
- [ ] Acceptance satisfied; `bun run build` (or plan-specific verification)
- [ ] Pushed `plan/<slug>`
- [ ] Reviewer session completed; Critical issues resolved
- [ ] PR opened **into `develop`**
- [ ] Maintainer notification path confirmed (GitHub email or mention)

## Additional resources

- Reviewer scope and output template: [reviewer-brief.md](reviewer-brief.md)
