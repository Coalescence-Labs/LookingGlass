---
topic: Adaptive music in games
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
slug: adaptive-music
---

## Summary

Modern game scores are not recordings; they are *systems*. A composer writes
music in separable parts — **stems** — and hands the game engine a set of rules
for combining them at runtime. Two techniques do most of the work. **Vertical
layering** (a.k.a. vertical remixing) plays several harmonically and
rhythmically compatible stems at once and fades them in or out so the same bar
of music can sound sparse or full. **Horizontal re-sequencing** slices music
into segments and jumps between them along a timeline, using **entry/exit cues**
and **quantization** so a switch lands on a musical beat or bar rather than
mid-note. Short one-shot accents called **stingers** punctuate events on the
beat. **Sidechain ducking** and **HDR** keep the mix legible by lowering music
under dialogue or louder sounds.

Two middleware packages dominate: **Audiokinetic Wwise** (the most elaborate
music system — Music Segments, a Transition Matrix, stingers, MIDI, beat
callbacks) and **Firelight FMOD Studio** (multi-track timeline, transition
regions, quantization, parameter-driven intensity). Real scores show the range:
**Hades** (FMOD, stems toggled by combat), **Red Dead Redemption 2** (11-stem
loops steered by an AI "Gunfight Conductor"), and **Destiny/Halo** (Bungie's
custom adaptive engine: intros, loops, outros).

For the interactive demo, all audio is **synthesized live in the browser** with
the Web Audio API — oscillators and filtered noise, no sample files — so every
sound is provably original and no copyrighted game audio is shipped.

## Research questions

1. What is the standard taxonomy of game audio (dynamic / interactive /
   adaptive), and who defined it? → `01-dynamic-audio-taxonomy.md`
2. How does vertical layering work, and what is a stem? → `02-vertical-layering.md`
3. How does horizontal re-sequencing work — segments, cues, transitions,
   stingers, sync? → `03-horizontal-resequencing.md`
4. How is the runtime mix kept legible (sidechain ducking, HDR)? →
   `04-mixing-and-ducking.md`
5. What do Wwise and FMOD actually provide, and how do they differ? →
   `05-middleware-wwise-fmod.md`
6. How do shipped games implement this (Hades, RDR2, Destiny)? →
   `06-case-studies.md`
7. How do we build a faithful, license-clean demo in the browser? →
   `07-web-audio-implementation.md`

## Chunk index

| File | Scope | Status |
|------|-------|--------|
| `01-dynamic-audio-taxonomy.md` | Collins' dynamic/interactive/adaptive split; terminology | draft |
| `02-vertical-layering.md` | Vertical remixing, stems, RTPC-driven gain | draft |
| `03-horizontal-resequencing.md` | Segments, entry/exit cues, transition matrix, stingers, sync | draft |
| `04-mixing-and-ducking.md` | Sidechain ducking, HDR, fade asymmetry | draft |
| `05-middleware-wwise-fmod.md` | Wwise vs FMOD feature comparison | draft |
| `06-case-studies.md` | Hades, RDR2, Destiny/Halo implementations | draft |
| `07-web-audio-implementation.md` | Web Audio API, autoplay, crossfades, our synthesis | draft |
| `numbers-and-units.md` | Quantified claims ledger | draft |
| `visuals-and-data.md` | Interactive/visual requirements | draft |

## Source map

