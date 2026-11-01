# Linear integration

How [`ship-article`](SKILL.md) uses the **Linear** MCP server.

## Authentication

Before shipping, verify Linear is usable:

```text
mcp_get_tools → server: "Linear"
```

If `serverStatus` is `needsAuth`, stop the pipeline and ask the maintainer to
authenticate Linear in **Cursor → Settings → MCP**. Do not skip ticket updates.

## Discover tools

Tool names vary by MCP version. Always introspect before calling:

```text
mcp_get_tools → server: "Linear"
```

Or search:

```text
mcp_get_tools → pattern: "issue"
```

Common capabilities (names may differ):

| Intent | Typical tool pattern |
|--------|---------------------|
| Get issue by ID | `get_issue`, `issue`, `linear_get_issue` |
| Search issues | `list_issues`, `search_issues` |
| Update status | `update_issue`, `linear_update_issue` |
| Add comment | `create_comment`, `add_comment` |
| List workflow states | `list_states`, workflow metadata on team |

Call `mcp_get_tools` with `server: "Linear"` and `toolName: "<name>"` for the
exact argument schema before `mcp_call_tool`.

## Issue input formats

| Format | Example |
|--------|---------|
| Identifier | `COA-42` |
| URL | `https://linear.app/coalescence/issue/COA-42/...` |

Extract the identifier (`TEAM-NUMBER`) from URLs with:

```bash
# Example — adjust regex to match your URL shape
echo 'https://linear.app/team/issue/COA-42/solar-life-cycle' | rg -o '[A-Z]+-[0-9]+'
```

## Status workflow

Teams define their own states. Typical mapping for ship-article:

| Pipeline moment | Linear status (examples) |
|-----------------|--------------------------|
| Phase 1 start | `In Progress`, `Started`, `Doing` |
| Phase 8 PR open | `In Review`, `Review`, or comment-only if no review state |
| After maintainer merges | `Done` — **maintainer only**, not ship-article |

If "In Review" does not exist, leave status at **In Progress** and put the PR
URL prominently in the latest comment.

## Comments to post

### Start (Phase 1)

```markdown
🤖 **ship-article** pipeline started

- **Plan:** `plans/concepts/<slug>.md`
- **Branch:** `plan/<slug>`
- **Agent:** Cursor cloud agent / local session
```

### PR ready (Phase 8)

```markdown
✅ **PR ready for manual review**

- **PR:** <url>
- **Route:** `/<slug>`
- **Review verdict:** Approve | Approve with nits
- **Artifacts:** `research/`, `design/`, `humanize/`, `reviews/`, `ship/` run log

Maintainer: review the PR on GitHub; merge when satisfied. Linear can move to Done after merge.
```

## Linking plan ↔ ticket

Encourage tickets to include in the description:

```markdown
slug: solar-life-cycle
plan: plans/concepts/solar-life-cycle.md
```

The agent parses these lines first when resolving slug.

## Fallback (no MCP)

If Linear cannot be authenticated in this environment:

1. Ask the user for issue identifier and confirmation ticket is already **In Progress**
2. Proceed with git/plan work
3. Output PR URL and **exact comment text** for the user to paste into Linear
4. Note in run log: `linear: manual`

Do not pretend the ticket was updated when MCP failed.

## Example MCP flow (pseudocode)

Adapt tool names after `mcp_get_tools`:

```text
1. mcp_call_tool Linear get_issue { id: "COA-42" }
2. mcp_call_tool Linear update_issue { id: "…", stateId: "<in-progress-state-uuid>" }
3. mcp_call_tool Linear create_comment { issueId: "…", body: "…" }
   … pipeline runs …
4. mcp_call_tool Linear update_issue { id: "…", stateId: "<in-review-state-uuid>" }
5. mcp_call_tool Linear create_comment { issueId: "…", body: "PR: https://…" }
```

Store issue ID, URL, and state changes in `ship/<slug>/run-*.md`.
