---
section: "§ I — The mixing board"
pattern: bespoke (P-SLIDER-LINEAR drivers + live stem rack + embedded state tree)
research-chunks:
  - research/adaptive-music/02-vertical-layering.md
  - research/adaptive-music/06-case-studies.md
  - research/adaptive-music/07-web-audio-implementation.md
claim-ids: [C-02, C-02a, C-05, C-06, C-07, C-10, C-13, C-14]
status: draft
---

## Teaching goal

After § I the reader has *felt* vertical layering: moving one slider keeps the
same bar of music playing but adds, removes, or thins the stems on top — and the
scene label / state tree change with what they hear.

## Layout

```
┌───────────────────────────────────────────────────────────┐
│ § chrome: "§ I  The mixing board"      right: "Interactive" │
├───────────────────────────────────────────────────────────┤
│ type-lede intro (max-w-2xl)                                 │
├───────────────────────────────────────────────────────────┤
│ AudioEngine panel (border border-line p-6 md:p-10,         │
│ bg rgba(15,15,18,0.6))                                      │
│  ┌─ top bar: [Start audio] [mute] [beat ●●●●]  scene: COMBAT│
│  ├─ grid md:grid-cols-[1.1fr_1fr] gap-8                     │
│  │   Left:  ParameterDrivers (3 sliders) + stinger button   │
│  │   Right: StateTree (scene nodes, active highlighted)      │
│  ├─ Stem rack: 4 rows (Pad / Bass / Drums / Lead)           │
│  │   each: label · live meter bar · on|off text · caption   │
│  └─ Caption line: "Now playing: …" (live, for muted users)  │
└───────────────────────────────────────────────────────────┘
```

- Section wrapper: `shell pb-24 md:pb-32`.
- Mobile (≤768px): drivers and tree stack; stem rack full width; controls wrap.

## Content

### Prose beats (intro lede)

1. The same eight bars can be a whisper or a wall of sound — what changes is
   which **stems** are unmuted (`C-02`).
2. Drive the three parameters; the engine rides each stem's volume. Drums "kick
   in" with combat, exactly as Hades does (`C-10`).
3. Audio is off until you start it; everything you hear is synthesised here, no
   files (`C-13`, `C-14`).

## Interactive spec

### Reader actions

- Press **Start audio** → resumes AudioContext (first gesture) and begins the
  loop at a fixed BPM (`C-13`).
- Drag **Tension / Combat / Discovery** sliders (0–100) → stem gains update on
  the next beat with a short crossfade (`C-02`, `C-05`).
- Press **Stinger** → a one-shot accent quantised to the next beat; briefly
  ducks the bed (`C-06`, `C-07`).
- Press **Mute** → master gain to 0; preference persisted.

### Driver → stem mapping (single source of truth in lib)

| Stem | Role | Gain rule (sketch) |
|------|------|--------------------|
| Pad / drone | tension | `0.22 + 0.55*tension`; lowpass cutoff opens with tension |
| Bass | foundation | `0.30 + 0.5*max(tension, combat)` |
| Drums | combat | ramps from ~0 below combat 0.15 → full by 0.5 ("kick in") |
| Lead / arp | discovery | `0.0 + 0.9*discovery`; pentatonic, on-beat notes |

Scene label `sceneFor(drivers)` (also drives the tree, § II references it):
`Calm → Explore → Discovery → Combat → Boss` by thresholds (see lib).

### UI chrome

- Standard interactive panel chrome.
- Controls: native `<input type=range>` (`.lg-range` style reused from
  ViewportDemo), `type-mono-sm` labels, real `<button>`s.
- Live outputs: stem meter widths + active tree node animate via `motion` gated
  by `useReducedMotion`; numeric/text always present.

### Data

- All in `src/lib/adaptive-music.ts`: `STEMS`, `SCENES`, `TRANSITIONS`,
  `sceneFor()`, `stemGains()`, `CAPTIONS`. No JSON, no fetch.
- Audio engine: `src/components/adaptive/audio-engine.ts` builds oscillators +
  filtered-noise buffers per stem, a master bus, a duck node, and a beat
  scheduler (lookahead pattern). `resume()` called in the Start click (same
  synchronous tick for Safari, `C-13`).

### Mobile & touch

- Sliders full width; ≥44px tall touch area; buttons wrap to two rows.
- State tree scales to container width (SVG `viewBox`, `width:100%`).

### Accessibility

- `<section aria-label="Adaptive music mixing board">`.
- Each slider: visible `<label>` + `aria-label` ("Combat intensity") + `aria-valuetext` (e.g. "70 percent").
- Start/Mute/Stinger: `aria-label`s; mute also `aria-pressed`.
- Caption line uses `aria-live="polite"` so SR users hear scene changes.
- Reduced motion: meters/tree update without easing; beat pulse static dot.

## Motion

| Element | Pattern | delay | notes |
|---------|---------|-------|-------|
| Section chrome | M-REVEAL | 0 | |
| Intro lede | M-REVEAL | 0.08 | |
| Panel | M-REVEAL | 0.15 | mount visible, no whileInView |
| Stem meters | M-VALUE-PULSE/width | — | gated by useReducedMotion |
| Active node | M-VALUE-PULSE | — | gated |
| Beat pulse | motion opacity | — | gated; static when reduced |

## Cross-links

- § II expands on what happens *between* scenes (transitions, sync).
- Sources cites MDN/Chrome autoplay + Web Audio spec.

## Acceptance (section-level)

- [ ] Moving a slider audibly changes density without restarting the loop
- [ ] Scene label + tree node match what's audible
- [ ] No audio before Start; mute persists
- [ ] Works muted (captions) and with reduced motion (audio intact)
- [ ] All controls keyboard-operable
```
