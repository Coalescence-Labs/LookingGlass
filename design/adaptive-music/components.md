---
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
status: draft
---

## New components

### `AudioEngine`

| Field | Value |
|-------|-------|
| Path | `src/components/adaptive/AudioEngine.tsx` |
| Client | yes — `"use client"` |
| Used in | § I (`02-mixing-board.md`) |
| Pattern | bespoke (drivers + stem rack + state tree + stinger) |

**Purpose:** the headline interactive — owns the Web Audio engine and master
controls, holds driver state, and composes `ParameterDrivers`, `StateTree`, the
stem rack, captions, beat indicator, and the stinger button.

**Props:** none (self-contained). Reads constants/helpers from lib.

**State**

```ts
const [started, setStarted] = useState(false);   // AudioContext resumed
const [muted, setMuted] = useState<boolean>(/* localStorage lg-adaptive-muted */);
const [drivers, setDrivers] = useState<Drivers>({ tension: 0.4, combat: 0, discovery: 0.3 });
const [beat, setBeat] = useState(0);             // for beat pulse, from engine callback
```

**Engine wiring**

- Holds an `AdaptiveEngine` instance in a `useRef` (created lazily).
- **Start audio** click handler (synchronous): create engine if needed →
  `engine.start()` which calls `ctx.resume()` in the same tick (Safari rule,
  C-13) → `setStarted(true)`.
- On `drivers` change → `engine.setDrivers(drivers)` (engine ramps gains on the
  next beat, C-02/C-05).
- On `muted` change → `engine.setMuted(muted)` + persist to localStorage.
- Stinger button → `engine.fireStinger()` (accent on next beat + duck, C-06/C-07).
- Engine beat callback → `setBeat(n)` for the pulse (gate animation w/ reduced
  motion).
- Cleanup on unmount: `engine.dispose()` (close AudioContext, stop nodes).

**Derived (from lib)**

- `scene = sceneFor(drivers)` → label + tree highlight + caption.
- `gains = stemGains(drivers)` → stem rack meter widths.
- `caption = captionFor(scene, gains)` → `aria-live` text.

**Motion**

- `useReducedMotion()` gates: stem meter width transition, active node pulse,
  beat dot pulse. Reduced → instant updates, static dot.

**Accessibility**

- `<section aria-label="Adaptive music mixing board">`.
- Start/Mute/Stinger real `<button>` with `aria-label`; Mute `aria-pressed`.
- Caption `<p aria-live="polite">`.
- Before start: a visible note "Audio is off — press Start" (no autoplay, C-13).

**Responsive**

- `grid md:grid-cols-[1.1fr_1fr]` (drivers | tree); single column on mobile.
- Stem rack full width; controls wrap; touch targets ≥44px.

---

### `ParameterDrivers`

| Field | Value |
|-------|-------|
| Path | `src/components/adaptive/ParameterDrivers.tsx` |
| Client | yes — `"use client"` |
| Used in | § I (inside `AudioEngine`) |
| Pattern | P-SLIDER-LINEAR ×3 |

**Purpose:** the three labelled sliders (controlled).

**Props**

```ts
type Drivers = { tension: number; combat: number; discovery: number }; // 0..1

type ParameterDriversProps = {
  drivers: Drivers;
  onChange: (next: Drivers) => void;
  disabled?: boolean;   // before audio starts (sliders still movable; engine idle)
};
```

**Details**

- Each row: visible `<label>`, `<input type="range" min=0 max=100>` mapped to
  0..1, value text (e.g. "70%"), and a one-line caption of what the stem does.
- Reuse `.lg-range` styling (lift the `<style jsx>` block from ViewportDemo or
  promote to globals; keep local to avoid touching shared CSS).
- `aria-label` per slider; `aria-valuetext` = percentage.

---

### `StateTree`

| Field | Value |
|-------|-------|
| Path | `src/components/adaptive/StateTree.tsx` |
| Client | yes — `"use client"` |
| Used in | § I (inside `AudioEngine`) |
| Pattern | scene diagram with active-node highlight |

**Purpose:** show the scene graph (Calm → Explore → Discovery → Combat → Boss)
and highlight the active node derived from the drivers.

**Props**

```ts
type StateTreeProps = {
  scenes: Scene[];          // from lib SCENES
  transitions: Transition[];// from lib TRANSITIONS (edge labels: rule)
  activeId: string;         // sceneFor(drivers).id
  reducedMotion: boolean;
};
```

**Details**

