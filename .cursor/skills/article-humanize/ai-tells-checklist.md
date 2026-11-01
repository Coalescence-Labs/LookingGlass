# AI tells checklist

Use during [`article-humanize`](SKILL.md) Phase 2. Search case-insensitively
unless the pattern is case-specific.

## High severity — rewrite before merge

### Openers & closers

- [ ] "In today's (fast-paced|digital|modern|ever-evolving)…"
- [ ] "In this (article|piece|explainer|guide), (we|you)…"
- [ ] "Let's (dive|delve|explore|unpack|break down)…"
- [ ] "When it comes to…"
- [ ] "At the end of the day…"
- [ ] "In conclusion" / "To summarize" / "Overall,"
- [ ] "Without further ado"

### Filler transitions

- [ ] "It's important to note that"
- [ ] "It's worth noting" / "It's worth mentioning"
- [ ] "Interestingly," / "Notably," / "Importantly,"
- [ ] "That said," / "With that in mind," (every paragraph)
- [ ] "Furthermore," / "Moreover," / "Additionally," (stacked)
- [ ] "Simply put," / "In other words," (when not clarifying jargon)

### AI vocabulary (replace with plain words)

- [ ] delve → look at, examine, open
- [ ] landscape → field, market, set (or delete)
- [ ] navigate → use, work with, pick
- [ ] leverage → use
- [ ] utilize → use
- [ ] robust → strong, reliable (or cut)
- [ ] holistic → whole, full
- [ ] comprehensive → full, complete (or cut)
- [ ] pivotal → key (or cut)
- [ ] crucial / vital / essential (stacked intensifiers)
- [ ] tapestry → (delete metaphor)
- [ ] realm → area, field
- [ ] embark on a journey → (delete)

### Structure tells

- [ ] Three parallel bullets with identical grammar in every section
- [ ] Every paragraph begins with "The" or "This"
- [ ] Numbered rhetorical questions as section headers
- [ ] "First, … Second, … Third, …" in body prose (§ chrome handles structure)
- [ ] Title Case On Every Heading Phrase In Cards

### Tone tells

- [ ] "Great question!" / "Absolutely!" / "Certainly!"
- [ ] "You're not alone" / "We've all been there"
- [ ] Excessive exclamation marks
- [ ] Emoji in prose (unless quoting a source)

## Medium severity — rewrite if time allows

- [ ] Passive voice chains: "is designed to", "is intended to", "is utilized by"
- [ ] Double hedges: "might potentially", "could possibly"
- [ ] Empty adjectives: amazing, incredible, fascinating, powerful (without proof)
- [ ] "A variety of" / "a range of" / "numerous" (be specific or cut)
- [ ] "Play a key role" / "serve as a cornerstone"
- [ ] Synonym cycling (window → viewport → context length → token budget every sentence)
- [ ] Over-long sentences (>40 words) with no payoff
- [ ] Generic metaphors: iceberg, puzzle piece, Swiss Army knife

## Low severity — polish pass

- [ ] Repeated "very" / "really" / "quite"
- [ ] "In order to" → "to"
- [ ] "Due to the fact that" → "because"
- [ ] "Whether or not" → "whether"
- [ ] Trailing "etc." or "and so on" where list is complete

## Positive signals (keep / add)

- [ ] Concrete noun within the first 15 words of a paragraph
- [ ] One metaphor extended across 2+ sentences
- [ ] Specific number or named example
- [ ] Honest limitation stated plainly
- [ ] Sentence rhythm variation (short after long)

## Scan command (starter)

```bash
SLUG=your-slug
rg -i -n \
  'delve|landscape|navigate|leverage|utiliz|robust|holistic|comprehensive|pivotal|crucial|it.s important|worth noting|in conclusion|let.s explore|when it comes to|ever-evolving|fast-paced|furthermore|moreover|additionally' \
  "src/app/${SLUG}/" "src/components/${SLUG}/" "src/lib/${SLUG}.ts" 2>/dev/null
```

Record hits in the pass log with line numbers and fix status.
