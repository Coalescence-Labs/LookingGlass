---
title: Concept — What git actually is (in levels)
status: not-started
category: concept
effort: L
series: "III — Everyday machines"
last-updated: 2026-04-20
---

## Context

Most developers use git every day without a mental model of what it
actually stores or how its commands compose. The result is a tool
learned as a set of incantations: `git pull`, `git push`, `git rebase
-i`, and a trip to Stack Overflow when anything goes sideways. The
piece dissolves that opacity.

The angle is **content-addressable filesystem first, commands second.**
Once a reader knows git is a key-value store of four object types glued
together by refs, the porcelain stops being mysterious. Branches become
pointers; merges become three-way diffs over a common ancestor; rebases
become replayed commits; the reflog becomes obvious.

The piece takes the same **levelled progression** format as
`plans/concepts/rendering-levels.md`: each level adds one capability
to a shared running "mini-repo" visual. The reader sees the same
tiny repository accumulate objects, move refs, and resolve conflicts
as concepts stack. This suits git well — its complexity is entirely
compositional.

## Goal

Ship `/git-internals` as a Concept in Series III, structured as six
unlockable levels that take the reader from "a commit is a hash over
a tree" to "what `git rebase --onto` is actually doing." The
centerpiece is a live **Object Graph** that mutates as each level
unlocks, showing blobs, trees, commits, and refs as the reader
progresses.

## The six levels

1. **Hashes and blobs.** Content addressing. SHA-1 (and the ongoing
   SHA-256 transition). What `git hash-object` does. Why two files with
   identical contents share one blob.

2. **Trees and commits.** Trees as directory snapshots pointing at
   blobs + subtrees. Commits as trees plus parent pointers plus an
   author + timestamp + message. The commit graph is a DAG, not a
   linear history.

3. **Refs and HEAD.** Branches are 40-character files under
   `.git/refs/heads/`. HEAD is a pointer (usually to a ref, sometimes
   directly to a commit — "detached"). Tags are refs that don't move.
   `git log`, `git checkout`, and `git branch` all manipulate refs.

4. **The three trees.** Working directory, index (staging area), HEAD.
   `git add` writes to the index; `git commit` writes the index to a
   new commit and moves HEAD. `git diff` vs `git diff --cached` vs
   `git diff HEAD`. Why `git reset` has three modes (`--soft`,
   `--mixed`, `--hard`) mapped exactly to these three trees.

5. **Merging and rebasing.** Three-way merge: find the merge base
   (lowest common ancestor), compute diffs from base → each branch,
   apply both to a new commit with two parents. Fast-forward as the
   special case where one branch is an ancestor of the other. Rebase
   as `git format-patch` + `git am` in spirit: replay each commit onto
   a new base, producing new commit hashes. Interactive rebase as a
   script of replay operations. Why rebasing rewrites history and
   merging doesn't.

6. **Remotes, reflog, and recovery.** Remotes as named URLs; refspecs
   (`+refs/heads/*:refs/remotes/origin/*`) as the mapping that makes
   `origin/main` a local ref. `git fetch` vs `git pull`. The reflog as
   a local-only log of every ref update — the reason a `reset --hard`
   is almost never fatal. `git fsck` for orphaned objects. Garbage
   collection.

Each level ends with a "try it" card: a short sequence of real
commands the reader can run in an empty directory to produce the same
state the Object Graph is showing.

## Goal shape

The piece reads as one article, not six mini-articles. Prose between
levels is tight. Each level is one scrollable § with:

- An editorial opener (≤ 4 sentences).
- A visual: the Object Graph in its "just unlocked this level" state,
  with the new object type or ref highlighted.
- 2–4 short prose paragraphs covering the mechanism.
- A plumbing card when it clarifies — e.g. `git cat-file -p <hash>` to
  dereference a commit into a tree pointer, shown as real terminal
  output.
- A "try it" card with 3–6 shell lines.

## Approach

1. **Research.** Write `research/git-internals.md`:
   - *Pro Git* (Chacon & Straub), chapters 9 and 10 specifically —
     canonical reference for internals. Creative Commons, so citeable
     liberally, but prose is original.
   - Git's own documentation, especially the plumbing man pages
     (`git-hash-object(1)`, `git-update-index(1)`, `git-cat-file(1)`,
     `git-commit-tree(1)`, `git-update-ref(1)`).
   - Linus Torvalds's original 2005 announcement and the early commit
     history of git itself — useful for *why* the design is the way
     it is.
   - Aditya Mukerjee, *Git from the inside out* — pedagogical shape
     reference, not a source of prose.
   - Git Rev News archives for the SHA-1 → SHA-256 transition status
     as of April 2026. Verify current state; do not assume.
   - `git help gitrepository-layout` for the authoritative file-layout
     documentation.

2. **Data.** `src/lib/git-internals.ts`:
   - `LEVELS: Level[]` — each with `{ id, name, blurb, graphState,
     tryItScript, plumbingExample? }`.
   - `graphState` is the declarative description of the Object Graph
     at that level: a list of objects (blob/tree/commit/tag), refs
     (branches, HEAD, tags), and edges. Later levels reuse earlier
     graph state plus deltas.
   - `TRY_IT_SCRIPTS` — the shell sequences per level, annotated so
     each line has a one-sentence explanation.