- SVG with `viewBox`, `width:100%`; nodes laid out left→right by intensity.
- Active node: filled accent ring **and** bold label (colour not sole signal).
- Edges show rule label (`next bar`, `immediate`) in `type-mono-sm`.
- `role="img"` with `aria-label` summarising the active scene; decorative
  strokes `aria-hidden`.
- Reduced motion: no transition on the active highlight.

---

## Non-component module

### `audio-engine.ts`

| Field | Value |
|-------|-------|
| Path | `src/components/adaptive/audio-engine.ts` |
| Client | n/a — plain TS, imported by `AudioEngine.tsx` only |

**Purpose:** encapsulate the Web Audio graph so the React component stays thin.

**Shape**

```ts
export class AdaptiveEngine {
  constructor(opts?: { bpm?: number; onBeat?: (n: number) => void });
  start(): void;             // create AudioContext + resume() (sync), build graph, start scheduler
  setDrivers(d: Drivers): void;   // schedule stem gain ramps on next beat
  setMuted(m: boolean): void;     // master gain 0/1 with short ramp
  fireStinger(): void;            // accent on next beat + duck bed (fast-in/slow-out)
  dispose(): void;                // stop nodes, close context
}
```

**Internals (sketch)**

- `ctx: AudioContext`, `master: GainNode`, `duck: GainNode` (bed routes through
  duck → master).
- Per stem: source(s) → `GainNode` → bus. Sources:
  - **pad**: 2–3 detuned oscillators (tonic+fifth) → lowpass (cutoff rides
    tension).
  - **bass**: oscillator playing root on the beat.
  - **drums**: scheduled noise bursts through bandpass (kick/hat) — gated by
    combat.
  - **lead**: triangle/sine arpeggio over a pentatonic set, notes on the beat,
    gated by discovery.
- **Scheduler:** lookahead loop (`setInterval` ~25 ms; schedule notes ≤100 ms
  ahead using `ctx.currentTime`), fires `onBeat`. Gain changes from `setDrivers`
  are applied at the next beat boundary via `setValueAtTime` + `linearRamp`
  (declick, C-13c).
- **Stinger:** short osc/noise accent at next beat; duck = `master/bed` gain
  ramp ~120 ms down, ~800 ms up (C-07b).
- All amplitudes scaled to keep master well below clipping.

**No external audio**: every sound generated at runtime (C-14). No `public/`
assets.

## Reused components

| Component | Configuration |
|-----------|---------------|
| `PageHeader` | index=`"05"`, kicker=`"On systems"`, title/lede from copy |
| `Reveal` | section intros + content; delays 0.08 / 0.15 |
| `SourceOutboundLink` | `#sources` external citations |

## Data module (`src/lib/adaptive-music.ts`)

```ts
export type Drivers = { tension: number; combat: number; discovery: number }; // 0..1

export type Stem = {
  id: "pad" | "bass" | "drums" | "lead";
  label: string;
  role: "tension" | "combat" | "discovery" | "bed";
  caption: string;     // what it sounds like (for muted users)
};

export type Scene = { id: string; label: string; caption: string; intensity: number };
export type Transition = { from: string; to: string; rule: "immediate" | "next-beat" | "next-bar" | "exit-cue" };

export type CaseStudy = {
  game: string; composer: string; engine: string;
  technique: string; note: string; source: string;
};
export type Middleware = {
  name: string; maker: string; character: string; features: string[];
};

export const STEMS: Stem[];
export const SCENES: Scene[];
export const TRANSITIONS: Transition[];
export const CASE_STUDIES: CaseStudy[];   // Hades, RDR2, Destiny — claims C-10..C-12
export const MIDDLEWARE: Middleware[];     // Wwise, FMOD — claims C-09a/b

export const BPM: number;                  // ~100
export function stemGains(d: Drivers): Record<Stem["id"], number>;  // C-02 mapping
export function sceneFor(d: Drivers): Scene;                         // single source of truth
export function captionFor(scene: Scene, gains: Record<string, number>): string;
```

## Static assets

None. No `public/audio/` (synthesised), no `public/data/` JSON (data in lib).

## Page orchestration notes

`src/app/adaptive-music/page.tsx` stays a Server Component. It imports only
`AudioEngine` as a client island (§ I). §§ II–V are server-rendered prose with
inline static SVG/CSS diagrams (§ II segment/cue, § III ducking) and lib-driven
card grids (§ IV `CASE_STUDIES`, § V `MIDDLEWARE`). Sources section lists
provider docs + per-game interviews via `SourceOutboundLink`, and states plainly
that all audio is synthesised (no copyrighted material).

## Applied

```
## Applied
- 2026-06-17 · commit <sha>
```
