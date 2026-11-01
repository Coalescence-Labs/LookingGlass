---
topic: Building the demo — Web Audio API
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 07
related-chunks:
  - 02-vertical-layering.md
  - 04-mixing-and-ducking.md
---

## Summary

The demo recreates a vertical-layering mixer in the browser with the **Web Audio
API** — no audio library, no sample files. Each "stem" is **synthesised live**
from oscillators and filtered noise, so every sound is provably original (no
copyrighted game audio anywhere) and the page ships no binary audio. Audio is
**opt-in by construction**: browsers create every `AudioContext` in the
`suspended` state and only allow playback after a **user gesture** calls
`resume()`, so nothing can autoplay. Each stem routes through its own
**`GainNode`**; a driver (tension/combat/discovery) maps to those gains. Volume
changes are scheduled with `setValueAtTime` + `linearRampToValueAtTime` /
`exponentialRampToValueAtTime` (an **equal-power** feel) to avoid clicks. A
shared beat clock quantises stem entries to the next beat, mirroring real
middleware sync.

## Method

- MDN "Web Audio API best practices" (autoplay policy, AudioParam scheduling).
- Chrome for Developers "Web Audio, Autoplay Policy and Games."
- web.dev "Getting started with Web Audio" (GainNode crossfade pattern).
- velocaption.com "Procedural Audio in the Browser" (oscillator + GainNode
  click-free ramps; iOS gesture timing). W3C Web Audio spec for node semantics.
  All 2026-06-17.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-13 | AudioContext starts `suspended`; must `resume()` inside a user gesture (autoplay policy) | high | MDN best practices | Chrome autoplay | satisfies opt-in acceptance |
| C-13a | Per-source GainNode + scheduled AudioParam ramps gives click-free crossfades | high | web.dev | MDN best practices | equal-power |
| C-13b | iOS Safari requires resume() in the same synchronous tick as the gesture | medium | velocaption | — | implementation gotcha |
| C-13c | A click-free fade needs a short ramp (≈5 ms) not an instant set | high | velocaption | MDN | avoid zipper noise |
| C-14 | All demo audio is synthesised in-browser (oscillators + filtered noise); no files | high | (design decision) | — | original by construction |

## Findings

### 1. Opt-in is the platform default (C-13, C-13b)

MDN: the autoplay policy is "create or resume context from inside a user
gesture." A context made outside a gesture is `suspended` and stays silent until
`resume()` is called from a `click`/`keydown`/`touchend`. This *gives us the
accessibility requirement for free*: the page mounts silent, and only a deliberate
"Start audio" press begins playback. iOS adds a constraint — `resume()` must run
in the same synchronous tick as the gesture (no `await` before it), or Safari
treats the gesture as lost.

### 2. Layering with gain nodes (C-13a, C-13c)

Each stem = a source (oscillators / a looping noise `AudioBufferSourceNode`) →
its own `GainNode` → a master bus → `destination`. To raise or lower a stem we
schedule on its gain: `setValueAtTime(current, t)` then
`linearRampToValueAtTime(target, t + fade)`. Ramps (not direct `.value` sets)
prevent the "zipper"/click of an instantaneous jump; ~5 ms is enough to declick,
longer (100–400 ms) for musical fades. This is the browser equivalent of an RTPC
curve riding a bus (chunk 02).

### 3. Synthesis keeps it license-clean (C-14)

Rather than ship recorded stems, the engine builds them: a tonic/fifth drone
(tension), a kick+hat pattern from a noise burst through a filter (combat), a
pentatonic arpeggio from a triangle/sine oscillator (discovery), plus a pad. A
single scheduler advances a beat clock; new notes and stem entries land on beat
boundaries (our stand-in for middleware quantization, chunk 03). Because every
sample is generated at runtime, there is zero third-party audio and nothing to
attribute beyond "synthesised with the Web Audio API."

### 4. Ducking in the demo (links chunk 04)

When a stinger/"dialogue" cue fires, the master music bus ducks via a fast-in /
slow-out gain ramp (≈120 ms down, ≈800 ms up), demonstrating sidechain ducking
(C-07) without a second audio source.

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| AudioContext | The Web Audio graph + clock | W3C spec |
| GainNode | A node that scales signal amplitude | W3C spec |
| AudioParam ramp | Scheduled value change (`linear/exponentialRampToValueAtTime`) | W3C spec |
| Suspended state | Context default until a user gesture resumes it | MDN |

## Implications for the article

- The "Start audio" button is both UX and the technical opt-in (C-13). Default
  muted; persist a mute preference across reveals (plan acceptance).
- Keyboard: sliders are native `<input type=range>` (arrow-key operable);
  buttons are real `<button>`s with `aria-label`s.
- Reduced motion: disable animated crossfade visuals on the diagram but keep the
  audio engine working (plan acceptance).
- Captions: each state has a text description of what it sounds like, so the page
  is fully usable muted.
- No `public/audio/` files needed — satisfies "no copyrighted audio" outright
  (C-14).

## Sources

1. **MDN** — "Web Audio API best practices."
   https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices (accessed 2026-06-17).
2. **Chrome for Developers** — "Web Audio, Autoplay Policy and Games."
   https://developer.chrome.com/blog/web-audio-autoplay (accessed 2026-06-17).
3. **web.dev** — "Getting started with Web Audio API."
   https://web.dev/articles/webaudio-intro (accessed 2026-06-17).
4. **W3C** — Web Audio API specification. https://webaudio.github.io/web-audio-api/ (accessed 2026-06-17).
5. **velocaption** — "Procedural Audio in the Browser with Web Audio."
   https://velocaption.com/blog/procedural-audio-in-the-browser/ (accessed 2026-06-17).

## Open questions

- [ ] None blocking. Test in Chromium build; note Safari gesture rule in code.
