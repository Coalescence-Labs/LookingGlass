---
topic: Concept 02 model roster vs provider rate cards (2026-04-18)
plan: plans/research/model-roster-refresh.md
date: 2026-04-18
agent: cursor
status: applied
---

## Summary

Cross-checked every row in `src/lib/model-compare.ts` against provider pricing
and model documentation fetched on 2026-04-18. Anthropic, OpenAI, and Google
figures already matched the live rate cards for the fields we track. DeepSeek
API pricing and context length had drifted. Mistral Large 3’s published API
rates were a quarter of what the repo still had. Kimi K2.5’s listed output rate
moved up slightly. Claude Haiku 4.5 now lists extended thinking in Anthropic’s
comparison table, so the capability grid should include reasoning alongside
Sonnet and Opus. Grok remains excluded.

## Method

- Read `src/lib/model-compare.ts` and compared each `MODELS[]` row to primary
  sources.
- Fetched or curled (same day):
  - Anthropic: `https://platform.claude.com/docs/en/about-claude/pricing`,
    `https://docs.claude.com/en/docs/about-claude/models`
  - OpenAI: `https://openai.com/api/pricing/`
  - Google: `https://ai.google.dev/gemini-api/docs/pricing` (HTML via `curl` +
    `rg` for `gemini-2.5-pro` / `gemini-2.5-flash` tables)
  - DeepSeek: `https://api-docs.deepseek.com/quick_start/pricing`
  - Mistral: `https://docs.mistral.ai/models/model-cards/mistral-large-3-25-12`
  - Moonshot / Kimi:
    `https://platform.kimi.ai/docs/pricing/chat-k25.md` and
    `https://platform.kimi.ai/docs/pricing/chat-k25`
- Spot-checked Meta Llama 4 and Qwen home pages; no change required to the
  representative open-weight rows beyond what is noted under Open questions.

## Findings

### Diff-style delta (vs prior `VERIFIED_DATE` 2026-04-17)

- **Additions:** none.
- **Removals:** none.
- **Price changes:** DeepSeek V3.2 in $0.14→$0.28, out $0.28→$0.42; Mistral
  Large 3 in $2→$0.50, out $6→$1.50; Kimi K2.5 out $2.50→$3.00.
- **Window changes:** DeepSeek V3.2 160K→128K (API).
- **Capability changes:** Claude Haiku 4.5 gains `reasoning` (extended thinking
  in provider table).

### 1. DeepSeek V3.2 — context and pay-as-you-go rates

The DeepSeek API docs specify **128K** context for `deepseek-chat` /
`deepseek-reasoner` (V3.2) and **$0.28 / 1M input** (cache miss) and **$0.42 / 1M
output**. The repo had **160K** context and **$0.14 / $0.28**, which no longer
matches the published table. Align Concept 02 with cache-miss input (exclude the
$0.028 cache-hit column per plan rules).

### 2. Mistral Large 3 — API price card

The Mistral Large 3 model card lists **$0.50 / 1M input** and **$1.50 / 1M
output** on La Plateforme. The repo had **$2 / $6**, which appears to be stale.

### 3. Kimi K2.5 — output token rate

Moonshot’s Kimi K2.5 pricing page lists three dollar figures for `kimi-k2.5`;
excluding the lowest tier as cache-related (see Sources), **$0.60 / 1M input**
and **$3.00 / 1M output** match the mid and high columns. The repo had output
**$2.50**.

### 4. Claude Haiku 4.5 — extended thinking

Anthropic’s latest-model comparison marks **Extended thinking: Yes** for Haiku
4.5. Concept 02 should include the `reasoning` capability flag for parity with
how Sonnet/Opus are labeled.

### 5. No roster change — Anthropic Opus/Sonnet/Haiku, GPT-5.4, Gemini 2.5 Pro /
Flash

Pricing and headline context windows for these rows already matched the
fetched provider pages (Gemini 2.5 Pro ≤200K tier $1.25 / $10; Flash $0.30 /
$2.50 text; GPT-5.4 $2.50 / $15 under 270K-token standard tier; Claude prices and
1M / 200k windows per docs).

## Sources

- https://platform.claude.com/docs/en/about-claude/pricing
- https://docs.claude.com/en/docs/about-claude/models
- https://openai.com/api/pricing/
- https://ai.google.dev/gemini-api/docs/pricing
- https://api-docs.deepseek.com/quick_start/pricing
- https://docs.mistral.ai/models/model-cards/mistral-large-3-25-12
- https://platform.kimi.ai/docs/pricing/chat-k25.md
- https://ai.meta.com/blog/llama-4 (Llama 4 announcement; Scout 10M context)
- https://qwen.ai

## Recommendations

- `src/lib/model-compare.ts` — apply Finding 1–4; bump `VERIFIED_DATE` to
  `2026-04-18`; extend `sources` where new URLs anchor the numbers.
- `plans/research/model-roster-refresh.md` — mark done after merge with pointer
  to this research file.

## Open questions

- **Qwen 3.5 flagship API**: No stable public USD rate card was retrieved at
  `qwen.ai` on this pass; the row stays representative with `priceNote` as
  before. Re-check on the next roster refresh.
- **GPT-5.4 exact context cap**: OpenAI’s pricing copy references a ~270K-token
  boundary for standard-rate tiers; the UI keeps **272_000** from the prior
  verification — confirm against `platform.openai.com` model metadata on a
  future pass if the number diverges.

## Applied

- 2026-04-18 · same PR as `src/lib/model-compare.ts` · Findings 1–4 and
  `VERIFIED_DATE` update per this file.
