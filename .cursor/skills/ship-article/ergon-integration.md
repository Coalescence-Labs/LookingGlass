# Ergon integration

How [`ship-article`](SKILL.md) uses the **Ergon** MCP server (issue tracker for
Looking Glass / Coalescence Labs). **Do not use Linear.**

## Authentication

Before shipping, verify Ergon is usable:

```text
GetDynamicTools → namespace: "user-ergon"
# or pattern search: GetDynamicTools → pattern: "ergon|save_issue"
```

If the namespace reports `needsAuth`, call `mcp_auth` for that namespace (or
authenticate Ergon in **Cursor → Settings → MCP**). Default MCP URL:
`https://ergon.coalescencelabs.app/mcp`.

Do not skip ticket updates when Ergon is available.

## Discover tools

Always introspect before calling:

```text
GetDynamicTools → namespace: "user-ergon"
GetDynamicTools → namespace: "user-ergon", toolName: "save_issue"
```

Then invoke with `CallDynamicTool` (`namespace: "user-ergon"`, `toolName: …`).

| Intent | Tool |
|--------|------|
| Get issue | `get_issue` |
| Agent brief | `get_issue_brief` |
| List / search | `list_issues`, `similar_issues` |
| Create / update | `save_issue` (omit `id` to create; pass `id` like `COA-123` to update) |
| Comment | `save_comment` (`issueId` + `body`) |
| Workflow states | `list_issue_statuses` (`team: "COA"`) |
| Attach PR / preview | `save_issue` → `links: [{ url, title?, kind? }]` (`github_pr`, `preview`, or auto) |
| Free-form intake | `intake` (for notes → tickets; not the usual ship path) |

## Issue input formats

| Format | Example |
|--------|---------|
| Identifier | `COA-463` |
| URL | `https://ergon.coalescencelabs.app/issue/COA-463` |

Extract the identifier (`TEAM-NUMBER`) from URLs with:

```bash
echo 'https://ergon.coalescencelabs.app/issue/COA-463' | rg -o '[A-Z]+-[0-9]+'
```

Project for Looking Glass tickets: **Looking Glass** (team **COA**).

## Status workflow

Discover states with `list_issue_statuses` for team `COA`. Typical mapping:

| Pipeline moment | Ergon state |
|-----------------|-------------|
| Phase 1 start | `In Progress` (or team `started`-type equivalent) |
| Phase 8 PR open | `In Review` |
| After maintainer merges | `Done` — **maintainer only**, not ship-article |

Pass `state` as the **name** string to `save_issue` (e.g. `"In Progress"`).

If `In Review` is missing, leave **In Progress** and put the PR + preview URLs
in the issue description / top comment.

## Comments to post

### Start (Phase 1)

Via `save_comment`:

```markdown
**ship-article** pipeline started

- **Plan:** `plans/concepts/<slug>.md`
- **Branch:** `plan/<slug>`
- **Agent:** Cursor cloud agent / local session
```

### PR ready (Phase 8) — walkable handoff

Ergon **In Review** handoffs must be walkable for a cold reader (not only links).
Rewrite the issue **description** with `save_issue` (or add a top comment) that
includes:

1. **What shipped** — route/feature in 2–4 sentences
2. **Which preview** — Vercel branch preview deep link (e.g. `…vercel.app/<slug>`), not only the deployment root
3. **Where to look** — ordered ~5-minute checklist
4. **Skip / don’t bother** — if anything is out of scope
5. **Acceptance** — remaining human checklist (merge, copy nits)

Also attach links:

```text
save_issue {
  id: "COA-NNN",
  state: "In Review",
  links: [
    { url: "<PR url>", kind: "github_pr", title: "PR" },
    { url: "https://looking-glass-git-plan-<slug>-coalescence-labs.vercel.app/<slug>", kind: "preview", title: "Vercel preview" }
  ]
}
```

Short comment (optional alongside the description rewrite):

```markdown
**PR ready for manual review**

- **PR:** <url>
- **Preview:** <vercel deep link to /<slug>>
- **Route:** `/<slug>`
- **Review verdict:** Approve | Approve with nits
- **Artifacts:** `research/`, `design/`, `humanize/`, `reviews/`, `ship/` run log

Maintainer: walk the preview, review the PR on GitHub, merge when satisfied.
Mark Ergon **Done** after merge.
```

## Linking plan ↔ ticket

Encourage tickets to include in the description:

```markdown
slug: solar-life-cycle
plan: plans/concepts/solar-life-cycle.md
```

The agent parses these lines first when resolving slug.

## Fallback (no MCP)

If Ergon cannot be authenticated in this environment:

1. Ask the user for issue identifier and confirmation the ticket is already **In Progress**
2. Proceed with git/plan work
3. Output PR URL, preview URL, and **exact comment / description text** for the user to paste into Ergon
4. Note in run log: `ergon: manual`

Do not pretend the ticket was updated when MCP failed.

## Example MCP flow (pseudocode)

```text
1. CallDynamicTool user-ergon get_issue { id: "COA-463" }
2. CallDynamicTool user-ergon list_issue_statuses { team: "COA" }   # if unsure of state names
3. CallDynamicTool user-ergon save_issue { id: "COA-463", state: "In Progress" }
4. CallDynamicTool user-ergon save_comment { issueId: "COA-463", body: "…" }
   … pipeline runs …
5. CallDynamicTool user-ergon save_issue {
     id: "COA-463",
     state: "In Review",
     description: "<walkable handoff markdown>",
     links: [ { url: "<pr>", kind: "github_pr" }, { url: "<preview>", kind: "preview" } ]
   }
6. CallDynamicTool user-ergon save_comment { issueId: "COA-463", body: "PR ready: …" }
```

Store issue ID, URL, and state changes in `ship/<slug>/run-*.md`.
