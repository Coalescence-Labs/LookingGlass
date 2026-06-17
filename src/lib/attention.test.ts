import { describe, expect, test } from "bun:test";
import {
  ATTENTION_EXAMPLE,
  MODEL_DIMS,
  strongestTarget,
  weightColor,
} from "./attention";

describe("attention data", () => {
  const n = ATTENTION_EXAMPLE.tokens.length;

  test("has a 10-token example and three heads", () => {
    expect(n).toBe(10);
    expect(ATTENTION_EXAMPLE.heads.length).toBe(3);
  });

  test("every head is a square row-stochastic matrix", () => {
    for (const head of ATTENTION_EXAMPLE.heads) {
      expect(head.weights.length).toBe(n);
      for (const row of head.weights) {
        expect(row.length).toBe(n);
        const sum = row.reduce((a, b) => a + b, 0);
        expect(Math.abs(sum - 1)).toBeLessThanOrEqual(0.001);
        for (const w of row) expect(w).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("each head carries a label and caption", () => {
    for (const head of ATTENTION_EXAMPLE.heads) {
      expect(head.label.length).toBeGreaterThan(0);
      expect(head.caption.length).toBeGreaterThan(0);
    }
  });

  test("coreference head resolves 'it' (7) to 'cat' (1)", () => {
    const coref = ATTENTION_EXAMPLE.heads.find((h) => h.label === "Coreference");
    expect(coref).toBeDefined();
    expect(strongestTarget(coref!.weights[7])).toBe(1);
  });

  test("previous-token head looks one step back", () => {
    const prev = ATTENTION_EXAMPLE.heads.find((h) => h.label === "Previous-token");
    expect(prev).toBeDefined();
    expect(strongestTarget(prev!.weights[5])).toBe(4);
  });

  test("MODEL_DIMS matches the base transformer", () => {
    expect(MODEL_DIMS.dModel).toBe(512);
    expect(MODEL_DIMS.heads).toBe(8);
    expect(MODEL_DIMS.dHead).toBe(64);
    expect(MODEL_DIMS.scale).toBe(8);
    expect(MODEL_DIMS.dModel / MODEL_DIMS.heads).toBe(MODEL_DIMS.dHead);
  });

  test("weightColor clamps and scales alpha", () => {
    expect(weightColor(0)).toContain("0.060");
    expect(weightColor(1)).toContain("1.000");
    expect(weightColor(2)).toContain("1.000");
  });
});
