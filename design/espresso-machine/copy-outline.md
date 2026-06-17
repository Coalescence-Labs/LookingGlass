---
topic: Copy outline (prose beats, not final copy)
plan: plans/concepts/espresso-machine.md
note: Implementation writes original prose. Beats are keyed to claim IDs.
---

## Lede (PageHeader)

A machine on the counter that is, underneath, a small thermodynamic instrument:
pressure, heat, and resistance held in balance for half a minute. (Sets up the
"contained system" framing from the plan.)

## Short answer

- Espresso = hot water *driven through coffee under pressure* (C-01).
- The standard pull: ~9 bar (≈130 psi, 9× atmosphere) (C-03), water a few degrees
  off boiling (~90–96 °C) (C-01/C-02), ~7 g grounds (C-01/C-02), ~25 s (C-01/C-02).
- The café reality: heavier — 18 g in, 36 g out (C-10).

## § I The flow path

- Follow one sip: reservoir → pump → over-pressure valve → boiler → group → puck
  → cup.
- Pump makes pressure (vibratory ~60 strokes/s, or rotary smooth) (C-04); the OPV
  caps it near 9 bar (C-03).
- Boiler holds ~90–96 °C; steam side runs hotter, ~125–135 °C (C-05).
- The puck is the resistor: grind sets how hard water has to push (C-14).

## § II The pull

- A shot is a trajectory, not a constant. Three tracks over ~25–32 s.
- Pre-infusion wets the puck at low pressure (C-14); then ~9 bar plateau (C-03);
  then decline on profiling machines.
- Flow and pressure are coupled through the bed (Darcy) (C-06b); temperature
  should stay flat (~93 °C) — that flatness is the goal of good boilers (C-05).
- State plainly: the curve is an *illustrative reference*, not a logged shot.

## § III Three boilers, one problem

- One vessel can't be at brew temp and steam temp at once (C-05).
- Single boiler: cheap, no simultaneity, temperature surfing.
- Heat exchanger: brew + steam together; cooling flush; E61 thermosiphon helps.
- Dual boiler: two independent boilers; PID holds brew within ~±1 °C (C-06).

## § IV What the science actually says

- EY = how much of the bean dissolves; the ceiling is ~30 % (C-07).
- Finer *should* mean more — but real beds channel, so yield peaks then falls (C-08).
- Channeling = water carving preferential paths; the cup turns bitter-and-sour.
- The fix: grind coarser, dose less, steer by brew ratio — up to ~25 % less coffee
  at the same yield (C-09).
- Tamp force barely matters; it just levels the bed (C-13).
- One honest caveat: the model favors lower pressure (café trials at 6 bar to
  avoid clogging); 9 bar is the sensory standard, not a yield optimum.

## § V Mechanism and ritual

- Crema is real: roast CO₂ released from solution into an oil-in-water emulsion
  carrying fines (C-11); pressure makes it, drip can't.
- Proteins/melanoidins form it; polysaccharides keep it; lipids firm it (C-11b).
- But it's a freshness/CO₂ signal more than a flavour verdict — robusta foams more
  (C-11c). ≥10 % of the cup, ≥2 minutes is the connoisseur's cue (C-12).
- Close gently: ritual is part of the pleasure; the point is to know which parts
  are mechanism and which are habit.

## Sources & notes

- Cameron & Hendon 2020 (Matter) — extraction science, definition, tamp,
  pre-infusion, downdosing.
- INEI / IEI — certified Italian espresso parameters.
- SCA (historical) — the grandfathered definition (via Cameron & Hendon).
- Illy & Navarini 2011 — crema composition + quantities.
- FRI 2018 crema study — surfactant roles + persistence.
- Note: pull curve is an illustrative reference; cutaway is a hand-drawn,
  not-to-scale schematic; no 18–22 % EY claim for espresso.
