---
title: Research — Refresh Concept 02 model roster
status: not-started
category: research
effort: S
last-updated: 2026-04-17
---

## Context

Concept 02 (`/model-comparison`) is a frontier-model field guide. Its
data is frozen at the verification date in `src/lib/model-compare.ts`
(`VERIFIED_DATE`). Frontier pricing, context windows, and model names
change on the order of weeks. If the page ships a claim that's wrong,
the whole site loses the "cite primary sources" credibility.

This plan runs on a recurring cadence — once per quarter, or whenever a
major release (Anthropic, OpenAI, Google, DeepSeek, Meta, Mistral,
Qwen, Moonshot) happens. Grok is **deliberately excluded**; do not add
it back.

## Goal

Deposit findings in `research/model-roster-refresh-<YYYY-MM-DD>.md`, then
open a follow-up PR that updates `src/lib/model-compare.ts` and
`VERIFIED_DATE`.

## Approach

1. For each current model in `src/lib/model-compare.ts`, verify:
   - Model still current / not deprecated. Check the provider's pricing
     page or API docs.
   - Input and output price per 1M tokens (standard pay-as-you-go rate;
     exclude batch and cached-token rates).
   - Context window (base + beta).
   - Release date.
   - Whether a newer successor exists.
2. Check each provider's blog / changelog for unlisted additions since
   `VERIFIED_DATE`.
3. Write `research/model-roster-refresh-<date>.md`:
   - Summary of what changed.
   - A diff-style list: additions, removals, price changes, window
     changes.
   - Every claim linked to the provider's own URL.
4. In a separate commit, apply the findings to
   `src/lib/model-compare.ts` and bump `VERIFIED_DATE`. Update the
   per-model `sources` array if any URLs moved.

## Files

**Create (each run):**
- `research/model-roster-refresh-<YYYY-MM-DD>.md`

**Modify (after findings are reviewed):**
- `src/lib/model-compare.ts`
- `src/app/model-comparison/page.tsx` — only if the verified-date copy
  needs tweaking.

## Acceptance

- [ ] Research file exists and follows `research/README.md` format.
- [ ] Every row in `MODELS` either verified unchanged or updated with a
      primary-source citation.
- [ ] `VERIFIED_DATE` matches the research file's date.
- [ ] `bun run build` clean.
- [ ] Grok still absent.

## References

- Provider docs: anthropic.com/pricing, platform.openai.com/docs/pricing,
  ai.google.dev/pricing, deepseek.com, huggingface.co/meta-llama,
  mistral.ai/pricing, qwen.ai, moonshot.ai.
- Internal: `src/lib/model-compare.ts`, `src/lib/context-window.ts`.
