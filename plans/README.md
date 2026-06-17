# Plans

Self-contained work items for Looking Glass. Each plan is written so any
agent (Cursor, Claude Code, or a human) can pick it up cold without the
prior conversation context.

## Categories

- **`concepts/`** — new explainer pieces for the archive. Each ends with a
  live page, an entry in `src/lib/concepts.ts`, original prose, and
  first-party visuals.
- **`research/`** — work that produces structured findings in the
  top-level `research/` folder (see `research/README.md`). Output lives
  there; this folder holds the brief.
- **`engineering/`** — infrastructure, platform, or quality work. Defined
  scope, defined verification.

## Plan format

Every plan uses YAML frontmatter plus a fixed set of sections. Frontmatter
is the machine-readable handle; the body is for humans and LLM agents.

```yaml
---
title: Short imperative title
status: not-started | in-progress | blocked | done
category: concept | research | engineering
effort: S (≤ 1 day) | M (1–3 days) | L (> 3 days)
series: optional — e.g. "II — Mechanisms of the world"
last-updated: YYYY-MM-DD
---
```

Body (in order):

1. **Context** — why this matters, what it connects to, constraints.
2. **Goal** — the deliverable, in one sentence.
3. **Approach** — an ordered set of steps.
4. **Files** — repo-relative paths to create or modify.
5. **Acceptance** — a checklist that answers "is this done?".
6. **References** — primary sources, internal files, prior art.

Keep plans short enough to read on one screen. If a plan outgrows that,
split it into siblings.

## Working with Cursor

### Ship a concept article (start here)

Use **[`ship-article`](../.cursor/skills/ship-article/SKILL.md)** with a **Linear
ticket** or topic. It runs the full pipeline (committing and pushing after each
phase) and opens a PR on `develop` for your manual review:

Linear ticket → research → design → implement → humanize → review → PR

### Individual passes (manual)

Or run each skill separately:

1. **[`article-research`](../.cursor/skills/article-research/SKILL.md)** — gather
   and cross-reference sources → `research/<slug>/`
2. **[`article-design`](../.cursor/skills/article-design/SKILL.md)** — architect
   the page, interactives, and motion → `design/<slug>/`
3. **[`plan-to-pr`](../.cursor/skills/plan-to-pr/SKILL.md)** — implement to
   acceptance and open a PR
4. **[`article-humanize`](../.cursor/skills/article-humanize/SKILL.md)** — polish
   prose so it reads natural and human → `humanize/<slug>/`
5. **[`article-review`](../.cursor/skills/article-review/SKILL.md)** — fact-check,
   link-check, build verification, and a11y audit → `reviews/<slug>/`

- Use `@plans/<path>` to attach a plan to a Cursor composer/agent session.
- Reference specific files with `@` so Cursor pulls them into context
  automatically.
- When an agent starts a plan, flip `status:` to `in-progress` in the
  frontmatter and set `last-updated:` to today.
- When a plan ships, flip to `done` and add a closing note at the bottom
  with the commit SHA or PR number.

## House rules these plans inherit from

- Original writing only. No scraped or re-heated third-party prose.
- Cite primary sources for every factual claim (provider docs,
  peer-reviewed papers, or authoritative references).
- Match the existing visual/typographic system in `src/app/globals.css`;
  see any live concept page for structure.
- No Grok in AI-series comparisons.
- Do **not** spawn a dev server — the maintainer runs `bun run dev`
  themselves. Build with `bun run build` to verify.

## Index

### Concepts
- [`concepts/solar-life-cycle.md`](concepts/solar-life-cycle.md) — Series II opener.
- [`concepts/espresso-machine.md`](concepts/espresso-machine.md) — mechanical systems.
- [`concepts/adaptive-music.md`](concepts/adaptive-music.md) — realtime audio in games.
- [`concepts/attention-mechanism.md`](concepts/attention-mechanism.md) — Series I continuation.
- [`concepts/mesh-networks.md`](concepts/mesh-networks.md) — mesh routing today + speculative post-stack rebuild.
- [`concepts/rendering-levels.md`](concepts/rendering-levels.md) — raytracing from pinhole to Blender, taught in unlockable levels.
- [`concepts/engagement-signals.md`](concepts/engagement-signals.md) — how a social feed measures, pipelines, and ranks its user.
- [`concepts/git-internals.md`](concepts/git-internals.md) — git as a content-addressable filesystem, taught in unlockable levels.

### Research
- [`research/model-roster-refresh.md`](research/model-roster-refresh.md) — keep Concept 02 current.
- [`research/accessibility-audit.md`](research/accessibility-audit.md) — one-time a11y sweep.

### Engineering
- [`engineering/security-review.md`](engineering/security-review.md) — threat-model the submission pipeline and public surface.
- [`engineering/privacy-first-analytics.md`](engineering/privacy-first-analytics.md) — add cookieless analytics.
- [`engineering/structured-logging.md`](engineering/structured-logging.md) — API route + client events.
- [`engineering/og-images.md`](engineering/og-images.md) — per-page Open Graph cards.
- [`engineering/sitemap-and-robots.md`](engineering/sitemap-and-robots.md) — SEO baseline.
- [`engineering/resend-domain-verification.md`](engineering/resend-domain-verification.md) — move off the shared sender.
