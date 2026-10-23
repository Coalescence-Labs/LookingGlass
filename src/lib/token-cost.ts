/**
 * Token cost calculator — pricing snapshot + pure cost math.
 *
 * Prices are USD per 1M tokens (pay-as-you-go). Cached-input rates are
 * cache *hits* (reads), not cache writes. Modalities use published
 * approximations; label results as estimates in the UI.
 *
 * Refresh cadence: mirror plans/research/model-roster-refresh.md.
 * Grok is intentionally excluded.
 */

import {
  AUDIO_TOKENS_PER_SEC,
  CHARS_PER_TOKEN,
  VIDEO_TOKENS_PER_SEC,
  WORDS_PER_TOKEN,
} from "./tokens";

export type ModelFamily =
  | "anthropic"
  | "openai"
  | "google"
  | "deepseek"
  | "meta"
  | "qwen"
  | "moonshot"
  | "mistral";

export type ModelPricing = {
  id: string;
  name: string;
  family: ModelFamily;
  /** USD per 1M input tokens */
  priceInput: number;
  /** USD per 1M cached-input (cache hit) tokens; omit if unpublished */
  priceCachedInput?: number;
  /** USD per 1M output tokens */
  priceOutput: number;
  sources: { label: string; url: string }[];
  /** For open-weight hosts where list price is representative only */
  priceNote?: string;
};

export type PricingSnapshot = {
  verifiedDate: string;
  models: ModelPricing[];
};

/** Image size band → approximate input tokens per image (English hedge). */
export type ImageSizeBand = "small" | "medium" | "large";

/** Video quality band scales the base tokens/sec rate. */
export type VideoFormatBand = "default" | "low" | "high";

export type TextInput =
  | { mode: "tokens"; tokens: number }
  | { mode: "words"; words: number }
  | { mode: "chars"; chars: number };

export type CostScenario = {
  modelId: string;
  text?: TextInput;
  images?: { count: number; size: ImageSizeBand };
  audioSeconds?: number;
  video?: { seconds: number; format: VideoFormatBand };
  /** 0–100: share of *text* input tokens billed at the cache-hit rate */
  cacheHitPercent?: number;
  outputTokens: number;
  /** Optional scale for monthly budget */
  requestsPerDay?: number;
  users?: number;
};

export type TokenBreakdown = {
  text: number;
  images: number;
  audio: number;
  video: number;
  /** text + images + audio + video */
  inputTotal: number;
  /** Portion of text billed as cache hits */
  cachedText: number;
  /** Portion of text billed at standard input */
  uncachedText: number;
  output: number;
};

export type CostLineItems = {
  uncachedInputUsd: number;
  cachedInputUsd: number;
  outputUsd: number;
  /** Sum of the three line items */
  perRequestUsd: number;
};

export type CostResult = {
  model: ModelPricing;
  verifiedDate: string;
  tokens: TokenBreakdown;
  costs: CostLineItems;
  monthly?: {
    requests: number;
    usd: number;
  };
  notes: string[];
};

export const IMAGE_TOKENS: Record<ImageSizeBand, number> = {
  small: 500, // ~512px-class
  medium: 1_100, // ~1024px-class
  large: 2_500, // ~2048px / high-detail
};

export const VIDEO_FORMAT_MULTIPLIER: Record<VideoFormatBand, number> = {
  low: 0.5,
  default: 1,
  high: 1.5,
};

