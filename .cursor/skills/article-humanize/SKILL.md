---
name: article-humanize
description: >-
  Polishes the prose of a Looking Glass concept article so it reads natural,
  literary, and human — not AI-generated. Edits page copy, component strings,
  and lib blurbs in place; logs the pass under humanize/<slug>/. Run after
  implementation draft, before article-review. Use when copy feels robotic,
  generic, or "ChatGPT-shaped", or the user asks to humanize an article.
---

# Article humanize

Use this skill on a **draft or completed concept article** to polish every
string a reader sees. The goal is prose that matches the three live reference
pieces — precise, concrete, slightly literary, never marketing-speak or
template-shaped.

This skill **edits code** (copy lives in TSX and lib files). It does not
change facts, numbers, routes, or component behaviour.

Run **after** a first implementation pass and **before**
[`article-review`](../article-review/SKILL.md) so fact-checking covers the
final wording.

## When to run

- First draft of `src/app/<slug>/page.tsx` is written and reads flat or generic.
- User says the article "feels AI-generated".
- Implementer handoff before review: run humanize, then review.
- Refreshing voice on an older live article (same workflow, smaller scope).

## Inputs (required)

1. **Slug** — e.g. `solar-life-cycle`
2. **Plan** — `@plans/concepts/<slug>.md` (tone + audience context)
3. **Voice reference** — read at least two of:
   - `src/app/one-million-tokens/page.tsx`
   - `src/app/context-window/page.tsx`
   - `src/app/model-comparison/page.tsx`
   - `src/components/context-window/WhyItMatters.tsx` (card copy)
   - `src/lib/model-compare.ts` (`blurb`, `bestFor`, `watchFor` fields)
4. **Article files to edit**:

| Path | Copy to humanize |
|------|------------------|
| `src/app/<slug>/page.tsx` | lede, short answer, § intros, sources prose, metadata.description |
| `src/components/<slug>/**` | labels, instructions, simulated content, captions |
| `src/lib/<slug>.ts` | blurbs, notes, editorial strings |
| `src/lib/concepts.ts` | subtitle, kicker (if new entry) |

5. **Research** — `@research/<slug>/` for claim IDs only; **do not alter facts**
   while humanizing.

## Output

1. **In-repo edits** — committed copy changes on the feature branch.
2. **Pass log** — `humanize/<slug>/pass-YYYY-MM-DD.md` using
   [`pass-report-template.md`](pass-report-template.md).

## The Looking Glass voice

Full reference: [`voice-guide.md`](voice-guide.md). Summary:

- **Literary clarity** — one good metaphor beats three abstract sentences.
- **Concrete anchors** — "eight paperbacks on a desk", not "a substantial volume of text".
- **Honest hedging** — "roughly", "about", "give or take" where numbers are approximate.
- **Varied rhythm** — mix short punches with longer sentences; avoid uniform paragraph length.
- **Quiet confidence** — no hype, no "revolutionary", no "it's worth noting that".
- **Reader sparingly** — "you" is fine when it helps ("how you get billed"); don't lecture.
- **British spellings** where already used on site (`tokenisation`, `encyclopaedia`).

## Workflow

### Phase 1 — Inventory

Extract every reader-facing string into a working list (file + location):

```bash
SLUG=solar-life-cycle
rg -n '"(The |A |An |In |It |This |When |If )' "src/app/${SLUG}/" "src/components/${SLUG}/" 2>/dev/null
```

Also scan:

- `PageHeader` lede prop
- `metadata.description`
- `StatRowItem` equivalent/note fields
- Interactive panel instructions (`type-mono-sm`, `type-lede` blocks)
- Simulated transcripts (must stay original — humanize rhythm, not facts)
- `#sources` bullet prose (keep citations intact)

Do **not** humanize:

