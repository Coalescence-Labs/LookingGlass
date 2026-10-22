---
name: article-research
description: >-
  Researches everything needed before writing a Looking Glass concept article.
  Produces a folder under research/ with cross-referenced markdown files — one
  per topic chunk — plus an index. Run this skill first when starting a new
  article from plans/concepts/. Use when the user asks to research an article,
  gather sources, or prepare findings before implementation.
---

# Article research

Use this skill **before any implementation** when starting a concept article
from `plans/concepts/`. Output is a durable research folder that the writing
and build phases cite explicitly.

Downstream skills (e.g. [`plan-to-pr`](../plan-to-pr/SKILL.md)) assume this
folder exists and is at least `status: draft`.

## When to run

- User is starting a new concept article.
- User attaches `@plans/concepts/<slug>.md` and asks to research it.
- A concept plan's Approach says "Research first" — **stop and run this
  skill** before touching `src/`.

Do **not** run this for one-off engineering plans under `plans/engineering/`
unless the user explicitly asks. For standalone research briefs under
`plans/research/`, use the single-file format in `research/README.md`.

## Inputs (required)

1. **Plan file** — `@plans/concepts/<slug>.md` (Context, Goal, Approach,
   References).
2. **Slug** — kebab-case article slug (usually matches the plan filename and
   future route, e.g. `solar-life-cycle` → `/solar-life-cycle`).
3. **Related live pages** — read at least one sibling concept under
   `src/app/<slug>/page.tsx` for depth and citation style.

If the plan is missing References, derive them during Phase 1 and note that
in the index.

## Output layout

Create **`research/<slug>/`** (a folder, not a single file):

```
research/<slug>/
  README.md                 # index — start here
  01-<topic-chunk>.md       # one file per research chunk
  02-<topic-chunk>.md
  ...
  numbers-and-units.md      # optional — all quantified claims in one ledger
  misconceptions.md         # optional — myths to address in prose
  visuals-and-data.md       # optional — what interactives need, with sources
```

**Chunking rules**

- One markdown file per **coherent topic** the article will cover (roughly
  one major § section, or one mechanism worth a visual).
- Target **3–8 chunk files** for a typical concept; split further if a chunk
  exceeds ~400 lines or mixes unrelated mechanisms.
- Prefix files with two-digit order (`01-`, `02-`, …) matching the intended
  article flow.
- Kebab-case after the prefix: `03-red-giant-phase.md`.

Use [`index-template.md`](index-template.md) for `README.md` and
[`chunk-template.md`](chunk-template.md) for each chunk file.

## Research quality bar

Every chunk must meet these standards before the folder is marked complete.

### Source tiers (prefer higher)

| Tier | Examples |
|------|----------|
| **A — Primary** | Peer-reviewed papers, official standards (ISO, IAU, SCA), provider docs, NASA/NOAA fact sheets, manufacturer service manuals |
| **B — Authoritative secondary** | University course notes with citations, annotated textbooks, well-sourced encyclopedia entries (Britannica, Stanford Encyclopedia) |
| **C — Tertiary** | Wikipedia (use only to find Tier A/B sources, not as sole citation) |
| **Avoid** | SEO blogs, unattributed listicles, forum folklore, scraped content |

**Minimum per chunk:** at least **two independent Tier A or B sources** for
every factual claim that will appear on the page. Numbers require **two
sources that agree**, or one Tier A source with explicit uncertainty noted.

### Cross-reference protocol

For each non-obvious claim:

1. Record it in the chunk's **Claims** table with a stable ID (`C-01`, …).
2. Attach **every source** that supports or contradicts it.
3. If sources disagree, add a **Discrepancies** subsection — do not silently
   pick a winner. Recommend which figure to use on the page and why.
4. In `README.md`, maintain a **Source map** listing each Tier A/B source
   once, with which chunks cite it.

### Numbers ledger

