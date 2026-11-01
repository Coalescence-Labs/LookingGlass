import { describe, expect, test } from "bun:test";
import type { ModelSpec } from "./model-compare";
import {
  formatUSD,
  MODELS,
  totalCostPerMillionMixed,
  VERIFIED_DATE,
} from "./model-compare";

const sample: Pick<ModelSpec, "priceInput" | "priceOutput"> = {
  priceInput: 10,
  priceOutput: 20,
};

describe("totalCostPerMillionMixed", () => {
  test("defaults to a 70/30 input/output blend", () => {
    expect(totalCostPerMillionMixed(sample as ModelSpec)).toBeCloseTo(13, 6);
  });

  test("honors a custom input share", () => {
    expect(totalCostPerMillionMixed(sample as ModelSpec, 0.5)).toBeCloseTo(15, 6);
  });
});

describe("formatUSD", () => {
  test("ten and above drop cents", () => {
    expect(formatUSD(13)).toBe("$13");
    expect(formatUSD(25)).toBe("$25");
  });

  test("below ten keeps two decimals", () => {
    expect(formatUSD(1.5)).toBe("$1.50");
    expect(formatUSD(0.3)).toBe("$0.30");
    expect(formatUSD(0.28)).toBe("$0.28");
  });
});

describe("MODELS data integrity", () => {
  test("Grok is intentionally excluded", () => {
    for (const m of MODELS) {
      expect(m.name.toLowerCase()).not.toContain("grok");
      expect(m.family as string).not.toBe("xai");
    }
  });

  test("every model has at least one source with a valid URL", () => {
    for (const m of MODELS) {
      expect(m.sources.length).toBeGreaterThan(0);
      for (const s of m.sources) {
        expect(s.label.length).toBeGreaterThan(0);
        expect(s.url).toMatch(/^https?:\/\//);
      }
    }
  });

  test("prices and context windows are positive", () => {
    for (const m of MODELS) {
      expect(m.priceInput).toBeGreaterThan(0);
      expect(m.priceOutput).toBeGreaterThan(0);
      expect(m.contextTokens).toBeGreaterThan(0);
    }
  });

  test("model names are unique", () => {
    const names = MODELS.map((m) => m.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test("VERIFIED_DATE is an ISO date", () => {
    expect(VERIFIED_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
