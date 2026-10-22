"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  PULL_CURVE,
  PULL_PHASES,
  PULL_AXES,
  type PullSample,
} from "@/lib/espresso";
import { easeExpo } from "@/lib/motion";

// SVG plot geometry.
const W = 1000;
const H = 460;
const PAD = { left: 18, right: 18, top: 18, bottom: 44 };
const PLOT_L = PAD.left;
const PLOT_R = W - PAD.right;
const PLOT_T = PAD.top;
const PLOT_B = H - PAD.bottom;

// Per-track display ranges (each track normalised to a sensible window so the
// temperature line reads as flat next to the swinging pressure and flow).
const RANGES = {
  pressure: { min: 0, max: 10, label: "bar", color: "var(--color-accent)" },
  flow: { min: 0, max: 4, label: "mL/s", color: "var(--color-bone-2)" },
  temp: { min: 80, max: 100, label: "°C", color: "var(--color-bone-3)" },
};

type TrackKey = keyof typeof RANGES;

function x(t: number) {
  return PLOT_L + (t / PULL_AXES.tMax) * (PLOT_R - PLOT_L);
}

function y(value: number, key: TrackKey) {
  const r = RANGES[key];
  const norm = (value - r.min) / (r.max - r.min);
  return PLOT_B - Math.max(0, Math.min(1, norm)) * (PLOT_B - PLOT_T);
}

function pointsFor(key: TrackKey) {
  return PULL_CURVE.map((s) => `${x(s.t).toFixed(1)},${y(s[key], key).toFixed(1)}`).join(
    " ",
  );
}

function phaseAt(t: number) {
  return (
    PULL_PHASES.find((p) => t >= p.tStart && t < p.tEnd) ??
    PULL_PHASES[PULL_PHASES.length - 1]
  );
}

const LAST = PULL_CURVE.length - 1;

