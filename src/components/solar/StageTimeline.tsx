"use client";

import { useId, useMemo } from "react";
import {
  SECONDS_PER_YEAR,
  STAGES,
  SUN_CURRENT_AGE_GYR,
  TOTAL_GYR,
  formatLogYears,
  stageDurationYears,
  type Stage,
} from "@/lib/solar";

type Props = {
  activeStageId?: Stage["id"];
};

const MIN_YEARS = 60 / SECONDS_PER_YEAR; // a minute, in years — floor for the log map
const LOG_BASE = Math.log10(MIN_YEARS);
const LOG_OFFSET = 1; // ensures the shortest event gets a visible slice

function logDurationWeight(years: number): number {
  return Math.max(LOG_OFFSET, Math.log10(years) - LOG_BASE + LOG_OFFSET);
}

function linPos(gyr: number): number {
  return Math.min(1, Math.max(0, gyr / TOTAL_GYR));
}

const NAME_INLINE_THRESHOLD = 0.08;
const LABEL_BELOW_THRESHOLD = 0.06;

export function StageTimeline({ activeStageId }: Props) {
  const gradientId = useId();

  const logBands = useMemo(() => {
    const weights = STAGES.map((s) => logDurationWeight(stageDurationYears(s)));
    const total = weights.reduce((a, b) => a + b, 0);
    const widths = weights.map((w) => w / total);
    return STAGES.map((stage, i) => ({
      stage,
      left: widths.slice(0, i).reduce((a, b) => a + b, 0),
      width: widths[i],
      durationYears: stageDurationYears(stage),
    }));
  }, []);

  const linBands = useMemo(
    () =>
      STAGES.map((s) => {
        const left = linPos(s.startGyr);
        const right = linPos(s.startGyr + s.durationGyr);
        return { stage: s, left, width: Math.max(0.0005, right - left) };
      }),
    [],
  );

  // "Now" lives inside the main-sequence band. Position linearly by progress.
  const msBand = logBands.find((b) => b.stage.id === "main-sequence");
  const msProgress = msBand
    ? (SUN_CURRENT_AGE_GYR - msBand.stage.startGyr) / msBand.stage.durationGyr
    : 0;
  const nowLog = msBand ? msBand.left + msBand.width * msProgress : 0;
  const nowLin = linPos(SUN_CURRENT_AGE_GYR);

  return (
    <div className="flex flex-col gap-14">
      {/* ——— Log-duration strip ——— */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="type-mono-sm">
            Log duration · each phase, sized by how long it takes
          </span>
          <span className="type-mono-sm text-bone-3">
            minutes → 10¹¹ yr
          </span>
        </div>

        <div className="relative mt-12 h-24 border-t border-b border-line">
          {logBands.map(({ stage, left, width }) => {
            const active = activeStageId === stage.id;
            const showName = width >= NAME_INLINE_THRESHOLD;
            const fill = stage.isEvent
              ? active
                ? "rgba(228,199,138,0.55)"
                : "rgba(228,199,138,0.32)"
              : active
              ? "rgba(228,199,138,0.16)"
              : "rgba(236,232,222,0.035)";
            return (
              <div
                key={stage.id}
                className="absolute inset-y-0 overflow-hidden transition-[background] duration-500"
                style={{
                  left: `${left * 100}%`,
                  width: `${width * 100}%`,
                  background: fill,
                  borderLeft: "1px solid var(--color-line-2)",
                }}
                aria-hidden
              >
                {showName && (
                  <span
                    className="type-mono-sm absolute bottom-2 left-2 whitespace-nowrap"
                    style={{
                      color: active
                        ? "var(--color-accent)"
                        : "var(--color-bone-3)",
                    }}
                  >
                    {stage.name}
                  </span>
                )}
              </div>
            );
          })}

          {/* Now marker */}
          <div
            className="pointer-events-none absolute inset-y-0 w-px"
            style={{ left: `${nowLog * 100}%`, background: "var(--color-accent)" }}
          >
            <span
              className="type-mono-sm absolute -top-7 -translate-x-1/2 whitespace-nowrap text-accent"
              style={{ left: "0" }}
            >
              Now · 4.6 billion years
            </span>
          </div>
        </div>

        {/* Duration row below strip */}
        <div className="relative mt-3 h-4">
          {logBands.map(({ stage, left, width, durationYears }) => {
            if (width < LABEL_BELOW_THRESHOLD) return null;
            return (
              <span
                key={stage.id}
                className="type-mono-sm absolute top-0 -translate-x-1/2 whitespace-nowrap text-dim"
                style={{ left: `${(left + width / 2) * 100}%` }}
              >
                {formatLogYears(durationYears)}
              </span>
            );
          })}
        </div>

        <p className="mt-6 type-mono-sm text-bone-3 max-w-xl">
          Each band is one phase, scaled by the log of its duration. From the
          minute of a helium flash to the hundred billion years of white-dwarf
          cooling, every phase gets a readable slice. The strip is a duration
          ladder, not a time axis — the linear strip below is the true-time
          view.
        </p>
      </div>

      {/* ——— Linear strip ——— */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="type-mono-sm">
            Linear scale · the same time, unflattened
          </span>
          <span className="type-mono-sm text-bone-3">
            0 → {Math.round(TOTAL_GYR)} billion years
          </span>
        </div>

        <div className="relative mt-12 h-14 overflow-hidden border-t border-b border-line">
          <svg
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            className="absolute inset-0"
            aria-hidden
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="rgba(228,199,138,0.02)" />
                <stop offset="1" stopColor="rgba(228,199,138,0.12)" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
          </svg>

          {linBands.map(({ stage, left, width }) => {
            const active = activeStageId === stage.id;
            const tooThin = width < 0.004;
            return (
              <div
                key={stage.id}
                className="absolute inset-y-0 transition-colors duration-500"
                style={{
                  left: `${left * 100}%`,
                  width: tooThin ? "2px" : `${width * 100}%`,
                  background: active
                    ? "rgba(228,199,138,0.28)"
                    : tooThin
                    ? "rgba(228,199,138,0.55)"
                    : "transparent",
                  borderRight: tooThin
                    ? "none"
                    : "1px solid rgba(236,232,222,0.1)",
                }}
                aria-hidden
              />
            );
          })}

          <div
            className="pointer-events-none absolute inset-y-0 w-px"
            style={{ left: `${nowLin * 100}%`, background: "var(--color-accent)" }}
          >
            <span
              className="type-mono-sm absolute -top-7 -translate-x-1/2 whitespace-nowrap text-accent"
              style={{ left: "0" }}
            >
              Now
            </span>
            <span className="type-mono-sm absolute top-1/2 -translate-y-1/2 translate-x-2 whitespace-nowrap text-bone-3">
              ← 4.6 billion years of main sequence already behind; ~5 billion ahead before anything interesting happens.
            </span>
          </div>
        </div>

        <p className="mt-6 type-mono-sm text-bone-3 max-w-xl">
          The linear strip restores true proportions. Four-fifths of the
          sun&rsquo;s working life is the main sequence we&rsquo;re in the
          middle of; everything after the red-giant turn fits in a sliver you
          can barely see.
        </p>
      </div>
    </div>
  );
}
