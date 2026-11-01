import { NextResponse } from "next/server";
import {
  calculateCost,
  parseCostScenario,
  PRICING_SNAPSHOT,
} from "@/lib/token-cost";

export const runtime = "nodejs";

/** GET — pricing snapshot metadata for the calculator UI. */
export async function GET() {
  return NextResponse.json({
    verifiedDate: PRICING_SNAPSHOT.verifiedDate,
    models: PRICING_SNAPSHOT.models.map((m) => ({
      id: m.id,
      name: m.name,
      family: m.family,
      priceInput: m.priceInput,
      priceCachedInput: m.priceCachedInput ?? null,
      priceOutput: m.priceOutput,
      priceNote: m.priceNote ?? null,
      sources: m.sources,
    })),
  });
}

/** POST — authoritative cost calculation for a scenario. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = parseCostScenario(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = calculateCost(parsed.scenario);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Calculation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