export function PullCurve() {
  const reduce = useReducedMotion();
  // Default the cursor to the middle of the nine-bar plateau.
  const [index, setIndex] = useState(() =>
    Math.min(LAST, Math.round(LAST * 0.45)),
  );

  const sample: PullSample = PULL_CURVE[index];
  const phase = phaseAt(sample.t);

  const tracks = useMemo(
    () =>
      (Object.keys(RANGES) as TrackKey[]).map((key) => ({
        key,
        points: pointsFor(key),
      })),
    [],
  );

  const valueText = `${sample.t} seconds · ${sample.pressure} bar · ${sample.flow} millilitres per second · ${sample.temp} degrees`;

  return (
    <div
      className="border border-line p-6 md:p-10"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      {/* Legend with live values */}
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <Legend
          label="Pressure"
          value={sample.pressure}
          unit="bar"
          swatch={RANGES.pressure.color}
          reduce={reduce}
          pulseKey={sample.pressure}
        />
        <Legend
          label="Flow"
          value={sample.flow}
          unit="mL/s"
          swatch={RANGES.flow.color}
          reduce={reduce}
          pulseKey={sample.flow}
        />
        <Legend
          label="Temperature"
          value={sample.temp}
          unit="°C"
          swatch={RANGES.temp.color}
          reduce={reduce}
          pulseKey={sample.temp}
        />
        <div className="ml-auto flex flex-col items-end">
          <span className="type-mono-sm">Time</span>
          <span className="type-numeral text-[1.6rem] leading-none text-bone">
            {sample.t}
            <span className="type-mono"> s</span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-6 w-full"
        style={{ height: "auto" }}
        role="img"
        aria-label={`Extraction curve. Pressure rises from a low pre-infusion soak to a plateau near nine bar, then declines; flow rises as the bed gives way; temperature holds nearly flat near ninety-three degrees across about ${PULL_AXES.tMax} seconds.`}
      >
        <title>Espresso extraction curve over time</title>

        {/* Phase bands */}
        {PULL_PHASES.map((p) => {
          const x0 = x(p.tStart);
          const x1 = x(p.tEnd);
          const isActive = p.id === phase.id;
          return (
            <g key={p.id} aria-hidden="true">
              <rect
                x={x0}
                y={PLOT_T}
                width={x1 - x0}
                height={PLOT_B - PLOT_T}
                fill={isActive ? "rgba(228,199,138,0.06)" : "transparent"}
              />
              <line
                x1={x1}
                y1={PLOT_T}
                x2={x1}
                y2={PLOT_B}
                stroke="var(--color-line)"
                strokeWidth={1}
              />
              <text
                x={x0 + 8}
                y={PLOT_T + 18}
                className="type-mono-sm"
                fill="var(--color-muted)"
                style={{ fontSize: "16px", letterSpacing: "0.12em" }}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={PLOT_L}
          y1={PLOT_B}
          x2={PLOT_R}
          y2={PLOT_B}
          stroke="var(--color-line-2)"
          strokeWidth={1}
        />

        {/* Track lines */}
        {tracks.map((tr) => (
          <polyline
            key={tr.key}
            points={tr.points}
            fill="none"
            stroke={RANGES[tr.key].color}
            strokeWidth={tr.key === "pressure" ? 3 : 2}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={tr.key === "pressure" ? 1 : 0.75}
          />
        ))}

        {/* Time cursor */}
        <line
          x1={x(sample.t)}
          y1={PLOT_T}
          x2={x(sample.t)}
          y2={PLOT_B}
          stroke="var(--color-bone)"
          strokeWidth={1}
          strokeDasharray="4 5"
          opacity={0.6}
        />
        {(Object.keys(RANGES) as TrackKey[]).map((key) => (
          <circle
            key={key}
            cx={x(sample.t)}
            cy={y(sample[key], key)}
            r={6}
            fill="var(--color-ink)"
            stroke={RANGES[key].color}
            strokeWidth={2.5}
          />
        ))}

        {/* Time axis ticks */}
        {[0, 8, 16, 24, 32].map((t) => (
          <text
            key={t}
            x={x(t)}
            y={H - 14}
            textAnchor="middle"
            fill="var(--color-muted)"
            style={{ fontSize: "16px", fontFamily: "var(--font-mono)" }}
          >
            {t}s
          </text>
        ))}
      </svg>

      {/* Scrub control */}
      <input
        type="range"
        min={0}
        max={LAST}
        step={1}
        value={index}
        onChange={(e) => setIndex(parseInt(e.target.value, 10))}
        className="lg-range mt-6 w-full"
        aria-label="Time through the shot"
        aria-valuetext={valueText}
      />

      {/* Phase caption */}
      <p className="type-body mt-4 max-w-2xl" aria-live="polite">
        <span className="text-accent">{phase.label}.</span> {phase.note}
      </p>

      <p className="type-mono-sm mt-6 text-muted">
        Illustrative reference profile — shaped to documented behaviour, not a
        log from one machine.
      </p>

      <style jsx>{`
        .lg-range {
          -webkit-appearance: none;
          appearance: none;
          height: 1px;
          background: var(--color-line-2);
          outline: none;
          cursor: pointer;
        }
        .lg-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-ink);
          box-shadow: 0 0 0 1px var(--color-accent), 0 0 20px rgba(228, 199, 138, 0.4);
          transition: transform 0.2s;
        }
        .lg-range::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .lg-range::-moz-range-thumb {
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

function Legend({
  label,
  value,
  unit,
  swatch,
  reduce,
  pulseKey,
}: {
  label: string;
  value: number;
  unit: string;
  swatch: string;
  reduce: boolean | null;
  pulseKey: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2 type-mono-sm">
        <span
          aria-hidden
          className="inline-block h-[3px] w-5"
          style={{ background: swatch }}
        />
        {label}
      </span>
      <motion.span
        key={reduce ? undefined : pulseKey}
        initial={reduce ? false : { opacity: 0.4, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: easeExpo }}
        className="type-numeral text-[1.6rem] leading-none text-bone"
      >
        {value}
        <span className="type-mono"> {unit}</span>
      </motion.span>
    </div>
  );
}
