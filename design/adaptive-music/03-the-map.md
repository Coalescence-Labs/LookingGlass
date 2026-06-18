---
section: "§ II — The map"
pattern: prose + static SVG/CSS segment-and-cue diagram
research-chunks:
  - research/adaptive-music/03-horizontal-resequencing.md
claim-ids: [C-03, C-04, C-04a, C-05, C-06]
status: draft
---

## Teaching goal

After § II the reader understands that switching *which* music plays is its own
discipline: music is sliced into segments with entry/exit cues, a transition
matrix decides when a change fires, and changes snap to the beat — so a switch
never sounds like someone hit stop.

## Layout

```
┌───────────────────────────────────────────────────────────┐
│ § chrome: "§ II  The map"            right: "Re-sequencing" │
├───────────────────────────────────────────────────────────┤
│ type-lede intro                                            │
├───────────────────────────────────────────────────────────┤
│ Static diagram (inline SVG/CSS, aria-described):           │
│  Two segment lanes (Explore / Combat) with entry|exit cues; │
│  a "you pressed combat HERE" tick mid-bar, and the actual   │
│  switch landing on the next exit cue (quantised).           │
├───────────────────────────────────────────────────────────┤
│ L-PROSE-GRID: left heading, right paragraphs               │
│  - segments & cues (C-03)                                   │
│  - transition matrix & default exit-cue rule (C-04, C-04a)  │
│  - sync/quantization (C-05)                                 │
│  - stingers (C-06)                                          │
└───────────────────────────────────────────────────────────┘
```

- Section wrapper: `shell pb-24 md:pb-32`.
- Diagram is **static** (no audio, no client component) — pure SVG/CSS in the
  server page, `role="img"` + `aria-label`, decorative ticks `aria-hidden`.
- Mobile: diagram lanes stack or scale; prose grid collapses to one column.

## Content

### Prose beats (not final copy)

1. Vertical layering changes the *thickness*; re-sequencing changes *which*
   passage plays — stop one segment, start another (`C-03`).
2. Each segment has an **entry** and **exit** cue; smaller segments react faster
   but cost more authoring (`C-03`).
3. A **transition matrix** sets the rule for each source→destination pair; by
   default the switch waits for the current segment's exit cue, so it lands on a
   musical boundary rather than cutting (`C-04`, `C-04a`).
4. Changes **quantise** to the beat or bar — the reason runtime music feels
   performed (`C-05`). (Callback to § I: your slider took effect on the beat.)
5. **Stingers** are short accents quantised to the next beat — punctuation, like
   the cymbal swell on a teleport (`C-06`).

### Stat callouts / pull quotes

| Label | Value | Source claim |
|-------|-------|--------------|
| Default transition | Waits for the next exit cue | C-04a |
| Stinger timing | Lands on the next beat/bar | C-06 |

## Interactive spec

Prose + static diagram only — the live model lives in § I. No new client
component. The diagram is illustrative SVG.

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Section chrome | M-REVEAL | 0 |
| Diagram | M-REVEAL | 0.08 |
| Prose grid | M-REVEAL | 0.15 |

## Cross-links

- Back-reference § I (beat-quantised slider changes).
- Sources: Wwise 201 (transition rules, stingers).

## Acceptance (section-level)

- [ ] Explains segments/cues, matrix, sync, stingers without § I
- [ ] Static diagram has text alternative
- [ ] All claims trace to C-03–C-06
```
