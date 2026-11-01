---
section: "§ V — The plumbing"
pattern: two-column compare + prose
research-chunks:
  - research/adaptive-music/05-middleware-wwise-fmod.md
  - research/adaptive-music/07-web-audio-implementation.md
claim-ids: [C-09, C-09a, C-09b, C-13, C-14]
status: draft
---

## Teaching goal

After § V the reader knows studios don't hand-roll this: two middleware packages
(Wwise, FMOD) provide the music systems — and the demo above is a hand-built
miniature of the same ideas, running on the Web Audio API.

## Layout

```
┌───────────────────────────────────────────────────────────┐
│ § chrome: "§ V  The plumbing"        right: "Middleware"   │
├───────────────────────────────────────────────────────────┤
│ type-lede intro                                            │
├───────────────────────────────────────────────────────────┤
│ grid md:grid-cols-2 gap-… — Wwise card | FMOD card         │
│  each: name · one-line character · 3–4 feature bullets      │
├───────────────────────────────────────────────────────────┤
│ "What the demo does" prose block — synthesised stems, opt-  │
│  in AudioContext, gain ramps, beat scheduler (C-13, C-14)   │
└───────────────────────────────────────────────────────────┘
```

- Section wrapper: `shell pb-24 md:pb-32`.
- Compare cards rendered in server page from `MIDDLEWARE` lib data (static).
- Mobile: cards stack.

## Content

### Compare (from lib `MIDDLEWARE`)

| | Wwise (Audiokinetic) | FMOD (Firelight) |
|--|----------------------|------------------|
| Character | Most elaborate music system | DAW-like, composer-friendly |
| Vertical | Switch/sub-tracks | Multi-track timeline volumes |
| Horizontal | Transition matrix, segments | Transition & loop regions |
| Sync | Beat callbacks, exit cues | Quantization to beat/bar |
| Extra | Stingers, MIDI instruments | Parameter-driven intensity |

Claims: C-09, C-09a, C-09b. Keep it qualitative — no market-share numbers.

### Prose beats

1. Both are the industry's two dominant tools; studios reuse parameter templates
   so any cue behaves consistently (`C-09`).
2. The browser demo is the same idea stripped to essentials: each stem is a gain
   node, a scheduler quantises entries to the beat, and nothing plays until you
   ask — because the Web Audio AudioContext starts suspended (`C-13`).
3. Every sound was synthesised on your device; there are no audio files and
   nothing copyrighted (`C-14`).

## Interactive spec

None — static cards + prose.

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Section chrome | M-REVEAL | 0 |
| Intro | M-REVEAL | 0.08 |
| Cards | M-REVEAL | 0.15 |
| Demo-note | M-REVEAL | 0.2 |

## Cross-links

- Back-reference § I (the demo) and § IV (engine names on the cards).
- Sources: Wwise/FMOD docs, MDN/Chrome autoplay, Web Audio spec.

## Acceptance (section-level)

- [ ] Two-column Wwise/FMOD compare from lib, qualitative
- [ ] "What the demo does" ties the page back to C-13, C-14
- [ ] No unsourced market-share numbers
```