- Code identifiers, class names, URLs
- Exact numbers, units, model names, dates
- `aria-label` text (keep literal and functional; shorten if verbose, don't poeticize)
- Source link labels that match provider document titles

### Phase 2 — Diagnose AI tells

Run each string against [`ai-tells-checklist.md`](ai-tells-checklist.md). Tag
every hit with severity:

- **High** — obvious template phrasing; fix before merge
- **Medium** — weak or generic; rewrite if time allows
- **Low** — minor smoothing

Common high-severity tells on this site:

| Tell | Fix direction |
|------|----------------|
| "In today's world…" / "In the ever-evolving…" | Delete opener; start with the mechanism |
| "It's important to note" / "It's worth mentioning" | Cut filler; state the thing |
| "Delve" / "landscape" / "navigate" / "leverage" | Plain verb |
| Rule of three everywhere | Keep one strong example; drop the other two |
| Every paragraph starts the same | Vary openings |
| Passive stack ("is designed to", "is utilized") | Active voice |
| Symmetric bullet lists with same grammar | Break symmetry; merge or cut |
| Over-signposting ("First… Second… In conclusion") | Use § chrome instead; let prose flow |
| Empty intensifiers ("truly", "incredibly", "remarkably") | Remove or replace with a fact |
| Fake warmth ("Great question!") | Remove |

### Phase 3 — Rewrite in place

Work section-by-section in reading order (header → short answer → § I … → sources).

**Rules while rewriting:**

1. **Facts frozen** — same numbers, names, citations. If copy is wrong, flag
   for research/review; don't fix facts in this pass.
2. **Length discipline** — lede ≤ ~60 words; section intros ≤ ~45 words unless
   the reference articles go longer for good reason.
3. **Metaphors** — at most one new metaphor per section; prefer extending an
   existing one from the plan or research outline.
4. **StatRow / card equivalents** — `equivalent` field is poetic but grounded
   ("A weekend's reading", "Almost a whole million"); `note` is plain fact.
5. **Short answer** — keep `italic text-accent` spans on the load-bearing
   phrases; rewrite what surrounds them.
6. **Sources section** — factual and dry is fine; remove throat-clearing only.

Read each rewritten paragraph ** aloud ** (mentally): if it sounds like a
help article or a keynote, rewrite again.

### Phase 4 — Consistency pass

1. **Terminology** — one term per concept throughout (don't switch "context
   window" / "context length" / "token budget" without reason).
2. **Cross-links** — sibling concept links should read naturally in sentence
   ("as in Concept 01", "the jar you pour them into" + link).
3. **Tone arc** — short answer is punchy; middle sections explain; sources
   are sober. Match reference articles.
4. **Metadata** — `description` should sound like Concept 01–03 metadata
   (complete sentences, no keyword stuffing).

### Phase 5 — Verify

```bash
bun run lint
bun run build
```

Copy-only changes should still build clean. Record results in the pass log.

### Phase 6 — Log the pass

Write `humanize/<slug>/pass-YYYY-MM-DD.md`:

- Files touched
- High-severity tells fixed (count)
- Before/after samples for the lede and one § intro
- Anything deferred to review (factual uncertainty, awkward but accurate phrasing)

Commit:

```text
humanize(<slug>): polish prose voice

- Rewrite lede and § intros against AI tells checklist
- Align StatRow equivalents with archive voice
- Log pass in humanize/<slug>/
```

## Quality bar (self-check before handoff)

- [ ] Read lede + short answer — would a human writer plausibly own this?
- [ ] No high-severity AI tells remain (checklist re-run on final text)
- [ ] Numbers and proper nouns unchanged from pre-humanize version
- [ ] At least two reference articles consulted for rhythm
- [ ] `bun run build` passes
- [ ] Pass log written to `humanize/<slug>/`

## Integration with other skills

| Skill | Relationship |
|-------|----------------|
| [`article-research`](../article-research/SKILL.md) | Facts come from here — don't invent |
| [`article-design`](../article-design/SKILL.md) | Structure fixed — humanize fills prose beats |
| [`article-review`](../article-review/SKILL.md) | Run **after** humanize; review checks facts on final copy |
| [`plan-to-pr`](../plan-to-pr/SKILL.md) | Implementer runs humanize before requesting review |

Suggested concept pipeline:

1. article-research
2. article-design
3. plan-to-pr (implement)
4. **article-humanize**
5. article-review

## Additional resources

- Voice guide: [voice-guide.md](voice-guide.md)
- AI tells checklist: [ai-tells-checklist.md](ai-tells-checklist.md)
- Pass log template: [pass-report-template.md](pass-report-template.md)
- Humanize folder conventions: [`humanize/README.md`](../../../humanize/README.md)