| Short name | Tier | Type | URL / citation | Cited in chunks |
|------------|------|------|----------------|-----------------|
| Collins 2008 (Game Sound) | A | book | Karen Collins, *Game Sound*, MIT Press 2008, ISBN 9780262033787 | 01, 02 |
| Collins 2009 (Procedural) | A | paper | Collins, "An Introduction to Procedural Music in Video Games", Contemporary Music Review 28(1), 2009, DOI 10.1080/07494460802663983 | 01 |
| Collins 2008 (Pac-Man) | A | book (ed.) | *From Pac-Man to Pop Music*, Routledge 2008 | 01, 02 |
| Audiokinetic — Dynamic Music Design | A | provider blog | https://www.audiokinetic.com/blog/about-dynamic-music-design-part-1-design-classification | 02, 03 |
| Wwise 201 — Layered/Re-sequencing | A | provider course | https://www.audiokinetic.com/en/courses/wwise201/ | 02, 03 |
| Wwise — Stingers | A | provider course | https://www.audiokinetic.com/en/courses/wwise201/?id=lesson_5_creating_interaction_understanding_stingers | 03 |
| Wwise — Transition Rule | A | provider course | https://www.audiokinetic.com/en/courses/wwise201/?id=lesson_6_implementing_transitions_part_i_adjusting_default_transition_rule | 03 |
| Wwise — Creating interactive music | A | provider docs | https://www.audiokinetic.com/en/library/edge/?id=creating_interactive_music | 03, 05 |
| Wwise — Sidechaining tutorial | A | provider docs | https://www.audiokinetic.com/download/documents/Wwise_SideChaining_Tutorial.pdf/ | 04 |
| Wwise — Understanding HDR | A | provider docs | https://www.audiokinetic.com/en/library/edge/?id=understanding_hdr | 04 |
| FMOD docs | A | provider docs | https://www.fmod.com/docs | 05 |
| Hades — gameplay.co interview | B | interview | https://gameplay.co/hades-game-music-sound-design-darren-korb-supergiant-games/ | 06 |
| Hades — Laced Records | B | interview | https://www.lacedrecords.com/blogs/blog/how-rock-band-influenced-hades-soundtrack | 06 |
| Korb — Game Developer (middleware) | B | interview | https://www.gamedeveloper.com/audio/composer-darren-korb-talks-audio-middleware-and-its-importance-to-game-developers | 06 |
| RDR2 — Rockstar Q&A (THR) | B | reproduced statement | https://www.hollywoodreporter.com/news/general-news/red-dead-redemption-2-official-score-launches-digital-platforms-1230363/ | 06 |
| RDR2 — Mix Online (Jackson) | B | interview | https://www.mixonline.com/recording/woody-jackson-and-vox-studios-red-dead-redemption-2 | 06 |
| RDR2 — Telegraph (Jackson) | B | interview | https://www.telegraph.co.uk/gaming/features/red-dead-redemption-2-shifting-soundtrack-built/ | 06 |
| Halo/Destiny — O'Donnell (Singer) | B | interview | https://www.nicholassinger.com/blog/halo-and-the-birth-of-cinematic-adaptive-music | 06 |
| MDN — Web Audio best practices | A | docs | https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices | 07 |
| Chrome — Web Audio autoplay | A | docs | https://developer.chrome.com/blog/web-audio-autoplay | 07 |
| web.dev — Web Audio intro | B | docs | https://web.dev/articles/webaudio-intro | 07 |
| W3C — Web Audio API spec | A | standard | https://webaudio.github.io/web-audio-api/ | 07 |

## Claim ledger (page-worthy)

| ID | Claim (short) | Value / note | Chunk | Safe for page |
|----|---------------|--------------|-------|---------------|
| C-01 | Dynamic = interactive + adaptive (Collins) | taxonomy | 01 | yes |
| C-02 | Vertical layering = simultaneous compatible stems faded in/out | — | 02 | yes |
| C-03 | Horizontal re-sequencing = jump between timeline segments | entry/exit cues | 03 | yes |
| C-04 | Transition matrix defines rules between state pairs | Wwise | 03 | yes |
| C-05 | Transitions quantize to beat/bar (sync) | — | 03 | yes |
| C-06 | Stinger = short accent quantized to next beat/bar | — | 03 | yes |
| C-07 | Sidechain ducking lowers music under dialogue | asym fades 50–200 / 500–1500 ms | 04 | yes |
| C-08 | HDR maps wide virtual range; loud masks soft | — | 04 | yes |
| C-09 | Wwise & FMOD are the dominant middleware | — | 05 | yes |
| C-10 | Hades (FMOD): drums on in combat, off after; semi-random stems | Tartarus 4 / Asphodel 3 / Elysium 3 | 06 | yes |
| C-11 | RDR2: 11 stems, 4–5 min loops, no fixed key/tempo, "Gunfight Conductor" | orig RDR 5 stems | 06 | yes |
| C-12 | Destiny/Halo: Bungie custom engine; intros/loops/outros | O'Donnell & Salvatori | 06 | yes |
| C-13 | Web Audio AudioContext starts suspended; resume on gesture | autoplay policy | 07 | yes |
| C-14 | Demo audio synthesized live in-browser; no sample files | original | 07 | yes |

## Recommended article outline

1. **Short answer** — music as a system, not a recording (C-01, C-02)
2. **§ I — The mixing board: vertical layering** — interactive demo (C-02, C-10)
3. **§ II — The map: horizontal re-sequencing & transitions** — segments, cues,
   stingers, sync (C-03, C-04, C-05, C-06)
4. **§ III — Keeping it legible: the runtime mix** — ducking, HDR (C-07, C-08)
5. **§ IV — How real scores do it** — Hades / RDR2 / Destiny cards (C-10–C-12)
6. **§ V — The plumbing** — Wwise vs FMOD; what the browser demo does (C-09, C-13, C-14)
7. **Sources & notes**

## Visual / data brief

See `visuals-and-data.md`. Headline interactive: a live Web Audio engine with
three parameter drivers (tension, combat, discovery) feeding a stem mixer, plus
a state-tree diagram that highlights the active path. All sound synthesized.

## Open questions

1. **[nice-to-have]** Exact stem counts for Hades per piece are not published;
   Korb cites Transistor ≈3 and Pyre 7–8 stems per piece — keep Hades framing
   qualitative ("drums / bass / everything-else" + semi-random extras).
2. **[nice-to-have]** RDR2 final stem count is cited as 11 in shipping
   interviews; Jackson elsewhere mentions experimenting up to 15 then settling
   ~6 for narrative cues. Use **11** for the open-world score, note the range.

## Handoff notes

Branch `plan/adaptive-music`. All sources fetched 2026-06-17. No blockers.
Implementer: prefer synthesized audio (chunk 07) to satisfy the no-copyright
acceptance criterion cleanly.
