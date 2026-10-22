---
topic: How shipped games do it — Hades, RDR2, Destiny
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 06
related-chunks:
  - 02-vertical-layering.md
  - 03-horizontal-resequencing.md
  - 05-middleware-wwise-fmod.md
---

## Summary

Three shipped scores show the techniques in the wild. **Hades** (Supergiant,
FMOD; Darren Korb) toggles **stems** by combat: the drum stem kicks in when
enemies appear and turns off when the room is clear, while a semi-randomised
choice of guitar/bass stems keeps each chamber fresh; bosses advance to a harder
"rocking" section. **Red Dead Redemption 2** (Rockstar; Woody Jackson) drives an
open-world score from **11 stems** in 4–5-minute loops, no longer locked to a
single key or tempo (the original game's system had only 5 stems sharing key and
tempo); an internal AI, the **"Gunfight Conductor,"** picks and layers stems in
real time. **Destiny** and the **Halo** series (Bungie; O'Donnell & Salvatori)
ran on a **custom** adaptive engine built before middleware was an option,
composing linear pieces and then disassembling them into intro/loop/outro chunks
that the game recombines.

## Method

- Hades: gameplay.co Korb interview transcript; Laced Records interview; Korb
  on Game Developer (FMOD, markers, parameter templates). All 2026-06-17.
- RDR2: Rockstar Newswire Q&A reproduced by The Hollywood Reporter; Mix Online
  and Telegraph interviews with Jackson; Wikipedia "Music of RDR2" (tertiary,
  for cross-checking the 11-stem / Gunfight Conductor facts).
- Destiny/Halo: O'Donnell interview (Nicholas Singer); hbo.bungie.org "The
  Music" (dynamic + interactive design statement).

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-10 | Hades uses FMOD; drum stem on in combat, off when cleared | high | gameplay.co | Laced Records | Korb's own words |
| C-10a | Hades semi-randomises stems per chamber (guitar+bass / bass only / neither) | high | gameplay.co | Laced Records | "moment of quiet" |
| C-10b | Hades biome playlists: Tartarus 4, Asphodel 3, Elysium 3 pieces; intro piece has drum/bass/"everything-else" stems | high | gameplay.co | — | direct quote |
| C-10c | Bosses advance to a harder "rocking" section | high | gameplay.co | YouTube interview | horizontal move |
| C-11 | RDR2 open-world score = 11 stems, 4–5 min loops, not locked to key/tempo | high | RDR2 Rockstar Q&A | Telegraph / Mix | |
| C-11a | Original RDR used 5 stems sharing key and tempo | high | RDR2 Rockstar Q&A | — | the contrast |
| C-11b | An AI "Gunfight Conductor" triggers transitions/layering in real time | high | Telegraph | Wikipedia (tertiary) | named system |
| C-11c | Jackson composed ~60 hours of music; ~190 missions | medium | Wikipedia (tertiary) | Nerdist | use "roughly" |
| C-12 | Destiny/Halo used a Bungie-custom adaptive engine; compose linear then disassemble | high | O'Donnell (Singer) | hbo.bungie.org | pre-middleware |

## Findings

### 1. Hades — stems toggled by combat (C-10, C-10a, C-10b, C-10c)

Korb: "when you're sort of in combat, all the stems are playing, or at least the
drums and bass… at the end of combat, the drums turn off." Per region there's a
small **playlist** — "four tracks for Tartarus, three for Asphodel, and three
for Elysium" — and an intro piece "has a drum stem, a bass stem, and an
everything else stem." A "semi-randomised thing… where either the guitar and
bass stem can play, or just the bass stem… or neither" yields "a moment of
quiet." At a mini-boss/boss the piece "advance[s] to the sort of rocking
section" — a horizontal move on top of the vertical toggling. Implemented in
FMOD with shared parameter-name templates so any cue behaves consistently.

### 2. RDR2 — 11 stems and an AI conductor (C-11, C-11a, C-11b, C-11c)

Rockstar: the dynamic open-world score is "a range of pieces… broken up into…
stems, that can be seamlessly layered… Bass sounds live on one stem, certain
kind of percussion on another, guitar on another." The original RDR "was limited
to five separate tracks of stems… recorded in the same key and tempo"; RDR2 used
"11 separate tracks of stems… we weren't limited by tempo or key." Transitions
and layering are steered by an internal AI Rockstar calls the **"Gunfight
Conductor."** Jackson recorded without a click, capturing call-and-response
takes; Wikipedia (tertiary) cites ~60 hours of music across ~190+ missions —
present with "roughly."

### 3. Destiny / Halo — Bungie's custom engine (C-12)

O'Donnell: in 1996 "there were [no] programs or systems… that would allow me to
do the kind of adaptive audio work" he wanted, so "developing a custom system…
was our only real option." His method: "compose music that works on its own…
[then] dissemble it to see how it can be implemented adaptively." Bungie's own
notes call the Halo music "both dynamic and interactive… designed so that the
player feels that their personal game experience was scored." This is the same
intro/loop/outro recombination model, hand-built before Wwise/FMOD existed.

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Gunfight Conductor | Rockstar's internal AI that drives RDR2's dynamic score | Telegraph / Wikipedia |
| Stem loop | A 4–5 min multi-stem open-world cue (RDR2) | Rockstar Q&A |

## Implications for the article

- § IV: three case-study cards, each naming the game, composer, engine, and the
  one technique it best illustrates (Hades → vertical toggling; RDR2 →
  stem loops + AI conductor; Destiny → custom recombination).
- Hades is also the anchor for § I's interactive (drums-on-in-combat).
- Hedge the RDR2 hours/mission counts ("roughly 60 hours", "around 190
  missions") — tertiary source.

## Sources

1. **gameplay.co** — "The Sound of Hades" (Darren Korb interview).
   https://gameplay.co/hades-game-music-sound-design-darren-korb-supergiant-games/ (accessed 2026-06-17).
2. **Laced Records** — "How Rock Band influenced Hades' soundtrack."
   https://www.lacedrecords.com/blogs/blog/how-rock-band-influenced-hades-soundtrack (accessed 2026-06-17).
3. **Game Developer** — "Composer Darren Korb Talks Audio Middleware."
   https://www.gamedeveloper.com/audio/composer-darren-korb-talks-audio-middleware-and-its-importance-to-game-developers (accessed 2026-06-17).
4. **The Hollywood Reporter** — RDR2 score launch (reproduces Rockstar Q&A).
   https://www.hollywoodreporter.com/news/general-news/red-dead-redemption-2-official-score-launches-digital-platforms-1230363/ (accessed 2026-06-17).
5. **Mix Online** — "Woody Jackson and Vox Studios."
   https://www.mixonline.com/recording/woody-jackson-and-vox-studios-red-dead-redemption-2 (accessed 2026-06-17).
6. **The Telegraph** — "How the shifting soundtrack of RDR2 was built."
   https://www.telegraph.co.uk/gaming/features/red-dead-redemption-2-shifting-soundtrack-built/ (accessed 2026-06-17).
7. **Nicholas Singer** — "Halo and the birth of adaptive cinematic music" (O'Donnell Q&A).
   https://www.nicholassinger.com/blog/halo-and-the-birth-of-cinematic-adaptive-music (accessed 2026-06-17).
8. **Bungie/HBO** — "Halo — The Music." https://hbo.bungie.org/music.html (accessed 2026-06-17).

## Open questions

- [ ] Exact Hades stem-per-piece count not published; keep qualitative.
- [ ] RDR2 hours (~60) and mission count (~190) are tertiary; hedge on page.
