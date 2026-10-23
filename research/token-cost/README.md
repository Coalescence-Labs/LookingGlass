---
topic: Token cost calculator — pricing snapshot notes
status: draft
last-updated: 2026-10-22
---

# Token cost research notes

Snapshot date: **2026-10-22** (`PRICING_SNAPSHOT.verifiedDate`).

## Rates

Verified against provider pricing pages on 2026-10-22. Cache column is
**cache hit / read** (not cache write).

| Family | Models in snapshot | Notes |
|--------|--------------------|-------|
| Anthropic | Opus / Sonnet / Haiku 5.5 | Cache hits at 0.05× input on Opus/Sonnet 5.5 |
| OpenAI | GPT-5.5, GPT-5.4, GPT-5.4 Mini | Standard window (<272K); long-context is higher |
| Google | Gemini 4 Argon, 3.8 Flash, 3.5 Flash-Lite | Argon & 3.8 Flash use current promo rates |
| DeepSeek | V4 Pro, Flash | Official **off-peak**; peak weekday windows are 2× |
| Meta / Qwen | Llama 4 Scout, Qwen 3.5 | Representative host rates (self-hostable) |
| Moonshot | Kimi K3 | Cache writes billed separately |
| Mistral | Large 4 | La Plateforme list |

Grok remains excluded.

## Modalities

- Audio ≈ 32 tokens/sec, video ≈ 258 tokens/sec — Gemini docs (same constants
  as Concept 01 / `src/lib/tokens.ts`).
- Image bands: small 500 / medium 1100 / large 2500 tokens (approximation).
- Video format bands scale the base rate: low 0.5×, default 1×, high 1.5×.

## Refresh

Follow `plans/research/model-roster-refresh.md` cadence; bump
`verifiedDate` when rates change.
