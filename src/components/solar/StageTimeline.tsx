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
  type StageId,
} from "@/lib/solar";

type Props = {
  activeStageId?: Stage["id"];
};

const MIN_YEARS = 60 / SECONDS_PER_YEAR; // a minute, in years — floor for the log map
const LOG_BASE = Math.log10(MIN_YEARS);
const LOG_OFFSET = 1; // ensures the shortest event gets a visible slice

/** First ~12 Gyr: everything before white-dwarf cooling dominates the linear axis. */
const EARLY_ZOOM_GYR = 12;

const SHORT_NAME: Partial<Record<StageId, string>> = {
  collapse: "Collapse",
  "main-sequence": "Main sequence",
  rgb: "RGB",
  "helium-flash": "He flash",
  "horizontal-branch": "HB",
  agb: "AGB",
  "planetary-nebula": "PN",
  "white-dwarf": "White dwarf",
};

function logDurationWeight(years: number): number {
  return Math.max(LOG_OFFSET, Math.log10(years) - LOG_BASE + LOG_OFFSET);
}

function linPos(gyr: number, span = TOTAL_GYR): number {
  return Math.min(1, Math.max(0, gyr / span));
}

function bandName(stage: Stage, width: number): string {
  if (stage.isEvent) return SHORT_NAME[stage.id] ?? stage.name;
  if (width < 0.11) return SHORT_NAME[stage.id] ?? stage.name;
  return stage.name;
}

function bandFill(stage: Stage, active: boolean, emphasis = false): string {
  if (stage.isEvent) {
    return active
      ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
      : "color-mix(in srgb, var(--color-accent) 32%, transparent)";
  }
  if (active) {
    return "color-mix(in srgb, var(--color-accent) 16%, transparent)";
  }
  if (emphasis) {
    return "color-mix(in srgb, var(--color-accent) 8%, transparent)";
  }
  return "var(--color-glass)";
}

