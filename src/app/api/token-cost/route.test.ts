import { describe, expect, test } from "bun:test";
import { GET, POST } from "./route";
import { PRICING_SNAPSHOT } from "@/lib/token-cost";

function postJson(body: unknown) {
  return POST(
    new Request("https://x.test/api/token-cost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("GET /api/token-cost", () => {
  test("returns snapshot models and verified date", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      verifiedDate: string;
      models: { id: string }[];
    };
    expect(data.verifiedDate).toBe(PRICING_SNAPSHOT.verifiedDate);
    expect(data.models.length).toBe(PRICING_SNAPSHOT.models.length);
    expect(data.models[0].id).toBeTruthy();
  });
});

describe("POST /api/token-cost", () => {
  test("rejects invalid JSON", async () => {
    const res = await postJson("{nope");
    expect(res.status).toBe(400);
  });

  test("rejects unknown model", async () => {
    const res = await postJson({ modelId: "nope", outputTokens: 10 });
    expect(res.status).toBe(400);
    const data = (await res.json()) as { error: string };
    expect(data.error).toMatch(/model/i);
  });

  test("calculates a fixture scenario", async () => {
    const res = await postJson({
      modelId: "claude-sonnet-4.6",
      text: { mode: "tokens", tokens: 1_000_000 },
      outputTokens: 1_000_000,
      cacheHitPercent: 0,
      requestsPerDay: 1,
      users: 1,
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      costs: { perRequestUsd: number };
      monthly: { requests: number; usd: number };
      verifiedDate: string;
    };
    expect(data.costs.perRequestUsd).toBeCloseTo(18, 5);
    expect(data.monthly.requests).toBe(30);
    expect(data.monthly.usd).toBeCloseTo(540, 4);
    expect(data.verifiedDate).toBe(PRICING_SNAPSHOT.verifiedDate);
  });
});
