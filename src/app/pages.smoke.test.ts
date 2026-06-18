import { describe, expect, test } from "bun:test";

// Smoke test: every live concept page module imports cleanly and exposes a
// default component plus metadata. This catches broken imports and bad exports
// as new articles ship in parallel, without rendering React or three.js.
const pageModules: Record<string, () => Promise<Record<string, unknown>>> = {
  home: () => import("./page"),
  about: () => import("./about/page"),
  "one-million-tokens": () => import("./one-million-tokens/page"),
  "model-comparison": () => import("./model-comparison/page"),
  "context-window": () => import("./context-window/page"),
};

describe("page modules", () => {
  for (const [name, load] of Object.entries(pageModules)) {
    test(`${name} imports and exports a default component`, async () => {
      const mod = await load();
      expect(typeof mod.default).toBe("function");
    });
  }
});
