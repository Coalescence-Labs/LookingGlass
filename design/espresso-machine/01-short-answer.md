---
section: Short answer
pattern: L-SHORT-ANSWER
plan: plans/concepts/espresso-machine.md
research: research/espresso-machine/01-what-is-espresso.md
claims: [C-01, C-02, C-10]
---

## Purpose

In one sentence, reframe espresso as a *defined process* — specific pressure,
temperature, dose, and time — not a vague "strong coffee." Hand the reader the
canonical numbers up front.

## Layout (L-SHORT-ANSWER)

```
section.shell pb-20 md:pb-28
  Reveal
    grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 border-t border-line pt-12 md:pt-16
      Left:
        type-mono-sm "The short answer"
        type-display-m text-bone with italic text-accent spans:
          "Espresso is hot water *driven through coffee under pressure* —
           about nine bars, water a few degrees off the boil, ~7 g of grounds,
           done in ~25 seconds."
      Right (flex flex-col gap-6):
        block: type-mono-sm "The standard pull" → type-numeral big "9 bar"
               + type-mono "≈ 130 psi · 9× atmosphere" (C-03)
        rule
        block: type-mono-sm "By the book" → small definition list:
               7 g · ~90–96 °C · 25 s · 25 mL  (C-01/C-02)
        block: type-mono-sm "In a real café" → "18 g in, 36 g out" (C-10)
```

## Motion

- Single `Reveal` wraps the grid.
- No count-up here (reserve `BigNumber` for § IV). The "9 bar" is static
  `type-numeral`.

## Data

- Pull `STANDARDS.sca` and `STANDARDS.inei` from `espresso.ts`.
- Numbers: C-01 (7–9 g, 92–95 °C, 9–10 bar, 20–30 s, 25–35 mL), C-02 (INEI),
  C-03 (130 psi), C-10 (café 18/36).

## Mobile

Single column; right-hand stat blocks stack under the sentence. Definition list
wraps to two lines.

## Notes

- Use the SCA/INEI distinction honestly: "~90–96 °C at the group; standards
  measure at different points" (research discrepancy #1). Keep the headline
  simple ("a few degrees off the boil") and let `#sources` carry the nuance.
