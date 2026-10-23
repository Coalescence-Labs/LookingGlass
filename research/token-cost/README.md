---
topic: Token cost calculator — pricing snapshot notes
status: draft
last-updated: 2026-10-22
---

# Token cost research notes

Snapshot date: **2026-10-22** (`PRICING_SNAPSHOT.verifiedDate`).

## Rates

Closed-model input/output seeded from Concept 02 (`src/lib/model-compare.ts`,
verified 2026-04-18) and cross-checked against provider pricing pages for cache
hit (cached-input) rates:

| Family | Cache hits |
|--------|------------|
| Anthropic | Opus 4.7 $0.50 · Sonnet 4.6 $0.30 · Haiku 4.5 $0.10 / 1M |
| OpenAI | GPT-5.4 cached ≈ $0.25 / 1M (published cache read) |
| Google | Gemini context-cache rates as listed on pricing docs |
| DeepSeek / Kimi | Published cache where available; else omitted |

## Modalities

- Audio ≈ 32 tokens/sec, video ≈ 258 tokens/sec — Gemini docs (same constants
  as Concept 01 / `src/lib/tokens.ts`).
- Image bands: small 500 / medium 1100 / large 2500 tokens (approximation).
- Video format bands scale the base rate: low 0.5×, default 1×, high 1.5×.

## Refresh

Follow `plans/research/model-roster-refresh.md` cadence; bump
`verifiedDate` when rates change.
