---
section: "§ III — Keeping it legible"
pattern: prose + static ducking diagram (CSS bars)
research-chunks:
  - research/adaptive-music/04-mixing-and-ducking.md
claim-ids: [C-07, C-07b, C-08]
status: draft
---

## Teaching goal

After § III the reader understands that a reactive score has to *get out of the
way*: sidechain ducking lowers the music under dialogue (fast to duck, slow to
return), and HDR lets louder sounds momentarily mask softer ones — both to
protect focus.

## Layout

```
┌───────────────────────────────────────────────────────────┐
│ § chrome: "§ III  Keeping it legible"   right: "The mix"   │
├───────────────────────────────────────────────────────────┤
│ type-lede intro                                            │
├───────────────────────────────────────────────────────────┤
│ grid md:grid-cols-2 gap-…                                  │
│  Left: ducking — static CSS diagram: music bar dips under   │
│        a "dialogue" pulse, fast-in/slow-out (C-07, C-07b)   │
│  Right: HDR — short prose + a small "loud masks soft"       │
│        illustration (C-08)                                  │
└───────────────────────────────────────────────────────────┘
```

- Section wrapper: `shell pb-24 md:pb-32`.
- Diagrams static (no audio); the live duck is demonstrated by the § I stinger.
- Mobile: two cards stack.

## Content

### Prose beats (not final copy)

1. The DJ analogy: a voice automatically ducks the music under it; in games the
   voice bus pulls down the music bus (`C-07`).
2. Good ducking is **asymmetric** — typically ~50–200 ms to duck, ~500–1500 ms
   to release — so the bed returns without pumping (`C-07b`).
3. **HDR** authors a wide virtual loudness range and slides a window over it: a
   gunshot makes the rustle of leaves momentarily inaudible, restored when it
   stops (`C-08`).
4. Both exist for the same reason: legibility. The score can be everywhere and
   still never bury the thing you need to hear.

### Stat callouts

| Label | Value | Source claim |
|-------|-------|--------------|
| Duck in / out | ~50–200 ms / ~500–1500 ms | C-07b |

## Interactive spec

Static diagrams only; live ducking shown by § I stinger button. No new client
component.

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Section chrome | M-REVEAL | 0 |
| Intro | M-REVEAL | 0.08 |
| Cards | M-REVEAL | 0.15 (+ i*0.06) |

## Cross-links

- Back-reference § I stinger (you heard the bed duck).
- Sources: Wwise sidechaining tutorial, Wwise HDR.

## Acceptance (section-level)

- [ ] Ducking + HDR explained with the asymmetric-fade number hedged
- [ ] Diagrams have text alternatives
- [ ] Claims trace to C-07, C-07b, C-08
```
