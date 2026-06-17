"use client";

import type { Drivers } from "@/lib/adaptive-music";

type DriverKey = keyof Drivers;

type Row = { key: DriverKey; label: string; hint: string };

const ROWS: Row[] = [
  { key: "tension", label: "Tension", hint: "opens the pad and widens the chord" },
  { key: "combat", label: "Combat", hint: "brings the drums in" },
  { key: "discovery", label: "Discovery", hint: "adds the bright lead" },
];

type Props = {
  drivers: Drivers;
  onChange: (next: Drivers) => void;
};

export function ParameterDrivers({ drivers, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {ROWS.map((row) => {
        const pct = Math.round(drivers[row.key] * 100);
        return (
          <div key={row.key}>
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor={`driver-${row.key}`}
                className="font-serif text-[1.05rem] text-bone"
              >
                {row.label}
              </label>
              <span className="type-numeral text-bone text-[1.1rem]">
                {pct}
                <span className="type-mono-sm">%</span>
              </span>
            </div>
            <input
              id={`driver-${row.key}`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={pct}
              onChange={(e) =>
                onChange({ ...drivers, [row.key]: Number(e.target.value) / 100 })
              }
              className="lg-range mt-3 w-full"
              aria-label={`${row.label} intensity`}
              aria-valuetext={`${pct} percent`}
            />
            <p className="mt-2 type-mono-sm text-bone-3">{row.hint}</p>
          </div>
        );
      })}

      <style jsx>{`
        :global(.lg-range) {
          -webkit-appearance: none;
          appearance: none;
          height: 2px;
          padding: 18px 0;
          background: transparent;
          outline: none;
          cursor: pointer;
        }
        :global(.lg-range::-webkit-slider-runnable-track) {
          height: 1px;
          background: var(--color-line-2);
        }
        :global(.lg-range::-moz-range-track) {
          height: 1px;
          background: var(--color-line-2);
        }
        :global(.lg-range::-webkit-slider-thumb) {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -9px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-ink);
          box-shadow: 0 0 0 1px var(--color-accent),
            0 0 20px rgba(228, 199, 138, 0.4);
          transition: transform 0.2s;
        }
        :global(.lg-range::-webkit-slider-thumb:hover) {
          transform: scale(1.15);
        }
        :global(.lg-range::-moz-range-thumb) {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-ink);
          box-shadow: 0 0 20px rgba(228, 199, 138, 0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
