---
topic: Vertical layering (vertical remixing)
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 02
related-chunks:
  - 01-dynamic-audio-taxonomy.md
  - 03-horizontal-resequencing.md
  - 06-case-studies.md
---

## Summary

Vertical layering — Audiokinetic also calls it **vertical remixing** or
**re-orchestration** — keeps the *same* passage of music playing while it adds,
removes, or swaps simultaneous **stems**. A stem is one separable part of an
arrangement: drums on one, bass on another, a counter-melody on a third, all
written to be harmonically and rhythmically compatible so any subset sounds
intentional. At runtime a parameter (enemy count, health, depth) rides each
stem's volume up or down. The "vertical" name is literal: in a DAW the stems
stack as parallel tracks, and the engine mutes or unmutes rows of that stack.
Because every layer shares the same clock and key, fades can happen at any
moment without the music breaking.

## Method

- Audiokinetic blog, "About Dynamic Music Design — Part 1" (2026-06-17): the
  two-category model (Vertical Remixing / Horizontal Re-Sequencing), attributed
  to Michael Sweet.
- Wwise 201 course, Lesson 2 "Re-orchestration — Using a Layered Approach":
  the DAW-track origin of "vertical", sub-tracks, RTPC-controlled volume.
- White Rose eThesis, Chapter 3 (DMS analysis): "additive and interchangeable
  layers," muted-until-used layers.
- Collins 2008 / van Geelen "parallel composing."

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-02 | Vertical layering plays multiple compatible stems at once, fading them in/out | high | Audiokinetic blog | Wwise 201 L2 | core definition |
| C-02a | Layers not in use play muted rather than stopped, so they can re-enter in sync | high | White Rose Ch.3 | Wwise 201 L2 | why it stays on-grid |
| C-02b | Continuous remix uses an RTPC/parameter on stem volume; discrete remix swaps switch-tracks | medium | Audiokinetic blog | Wwise 201 L2 | two flavours |
| C-02c | "Vertical" comes from stacked DAW tracks | high | Wwise 201 L2 | — | etymology |

## Findings

### 1. Compatible stems, mixed live (C-02, C-02c)

Wwise 201: re-orchestration "mirrors the creative process of writing a short
section of music… a melody line and then add a harmony, followed by counter
melody, bass and percussion; each a layer." In a DAW these stack vertically and
you audition combinations by muting tracks — "which may help to explain the
*vertical* designation." The engine does the same muting at runtime.

### 2. Muted, not stopped (C-02a)

The DMS literature is explicit that unused layers "play in a muted state while
it is not being used," with "additive and interchangeable layers." Keeping them
running (silent) means a stem can fade back in already locked to the beat and
phrase — there is no re-trigger and no drift.

### 3. Continuous vs discrete (C-02b)

Audiokinetic distinguishes "continuous" remixing — an RTPC (real-time parameter
control) curve mapping a game value to a stem's gain — from "discrete" remixing,
where switch-tracks swap whole layers on a state change. The browser demo models
the continuous case: each driver is a 0–1 parameter feeding a gain curve.

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Stem | A separable instrumental layer rendered for independent control | Audiokinetic / Collins |
| RTPC | Real-Time Parameter Control — a game value mapped to an audio property | Audiokinetic |
| Re-orchestration | Wwise's name for the layered/vertical approach | Wwise 201 |

## Implications for the article

- This is the **headline interactive** (§ I). A driver slider → stem gains; the
  reader hears the same loop thicken and thin (C-02, C-02b).
- Make the "muted not stopped" point visible: stems stay on the grid; toggling
  re-enters in time (C-02a).
- Use Hades as the concrete anchor (drums layer on/off) — see chunk 06.

## Sources

1. **Audiokinetic** — "About Dynamic Music Design – Part 1: Design
   Classification." https://www.audiokinetic.com/blog/about-dynamic-music-design-part-1-design-classification (accessed 2026-06-17).
2. **Audiokinetic** — Wwise 201, Lesson 2 "Re-orchestration – Using a Layered
   Approach." https://www.audiokinetic.com/en/courses/wwise201/?id=lesson_2_re_orchestration_using_vertical_approach (accessed 2026-06-17).
3. **University of Leeds (White Rose eTheses)** — Chapter 3, dynamic music
   systems. https://etheses.whiterose.ac.uk/id/eprint/27365/ (accessed 2026-06-17).
4. **Collins, K. (2008)** — *Game Sound*, MIT Press.

## Open questions

- [ ] None blocking.