export const PRICING_SNAPSHOT: PricingSnapshot = {
  verifiedDate: "2026-10-22",
  models: [
    {
      id: "claude-opus-4.7",
      name: "Claude Opus 4.7",
      family: "anthropic",
      priceInput: 5,
      priceCachedInput: 0.5,
      priceOutput: 25,
      sources: [
        {
          label: "Claude API pricing",
          url: "https://platform.claude.com/docs/en/about-claude/pricing",
        },
        {
          label: "Prompt caching",
          url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
        },
      ],
    },
    {
      id: "claude-sonnet-4.6",
      name: "Claude Sonnet 4.6",
      family: "anthropic",
      priceInput: 3,
      priceCachedInput: 0.3,
      priceOutput: 15,
      sources: [
        {
          label: "Claude API pricing",
          url: "https://platform.claude.com/docs/en/about-claude/pricing",
        },
      ],
    },
    {
      id: "claude-haiku-4.5",
      name: "Claude Haiku 4.5",
      family: "anthropic",
      priceInput: 1,
      priceCachedInput: 0.1,
      priceOutput: 5,
      sources: [
        {
          label: "Claude API pricing",
          url: "https://platform.claude.com/docs/en/about-claude/pricing",
        },
      ],
    },
    {
      id: "gpt-5.4",
      name: "GPT-5.4",
      family: "openai",
      priceInput: 2.5,
      priceCachedInput: 0.25,
      priceOutput: 15,
      sources: [
        {
          label: "OpenAI API pricing",
          url: "https://openai.com/api/pricing/",
        },
      ],
    },
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      family: "google",
      priceInput: 1.25,
      priceCachedInput: 0.315,
      priceOutput: 10,
      sources: [
        {
          label: "Gemini API pricing",
          url: "https://ai.google.dev/gemini-api/docs/pricing",
        },
      ],
    },
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      family: "google",
      priceInput: 0.3,
      priceCachedInput: 0.075,
      priceOutput: 2.5,
      sources: [
        {
          label: "Gemini API pricing",
          url: "https://ai.google.dev/gemini-api/docs/pricing",
        },
      ],
    },
    {
      id: "deepseek-v3.2",
      name: "DeepSeek V3.2",
      family: "deepseek",
      priceInput: 0.28,
      priceCachedInput: 0.028,
      priceOutput: 0.42,
      priceNote:
        "API prices vary by host; cache rate is DeepSeek's published cache hit.",
      sources: [
        {
          label: "DeepSeek API pricing",
          url: "https://api-docs.deepseek.com/quick_start/pricing",
        },
      ],
    },
    {
      id: "llama-4-scout",
      name: "Llama 4 Scout",
      family: "meta",
      priceInput: 0.15,
      priceOutput: 0.6,
      priceNote:
        "Self-hostable at no API cost; rates are representative third-party hosts.",
      sources: [
        {
          label: "Meta — Llama 4",
          url: "https://ai.meta.com/blog/llama-4",
        },
      ],
    },
    {
      id: "qwen-3.5",
      name: "Qwen 3.5",
      family: "qwen",
      priceInput: 0.1,
      priceOutput: 0.2,
      priceNote: "Representative flagship host rate; sizes vary.",
      sources: [{ label: "Qwen", url: "https://qwen.ai" }],
    },
    {
      id: "kimi-k2.5",
      name: "Kimi K2.5",
      family: "moonshot",
      priceInput: 0.6,
      priceCachedInput: 0.15,
      priceOutput: 3,
      sources: [
        {
          label: "Kimi K2.5 API pricing",
          url: "https://platform.kimi.ai/docs/pricing/chat-k25",
        },
      ],
    },
    {
      id: "mistral-large-3",
      name: "Mistral Large 3",
      family: "mistral",
      priceInput: 0.5,
      priceOutput: 1.5,
      priceNote: "La Plateforme list price; resellers may differ.",
      sources: [
        { label: "Mistral AI pricing", url: "https://mistral.ai/pricing" },
      ],
    },
  ],
};

export function getModel(id: string): ModelPricing | undefined {
  return PRICING_SNAPSHOT.models.find((m) => m.id === id);
}

export function textToTokens(text: TextInput): number {
  switch (text.mode) {
    case "tokens":
      return Math.max(0, text.tokens);
    case "words":
      return Math.max(0, text.words / WORDS_PER_TOKEN);
    case "chars":
      return Math.max(0, text.chars / CHARS_PER_TOKEN);
  }
}

