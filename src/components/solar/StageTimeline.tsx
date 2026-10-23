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

  // Two-row stagger so adjacent duration labels don't collide.
  const durationLabels = useMemo(
    () =>
      logBands.map((band, i) => ({
        ...band,
        row: (i % 2) as 0 | 1,
      })),
    [logBands],
  );

  // "Now" lives inside the main-sequence band. Position linearly by progress.
  const msBand = logBands.find((b) => b.stage.id === "main-sequence");
  const msProgress = msBand
    ? (SUN_CURRENT_AGE_GYR - msBand.stage.startGyr) / msBand.stage.durationGyr
    : 0;
  const nowLog = msBand ? msBand.left + msBand.width * msProgress : 0;
  const nowLin = linPos(SUN_CURRENT_AGE_GYR);

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {/* ——— Log-duration strip ——— */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <span className="type-mono-sm">
            Log duration · each phase, sized by how long it takes
          </span>
          <span className="type-mono-sm text-bone-3">minutes → 10¹¹ yr</span>
        </div>

        {/* Marker lane reserved above the strip so "Now" never collides with the title. */}
        <div className="relative pt-8">
          <div
            className="pointer-events-none absolute top-0 z-10"
            style={{ left: `${nowLog * 100}%` }}
          >
            <span className="type-mono-sm absolute bottom-2 left-0 -translate-x-1/2 whitespace-nowrap text-accent">
              Now · 4.6 Gyr
            </span>
          </div>

          <div className="relative h-24 border-t border-b border-line">
            {logBands.map(({ stage, left, width }) => {
              const active = activeStageId === stage.id;
              const showName = width >= NAME_INLINE_THRESHOLD;
              const fill = stage.isEvent
                ? active
                  ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
                  : "color-mix(in srgb, var(--color-accent) 32%, transparent)"
                : active
                  ? "color-mix(in srgb, var(--color-accent) 16%, transparent)"
                  : "var(--color-glass)";
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
                      className="type-mono-sm absolute bottom-2 left-2 max-w-[calc(100%-0.75rem)] truncate"
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

            <div
              className="pointer-events-none absolute inset-y-0 w-px"
              style={{
                left: `${nowLog * 100}%`,
                background: "var(--color-accent)",
              }}
            />
          </div>
        </div>

        {/* Duration row — two lanes so neighbors don't collide */}
        <div className="relative h-10">
          {durationLabels.map(({ stage, left, width, durationYears, row }) => (
            <span
              key={stage.id}
              className="type-mono-sm absolute -translate-x-1/2 whitespace-nowrap text-dim"
              style={{
                left: `${(left + width / 2) * 100}%`,
                top: row === 0 ? 0 : "1.125rem",
              }}
            >
              {formatLogYears(durationYears)}
            </span>
          ))}
        </div>

        <p className="type-mono-sm text-bone-3 max-w-xl">
          Each band is one phase, scaled by the log of its duration. From the
          minute of a helium flash to the hundred billion years of white-dwarf
          cooling, every phase gets a readable slice. The strip is a duration
          ladder, not a time axis — the linear strip below is the true-time
          view.
        </p>
      </div>

      {/* ——— Linear strip ——— */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <span className="type-mono-sm">
            Linear scale · the same time, unflattened
          </span>
          <span className="type-mono-sm text-bone-3">
            0 → {Math.round(TOTAL_GYR)} billion years
          </span>
        </div>

        <div className="relative pt-8">
          <div
            className="pointer-events-none absolute top-0 z-10"
            style={{ left: `${nowLin * 100}%` }}
          >
            <span className="type-mono-sm absolute bottom-2 left-0 -translate-x-1/2 whitespace-nowrap text-accent">
              Now
            </span>
          </div>

          <div className="relative h-14 border-t border-b border-line">
            <svg
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              className="absolute inset-0"
              aria-hidden
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset="0"
                    stopColor="color-mix(in srgb, var(--color-accent) 2%, transparent)"
                  />
                  <stop
                    offset="1"
                    stopColor="color-mix(in srgb, var(--color-accent) 12%, transparent)"
                  />
                </linearGradient>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={`url(#${gradientId})`}
              />
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
                      ? "color-mix(in srgb, var(--color-accent) 28%, transparent)"
                      : tooThin
                        ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
                        : "transparent",
                    borderRight: tooThin
                      ? "none"
                      : "1px solid var(--color-line)",
                  }}
                  aria-hidden
                />
              );
            })}

            <div
              className="pointer-events-none absolute inset-y-0 w-px"
              style={{
                left: `${nowLin * 100}%`,
                background: "var(--color-accent)",
              }}
            />
          </div>
        </div>

        <p className="type-mono-sm text-bone-3 max-w-2xl">
          At 4.6 billion years we sit mid–main-sequence: a little under half the
          working life already behind, ~5 billion years ahead before the
          red-giant turn. Nearly all of the sun&rsquo;s hydrogen-burning career
          is this long middle; after turnoff, the luminous giant phases fit in a
          sliver you can barely see (the white-dwarf cooling that follows is
          longer still, but no longer shining by fusion).
        </p>
      </div>
    </div>
  );
}
