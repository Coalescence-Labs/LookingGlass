import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { getSiteUrl } from "./site";

const ENV_KEY = "NEXT_PUBLIC_SITE_URL";

describe("getSiteUrl", () => {
  let original: string | undefined;

  beforeEach(() => {
    original = process.env[ENV_KEY];
  });

  afterEach(() => {
    if (original === undefined) delete process.env[ENV_KEY];
    else process.env[ENV_KEY] = original;
  });

  test("falls back to the default origin when unset", () => {
    delete process.env[ENV_KEY];
    expect(getSiteUrl()).toBe("https://lookingglass.coalescencelabs.app");
  });

  test("falls back when the value is only whitespace", () => {
    process.env[ENV_KEY] = "   ";
    expect(getSiteUrl()).toBe("https://lookingglass.coalescencelabs.app");
  });

  test("uses the env value and strips a trailing slash", () => {
    process.env[ENV_KEY] = "https://preview.example.com/";
    expect(getSiteUrl()).toBe("https://preview.example.com");
  });

  test("leaves a clean URL untouched", () => {
    process.env[ENV_KEY] = "https://preview.example.com";
    expect(getSiteUrl()).toBe("https://preview.example.com");
  });
});
