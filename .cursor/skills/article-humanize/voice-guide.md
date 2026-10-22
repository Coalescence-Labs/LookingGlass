# Looking Glass voice guide

Distilled from Concepts 01–03 and shared components. Humanize passes should
move draft copy **toward** this, not away from it.

## What we sound like

**A precise explainer with a literary ear.** We teach mechanisms the way a good
magazine piece would — concrete images, honest caveats, no brochure voice.

### Do

- **Open with a reframing.**  
  *"Language models don't read words. They read tokens."*  
  *"A language model reads through a window, not a book."*  
  *"There is no single best model."*

- **Use one strong metaphor and stay with it.**  
  Tokens as water in a meter; context as a jar; the frontier as a shelf; the
  viewport as a band of light.

- **Ground abstractions in objects.**  
  Paperbacks on a desk, a train ride, a 34-second TikTok, a semester of study.

- **Hedge honestly.**  
  "Roughly", "about", "give or take", "the rule of thumb is simple".

- **Vary sentence length.**  
  Short: *"Punctuation, spaces, and emojis all count too."*  
  Longer: complex mechanism in one flowing sentence, then a short punch.

- **Use em dashes sparingly** — for apposition or a sharp turn, not every clause.

- **Let italics (accent) carry emphasis** in display type — the short answer
  highlights load-bearing phrases, not every other word.

- **Write blurbs with a point of view.**  
  *"The balanced middle tier — near-frontier quality at roughly half the cost of Opus."*  
  Include a real caveat in `watchFor` style: the thing that bites.

- **Keep sources prose dry.**  
  Methodology bullets, not essay voice.

### Don't

- Marketing superlatives: "cutting-edge", "game-changing", "powerful", "seamless"
- AI vocabulary: delve, landscape, navigate, leverage, robust (as filler), holistic
- Throat-clearing: "In this article", "Let's explore", "When it comes to"
- False enthusiasm or chatbot warmth
- Uniform lists where every item starts with a verb + noun
- Explaining that you're about to explain
- Moralizing or "it's crucial to understand"
- Keyword-stuffed metadata descriptions

## Register by section

| Section | Register | Example shape |
|---------|----------|----------------|
| `metadata.description` | Complete, direct | Two sentences max; what's inside the page |
| PageHeader lede | Essay opening | Reframe + stakes in ~2–4 sentences |
| Short answer | Display poetry | One sentence with 2–4 accent spans |
| § intro (`type-lede`) | Guided tour | What the reader will do/see; invite interaction |
| Body (`type-body`) | Clear mechanism | Short paragraphs; one idea each |
| StatRow `equivalent` | Metaphorical label | 3–6 words, evocative |
| StatRow `note` | Plain fact | Number or caveat |
| Interactive chrome | Instructional, calm | "Scroll through it." "Adjust its size." |
| Card titles (`WhyItMatters`) | Declarative | Not questions; not clickbait |
| Sources | Documentary | Who said what; no rhetoric |

## Rhythm samples (from live archive)

**Lede — Concept 01**  
> Language models don't read words. They read tokens — roughly three-quarter-word
> chunks — and count them the way a meter counts water.

**Mechanism — Concept 01**  
> Models don't read letters or even always words; they read these fragments, and
> count them relentlessly.

**§ intro — Concept 03**  
> Below is a short essay — a little over two thousand words. Scroll through it.
> The gold band is the window.

**Honest caveat — Concept 02 lib**  
> New tokenizer can produce up to ~35% more tokens for the same input than Opus
> 4.6 — the bill grows even though the rate card didn't.

**Card body — Concept 03**  
> A conversation isn't stored somewhere clever. Every turn you and the model
> have exchanged is re-fed into the window at each step.

## Spelling & punctuation

- Prefer curly quotes in JSX: `&ldquo;` / `&rdquo;`, `&rsquo;`
- British spellings acceptable when consistent on site (`tokenisation`, `encyclopaedia`)
- Numbers: use `toLocaleString()` in UI; prose uses "about 90,000" or "90k" as context dictates
- Avoid Oxford-comma pedantry unless clarity needs it

## When humanizing hurts

Stop and flag for review instead of rewriting if:

- The sentence is awkward because the **fact** is awkward (pricing exceptions, disputed science)
- Jargon removal would **mis-teach** the mechanism
- The plan explicitly requires a formal tone for a primary source quote
