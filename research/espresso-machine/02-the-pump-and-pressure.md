---
topic: The pump and where pressure comes from
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 02
related-chunks:
  - 04-grouphead-portafilter-puck.md
  - 06-the-extraction-curve.md
---

## Summary

Nine bar is roughly nine times atmospheric pressure — about 130 psi. Two pump
families produce it. A **vibratory** (solenoid) pump drives a spring-loaded
piston with an electromagnetic coil, oscillating ~60 times per second; flow is
pulsed and pressure builds over a second or two. A **rotary vane** pump uses a
motor-spun, offset rotor whose vanes sweep a crescent chamber, delivering smooth
continuous flow at near-instant full pressure. Vibratory pumps are small, cheap,
and standard in home machines; rotary pumps are larger, quieter, longer-lived,
and standard in commercial machines and can plumb to a water line. In both, a
spring **over-pressure valve (OPV)** caps brew pressure (commonly set ~9–10 bar)
by bleeding excess back to the reservoir.

## Method

- Read Clive Coffee "The Pump" explainer and Coffeeionado/Brew Coffee Home/
  Seattle Coffee Gear pump comparisons (multiple independent vendors agree on
  mechanism). Accessed 2026-06-17.
- Cross-checked the 9 bar ≈ 130 psi figure (Clive) against unit conversion
  (9 bar = 130.5 psi).

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-03 | 9 bar ≈ 130 psi ≈ 9 atm | high | Clive Coffee | unit conversion | for intuition |
| C-04 | Vibratory pump ~60 strokes/s | high | Clive Coffee | Coffeeionado, Brew Coffee Home | pulsed flow |
| C-04b | Rotary = continuous, near-instant full pressure | high | Coffeeionado | Seattle Coffee Gear | smooth |

## Findings

### 1. What 9 bar feels like (C-03)

"To give water the strength to push through a tightly packed bed of finely
ground coffee, machines need pressure: 9 bars … which roughly translates to
130 psi" (Clive Coffee). One bar ≈ sea-level atmospheric pressure, so 9 bar is
about nine atmospheres. The earliest machines reached this with a hand lever and
a spring — hence "pull a shot."

### 2. Vibratory pumps (C-04)

A piston with an attached magnet sits inside a coil; alternating current drives
it back and forth, each forward stroke pushing water, each return drawing more
in. "Your average vibe pump clocks in at sixty pushes per second." The output is
therefore a fast pulse train, and pressure ramps over ~1–2 s from a low start.
Small, inexpensive, reservoir-fed, but louder and shorter-lived. Brands: Ulka,
Olab, Fluid-O-Tech.

### 3. Rotary vane pumps (C-04b)

A motor spins a disc mounted off-center inside a round chamber; vanes slide to
follow the wall, so each pocket shrinks toward the outlet and pressurizes the
water. Flow is smooth and continuous, full pressure is reached almost
immediately, and pressure can be trimmed with a screw. Bigger, quieter, more
durable, and able to take a plumbed line. Standard in commercial machines.

### 4. The over-pressure valve

Both pumps can exceed target; a spring OPV bleeds excess back to the tank to cap
brew pressure (commonly factory-set near 9–10 bar). This is why a gauge "pins" at
a stable value once the puck is saturated.

## Implications for the article

- § Pressure: explain the pump and the OPV; use C-03 for intuition.
- Cutaway labels: reservoir → pump → (OPV branch back to tank) → boiler inlet.
- Note: vibratory ramp vs rotary instant-on motivates the pre-infusion / pressure
  shape in chunk 06.

## Sources

1. **Clive Coffee** — The Pump: The Heart of Your Espresso Machine.
   https://clivecoffee.com/blogs/learn/the-pump-the-heart-of-your-espresso-machine
2. **Coffeeionado** — Rotary Pump vs Vibration Pump.
   https://www.coffeeionado.com/blogs/engineering-tech/rotary-pump-vs-vibration-pump-espresso-machines-whats-the-difference
3. **Seattle Coffee Gear** — Vibratory vs. Rotary Pumps.
   https://www.seattlecoffeegear.com/blogs/scg-blog/vibratory-vs-rotary-pumps
   All accessed 2026-06-17.

## Open questions

- [ ] A primary (engineering) citation for the 60 Hz figure would be ideal; it is
  consistent across vendors and matches mains-frequency solenoid behavior, so it
  is safe as "about 60 times a second."
