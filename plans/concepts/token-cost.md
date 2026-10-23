---
title: Concept — What does a token actually cost?
status: in-progress
category: concept
effort: M
series: "I — On language models"
last-updated: 2026-10-22
---

## Context

Series I covers how much a million tokens *is* (Concept 01) and what models
cost per million on a rate card (Concept 02). What's missing is a working
calculator: given a real app shape — text, images, audio, video, cache hits,
output budget — what does a request and a month actually cost?

## Goal

Ship `/token-cost` with a backend calculator (`POST /api/token-cost`) over a
dated pricing snapshot (input, cached input, output) and modality converters,
so builders can reason about token budgets before they ship.

## Approach

1. Snapshot model pricing separately from Concept 02; include cached-input
   rates where providers publish them; stamp `verifiedDate`.
2. Pure calc lib: modality → tokens → USD line items → optional monthly scale.
3. Thin API route validates and returns the breakdown.
4. Interactive page: model picker, modality panels, scenario presets, verified
   date subtext.

## Files

**Create:**
- `src/lib/token-cost.ts` — snapshot + calculate
- `src/lib/token-cost.test.ts`
- `src/app/api/token-cost/route.ts` (+ tests)
- `src/app/token-cost/page.tsx`
- `src/components/token-cost/*`

**Modify:**
- `src/lib/concepts.ts` — Concept 08

## Acceptance

- [ ] Backend calc matches unit fixtures (cache %, modalities, monthly).
- [ ] UI shows `Pricing verified YYYY-MM-DD`.
- [ ] `bun run lint` / `build` / `test` clean.
- [ ] Grok absent from the snapshot.

## References

- Anthropic pricing / prompt caching docs
- OpenAI API pricing
- Gemini API pricing (audio/video token rates)
- Internal: `src/lib/model-compare.ts`, `src/lib/tokens.ts`
