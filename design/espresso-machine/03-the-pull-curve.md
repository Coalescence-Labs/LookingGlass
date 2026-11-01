---
section: § II — The pull
pattern: P-SLIDER-LINEAR (time scrub) + custom multi-track curve
plan: plans/concepts/espresso-machine.md
research: research/espresso-machine/06-the-extraction-curve.md
claims: [C-14, C-03, C-05, C-10, C-06b]
component: PullCurve
---

## Purpose

The headline interactive. Make the famous "9 bar / ~25 s" legible as a
*trajectory*: three tracks — pressure, flow, temperature — over time. Dragging a
time cursor updates all three read-outs at once (plan acceptance).

## What the reader understands after using it

That a shot has phases (pre-infusion → the 9-bar plateau → decline), that
pressure and flow are coupled, and that temperature should stay nearly flat —
the steadiness being the whole point of good boiler design (§ III).

## Pattern

Custom SVG/CSS line chart with a scrub control (`P-SLIDER-LINEAR`):

- **X axis:** time 0 → ~32 s.
- **Three tracks**, each its own color/label, drawn as SVG polylines:
  - **Pressure** (bar, 0–10), accent gold — the primary line, heaviest weight.
  - **Flow** (mL/s, 0–~3), bone-2 — secondary.
  - **Temperature** (°C, 88–96), bone-3 — nearly flat.
- **Time cursor:** a vertical line at the scrubbed time; dots mark where it
  crosses each track; a read-out shows `t`, `pressure`, `flow`, `temp`.
- **Phase bands:** three subtle background bands (pre-infusion · plateau ·
  decline) with `type-mono-sm` labels (C-14).

## Interaction

- Scrub via a **range input** (`min=0 max=lastIndex step=1`) bound to the sample
  index — fully keyboard-accessible (arrows), `aria-label="Time through the shot"`,
  `aria-valuetext` announcing seconds + the three values.
- Optionally also draggable directly on the chart (pointer), but the range input
  is the canonical control so touch + keyboard always work.
- Read-out values use M-VALUE-PULSE on change (gated by `useReducedMotion`).

## Layout

```
section.shell pb-24 md:pb-32
  Reveal: L-SECTION-CHROME "§ II" / "The pull" · right label "Interactive"
  Reveal 0.08: type-lede max-w-2xl  (explain the three tracks + the window)
  Reveal 0.15:
    panel: border border-line p-6 md:p-10, background rgba(15,15,18,0.6)
      top row: three legend chips (Pressure / Flow / Temp) with current values
               (type-mono-sm label + type-numeral value)
      chart:  responsive SVG (viewBox 0 0 100 56-ish), polylines + grid + cursor
      range input (lg-range styling reused from TokenScale)
      phase caption: active phase name + one-line note (aria-live polite)
```

## Data

- `PULL_CURVE: { t:number, pressure:number, flow:number, temp:number }[]` —
  sampled reference profile (e.g. ~33 points at 1 s spacing). Values inside cited
  ranges; **explicitly illustrative / synthetic** (label it in copy + a note).
- `PULL_PHASES: { id, label, tStart, tEnd, note }[]` — pre-infusion (0–~6 s),
  plateau (~6–24 s), decline (~24–32 s).
- Helper to map a time/index → nearest sample, and value → SVG y.

## Curve shape (reference profile, from chunk 06)

- Pressure: 0 → ~3 bar soak (0–6 s) → ramp to ~9 (6–10 s) → plateau ~9 (10–24 s)
  → decline to ~5 (24–32 s).
- Flow: ~0 (0–5 s, dry puck) → rise to ~2–2.5 mL/s as bed gives way → ease with
  the pressure decline.
- Temp: ~93 °C, dipping ~1–2° at first contact, recovering — visibly *flat*.

## Motion

- `Reveal` on chrome/lede/panel.
- Cursor + read-out update on scrub; value pulse gated by reduced motion.
- No autoplay by default. (Optional: a small "play" that animates the cursor 0→end;
  if added, it must respect reduced motion and be pausable. MVP: scrub only.)

## Mobile

Chart full width; legend chips wrap; range input full width with large thumb.
Touch-drag on the range input; chart remains readable at small sizes (min height ~220px).

## Accessibility

- Range input is the keyboard/touch control; `aria-valuetext` reads
  "12 s · 9.0 bar · 2.1 mL/s · 93 °C".
- Chart SVG `role="img"` with `<title>`/`<desc>`; tracks also summarized in the
  legend so the data isn't SVG-only.
- Phase caption `aria-live="polite"`.

## Reduced motion (plan acceptance)

"Reduced-motion collapses scrubbing animations but keeps the data visible." → no
value-pulse, no autoplay, no cursor easing; the full curves, legend values, and a
movable (instant) cursor remain. The reader can still read every value.
