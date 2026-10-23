import { describe, expect, test } from "bun:test";
import {
  AUDIO_TOKENS_PER_SEC,
  VIDEO_TOKENS_PER_SEC,
} from "./tokens";
import {
  calculateCost,
  formatCostUsd,
  getModel,
  IMAGE_TOKENS,
  modalityTokens,
  parseCostScenario,
  PRICING_SNAPSHOT,
  textToTokens,
  usdForTokens,
  VIDEO_FORMAT_MULTIPLIER,
} from "./token-cost";

describe("PRICING_SNAPSHOT integrity", () => {
  test("verifiedDate is ISO", () => {
    expect(PRICING_SNAPSHOT.verifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("Grok is excluded", () => {
    for (const m of PRICING_SNAPSHOT.models) {
      expect(m.name.toLowerCase()).not.toContain("grok");
      expect(m.family as string).not.toBe("xai");
    }
  });

  test("ids are unique and prices positive", () => {
    const ids = PRICING_SNAPSHOT.models.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of PRICING_SNAPSHOT.models) {
      expect(m.priceInput).toBeGreaterThan(0);
      expect(m.priceOutput).toBeGreaterThan(0);
      if (m.priceCachedInput != null) {
        expect(m.priceCachedInput).toBeGreaterThan(0);
        expect(m.priceCachedInput).toBeLessThanOrEqual(m.priceInput);
      }
      expect(m.sources.length).toBeGreaterThan(0);
    }
  });
});

describe("textToTokens", () => {
  test("tokens pass through", () => {
    expect(textToTokens({ mode: "tokens", tokens: 1_000 })).toBe(1_000);
  });

  test("words use WORDS_PER_TOKEN", () => {
    expect(textToTokens({ mode: "words", words: 750 })).toBeCloseTo(1_000, 6);
  });

  test("chars use CHARS_PER_TOKEN", () => {
    expect(textToTokens({ mode: "chars", chars: 4_000 })).toBe(1_000);
  });
});

describe("modalityTokens", () => {
  test("sums text, images, audio, video", () => {
    const t = modalityTokens({
      modelId: "claude-sonnet-5.5",
      text: { mode: "tokens", tokens: 1_000 },
      images: { count: 2, size: "medium" },
      audioSeconds: 10,
      video: { seconds: 2, format: "default" },
      outputTokens: 0,
    });
    expect(t.text).toBe(1_000);
    expect(t.images).toBe(2 * IMAGE_TOKENS.medium);
    expect(t.audio).toBe(10 * AUDIO_TOKENS_PER_SEC);
    expect(t.video).toBe(2 * VIDEO_TOKENS_PER_SEC);
    expect(t.inputTotal).toBe(t.text + t.images + t.audio + t.video);
  });

  test("video format multiplier", () => {
    const low = modalityTokens({
      modelId: "gemini-2.5-flash",
      video: { seconds: 10, format: "low" },
      outputTokens: 0,
    });
    expect(low.video).toBe(
      10 * VIDEO_TOKENS_PER_SEC * VIDEO_FORMAT_MULTIPLIER.low,
    );
  });
});

describe("usdForTokens", () => {
  test("1M tokens at $5 is $5", () => {
    expect(usdForTokens(1_000_000, 5)).toBe(5);
  });

  test("fractional", () => {
    expect(usdForTokens(100_000, 3)).toBeCloseTo(0.3, 6);
  });
});

describe("calculateCost", () => {
  test("simple text + output with no cache", () => {
    const result = calculateCost({
      modelId: "claude-sonnet-5.5",
      text: { mode: "tokens", tokens: 1_000_000 },
      outputTokens: 1_000_000,
      cacheHitPercent: 0,
    });
    // $2 input + $10 output
    expect(result.costs.uncachedInputUsd).toBeCloseTo(2, 6);
    expect(result.costs.cachedInputUsd).toBeCloseTo(0, 6);
    expect(result.costs.outputUsd).toBeCloseTo(10, 6);
    expect(result.costs.perRequestUsd).toBeCloseTo(12, 6);
    expect(result.verifiedDate).toBe(PRICING_SNAPSHOT.verifiedDate);
  });

  test("cache hit percent splits text only", () => {
    const result = calculateCost({
      modelId: "claude-opus-5.5",
      text: { mode: "tokens", tokens: 1_000_000 },
      images: { count: 0, size: "small" },
      outputTokens: 0,
      cacheHitPercent: 80,
    });
    // 800k @ $0.20 + 200k @ $4
    expect(result.tokens.cachedText).toBeCloseTo(800_000, 6);
    expect(result.tokens.uncachedText).toBeCloseTo(200_000, 6);
    expect(result.costs.cachedInputUsd).toBeCloseTo(0.16, 6);
    expect(result.costs.uncachedInputUsd).toBeCloseTo(0.8, 6);
  });

  test("model without cache rate falls back to input price", () => {
    const model = getModel("llama-4-scout");
    expect(model?.priceCachedInput).toBeUndefined();
    const result = calculateCost({
      modelId: "llama-4-scout",
      text: { mode: "tokens", tokens: 1_000_000 },
      outputTokens: 0,
      cacheHitPercent: 50,
    });
    expect(result.tokens.cachedText).toBe(0);
    expect(result.costs.uncachedInputUsd).toBeCloseTo(0.15, 6);
    expect(result.notes.some((n) => n.includes("no published cache"))).toBe(
      true,
    );
  });

  test("monthly scale", () => {
    const result = calculateCost({
      modelId: "claude-haiku-5.5",
      text: { mode: "tokens", tokens: 1_000 },
      outputTokens: 500,
      requestsPerDay: 100,
      users: 10,
    });
    expect(result.monthly?.requests).toBe(100 * 10 * 30);
    expect(result.monthly?.usd).toBeCloseTo(
      result.costs.perRequestUsd * 30_000,
      6,
    );
  });

  test("unknown model throws", () => {
    expect(() =>
      calculateCost({ modelId: "nope", outputTokens: 0 }),
    ).toThrow(/Unknown model/);
  });
});

describe("parseCostScenario", () => {
  test("accepts a valid body", () => {
    const parsed = parseCostScenario({
      modelId: "gpt-5.4",
      text: { mode: "words", words: 750 },
      outputTokens: 200,
      cacheHitPercent: 10,
    });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.scenario.modelId).toBe("gpt-5.4");
      expect(parsed.scenario.outputTokens).toBe(200);
    }
  });

  test("rejects unknown model", () => {
    const parsed = parseCostScenario({
      modelId: "grok-9000",
      outputTokens: 1,
    });
    expect(parsed.ok).toBe(false);
  });

  test("rejects bad cache percent", () => {
    const parsed = parseCostScenario({
      modelId: "gpt-5.4",
      outputTokens: 1,
      cacheHitPercent: 150,
    });
    expect(parsed.ok).toBe(false);
  });
});

describe("formatCostUsd", () => {
  test("formats small and large", () => {
    expect(formatCostUsd(0)).toBe("$0");
    expect(formatCostUsd(0.005)).toBe("$0.0050");
    expect(formatCostUsd(1.23)).toBe("$1.23");
  });
});