Any quantity that might appear in copy, a stat callout, or a visual belongs in
`numbers-and-units.md` (or the index if there are fewer than five numbers).
Columns: claim ID, value, units, source A, source B, notes, safe-for-page
(yes/no).

### Reproducibility

**Method** sections must name exact URLs fetched, search queries, papers
(read DOI/arXiv ID), and tools (`curl`, `WebFetch`, MCP, etc.) so a future
agent can re-run the check.

### House rules (from `plans/README.md`)

- Research notes are **facts and citations**, not article prose. Do not draft
  the final essay voice here.
- No Grok in AI-series comparisons.
- Prefer primary sources over news coverage of a paper.

## Workflow

### Phase 1 — Scope

1. Read the plan end-to-end.
2. List every topic, mechanism, number, visual, and misconception the plan
   implies.
3. Draft the chunk file list; write `research/<slug>/README.md` with:
   - YAML frontmatter (see index template)
   - **Research questions** — one bullet per chunk, phrased as answerable
     questions
   - **Chunk index** — filename → one-line scope
   - Empty **Source map** and **Claim ledger** tables to fill in Phase 3

Commit the scaffold before deep research if working on a branch (`research(<slug>): scaffold index and chunk list`).

### Phase 2 — Gather (per chunk)

Work chunk-by-chunk in article order. For each file:

1. Start from the plan's References plus systematic search (papers, standards,
   official docs).
2. Fetch and read sources; extract claims, numbers, diagrams worth knowing,
   and terminology.
3. Cross-check each claim against a **second independent source**.
4. Fill in the chunk file using the chunk template.
5. Update `README.md` source map and claim ledger as you go.

**Do not skip chunks** to start coding. If a chunk is blocked (paywall,
ambiguous source), document it under **Open questions** in the index and
continue other chunks.

### Phase 3 — Synthesize

1. Complete `README.md`:
   - **Summary** (≤ 200 words) for implementers who won't read every chunk.
   - **Recommended article outline** — § headings mapped to chunk files.
   - **Visual/data brief** — what each interactive needs, tied to claim IDs.
   - **Open questions** — ranked by blocker severity.
2. Scan all chunks for orphan claims (in ledger but not in any chunk, or
   vice versa) and reconcile.
3. Set index frontmatter `status: draft` when done; `reviewed` after a
   second pass or explicit user review.

### Phase 4 — Handoff

Post a short handoff in chat:

- Folder path: `research/<slug>/`
- Chunk count and any gaps
- Top 3 open questions
- Suggested next step: implement via `plan-to-pr` using the same plan file

Update the concept plan's Approach step 1 to cite the folder path
(`research/<slug>/`) if it still references a single flat file like
`research/<slug>.md`.

## Verification checklist

Before marking research complete:

- [ ] `research/<slug>/README.md` exists with frontmatter, summary, chunk
      index, source map, and claim ledger
- [ ] Every planned article topic has a chunk file (or is explicitly deferred
      in Open questions)
- [ ] Every chunk has Summary, Method, Claims (with IDs), Findings,
      Discrepancies (if any), Sources, Open questions
- [ ] Every page-worthy number appears in the ledger with ≥1 Tier A/B source
- [ ] No factual claim rests on a single Tier C source
- [ ] Discrepancies are documented, not glossed over
- [ ] Visual/interactive requirements captured in `visuals-and-data.md` or the
      index if the plan includes visuals
- [ ] Index `plan:` field points at `plans/concepts/<slug>.md`

## Citing research during implementation

Implementation commits and article copy should cite research explicitly:

- *"per `research/solar-life-cycle/03-main-sequence.md`, claim C-04"*
- *"timeline bounds from `research/solar-life-cycle/numbers-and-units.md`"*

When the article ships, set index `status: applied` and append an **Applied**
section per `research/README.md`.

## Additional resources

- Index template: [index-template.md](index-template.md)
- Chunk template: [chunk-template.md](chunk-template.md)
- Research folder conventions: [`research/README.md`](../../../research/README.md)
- Concept plan format: [`plans/README.md`](../../../plans/README.md)
