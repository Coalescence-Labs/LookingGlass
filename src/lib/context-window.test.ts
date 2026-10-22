import { describe, expect, test } from "bun:test";
import {
  formatPages,
  formatTokensShort,
  MAX_TOKENS,
  MODELS,
  tokensToPages,
  tokensToWords,
} from "./context-window";

describe("tokensToPages / tokensToWords", () => {
  test("words use the token ratio", () => {
    expect(tokensToWords(1000)).toBe(750);
  });

  test("pages divide words by page length", () => {
    expect(tokensToPages(1000)).toBeCloseTo(2.727, 2);
    expect(tokensToPages(1_000_000)).toBeCloseTo(2727.27, 1);
  });
});

describe("formatTokensShort", () => {
  test("millions collapse trailing zeros", () => {
    expect(formatTokensShort(1_000_000)).toBe("1M");
    expect(formatTokensShort(2_000_000)).toBe("2M");
    expect(formatTokensShort(1_500_000)).toBe("1.5M");
    expect(formatTokensShort(10_000_000)).toBe("10M");
  });

  test("thousands round to whole K", () => {
    expect(formatTokensShort(128_000)).toBe("128K");
    expect(formatTokensShort(200_000)).toBe("200K");
  });

  test("small values are localized integers", () => {
    expect(formatTokensShort(500)).toBe("500");
  });
});

describe("formatPages", () => {
  test("ten-thousands and up use K pages", () => {
    expect(formatPages(12_500)).toBe("12.5K pages");
  });

  test("thousands are localized with the pages suffix", () => {
    expect(formatPages(2_727.3)).toBe("2,727 pages");
  });

  test("small counts round to whole pages", () => {
    expect(formatPages(500.4)).toBe("500 pages");
  });
});

describe("MODELS data integrity", () => {
  test("MAX_TOKENS reflects the largest beta-or-standard window", () => {
    const expected = Math.max(...MODELS.map((m) => m.tokensBeta ?? m.tokens));
    expect(MAX_TOKENS).toBe(expected);
    expect(MAX_TOKENS).toBe(10_000_000);
  });

  test("every model has a positive window and a source URL", () => {
    for (const m of MODELS) {
      expect(m.tokens).toBeGreaterThan(0);
      expect(m.source).toMatch(/^https?:\/\//);
      if (m.tokensBeta !== undefined) {
        expect(m.tokensBeta).toBeGreaterThan(m.tokens);
      }
    }
  });
});
