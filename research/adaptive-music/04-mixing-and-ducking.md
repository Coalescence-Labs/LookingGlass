---
topic: Runtime mixing — sidechain ducking and HDR
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 04
related-chunks:
  - 03-horizontal-resequencing.md
  - 07-web-audio-implementation.md
---

## Summary

A reactive score is useless if it buries the dialogue. Two techniques keep the
runtime mix legible. **Sidechain ducking** monitors one signal and uses its
level to pull down another: when a character speaks, the voice bus automatically
ducks the music bus. The classic analogy is a radio DJ talking over a record.
Good ducking is **asymmetric** — fast to duck (≈50–200 ms) so the important
sound cuts through immediately, slow to release (≈500–1500 ms) so the music
breathes back in without pumping. **HDR (high dynamic range) audio** is the
automated cousin: sounds are authored across a huge virtual loudness range, and
a sliding window maps that range onto the device's limited output, so a gunshot
momentarily masks the rustle of leaves and restores it when the shot stops. Both
exist to protect focus.

## Method

- Wwise Sidechaining tutorial PDF (RTPC + Meter Effect), Wwise "Understanding
  HDR" docs, MCV/Develop sidechaining guide (Garry Taylor quote). All
  2026-06-17.
- Amplitude Audio SDK ducking docs (fade-time guidance, asymmetric fades).

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-07 | Sidechain ducking monitors one signal to attenuate another (voice ducks music) | high | Wwise Sidechaining | MCV/Develop | DJ analogy from source |
| C-07a | Ducking is set up with a meter on the trigger bus driving an attenuation curve on the target | high | Wwise Sidechaining | — | RTPC + Meter Effect |
| C-07b | Natural ducking uses asymmetric fades: ~50–200 ms in, ~500–1500 ms out | medium | Amplitude SDK | — | practitioner guidance |
| C-08 | HDR maps a wide virtual loudness range to output; louder sounds make softer ones inaudible, restored when they stop | high | Wwise HDR | audioandmusic blog | window slides up on loud sounds |
| C-08a | Sidechaining needs known priorities a priori; HDR infers from instantaneous loudness | medium | Wwise HDR | — | the practical difference |

## Findings

### 1. Sidechaining (C-07, C-07a, C-07b)

Audiokinetic: "Side-chaining consists of monitoring the level of an audio signal
and using it to manipulate another… in radio broadcasting [a] DJ's voice
automatically ducks the music volume." Setup in Wwise: a **Meter Effect** on the
trigger bus produces an RMS value; an **RTPC curve** maps that value to the
target bus's volume. Garry Taylor (Sony): sidechaining "take[s] into account any
transients within the sounds to be focussed on, and not just reduce the volume…
for a set duration" — i.e. it's smarter than blunt event ducking. Practitioner
fade guidance (Amplitude): "fast fade-in (50–200 ms) and slow fade-out
(500–1500 ms) feel most natural"; avoid target gains below ~0.1 or the bed
seems to vanish.

### 2. HDR (C-08, C-08a)

Wwise HDR "works like a dynamic range limiter/compressor… making soft sounds
inaudible when loud sounds play, and making them audible again when playing
alone." A window slides up when a loud sound arrives; everything far below the
top of the window drops out — "the sound of leaves in a tree… can become
completely inaudible when a gunshot is played." The difference from sidechaining
(C-08a): sidechaining encodes priorities you decide in advance; HDR "figures it
out based on their respective instantaneous loudness."

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| Sidechain ducking | Use one bus's level to attenuate another | Wwise |
| Meter Effect | Wwise effect that outputs a bus's measured level | Wwise |
| HDR audio | Loudness-window system mapping a wide range to output | Wwise |

## Implications for the article

- § III: a compact "keeping it legible" section. A small interactive or animated
  diagram where firing "dialogue" ducks the music bed and it eases back (C-07).
- State the asymmetric-fade rule as a concrete number callout (C-07b).
- Tie to the demo: our engine ducks the music bed when a stinger/dialogue cue
  fires, using a fast-in/slow-out gain ramp (chunk 07).

## Sources

1. **Audiokinetic** — "Using RTPCs to fine-tune the audio mix" (Sidechaining
   tutorial PDF). https://www.audiokinetic.com/download/documents/Wwise_SideChaining_Tutorial.pdf/ (accessed 2026-06-17).
2. **MCV/Develop** — "Audio guide: Side-chaining in Wwise."
   https://mcvuk.com/development-news/audio-guide-side-chaining-in-wwise/ (accessed 2026-06-17).
3. **Audiokinetic** — "Understanding HDR."
   https://www.audiokinetic.com/en/library/edge/?id=understanding_hdr (accessed 2026-06-17).
4. **Amplitude Audio SDK** — "Bus Ducking."
   https://docs.amplitudeaudiosdk.com/nightly/integration/bus-ducking/ (accessed 2026-06-17).

## Open questions

- [ ] Fade-time figures are practitioner guidance (Tier B/C), not a standard.
      Present with hedging ("typically", "roughly").
