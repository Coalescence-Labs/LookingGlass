import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { concepts } from "@/lib/concepts";
import sitemap from "./sitemap";

const ENV_KEY = "NEXT_PUBLIC_SITE_URL";

describe("sitemap", () => {
  let original: string | undefined;

  beforeEach(() => {
    original = process.env[ENV_KEY];
    process.env[ENV_KEY] = "https://example.test";
  });

  afterEach(() => {
    if (original === undefined) delete process.env[ENV_KEY];
    else process.env[ENV_KEY] = original;
  });

  test("includes the home and about routes", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://example.test");
    expect(urls).toContain("https://example.test/about");
  });

  test("includes every live concept and excludes coming-soon ones", () => {
    const urls = new Set(sitemap().map((e) => e.url));
    for (const c of concepts) {
      const url = `https://example.test/${c.slug}`;
      if (c.status === "live") {
        expect(urls.has(url)).toBe(true);
      } else {
        expect(urls.has(url)).toBe(false);
      }
    }
  });

  test("entries carry lastModified and priority metadata", () => {
    for (const entry of sitemap()) {
      expect(entry.url).toMatch(/^https:\/\/example\.test/);
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(typeof entry.priority).toBe("number");
    }
  });
});
