---
title: Concept — Adaptive music in games
status: not-started
category: concept
effort: L
series: "III — Everyday machines"
last-updated: 2026-04-17
---

## Context

Modern games (Call of Duty, Destiny, Red Dead Redemption 2, Hades) don't
play a static soundtrack. They play a *system*: a tree of musical layers,
stems, and transitions driven by runtime parameters — enemy proximity,
player health, mission phase, biome, stealth state. The piece should
cover: vertical layering, horizontal re-sequencing, transition matrices,
stingers, sidechain ducking, and the two dominant middleware systems
(Wwise and FMOD).

The point of interest for a general reader is the *systems thinking*:
this is music composed so it can't be listened to linearly — it's a
decision tree that only becomes a piece during play.

## Goal

Ship `/adaptive-music` as a Concept in Series III, with an interactive
demo where the reader drives runtime parameters (tension, combat,
stealth) and hears the musical system respond in real time.

## Approach

1. **Research.** Write `research/adaptive-music.md`. Primary sources:
   Audiokinetic's Wwise documentation, Firelight's FMOD documentation,
   published developer post-mortems (GDC talks: Hades, RDR2, Destiny),
   academic work by Karen Collins on game audio.
2. **Audio assets.** All sample stems must be original recordings or
   CC0-licensed. No copyrighted game audio on the page. See House rules
   in `plans/README.md`. Recommend recording 4–6 short original stems
   (30–60 s) in a DAW — or using a CC0 library like FreePD's game tracks
   with attribution.
3. **Demo mechanics.**
   - Web Audio API for mixing. No external audio library.
   - Three runtime parameters the reader can drive (slider or click):
     *tension*, *combat*, *discovery*.
   - Stems layer/unmute based on parameter state with fast crossfades.
4. **Visuals.** State-tree diagram showing how parameters map to stems;
   live highlighting of the active path as the reader drives the demo.
5. **Accessibility.** All audio controls keyboard-accessible; an
   explicit mute/opt-in (don't autoplay); captions describe what each
   state sounds like for people who can't or won't play audio.

## Files

**Create:**
- `research/adaptive-music.md`
- `public/audio/adaptive/*.mp3` or `*.ogg` — original stems.
- `src/lib/adaptive-music.ts` — stem metadata, state tree, transitions.
- `src/components/adaptive/ParameterDrivers.tsx` — sliders/buttons.
- `src/components/adaptive/StateTree.tsx` — diagram with live highlight.
- `src/components/adaptive/AudioEngine.tsx` — Web Audio graph; opt-in.
- `src/app/adaptive-music/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add this concept to Series III.

## Acceptance

- [ ] `bun run build` clean.
- [ ] No copyrighted audio; every stem original or CC0 with attribution
      in the Sources section.
- [ ] Audio is opt-in — playback never starts without a user gesture.
- [ ] Mute persists across reveals.
- [ ] State-tree diagram stays in sync with what the reader hears.
- [ ] Reduced-motion disables animated crossfades on the diagram but
      keeps audio functional.
- [ ] Page works with audio muted — captions describe each state.

## References

- Audiokinetic Wwise docs — https://www.audiokinetic.com/en/library/
- FMOD docs — https://www.fmod.com/docs
- Karen Collins, *Game Sound* (MIT Press, 2008).
- GDC Vault talks on Hades, Destiny, RDR2 music systems.
- Web Audio API spec — https://webaudio.github.io/web-audio-api/
