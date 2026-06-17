"use client";

import { useId, useMemo } from "react";
import {
  LOG_RANGE,
  STAGES,
  SUN_CURRENT_AGE_GYR,
  TOTAL_GYR,
  formatGyr,
  type Stage,
} from "@/lib/solar";

type Props = {
  activeStageId?: Stage["id"];
};

const LOG_MIN = Math.log10(LOG_RANGE.minGyr);
const LOG_MAX = Math.log10(LOG_RANGE.maxGyr);

function logPos(gyr: number): number {
  const g = Math.max(LOG_RANGE.minGyr, gyr);
  return (Math.log10(g) - LOG_MIN) / (LOG_MAX - LOG_MIN);
}

function linPos(gyr: number): number {
  return Math.min(1, Math.max(0, gyr / TOTAL_GYR));
}

const LOG_TICKS = [0.001, 0.01, 0.1, 1, 10, 100];

export function StageTimeline({ activeStageId }: Props) {
  const gradientId = useId();

  const logBands = useMemo(
    () =>
      STAGES.map((s) => {
        const startG = Math.max(LOG_RANGE.minGyr, s.startGyr);
        const endG = Math.max(LOG_RANGE.minGyr, s.startGyr + s.durationGyr);
        const left = logPos(startG);
        const right = logPos(endG);
        return { stage: s, left, width: Math.max(0.004, right - left) };
      }),
    [],
  );

  const linBands = useMemo(
    () =>
      STAGES.map((s) => {
        const left = linPos(s.startGyr);
        const right = linPos(s.startGyr + s.durationGyr);
        return { stage: s, left, width: Math.max(0.0005, right - left) };
      }),
    [],
  );

  const nowLog = logPos(SUN_CURRENT_AGE_GYR);
  const nowLin = linPos(SUN_CURRENT_AGE_GYR);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="flex items-baseline justify-between">
          <span className="type-mono-sm">Log scale · every tick is ten times the last</span>
          <span className="type-mono-sm text-bone-3">
            {formatGyr(LOG_RANGE.minGyr)} → {formatGyr(LOG_RANGE.maxGyr)}
          </span>
        </div>

        <div className="relative mt-6 h-20 border-t border-b border-line">
          {logBands.map(({ stage, left, width }) => {
            const active = activeStageId === stage.id;
            return (
              <div
                key={stage.id}
                className="absolute inset-y-0 flex items-end transition-[background,opacity] duration-500"
                style={{
                  left: `${left * 100}%`,
                  width: `${width * 100}%`,
                  background: stage.isEvent
                    ? active
                      ? "rgba(228,199,138,0.35)"
                      : "rgba(228,199,138,0.18)"
                    : active
                    ? "rgba(228,199,138,0.14)"
                    : "rgba(236,232,222,0.04)",
                  borderLeft: "1px solid var(--color-line-2)",
                }}
                aria-hidden
              >
                <span
                  className="type-mono-sm ml-1 mb-1 whitespace-nowrap"
                  style={{
                    color: active
                      ? "var(--color-accent)"
                      : "var(--color-bone-3)",
                  }}
                >
                  {stage.isEvent ? "·" : stage.name.split(" ")[0]}
                </span>
              </div>
            );
          })}

          <div
            className="absolute inset-y-0 w-px"
            style={{
              left: `${nowLog * 100}%`,
              background: "var(--color-accent)",
            }}
          >
            <span
              className="absolute -top-6 -translate-x-1/2 type-mono-sm text-accent"
              style={{ left: "0" }}
            >
              Now · {SUN_CURRENT_AGE_GYR} Gyr
            </span>
          </div>
        </div>

        <div className="relative mt-2 h-4">
          {LOG_TICKS.map((t) => {
            const left = logPos(t);
            if (left < 0 || left > 1) return null;
            return (
              <div
                key={t}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${left * 100}%`, transform: "translateX(-50%)" }}
              >
                <span className="type-mono-sm text-dim">{formatGyr(t)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="type-mono-sm">Linear scale · the same time, unflattened</span>
          <span className="type-mono-sm text-bone-3">
            0 → {Math.round(TOTAL_GYR)} Gyr
          </span>
        </div>

        <div className="relative mt-6 h-14 border-t border-b border-line overflow-hidden">
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
            className="absolute inset-y-0 w-px"
            style={{
              left: `${nowLin * 100}%`,
              background: "var(--color-accent)",
            }}
          >
            <span
              className="absolute -top-6 -translate-x-1/2 type-mono-sm text-accent whitespace-nowrap"
              style={{ left: "0" }}
            >
              Now
            </span>
            <span
              className="absolute top-1/2 -translate-y-1/2 translate-x-2 type-mono-sm text-bone-3 whitespace-nowrap"
            >
              ← 4.6 Gyr of main sequence already behind; ~5 Gyr ahead before anything interesting happens.
            </span>
          </div>
        </div>

        <p className="mt-4 type-mono-sm text-bone-3 max-w-xl">
          The log scale makes every phase readable. The linear strip is the same
          story at true proportions — four-fifths of the sun&rsquo;s entire
          working life is the main sequence we&rsquo;re in the middle of. Everything
          after the red-giant turn fits in a sliver you can barely see.
        </p>
      </div>
    </div>
  );
}
