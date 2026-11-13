import { BAND_SKETCH } from "@/lib/anc";

export function BandSketch() {
  return (
    <div
      className="border border-line p-6 md:p-10"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <p className="type-mono-sm text-bone-3">
        Illustrative mix of contributions — not a lab scorecard for any one
        product (research C-22).
      </p>
      <ul className="mt-8 flex flex-col gap-6">
        {BAND_SKETCH.map((row) => (
          <li key={row.band}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="type-mono-sm text-bone">{row.band}</span>
              <span className="type-mono-sm text-bone-3">{row.label}</span>
            </div>
            <div className="mt-3 space-y-2">
              <Bar label="Active" value={row.active} tone="accent" />
              <Bar label="Passive" value={row.passive} tone="muted" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "accent" | "muted";
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 type-mono-sm text-bone-3">{label}</span>
      <div className="h-2 flex-1 bg-[rgba(255,255,255,0.06)]">
        <div
          className="h-full"
          style={{
            width: `${Math.round(value * 100)}%`,
            background:
              tone === "accent"
                ? "rgba(228, 199, 138, 0.85)"
                : "rgba(180, 180, 190, 0.55)",
          }}
        />
      </div>
    </div>
  );
}
