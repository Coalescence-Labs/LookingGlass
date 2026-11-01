---
section: "§ IV — How real scores do it"
pattern: L-CARD-GRID
research-chunks:
  - research/adaptive-music/06-case-studies.md
claim-ids: [C-10, C-10a, C-10b, C-11, C-11a, C-11b, C-12]
status: draft
---

## Teaching goal

After § IV the reader can name three shipped scores and the one technique each
best illustrates: Hades (stems toggled by combat), RDR2 (11-stem loops + an AI
conductor), Destiny/Halo (a custom recombination engine before middleware
existed).

## Layout

```
┌───────────────────────────────────────────────────────────┐
│ § chrome: "§ IV  How real scores do it"  right: "Three"    │
├───────────────────────────────────────────────────────────┤
│ type-lede intro                                            │
├───────────────────────────────────────────────────────────┤
│ grid gap-5 md:grid-cols-3 (cards, Reveal stagger i*0.06)   │
│  Card: game · composer · engine · the technique · 1–2 lines │
└───────────────────────────────────────────────────────────┘
```

- Section wrapper: `shell pb-24 md:pb-32`.
- Cards rendered in the **server page** from `CASE_STUDIES` in lib (static, no
  client). Card chrome: `border border-line p-6`, label rows in `type-mono-sm`,
  body in `type-body`, game title in serif.
- Mobile: single column.

## Content

### Cards (from lib `CASE_STUDIES`)

| Game | Composer | Engine | Technique (claim) | Note |
|------|----------|--------|-------------------|------|
| Hades | Darren Korb | FMOD | Vertical: drums on in combat, off after; semi-random stems (C-10, C-10a, C-10b) | Tartarus 4 / Asphodel 3 / Elysium 3 pieces |
| Red Dead Redemption 2 | Woody Jackson | Custom (Rockstar) | 11-stem loops, no fixed key/tempo; "Gunfight Conductor" AI (C-11, C-11a, C-11b) | original RDR had 5 stems, same key/tempo |
| Destiny / Halo | M. O'Donnell & M. Salvatori | Bungie custom | Compose linear, then disassemble into intro/loop/outro (C-12) | built before Wwise/FMOD existed |

### Prose beats (intro)

1. The techniques aren't theory — here are three you've probably heard.
2. Each card names the engine to set up § V (the plumbing).

## Interactive spec

None — static cards.

## Motion

| Element | Pattern | delay |
|---------|---------|-------|
| Section chrome | M-REVEAL | 0 |
| Intro | M-REVEAL | 0.08 |
| Cards | M-REVEAL | 0.15 + i*0.06 |

## Cross-links

- Hades card back-references § I ("the drums you toggled").
- Engine names forward-reference § V.
- Sources: per-game interviews (gameplay.co, Rockstar Q&A, O'Donnell).

## Acceptance (section-level)

- [ ] Three cards, each with engine + technique + claim trace
- [ ] RDR2 hours/missions NOT used as hard facts here (kept in sources, hedged)
- [ ] Stem counts match research (11 / 5; Hades 4/3/3 pieces)
```
