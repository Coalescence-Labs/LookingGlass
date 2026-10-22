---
topic: The middleware — Wwise and FMOD
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 05
related-chunks:
  - 03-horizontal-resequencing.md
  - 06-case-studies.md
---

## Summary

Most studios don't build a music engine from scratch; they license one of two
**middleware** packages and author the rules in a dedicated tool. **Audiokinetic
Wwise** has the most elaborate interactive-music system: a hierarchy of Music
Segments, Playlists and Switch Containers, the full **Transition Matrix**,
**stingers**, MIDI-driven instruments, and **music callbacks** that fire on
beats so gameplay can sync to the music. **Firelight FMOD Studio** presents a
more DAW-like **timeline**: multi-track layers with individual volume, marked
**transition regions** and loop regions, **quantization** to beats/bars, and
**parameter-driven intensity** (a "danger" parameter that layers instruments in
as it rises). Both are free for small/indie budgets and ubiquitous; the rough
consensus is Wwise for the most complex interactive scores, FMOD for a faster,
composer-friendly workflow.

## Method

- Wwise "Creating interactive music" reference (hierarchy, matrix, stingers,
  MIDI). FMOD docs (music system). StraySpark "Wwise vs FMOD vs MetaSounds"
  feature comparison (2026). All 2026-06-17.
- Cross-checked FMOD feature names against Korb interviews (markers, sections,
  live sync) in chunk 06.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-09 | Wwise and FMOD are the two dominant audio middleware packages | high | StraySpark | Korb (Game Developer) | widely attested |
| C-09a | Wwise music: Music Segments/Playlists/Switch Containers, transition matrix, stingers, MIDI, beat callbacks | high | Wwise interactive music | StraySpark | feature set |
| C-09b | FMOD music: multi-track timeline, transition/loop regions, quantization, parameter-driven intensity | high | FMOD docs | StraySpark | feature set |
| C-09c | Both are free for indie tiers and integrate with Unity/Unreal | medium | StraySpark | — | commercial framing — keep general |

## Findings

### 1. Two incumbents (C-09)

The middleware question is effectively a duopoly for music: Wwise and FMOD.
Korb (Supergiant) has used FMOD "for nearly a decade"; large studios standardise
on one tool and reuse parameter templates across projects so any cue "just
works" when loaded.

### 2. Wwise's model (C-09a)

Wwise organises music as a hierarchy — Music Segments → Music Playlist
Containers (sequence/shuffle) → Music Switch Containers (state-driven) — over a
**Transition Matrix** that defines every source→destination move, plus
**Stingers** and MIDI instruments. **Music callbacks** expose beat/bar timing to
gameplay code, so enemies can attack "on the beat." This is the system with the
most knobs.

### 3. FMOD's model (C-09b)

FMOD Studio looks like a DAW timeline. You stack **tracks** (each with its own
volume for vertical layering), drop **transition regions** and **loop regions**
for horizontal form, set **quantization** so transitions snap to the grid, and
wire a **parameter** (e.g. intensity/danger) that fades layers in as it climbs.
Korb's Hades work leans on **markers** and **section transitions** (chunk 06).

### 4. Choosing (C-09c)

Rough field consensus: Wwise leads for the most complex interactive music; FMOD
is "excellent and easier to learn." Both are free at indie revenue tiers and
ship integrations for Unity and Unreal. Keep the article's framing qualitative —
licensing terms change.

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Middleware | Licensed audio engine + authoring tool | StraySpark |
| Music Switch Container | Wwise state-driven music object | Wwise |
| Transition region | FMOD timeline marker enabling a clean switch | FMOD |
| Parameter | A named runtime value driving audio behaviour | FMOD / Wwise (RTPC) |

## Implications for the article

- § V "plumbing": a two-column compare (Wwise / FMOD) as a small card or table,
  then pivot to "the browser demo is a hand-built miniature of this" (C-09,
  C-14 in chunk 07).
- Don't over-claim market share with numbers; say "the two dominant" (C-09).

## Sources

1. **Audiokinetic** — "Creating interactive music."
   https://www.audiokinetic.com/en/library/edge/?id=creating_interactive_music (accessed 2026-06-17).
2. **Firelight Technologies** — FMOD documentation. https://www.fmod.com/docs
   (accessed 2026-06-17).
3. **StraySpark** — "Wwise vs FMOD vs MetaSounds (2026)."
   https://www.strayspark.studio/blog/wwise-fmod-metasounds-audio-middleware-comparison (accessed 2026-06-17). *(Tier C — used only for uncontested feature lists, cross-checked against provider docs.)*

## Open questions

- [ ] Market-share percentages not sourced reliably; avoid putting a number on
      the page. "Two dominant" is safe.
