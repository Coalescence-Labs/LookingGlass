---
topic: Visual and interactive requirements
plan: plans/concepts/adaptive-music.md
date: 2026-06-17
agent: cursor
status: draft
chunk: visuals
---

## Summary

What the build phase needs from research. The page has one large headline
interactive (a live Web Audio stem mixer driven by three parameters) plus a
synchronised state-tree diagram, three case-study cards, and a small
ducking/mixing illustration.

## Visual / data brief

| Visual | Purpose | Key claims | Data available? |
|--------|---------|------------|-----------------|
| **Stem mixer (headline interactive)** | Reader drives tension/combat/discovery; hears layers fade in/out and lands on the beat | C-02, C-05, C-10, C-13, C-14 | yes — synthesised at runtime, no files |
| **State-tree diagram** | Show states (Explore → Combat → Boss → Defeat) and transition rules; highlight the live active node | C-03, C-04, C-04a | yes — static node/edge data in lib |
| **Ducking illustration** | Show music bed ducking under a dialogue/stinger cue (fast-in/slow-out) | C-07, C-07b | yes — animated bars or live gain trace |
| **Case-study cards (×3)** | Hades / RDR2 / Destiny: composer, engine, signature technique | C-10, C-11, C-12 | yes — typed records in lib |
| **Wwise vs FMOD compare** | Two-column feature contrast | C-09, C-09a, C-09b | yes — typed records in lib |

## Headline interactive — spec inputs from research

- **Three drivers** (0–1 each), mapped to engine parameters (C-01 adaptive
  model):
  - **Tension** → drone/pad gain + filter openness.
  - **Combat** → percussion (kick/hat) gain; at high combat, drums "kick in"
    (Hades anchor, C-10).
  - **Discovery** → melodic arpeggio/lead gain (the "exploration" colour).
- **Stems stay running, muted when low** (C-02a) — re-enter in time.
- **Quantize entries to the beat** (C-05) — a shared scheduler.
- **Stinger button** — fire a one-shot accent on the next beat (C-06), which
  also ducks the bed briefly (C-07).
- **Opt-in**: master starts muted; "Start audio" resumes the AudioContext inside
  the click (C-13). Mute toggle persists across reveals (plan acceptance).
- **Captions**: each driver state has a text description of its sound so the
  page works fully muted (plan acceptance).
- **Reduced motion**: disable animated crossfade visuals; audio still works
  (plan acceptance).

## State-tree data shape (for `src/lib/adaptive-music.ts`)

- Nodes: `{ id, label, caption }` — Explore, Combat, Boss, Victory/Defeat.
- Edges: `{ from, to, rule }` where rule ∈ {immediate, next-beat, next-bar,
  exit-cue} (C-04, C-05).
- Stems: `{ id, label, role: tension|combat|discovery|bed, caption }`.

## Accessibility checklist (from plan + chunk 07)

- No autoplay; explicit opt-in (C-13).
- All controls keyboard-operable; sliders = native range inputs; buttons have
  `aria-label`s.
- Mute persists across reveals.
- Captions describe each state for muted/SR users.
- Reduced motion keeps audio functional, drops animation.
- Status never conveyed by colour alone — pair active-state colour with a label.

## Notes

- No `public/audio/` assets — all synthesised (C-14). This is the cleanest route
  to the "no copyrighted audio" acceptance criterion.