export function modalityTokens(scenario: CostScenario): Omit<
  TokenBreakdown,
  "cachedText" | "uncachedText" | "output"
> {
  const text = scenario.text ? textToTokens(scenario.text) : 0;
  const images =
    scenario.images && scenario.images.count > 0
      ? scenario.images.count * IMAGE_TOKENS[scenario.images.size]
      : 0;
  const audio =
    scenario.audioSeconds && scenario.audioSeconds > 0
      ? scenario.audioSeconds * AUDIO_TOKENS_PER_SEC
      : 0;
  const video =
    scenario.video && scenario.video.seconds > 0
      ? scenario.video.seconds *
        VIDEO_TOKENS_PER_SEC *
        VIDEO_FORMAT_MULTIPLIER[scenario.video.format]
      : 0;

  return {
    text,
    images,
    audio,
    video,
    inputTotal: text + images + audio + video,
  };
}

/** USD for `tokens` at a per-1M rate. */
export function usdForTokens(tokens: number, pricePerMillion: number): number {
  return (tokens / 1_000_000) * pricePerMillion;
}

export function calculateCost(scenario: CostScenario): CostResult {
  const model = getModel(scenario.modelId);
  if (!model) {
    throw new Error(`Unknown model: ${scenario.modelId}`);
  }

  const notes: string[] = [];
  const parts = modalityTokens(scenario);
  const output = Math.max(0, scenario.outputTokens);

  const cachePct = clamp(scenario.cacheHitPercent ?? 0, 0, 100) / 100;
  let cachedText = parts.text * cachePct;
  let uncachedText = parts.text - cachedText;

  if (cachePct > 0 && model.priceCachedInput == null) {
    notes.push(
      `${model.name} has no published cache-hit rate in this snapshot — text billed at the standard input price.`,
    );
    cachedText = 0;
    uncachedText = parts.text;
  }

  // Non-text modalities always bill at standard input in this calculator.
  const uncachedInputTokens =
    uncachedText + parts.images + parts.audio + parts.video;

  const cachedRate = model.priceCachedInput ?? model.priceInput;
  const uncachedInputUsd = usdForTokens(uncachedInputTokens, model.priceInput);
  const cachedInputUsd = usdForTokens(cachedText, cachedRate);
  const outputUsd = usdForTokens(output, model.priceOutput);
  const perRequestUsd = uncachedInputUsd + cachedInputUsd + outputUsd;

  if (parts.images > 0 || parts.audio > 0 || parts.video > 0) {
    notes.push(
      "Image, audio, and video token counts are published approximations — not a substitute for the provider tokenizer.",
    );
  }
  if (model.priceNote) {
    notes.push(model.priceNote);
  }

  const tokens: TokenBreakdown = {
    ...parts,
    cachedText,
    uncachedText,
    output,
  };

  const costs: CostLineItems = {
    uncachedInputUsd,
    cachedInputUsd,
    outputUsd,
    perRequestUsd,
  };

  const requestsPerDay = scenario.requestsPerDay ?? 0;
  const users = scenario.users ?? 1;
  let monthly: CostResult["monthly"];
  if (requestsPerDay > 0) {
    const requests = requestsPerDay * users * 30;
    monthly = { requests, usd: perRequestUsd * requests };
  }

  return {
    model,
    verifiedDate: PRICING_SNAPSHOT.verifiedDate,
    tokens,
    costs,
    monthly,
    notes,
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Coerce a POST body into a CostScenario or return an error string. */
export function parseCostScenario(
  body: unknown,
): { ok: true; scenario: CostScenario } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.modelId !== "string" || !b.modelId.trim()) {
    return { ok: false, error: "modelId is required." };
  }
  if (!getModel(b.modelId)) {
    return { ok: false, error: `Unknown modelId: ${b.modelId}` };
  }

  const outputTokens = asNonNegNumber(b.outputTokens, "outputTokens");
  if (outputTokens == null) {
    return { ok: false, error: "outputTokens must be a non-negative number." };
  }

  const scenario: CostScenario = {
    modelId: b.modelId,
    outputTokens,
  };

  if (b.text != null) {
    const text = parseTextInput(b.text);
    if (!text.ok) return text;
    scenario.text = text.value;
  }

  if (b.images != null) {
    if (typeof b.images !== "object" || b.images === null) {
      return { ok: false, error: "images must be an object." };
    }
    const img = b.images as Record<string, unknown>;
    const count = asNonNegNumber(img.count, "images.count");
    if (count == null) {
      return { ok: false, error: "images.count must be a non-negative number." };
    }
    const size = img.size;
    if (size !== "small" && size !== "medium" && size !== "large") {
      return {
        ok: false,
        error: 'images.size must be "small", "medium", or "large".',
      };
    }
    scenario.images = { count, size };
  }

  if (b.audioSeconds != null) {
    const audio = asNonNegNumber(b.audioSeconds, "audioSeconds");
    if (audio == null) {
      return { ok: false, error: "audioSeconds must be a non-negative number." };
    }
    scenario.audioSeconds = audio;
  }

  if (b.video != null) {
    if (typeof b.video !== "object" || b.video === null) {
      return { ok: false, error: "video must be an object." };
    }
    const v = b.video as Record<string, unknown>;
    const seconds = asNonNegNumber(v.seconds, "video.seconds");
    if (seconds == null) {
      return {
        ok: false,
        error: "video.seconds must be a non-negative number.",
      };
    }
    const format = v.format;
    if (format !== "default" && format !== "low" && format !== "high") {
      return {
        ok: false,
        error: 'video.format must be "default", "low", or "high".',
      };
    }
    scenario.video = { seconds, format };
  }

  if (b.cacheHitPercent != null) {
    const pct = asNonNegNumber(b.cacheHitPercent, "cacheHitPercent");
    if (pct == null || pct > 100) {
      return {
        ok: false,
        error: "cacheHitPercent must be a number between 0 and 100.",
      };
    }
    scenario.cacheHitPercent = pct;
  }

  if (b.requestsPerDay != null) {
    const r = asNonNegNumber(b.requestsPerDay, "requestsPerDay");
    if (r == null) {
      return {
        ok: false,
        error: "requestsPerDay must be a non-negative number.",
      };
    }
    scenario.requestsPerDay = r;
  }

  if (b.users != null) {
    const u = asNonNegNumber(b.users, "users");
    if (u == null || u < 1) {
      return { ok: false, error: "users must be a number ≥ 1." };
    }
    scenario.users = u;
  }

  return { ok: true, scenario };
}

