import { describe, expect, test } from "bun:test";
import {
  asString,
  FIELD_MAX,
  getIp,
  IDEA_MAX,
  RATE_LIMIT_MAX,
  rateLimited,
} from "./submit";

describe("getIp", () => {
  test("prefers the first x-forwarded-for entry", () => {
    const req = new Request("https://x.test", {
      headers: { "x-forwarded-for": "1.1.1.1, 2.2.2.2" },
    });
    expect(getIp(req)).toBe("1.1.1.1");
  });

  test("falls back to x-real-ip", () => {
    const req = new Request("https://x.test", {
      headers: { "x-real-ip": "3.3.3.3" },
    });
    expect(getIp(req)).toBe("3.3.3.3");
  });

  test("returns 'unknown' with no proxy headers", () => {
    expect(getIp(new Request("https://x.test"))).toBe("unknown");
  });
});

describe("asString", () => {
  test("trims and caps length", () => {
    expect(asString("  hello  ", IDEA_MAX)).toBe("hello");
    expect(asString("abcdef", 3)).toBe("abc");
  });

  test("non-strings become empty", () => {
    expect(asString(42, FIELD_MAX)).toBe("");
    expect(asString(null, FIELD_MAX)).toBe("");
    expect(asString(undefined, FIELD_MAX)).toBe("");
    expect(asString({}, FIELD_MAX)).toBe("");
  });
});

describe("rateLimited", () => {
  test("allows up to the max then blocks", () => {
    const store = new Map<string, number[]>();
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect(rateLimited("ip", store, now)).toBe(false);
    }
    expect(rateLimited("ip", store, now)).toBe(true);
  });

  test("forgets hits outside the window", () => {
    const store = new Map<string, number[]>();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      rateLimited("ip", store, 0);
    }
    expect(rateLimited("ip", store, 0)).toBe(true);
    // Far in the future, the old window has fully expired.
    expect(rateLimited("ip", store, 60 * 60 * 1000)).toBe(false);
  });

  test("tracks IPs independently", () => {
    const store = new Map<string, number[]>();
    const now = 5;
    for (let i = 0; i < RATE_LIMIT_MAX; i++) rateLimited("a", store, now);
    expect(rateLimited("a", store, now)).toBe(true);
    expect(rateLimited("b", store, now)).toBe(false);
  });
});
