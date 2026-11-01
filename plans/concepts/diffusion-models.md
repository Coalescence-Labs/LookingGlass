---
title: Concept — How diffusion models generate an image
status: not-started
category: concept
effort: L
series: "I — On language models"
last-updated: 2026-06-17
---

## Context

Series I covers tokens, models, context, and attention — all language-
centric. Image generation is the other modality readers ask about most.
The piece should explain: forward noising, reverse denoising, the score /
noise-prediction objective, classifier-free guidance (conceptually), and
why steps matter — without treating the model as magic.

Risk: math-heavy. Use a visual step-by-step with a tiny grid or low-res
latent strip rather than equations first.

## Goal

Ship `/diffusion-models` as a Concept in Series I, with a scrubbable
denoising demo that walks from pure noise to a resolved image across
discrete timesteps (static frames or precomputed latent strip).

## Approach

1. **Research.** Write `research/diffusion-models/` citing Ho et al.
   DDPM (2020), Nichol & Dhariwal improved DDPM, and primary docs from
   Stability / OpenAI on inference schedulers. Claim ledger for every
   number (typical step counts, noise schedule).
2. **Data.** `src/lib/diffusion.ts` + `public/data/diffusion-denoise.json`
   — precomputed frames for one fixed seed; no runtime model inference.
3. **Visuals.**
   - Timeline scrubber: step 0 (noise) → step T (image).
   - Side panel: what the network predicts at this step (noise vs x0).
   - Optional: guidance slider showing sharper but less diverse output.
4. **Page** cross-links to attention and model-comparison where relevant.

## Files

**Create:**
- `research/diffusion-models/`
- `src/lib/diffusion.ts`
- `public/data/diffusion-denoise.json`
- `src/components/diffusion/DenoiseScrubber.tsx`
- `src/components/diffusion/StepExplainer.tsx`
- `src/app/diffusion-models/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry under Series I.

## Acceptance

- [ ] `bun run build` clean.
- [ ] Denoising demo uses only static/precomputed frames — no WebGPU /
      onnx runtime on the page.
- [ ] Forward vs reverse process explained in prose before jargon.
- [ ] Every figure (step count, schedule name) cited to a primary source.
- [ ] Reduced-motion: show first/middle/last frames without animation.

## References

- Ho, Jain, Abbeel — "Denoising Diffusion Probabilistic Models" (2020).
- Nichol & Dhariwal — improved DDPM (2021).
- Internal: `src/app/attention/page.tsx` for Series I structure.
