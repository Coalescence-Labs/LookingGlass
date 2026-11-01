import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import robots from "./robots";

const ENV_KEY = "NEXT_PUBLIC_SITE_URL";

describe("robots", () => {
  let original: string | undefined;

  beforeEach(() => {
    original = process.env[ENV_KEY];
    process.env[ENV_KEY] = "https://example.test";
  });

  afterEach(() => {
    if (original === undefined) delete process.env[ENV_KEY];
    else process.env[ENV_KEY] = original;
  });

  test("allows the site and disallows the API surface", () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rules?.userAgent).toBe("*");
    expect(rules?.allow).toBe("/");
    expect(rules?.disallow).toBe("/api/*");
  });

  test("points at the sitemap on the configured origin", () => {
    expect(robots().sitemap).toBe("https://example.test/sitemap.xml");
  });
});