3. **Visuals.**
   - **`ObjectGraph`** (client) — SVG graph. Nodes are colour-coded
     by object type (blob / tree / commit / tag); refs render as
     labelled arrows pointing at commits; HEAD is drawn in gold.
     Node positions are layout-computed (simple d3-force or a
     hand-rolled layered layout — probably the latter for
     predictability). Hash is shown abbreviated (first 7 chars) but
     revealable on hover. State-driven; no animation library needed
     (matches the codebase pattern).
   - **`LevelStepper`** — sticky vertical rail on desktop, sticky top
     bar on mobile. Scroll-into-view advances level; clicking jumps.
     Same shape as `rendering-levels`'s stepper; extract to
     `src/components/levels/LevelStepper.tsx` if both pieces end up
     shipping so they share one component. (Decide when the second
     levelled piece is built; fine to inline for this plan.)
   - **`CommandCard`** — terminal-style block for plumbing examples
     and try-it scripts. Monospace, faint shell prompt, output lines
     distinguished from input. Not a live terminal — it's an
     annotated transcript.
   - **`ThreeTrees`** (Level 4 only) — side-by-side depiction of
     working dir, index, HEAD with a single file's state shown at
     each. Transitions on `add` / `commit` / `reset` buttons.
   - **`MergeDiagram`** (Level 5 only) — two-branch DAG with merge
     base highlighted, then the merge commit drawn in.

4. **Page structure.**
   - `PageHeader` — kicker "On tools we stop seeing," title
     "What git actually is."
   - **Short answer.** One paragraph: git is a content-addressable
     key-value store with four object types, wrapped in a porcelain
     that makes it look like a version-control system.
   - **§ 01 — Hashes and blobs** through **§ 06 — Remotes, reflog,
     and recovery** — one level per §.
   - **§ VII — The commands, revisited.** A small table mapping
     common porcelain commands to the plumbing they compose
     (`git commit` → `write-tree` + `commit-tree` + `update-ref`,
     etc.). Makes the whole piece retroactively click.
   - **§ VIII — Further reading.** *Pro Git*, the plumbing man
     pages, Mukerjee's piece. Credit each as intellectual lineage,
     not as source for our prose.
   - Sources & notes.

5. **Content discipline.**
   - No lifted prose, no screenshots of other people's terminals.
   - All terminal transcripts are produced fresh in an empty repo
     for this piece; hashes are real, from the real runs, and
     referenced consistently across levels (the commit shown in § 02
     and the commit shown in § 04 should be the same commit).
   - Original SVG diagrams; no reused figures from *Pro Git* even
     though its licence would allow it (house rule).

## Files

**Create:**
- `research/git-internals.md`
- `src/lib/git-internals.ts` — levels, graph states, try-it scripts.
- `src/components/git/ObjectGraph.tsx`
- `src/components/git/LevelStepper.tsx`
- `src/components/git/CommandCard.tsx`
- `src/components/git/ThreeTrees.tsx`
- `src/components/git/MergeDiagram.tsx`
- `src/app/git-internals/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry (Series III).

## Acceptance

- [ ] `bun run lint` and `bun run build` both clean.
- [ ] Object Graph renders correctly at all six levels; a user who
      jumps to Level 5 sees merge commits and refs, not Level 1's
      single blob.
- [ ] Every shell transcript on the page is reproducible: running the
      try-it scripts in an empty directory produces the state shown in
      the Object Graph at that level. (Verify manually before ship.)
- [ ] Plumbing commands cited at least once per level where they
      apply (`hash-object`, `cat-file`, `write-tree`, `commit-tree`,
      `update-ref`, `for-each-ref`, `fsck`).
- [ ] § VII command-to-plumbing table is accurate for git ≥ 2.40.
- [ ] SHA-256 transition status in § 01 reflects reality as of the
      research date; cite Git Rev News or similar.
- [ ] No scraped figures; all diagrams first-party SVG.
- [ ] Reduced-motion disables auto-advance on scroll; user can still
      step levels manually.
- [ ] Page readable with JavaScript disabled (core prose + static
      Object Graph snapshots at each level).
- [ ] Mobile-responsive; Object Graph reflows or becomes horizontally
      scrollable below 768px.

## Cross-references

- Thematic sibling to `plans/concepts/rendering-levels.md` — same
  levelled format; if both ship, extract `LevelStepper` into
  `src/components/levels/` as a shared primitive.
- A natural precursor to a future piece on **distributed systems and
  Merkle DAGs** (git, IPFS, blockchain data models all share the same
  core idea).
- Potential follow-up: a shorter piece on **git rebase and what
  "rewriting history" really means** once this foundation is in
  place.

## References

### Canonical
- Chacon & Straub, *Pro Git* (2nd ed.) — chapters 9 (Git Internals)
  and 10 (Git Plumbing). https://git-scm.com/book/en/v2
- Git project documentation — https://git-scm.com/docs
- Plumbing man pages: `git-hash-object(1)`, `git-cat-file(1)`,
  `git-write-tree(1)`, `git-commit-tree(1)`, `git-update-index(1)`,
  `git-update-ref(1)`, `git-for-each-ref(1)`, `git-fsck(1)`,
  `git-reflog(1)`.
- `git help gitrepository-layout` — on-disk layout reference.

### Historical
- Linus Torvalds, git initial announcement (2005) — linux-kernel
  archives.
- Early git commit history — `git log --reverse` in the git source
  itself. Useful for "why" choices.

### Pedagogical (lineage only, not source of prose)
- Aditya Mukerjee, *Git from the inside out* (2014) —
  https://maryrosecook.com/blog/post/git-from-the-inside-out
- Julia Evans, git-related zines — https://wizardzines.com/

### Transition tracking
- Git Rev News — https://git.github.io/rev_news/ — for SHA-256
  transition status and other ongoing work.

### Internal
- `plans/concepts/rendering-levels.md` — same levelled format;
  coordinate `LevelStepper` shape.
- `src/components/motion/Reveal.tsx` — motion pattern.
- `src/app/context-window/page.tsx` — page rhythm reference.
