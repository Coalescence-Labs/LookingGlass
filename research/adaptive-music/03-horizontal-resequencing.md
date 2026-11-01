---
topic: Horizontal re-sequencing, transitions, stingers, sync
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 03
related-chunks:
  - 02-vertical-layering.md
  - 05-middleware-wwise-fmod.md
---

## Summary

Where vertical layering changes the *thickness* of a passage, horizontal
re-sequencing changes *which* passage plays. The music is cut into **segments**;
each segment has an **entry cue** and an **exit cue**. To move from exploration
to combat the engine stops one segment and starts another — but not instantly.
By default a transition waits for the current segment's **exit cue** (often the
next bar) so the switch lands on a musical boundary. Wwise formalises every
allowed move in a **Transition Matrix**: for each ordered pair of states
(source → destination) you set when the change fires and whether a short
**transition segment** bridges them. **Stingers** are the punctuation: brief
musical accents — a cymbal swell, a horn hit — that the engine **quantizes** to
the next beat or bar so they feel composed rather than dropped on top.

## Method

- Wwise 201 Lesson 1 (re-sequencing / timing grid), Lesson 5 (stingers),
  Lesson 6 (transition rules); Wwise "Creating interactive music" reference
  (transition matrix, transition segments). All fetched 2026-06-17.
- gamesounddesign.com walkthrough (segments → playlists → switch container).
- StraySpark middleware comparison (FMOD transition regions, quantization).

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-03 | Horizontal re-sequencing stops one segment and starts another; music is sliced into segments with entry/exit cues | high | Wwise 201 L1 | White Rose Ch.3 | core definition |
| C-03a | Smaller segments = more responsive but more transitions to author | high | White Rose Ch.3 (Whitmore) | — | the trade-off |
| C-04 | A Transition Matrix defines rules for every source→destination state pair | high | Wwise interactive music | Wwise 201 L6 | Wwise-specific |
| C-04a | Default rule: exit at the current segment's Exit Cue (next bar), not immediately | high | Wwise 201 L6 | — | why music doesn't snap |
| C-05 | Transitions can quantize to beat or bar (sync points) | high | Wwise 201 L6 | FMOD (StraySpark) | shared across middleware |
| C-06 | A stinger is a short accent quantized to the next beat/bar; in Wwise it's a Music Segment designation, not a separate object | high | Wwise 201 L5 | — | |

## Findings

### 1. Segments, cues, and the size trade-off (C-03, C-03a)

Re-sequencing "change[s] the musical material by stopping an existing track, and
starting a new one… slice the music into smaller segments. The beginning of each
segment acts as an entry point… and the end as an exit point." Whitmore's rule
(via the DMS thesis): "smaller chunks are able to more fluidly connect changes
in gameplay, while longer segments may be too slow due to fewer exit points."
Finer slicing buys responsiveness at the cost of more authoring and more seams
to hide.

### 2. The transition matrix (C-04, C-04a)

Wwise's Music Switch Container uses transition **rules**. The default Source
rule is "exit at the next **Exit Cue**," so changing the game state mid-segment
does *not* cut the music — it waits, sometimes several bars, for the boundary.
The matrix lets you override per pair: Combat→Defeated might be **immediate**
(a death should land now), while Defeated→Alive waits for the exit cue so the
defeat motif isn't truncated. You can also insert a **transition segment** — a
purpose-written bridge — between two states.

### 3. Sync / quantization (C-05)

Both engines snap changes to a grid. Wwise's rhythmically-aware exit options
(next beat, next bar, next grid, next cue) keep switches "musically
appropriate." FMOD exposes the same idea as a **quantization** property on
transition regions ("snap to beats or bars"). This is the mechanism that makes
runtime music feel performed.

### 4. Stingers (C-06)

A stinger overlays a short accent on whatever is playing. Wwise: "a Stinger is a
designation given to Music Segments that include additional instructions on how
[it] should synchronize." Example from the course: a teleporter cymbal swell
that, rather than firing the instant the player steps through, is delayed "just
enough so that it plays at a more musical time, such as the next beat or bar."
Stingers also smooth state changes — the White Rose analysis describes a stinger
layered at the exact moment one track stops and the next starts.

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Segment | A slice of music with an entry and exit cue | Wwise |
| Exit cue | The boundary where a segment may hand off | Wwise 201 |
| Transition matrix | Per-pair rule table for state changes | Wwise |
| Stinger | Short accent quantized to the beat/bar | Wwise 201 |
| Quantization | Snapping an event to a musical grid | FMOD / Wwise |

## Implications for the article

- § II: a state-tree / map visual. Nodes = states (Explore, Combat, Boss,
  Defeat); edges = transition rules with their timing (C-03, C-04).
- Make the "waits for the bar" point tangible: in the demo, switching a driver
  takes effect on the next beat, not instantly (C-04a, C-05).
- A stinger button: fire an accent that lands on the next beat (C-06).

## Sources

1. **Audiokinetic** — Wwise 201 Lesson 1 (re-sequencing), Lesson 5
   (stingers), Lesson 6 (transition rules).
   https://www.audiokinetic.com/en/courses/wwise201/ (accessed 2026-06-17).
2. **Audiokinetic** — "Creating interactive music" (transition matrix,
   transition segments). https://www.audiokinetic.com/en/library/edge/?id=creating_interactive_music (accessed 2026-06-17).
3. **University of Leeds (White Rose eTheses)** — Chapter 3.
   https://etheses.whiterose.ac.uk/id/eprint/27365/ (accessed 2026-06-17).

## Open questions

- [ ] None blocking.
