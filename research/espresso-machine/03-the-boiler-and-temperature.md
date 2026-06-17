---
topic: The boiler and temperature control
plan: plans/concepts/espresso-machine.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 03
related-chunks:
  - 02-the-pump-and-pressure.md
  - 06-the-extraction-curve.md
---

## Summary

One vessel cannot be at brew temperature (~90–96 °C) and steam temperature
(~125–135 °C) at once. The three classic architectures are three answers.
**Single boiler**: one vessel, one setpoint — brew, then wait and reheat to
steam (no simultaneity). **Heat exchanger (HX)**: a steam-temperature boiler
with a tube running through it; cold brew water flash-heats as it passes, so you
can brew and steam together, but idle water in the tube overheats and needs a
"cooling flush." **Dual boiler**: two independent boilers, each with its own
controller — the brew boiler is never disturbed by steaming. A **PID**
controller pulses the heating element to hold a setpoint, typically within ~±1 °C
(saturated group + PID can be tighter). The **E61 thermosiphon** passively
circulates boiler water through the brass group to keep it warm.

## Method

- Read Coffeeionado, Coffee Scholars, Brew Precision, and Simon & Bearns boiler
  explainers (independent vendors/educators agree on architecture and
  temperature bands). Accessed 2026-06-17.
- INEI exit-water 88 °C ±2 cross-checked from chunk 01.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-05 | brew ~90–96 °C; steam boiler ~125–135 °C | high | Coffee Scholars | Brew Precision | HX boiler ~125 °C |
| C-06 | PID/dual-boiler brew stability ~±1 °C | high | Brew Precision | Coffee Scholars | saturated+PID tighter (±0.1–0.5 °F) |
| C-05b | 2 °C swing audibly changes flavor | medium | Brew Precision | — | motivates the whole section |

## Findings

### 1. The core problem (C-05)

Brewing wants ~90–96 °C water; steaming milk wants dry steam, which means a
boiler above 100 °C (commonly ~125–135 °C). A single vessel can't hold both.

### 2. Single boiler (SBDU)

One boiler, one heating element, one setpoint. To go from brew to steam you raise
the setpoint and wait; to go back you cool down. Cheapest and most
energy-efficient; no simultaneous brew+steam. Without a PID, users "temperature
surf" — timing the shot against the thermostat's heating cycle.

### 3. Heat exchanger (C-05)

A large boiler is held at steam temperature (~125 °C). A tube (the heat
exchanger) passes through it; cold reservoir water flows through the tube and is
flash-heated on the way to the group. Brew and steam at once — but water sitting
in the tube while idle overheats, so baristas run a brief "cooling flush" before
pulling. Many HX machines use an E61 group whose thermosiphon passively
stabilizes group temperature.

### 4. Dual boiler (C-06)

Two independent boilers: a small PID-controlled brew boiler (e.g. 93 °C) and a
separate steam boiler (~125–135 °C). The brew circuit is decoupled from steam
demand, so PID can hold brew temperature within ~±1 °C. A saturated group head in
direct contact with the brew boiler, plus PID, narrows variance further
(vendors cite ±0.1–0.5 °F at the group).

### 5. The E61 thermosiphon

The E61 group is a brass/copper unit with its own passive circuit: hot boiler
water rises through the group and returns, no pump needed, keeping the heavy
group mass warm and thermally stable once fully heated (15–30 min warm-up).

## Discrepancies

| Claim ID | Source A says | Source B says | Recommended | Rationale |
|----------|---------------|---------------|-------------|-----------|
| C-05 | steam boiler ~125 °C | another vendor ~135 °C | "~125–135 °C" | range across designs |

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| PID | proportional–integral–derivative controller; modulates element power to a setpoint | control theory |
| thermosiphon | passive convective loop circulating hot water without a pump | Coffeeionado (E61) |
| cooling flush | brief water release to purge overheated HX water before a shot | Brew Precision |

## Implications for the article

- § Heat: three boilers, one problem; this is the natural home for the
  `BoilerComparison` interactive (single / HX / dual across stability &
  simultaneity).
- Cutaway: show boiler + group + thermosiphon loop; highlight on scroll.
- Tie back: temperature stability is why pull-curve track 3 (temperature) is
  nearly flat on good machines (chunk 06).

## Sources

1. **Coffee Scholars** — Single Boiler vs. Heat Exchanger vs. Dual Boiler.
   https://coffeescholars.com/single-boiler-vs-heat-exchanger-vs-dual-boiler/
2. **Brew Precision** — Single vs Dual Boiler vs Heat Exchanger.
   https://brewprecision.com/articles/single-boiler-vs-dual-boiler-vs-heat-exchanger
3. **Coffeeionado** — Single Boiler vs Heat Exchanger vs Dual Boiler.
   https://www.coffeeionado.com/blogs/the-academy/single-boiler-vs-heat-exchanger-vs-dual-boiler-espresso-machines-whats-the-difference
   All accessed 2026-06-17.

## Open questions

- [ ] Exact ±°C band varies by machine; page uses "about a degree" framing with
  the saturated-group caveat rather than a single hard number.