export function StageTimeline({ activeStageId }: Props) {
  const gradientId = useId();
  const zoomGradientId = useId();

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

  const earlyBands = useMemo(() => {
    return STAGES.filter((s) => s.startGyr < EARLY_ZOOM_GYR).map((s) => {
      const end = Math.min(s.startGyr + s.durationGyr, EARLY_ZOOM_GYR);
      const left = linPos(s.startGyr, EARLY_ZOOM_GYR);
      const right = linPos(end, EARLY_ZOOM_GYR);
      return {
        stage: s,
        left,
        width: Math.max(s.isEvent ? 0.012 : 0.004, right - left),
      };
    });
  }, []);

  const earlyEndLin = linPos(EARLY_ZOOM_GYR);

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
  const nowEarly = linPos(SUN_CURRENT_AGE_GYR, EARLY_ZOOM_GYR);

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
              const label = bandName(stage, width);
              // Events always get a name — the He-flash band is wide enough to
              // look intentional but used to sit just under the old inline cutoff.
              const showName = stage.isEvent || width >= 0.055;
              return (
                <div
                  key={stage.id}
                  className="absolute inset-y-0 overflow-hidden transition-[background] duration-500"
                  style={{
                    left: `${left * 100}%`,
                    width: `${width * 100}%`,
                    background: bandFill(stage, active),
                    borderLeft: "1px solid var(--color-line-2)",
                  }}
                  aria-hidden
                >
                  {showName && (
                    <span
                      className="type-mono-sm absolute bottom-2 left-2 max-w-[calc(100%-0.75rem)] truncate"
                      style={{
                        color: active || stage.isEvent
                          ? "var(--color-accent)"
                          : "var(--color-bone-3)",
                      }}
                    >
                      {label}
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
          Each band is one phase, scaled by the log of its duration — so the
          minute of a helium flash and the hundred-billion-year white-dwarf cool
          both get a readable slice. This is a duration ladder, not a clock; the
          linear pair below is true time.
        </p>
      </div>

      {/* ——— Linear strip + early zoom ——— */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <span className="type-mono-sm">
            Linear scale · the same time, unflattened
          </span>
          <span className="type-mono-sm text-bone-3">
            0 → {Math.round(TOTAL_GYR)} billion years
          </span>
        </div>

        {/* Full career */}
        <div className="relative pt-8">
          <div
            className="pointer-events-none absolute top-0 z-10"
            style={{ left: `${nowLin * 100}%` }}
          >
            <span className="type-mono-sm absolute bottom-2 left-0 whitespace-nowrap text-accent">
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
              const isWd = stage.id === "white-dwarf";
              return (
                <div
                  key={stage.id}
                  className="absolute inset-y-0 overflow-hidden transition-colors duration-500"
                  style={{
                    left: `${left * 100}%`,
                    width: tooThin ? "2px" : `${width * 100}%`,
                    background: active
                      ? "color-mix(in srgb, var(--color-accent) 28%, transparent)"
                      : tooThin
                        ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
                        : isWd
                          ? "color-mix(in srgb, var(--color-accent) 6%, transparent)"
                          : "transparent",
                    borderRight: tooThin
                      ? "none"
                      : "1px solid var(--color-line)",
                  }}
                  aria-hidden
                >
                  {isWd && (
                    <span className="type-mono-sm absolute bottom-2 left-3 text-bone-3">
                      White dwarf · cooling (~10¹¹ yr)
                    </span>
                  )}
                </div>
              );
            })}

            {/* Bracket under the compressed early life */}
            <div
              className="pointer-events-none absolute -bottom-5 h-px"
              style={{
                left: 0,
                width: `${earlyEndLin * 100}%`,
                background: "var(--color-line-2)",
              }}
              aria-hidden
            />

            <div
              className="pointer-events-none absolute inset-y-0 w-px"
              style={{
                left: `${nowLin * 100}%`,
                background: "var(--color-accent)",
              }}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="type-mono-sm text-dim">
              ← early life (~{EARLY_ZOOM_GYR} Gyr) — a sliver on this axis
            </span>
            <span className="type-mono-sm text-dim">
              white dwarf fills the rest →
            </span>
          </div>
        </div>

        {/* Early-life zoom */}
        <div className="flex flex-col gap-4 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <span className="type-mono-sm">
              Early life · first {EARLY_ZOOM_GYR} Gyr, expanded
            </span>
            <span className="type-mono-sm text-bone-3">
              collapse → planetary nebula
            </span>
          </div>

          <div className="relative pt-8">
            <div
              className="pointer-events-none absolute top-0 z-10"
              style={{ left: `${nowEarly * 100}%` }}
            >
              <span className="type-mono-sm absolute bottom-2 left-0 -translate-x-1/2 whitespace-nowrap text-accent">
                Now · 4.6 Gyr
              </span>
            </div>

            <div className="relative h-16 border-t border-b border-line">
              <svg
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                className="absolute inset-0"
                aria-hidden
              >
                <defs>
                  <linearGradient
                    id={zoomGradientId}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0"
                      stopColor="color-mix(in srgb, var(--color-accent) 3%, transparent)"
                    />
                    <stop
                      offset="1"
                      stopColor="color-mix(in srgb, var(--color-accent) 8%, transparent)"
                    />
                  </linearGradient>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill={`url(#${zoomGradientId})`}
                />
              </svg>

              {earlyBands.map(({ stage, left, width }) => {
                const active = activeStageId === stage.id;
                const showName =
                  stage.id === "main-sequence" ||
                  stage.isEvent ||
                  width >= 0.08;
                const label = bandName(stage, width);
                return (
                  <div
                    key={stage.id}
                    className="absolute inset-y-0 overflow-hidden transition-[background] duration-500"
                    style={{
                      left: `${left * 100}%`,
                      width: `${width * 100}%`,
                      background: bandFill(
                        stage,
                        active,
                        stage.id === "main-sequence",
                      ),
                      borderLeft: "1px solid var(--color-line-2)",
                    }}
                    aria-hidden
                  >
                    {showName && (
                      <span
                        className="type-mono-sm absolute bottom-2 left-2 max-w-[calc(100%-0.75rem)] truncate"
                        style={{
                          color:
                            active || stage.isEvent
                              ? "var(--color-accent)"
                              : "var(--color-bone-3)",
                        }}
                      >
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}

              <div
                className="pointer-events-none absolute inset-y-0 w-px"
                style={{
                  left: `${nowEarly * 100}%`,
                  background: "var(--color-accent)",
                }}
              />
            </div>
          </div>

          {/* Tick labels for the zoom */}
          <div className="relative h-5">
            {[0, 5, 10, EARLY_ZOOM_GYR].map((gyr) => (
              <span
                key={gyr}
                className="type-mono-sm absolute -translate-x-1/2 text-dim"
                style={{ left: `${linPos(gyr, EARLY_ZOOM_GYR) * 100}%` }}
              >
                {gyr} Gyr
              </span>
            ))}
          </div>
        </div>

        <p className="type-mono-sm text-bone-3 max-w-2xl">
          On a true clock, white-dwarf cooling owns almost the whole bar. The
          luminous career — Now mid–main-sequence, then a brief giant sequence —
          is the left-edge sliver expanded above. That contrast is the point of
          the pair.
        </p>
      </div>
    </div>
  );
}
