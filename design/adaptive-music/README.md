---
topic: Adaptive music in games
plan: plans/concepts/adaptive-music.md
research: research/adaptive-music/
date: 2026-06-17
agent: cursor
status: draft
slug: adaptive-music
route: /adaptive-music
concept-index: "05"
series-id: everyday-machines
---

## Summary

The reader should leave understanding that a game score is a **system, not a
recording** — and they should *prove* it to themselves by driving one. The page
is built around a single headline interactive: a live Web Audio mixing board
where three sliders (tension, combat, discovery) fade synthesised stems in and
out, a scene label and state-tree light up in sync, and a stinger button fires
an accent that lands on the next beat. Everything is synthesised in the browser
— no audio files, no copyrighted game music. The surrounding sections explain
the two core techniques (vertical layering, horizontal re-sequencing), how the
runtime mix stays legible (ducking/HDR), how three shipped scores actually do it
(Hades, RDR2, Destiny), and the plumbing underneath (Wwise vs FMOD, and what our
browser miniature is doing). Audio is opt-in by construction; the page is fully
usable muted via captions.

## Page architecture

```
PageHeader (index 05, kicker "On systems")
  └─ Short answer (L-SHORT-ANSWER) — music as a system, not a recording
§ I — The mixing board (P-SLIDER-LINEAR + bespoke) — headline AudioEngine interactive
§ II — The map (prose + static segment/cue diagram) — horizontal re-sequencing, transitions, stingers, sync
§ III — Keeping it legible (prose + static ducking diagram) — sidechain ducking, HDR
§ IV — How real scores do it (L-CARD-GRID) — Hades / RDR2 / Destiny
§ V — The plumbing (L-STAT-TABLE-ish compare) — Wwise vs FMOD; what the demo does
Sources (id="sources")
```

## Section index

| File | § | Pattern | Primary teaching goal |
|------|---|---------|----------------------|
| `01-short-answer.md` | — | L-SHORT-ANSWER | A score is assembled at runtime from stems |
| `02-mixing-board.md` | § I | bespoke (drivers + stems + tree) | Vertical layering: same bar, many densities |
| `03-the-map.md` | § II | prose + static diagram | Horizontal re-sequencing, transition rules, sync, stingers |
| `04-keeping-it-legible.md` | § III | prose + static diagram | Ducking and HDR protect focus |
| `05-real-scores.md` | § IV | L-CARD-GRID | Three shipped implementations |
| `06-the-plumbing.md` | § V | compare + prose | Wwise/FMOD; the demo is a hand-built miniature |

## Motion strategy

`Reveal` wraps every section intro and content block (delays 0.08 / 0.15; list
items `i * 0.06`). The only Motion-driven live elements are inside the
`AudioEngine` client component: stem meter bars, the beat pulse, the active
state-tree node, and the duck indicator — all gated by `useReducedMotion()`.
With reduced motion the meters/tree update instantly (no eased transitions, no
beat pulse animation) but **audio keeps working**. No `whileInView` on
content-critical elements. No decorative `BookSpines`-style elements needed.

## File map (implementation)

**Create**

- `src/app/adaptive-music/page.tsx` — Server Component; sections, static prose,
  static § II/§ III diagrams (inline SVG/CSS), § IV/§ V rendered from lib data.
- `src/lib/adaptive-music.ts` — types + data: stems, scenes, transitions, case
  studies, middleware compare, driver→gain mapping helpers, captions.
- `src/components/adaptive/AudioEngine.tsx` — `"use client"` orchestrator: owns
  the Web Audio engine, master opt-in/mute, renders drivers + state tree +
  captions + stinger + beat indicator (the headline interactive).
- `src/components/adaptive/ParameterDrivers.tsx` — `"use client"` presentational
  sliders/labels (controlled by AudioEngine).
- `src/components/adaptive/StateTree.tsx` — `"use client"` presentational SVG/CSS
  scene diagram with active-node highlight.
- `src/components/adaptive/audio-engine.ts` — non-React Web Audio engine class
  (AudioContext, stems, scheduler, duck). No JSX.

**No** `public/audio/` assets (synthesised) and **no** `public/data/` JSON
(data is small, lives in lib).

**Modify**

- `src/lib/concepts.ts` — add Series III ("everyday-machines") + this concept.

## concepts.ts entry (draft)

```ts
// SERIES: add
{
  id: "everyday-machines",
  roman: "III",
  title: "Everyday machines",
  blurb:
    "The systems hiding in plain sight — the machines and media we use without seeing how they work.",
}

// concepts: add
{
  index: "05",
  slug: "adaptive-music",
  title: "How game music follows you",
  subtitle:
    "A game score isn't a recording — it's a system of stems the engine remixes in real time. Drive it yourself.",
  kicker: "On systems",
  seriesId: "everyday-machines",
  status: "live",
  readingTime: "9 min",
}
```

> **Coordination note:** `plans/concepts/espresso-machine.md` also opens Series
> III and adds the same `SERIES` entry. Index `04` is espresso's; this article
> takes `05`. Expect a `concepts.ts` merge — keep one `everyday-machines` SERIES
> entry and both concept records.

## Research traceability

| § | Research chunks | Key claim IDs |
|---|-----------------|---------------|
| Short answer | `01`, `02` | C-01, C-02 |
| § I | `02`, `06`, `07` | C-02, C-02a, C-10, C-13, C-14 |
| § II | `03` | C-03, C-04, C-04a, C-05, C-06 |
| § III | `04` | C-07, C-07b, C-08 |
| § IV | `06` | C-10, C-11, C-12 |
| § V | `05`, `07` | C-09, C-13, C-14 |

## Accessibility summary

- **Opt-in audio:** AudioContext created/resumed only inside the "Start audio"
  click (C-13). Page mounts silent.
- **Mute persistence:** master mute stored in `localStorage`
  (`lg-adaptive-muted`) so it survives reveals/navigation (plan acceptance).
- **Keyboard:** drivers are native `<input type="range">` (arrow keys);
  start/mute/stinger are real `<button>`s with `aria-label`s; visible focus via
  global `:focus-visible`.
- **Captions:** a live text panel names the current scene and which stems are
  audible, so the page teaches fully muted (plan acceptance).
- **Colour not sole signal:** active scene node carries a text label + ring, not
  just colour; stem rows show "on/off" text alongside the meter.
- **Reduced motion:** `useReducedMotion()` drops meter/tree easing and the beat
  pulse; audio still functions (plan acceptance).
- **Touch targets:** controls ≥44px tall on mobile.

## Open design questions

1. **[important]** Scene thresholds (when "Combat" becomes "Boss") are an
   authoring choice — fix them in lib (`sceneFor(drivers)`) so prose, tree, and
   captions all read from one function. Implementer: single source of truth.
2. **[nice-to-have]** Beat clock BPM (~100) and fade times are tunable; keep in
   lib constants.
3. **[nice-to-have]** § II/§ III static diagrams are inline SVG/CSS in the server
   page to avoid extra client components; if they grow, promote to components.
```