function parseTextInput(
  raw: unknown,
):
  | { ok: true; value: TextInput }
  | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "text must be an object." };
  }
  const t = raw as Record<string, unknown>;
  if (t.mode === "tokens") {
    const tokens = asNonNegNumber(t.tokens, "text.tokens");
    if (tokens == null) {
      return { ok: false, error: "text.tokens must be a non-negative number." };
    }
    return { ok: true, value: { mode: "tokens", tokens } };
  }
  if (t.mode === "words") {
    const words = asNonNegNumber(t.words, "text.words");
    if (words == null) {
      return { ok: false, error: "text.words must be a non-negative number." };
    }
    return { ok: true, value: { mode: "words", words } };
  }
  if (t.mode === "chars") {
    const chars = asNonNegNumber(t.chars, "text.chars");
    if (chars == null) {
      return { ok: false, error: "text.chars must be a non-negative number." };
    }
    return { ok: true, value: { mode: "chars", chars } };
  }
  return {
    ok: false,
    error: 'text.mode must be "tokens", "words", or "chars".',
  };
}

function asNonNegNumber(v: unknown, _label: string): number | null {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) return null;
  return v;
}

export function formatCostUsd(n: number): string {
  if (n === 0) return "$0";
  if (n < 0.0001) return `$${n.toExponential(2)}`;
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
