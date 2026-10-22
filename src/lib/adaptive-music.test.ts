import { expect, test, describe } from "bun:test";
import {
  captionFor,
  sceneFor,
  stemGains,
  type Drivers,
} from "./adaptive-music";

const d = (
  tension: number,
  combat: number,
  discovery: number,
): Drivers => ({ tension, combat, discovery });

describe("stemGains", () => {
  test("drums stay off below the combat threshold and rise above it", () => {
    expect(stemGains(d(0, 0.1, 0)).drums).toBe(0);
    expect(stemGains(d(0, 0.5, 0)).drums).toBeGreaterThan(0);
  });

  test("lead tracks discovery, pad tracks tension", () => {
    expect(stemGains(d(0, 0, 1)).lead).toBeGreaterThan(
      stemGains(d(0, 0, 0)).lead,
    );
    expect(stemGains(d(1, 0, 0)).pad).toBeGreaterThan(
      stemGains(d(0, 0, 0)).pad,
    );
  });

  test("all gains stay within 0..1", () => {
    for (const g of Object.values(stemGains(d(1, 1, 1)))) {
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(1);
    }
  });
});

describe("sceneFor", () => {
  test("low everything reads as calm", () => {
    expect(sceneFor(d(0.1, 0, 0.1)).id).toBe("calm");
  });

  test("high combat and tension reads as boss", () => {
    expect(sceneFor(d(0.8, 0.8, 0.2)).id).toBe("boss");
  });

  test("moderate combat reads as combat", () => {
    expect(sceneFor(d(0.3, 0.5, 0)).id).toBe("combat");
  });

  test("discovery without combat reads as discovery", () => {
    expect(sceneFor(d(0.3, 0, 0.7)).id).toBe("discovery");
  });
});

describe("captionFor", () => {
  test("names the audible stems", () => {
    const drivers = d(0.6, 0.6, 0.6);
    const caption = captionFor(sceneFor(drivers), stemGains(drivers));
    expect(caption).toContain("drums");
  });

  test("reports near silence when nothing is audible", () => {
    const gains = { pad: 0, bass: 0, drums: 0, lead: 0 };
    expect(captionFor(sceneFor(d(0, 0, 0)), gains)).toContain("silence");
  });
});
