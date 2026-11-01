import { describe, expect, test } from "bun:test";
import { resultantAmplitude, sampleWave } from "./anc";

describe("resultantAmplitude", () => {
  test("nulls at 180° with unit anti-gain", () => {
    expect(resultantAmplitude(Math.PI, 1)).toBeCloseTo(0, 10);
  });

  test("reinforces at 0°", () => {
    expect(resultantAmplitude(0, 1)).toBeCloseTo(2, 10);
  });
});

describe("sampleWave", () => {
  test("sum near zero across samples at anti-phase", () => {
    const { sum } = sampleWave(Math.PI, 1, 64);
    const peak = Math.max(...sum.map(Math.abs));
    expect(peak).toBeLessThan(1e-10);
  });
});
