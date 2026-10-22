import { describe, expect, test } from "bun:test";
import {
  concepts,
  conceptsBySeries,
  getConcept,
  getSeries,
  SERIES,
} from "./concepts";

describe("getConcept", () => {
  test("returns a concept by slug", () => {
    expect(getConcept("one-million-tokens")?.index).toBe("01");
  });

  test("returns undefined for an unknown slug", () => {
    expect(getConcept("does-not-exist")).toBeUndefined();
  });
});

describe("getSeries", () => {
  test("returns a series by id", () => {
    expect(getSeries("language-models")?.roman).toBe("I");
  });

  test("returns undefined for an unknown id", () => {
    expect(getSeries("nope")).toBeUndefined();
  });
});

describe("conceptsBySeries", () => {
  test("groups every concept under its series exactly once", () => {
    const grouped = conceptsBySeries();
    const total = grouped.reduce((n, g) => n + g.concepts.length, 0);
    const knownSeriesIds = new Set(SERIES.map((s) => s.id));
    const conceptsInKnownSeries = concepts.filter((c) =>
      knownSeriesIds.has(c.seriesId),
    ).length;
    expect(total).toBe(conceptsInKnownSeries);
  });
});

describe("concepts data integrity", () => {
  test("slugs are unique", () => {
    const slugs = concepts.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("indexes are unique", () => {
    const indexes = concepts.map((c) => c.index);
    expect(new Set(indexes).size).toBe(indexes.length);
  });

  test("every seriesId references a defined series", () => {
    const ids = new Set(SERIES.map((s) => s.id));
    for (const c of concepts) {
      expect(ids.has(c.seriesId)).toBe(true);
    }
  });

  test("status is always live or coming", () => {
    for (const c of concepts) {
      expect(["live", "coming"]).toContain(c.status);
    }
  });

  test("slugs are URL-safe", () => {
    for (const c of concepts) {
      expect(c.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
