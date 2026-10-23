"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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

const MIN_YEARS = 60 / SECONDS_PER_YEAR;
const LOG_BASE = Math.log10(MIN_YEARS);
const LOG_OFFSET = 1;

/** Default loupe covers collapse through planetary nebula. */
const LOUPE_DEFAULT_END_GYR = 12;
const LOUPE_MIN_SPAN_GYR = 2;

const SHORT_NAME: Record<StageId, string> = {
  collapse: "Collapse",
  "main-sequence": "Main sequence",
  rgb: "Red giant",
  "helium-flash": "Helium flash",
  "horizontal-branch": "Horizontal branch",
  agb: "AGB",
  "planetary-nebula": "Planetary nebula",
  "white-dwarf": "White dwarf",
};

function logDurationWeight(years: number): number {
  return Math.max(LOG_OFFSET, Math.log10(years) - LOG_BASE + LOG_OFFSET);
}

function linPos(gyr: number, span = TOTAL_GYR): number {
  return Math.min(1, Math.max(0, gyr / span));
}

function bandFill(stage: Stage, active: boolean): string {
  if (stage.isEvent) {
    return active
      ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
      : "color-mix(in srgb, var(--color-accent) 38%, transparent)";
  }
  if (active) {
    return "color-mix(in srgb, var(--color-accent) 22%, transparent)";
  }
  if (stage.id === "main-sequence") {
    return "color-mix(in srgb, var(--color-accent) 12%, transparent)";
  }
  if (stage.id === "white-dwarf") {
    return "color-mix(in srgb, var(--color-accent) 5%, transparent)";
  }
  return "var(--color-glass)";
}

export function StageTimeline({ activeStageId }: Props) {
  const gradientId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const [loupeEnd, setLoupeEnd] = useState(LOUPE_DEFAULT_END_GYR);

  const logRows = useMemo(() => {
    const weights = STAGES.map((s) => logDurationWeight(stageDurationYears(s)));
    const max = Math.max(...weights);
    return STAGES.map((stage, i) => ({
      stage,
      barPct: (weights[i] / max) * 100,
      durationYears: stageDurationYears(stage),
    }));
  }, []);

  const loupeEndClamped = Math.min(
    TOTAL_GYR,
    Math.max(LOUPE_MIN_SPAN_GYR, loupeEnd),
  );

  const loupeBands = useMemo(() => {
    return STAGES.filter((s) => s.startGyr < loupeEndClamped).map((s) => {
      const end = Math.min(s.startGyr + s.durationGyr, loupeEndClamped);
      const left = linPos(s.startGyr, loupeEndClamped);
      const right = linPos(end, loupeEndClamped);
      return {
        stage: s,
        left,
        width: Math.max(s.isEvent ? 0.014 : 0.003, right - left),
      };
    });
  }, [loupeEndClamped]);

  const nowLin = linPos(SUN_CURRENT_AGE_GYR);
  const nowLoupe = linPos(SUN_CURRENT_AGE_GYR, loupeEndClamped);
  const loupeWidthPct = linPos(loupeEndClamped) * 100;
  const wdStage = STAGES.find((s) => s.id === "white-dwarf")!;
  const wdSharePct = Math.round((wdStage.durationGyr / TOTAL_GYR) * 100);

  const applyPointer = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const gyr = t * TOTAL_GYR;
    // Loupe always opens from t=0 (birth); the handle sets how far early life expands.
    setLoupeEnd(Math.max(LOUPE_MIN_SPAN_GYR, Math.min(TOTAL_GYR * 0.45, gyr)));
  }, []);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      dragging.current = true;
      trackRef.current?.setPointerCapture(e.pointerId);
      applyPointer(e.clientX);
    },
    [applyPointer],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!dragging.current) return;
      applyPointer(e.clientX);
    },
    [applyPointer],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      {/* ——— Duration ladder (log) ——— */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
          <span className="type-mono-sm">Duration ladder · log scale</span>
          <span className="type-mono-sm text-bone-3">
            minute → {formatLogYears(stageDurationYears(STAGES[STAGES.length - 1]))}
          </span>
        </div>

        <ol className="flex flex-col">
          {logRows.map(({ stage, barPct, durationYears }) => {
            const active = activeStageId === stage.id;
            const isNow =
              stage.id === "main-sequence" &&
              SUN_CURRENT_AGE_GYR >= stage.startGyr &&
              SUN_CURRENT_AGE_GYR < stage.startGyr + stage.durationGyr;
            return (
              <li
                key={stage.id}
                className="grid grid-cols-[minmax(7.5rem,11rem)_1fr_auto] items-center gap-3 border-b border-line py-3.5 md:grid-cols-[minmax(10rem,14rem)_1fr_minmax(5.5rem,7rem)] md:gap-6"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className="font-serif text-[1.05rem] leading-tight md:text-[1.15rem]"
                    style={{
                      color:
                        active || stage.isEvent
                          ? "var(--color-accent)"
                          : "var(--color-bone)",
                    }}
                  >
                    {SHORT_NAME[stage.id]}
                  </span>
                  {isNow && (
                    <span className="type-mono-sm text-accent">Now · 4.6 Gyr</span>
                  )}
                  {stage.isEvent && !isNow && (
                    <span className="type-mono-sm text-accent">Event</span>
                  )}
                </div>

                <div
                  className="relative h-2 w-full"
                  style={{ background: "var(--color-line)" }}
                  aria-hidden
                >
                  <div
                    className="absolute inset-y-0 left-0 transition-[width,background] duration-500"
                    style={{
                      width: `${barPct}%`,
                      background: bandFill(stage, active),
                      boxShadow: stage.isEvent
                        ? "inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 45%, transparent)"
                        : undefined,
                    }}
                  />
                </div>

                <span className="type-mono-sm text-right text-dim tabular-nums">
                  {formatLogYears(durationYears)}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="type-body max-w-2xl">
          Each row is one phase, sized by the log of how long it lasts — so the
          minute of a helium flash and the hundred-billion-year white-dwarf cool
          both get a readable bar. This is a duration ladder, not a clock.
        </p>
      </div>

      {/* ——— True clock (linear) + loupe ——— */}
      <div className="mt-12 flex flex-col gap-6 border-t border-line pt-10 md:mt-14 md:pt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <span className="type-mono-sm">True clock · linear scale</span>
          <span className="type-mono-sm text-bone-3">
            0 → {Math.round(TOTAL_GYR)} billion years
          </span>
        </div>

        {/* Full career with draggable loupe bracket */}
        <div className="flex flex-col gap-3">
          <div className="relative pt-7">
            <div
              className="pointer-events-none absolute top-0 z-10"
              style={{ left: `${nowLin * 100}%` }}
            >
              <span className="type-mono-sm absolute bottom-2 left-0 -translate-x-1/2 whitespace-nowrap text-accent">
                Now
              </span>
            </div>

            <div
              ref={trackRef}
              className="relative h-11 touch-none select-none border-t border-b border-line cursor-ew-resize"
              style={{ background: "rgba(9,9,11,0.45)" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              role="slider"
              aria-label="Early-life loupe end"
              aria-valuemin={LOUPE_MIN_SPAN_GYR}
              aria-valuemax={Math.round(TOTAL_GYR * 0.45)}
              aria-valuenow={Math.round(loupeEndClamped)}
              aria-valuetext={`Loupe covers first ${loupeEndClamped.toFixed(0)} billion years`}
            >
              <svg
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0"
                aria-hidden
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                    <stop
                      offset="0"
                      stopColor="color-mix(in srgb, var(--color-accent) 3%, transparent)"
                    />
                    <stop
                      offset="1"
                      stopColor="color-mix(in srgb, var(--color-accent) 10%, transparent)"
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

              {/* Loupe window highlight */}
              <div
                className="pointer-events-none absolute inset-y-0"
                style={{
                  left: 0,
                  width: `${loupeWidthPct}%`,
                  background:
                    "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                  borderRight: "1px solid var(--color-accent)",
                }}
              />

              {/* End handle (visual; track owns the drag) */}
              <div
                className="pointer-events-none absolute top-1/2 z-20 h-8 w-3 -translate-x-1/2 -translate-y-1/2 border border-accent bg-ink-2"
                style={{ left: `${loupeWidthPct}%` }}
                aria-hidden
              />

              {/* Thin phase ticks for early life */}
              {STAGES.filter((s) => s.startGyr < loupeEndClamped && !s.isEvent).map(
                (s) => (
                  <div
                    key={s.id}
                    className="pointer-events-none absolute inset-y-0 w-px"
                    style={{
                      left: `${linPos(s.startGyr) * 100}%`,
                      background: "var(--color-line-2)",
                    }}
                  />
                ),
              )}

              <div
                className="pointer-events-none absolute inset-y-0 w-px"
                style={{
                  left: `${nowLin * 100}%`,
                  background: "var(--color-accent)",
                }}
              />

              <span className="pointer-events-none absolute bottom-2 right-3 type-mono-sm text-bone-3">
                White dwarf cooling
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="type-mono-sm text-dim">
              Drag the handle — loupe covers the first{" "}
              {loupeEndClamped >= 10
                ? Math.round(loupeEndClamped)
                : loupeEndClamped.toFixed(1)}{" "}
              Gyr
            </span>
            <span className="type-mono-sm text-dim">
              ~{wdSharePct}% of the bar is white dwarf
            </span>
          </div>
        </div>

        {/* Loupe detail — one insight: luminous career readable */}
        <div className="flex flex-col gap-4 border border-line-2 p-4 md:p-5"
          style={{ background: "rgba(9,9,11,0.4)" }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <span className="type-mono-sm text-accent">
              Loupe · first {loupeEndClamped >= 10
                ? Math.round(loupeEndClamped)
                : loupeEndClamped.toFixed(1)}{" "}
              Gyr expanded
            </span>
            <span className="type-mono-sm text-bone-3">
              collapse →{" "}
              {loupeEndClamped >= 11 ? "planetary nebula" : "mid-career"}
            </span>
          </div>

          <div className="relative pt-7">
            <div
              className="pointer-events-none absolute top-0 z-10"
              style={{ left: `${Math.min(0.98, nowLoupe) * 100}%` }}
            >
              <span className="type-mono-sm absolute bottom-2 left-0 -translate-x-1/2 whitespace-nowrap text-accent">
                Now · 4.6 Gyr
              </span>
            </div>

            <div className="relative h-14 border-t border-b border-line">
              {loupeBands.map(({ stage, left, width }) => {
                const active = activeStageId === stage.id;
                // Only the main-sequence band is wide enough for an in-band name;
                // thinner phases are keyed below — no truncate theater.
                const showInside = stage.id === "main-sequence" || width >= 0.12;
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
                    title={`${stage.name} · ${formatLogYears(stageDurationYears(stage))}`}
                    aria-hidden
                  >
                    {showInside && (
                      <span
                        className="absolute bottom-2 left-2 font-serif text-[0.8rem] leading-none"
                        style={{
                          color: active
                            ? "var(--color-accent)"
                            : "var(--color-bone-3)",
                        }}
                      >
                        {SHORT_NAME[stage.id]}
                      </span>
                    )}
                  </div>
                );
              })}

              <div
                className="pointer-events-none absolute inset-y-0 w-px"
                style={{
                  left: `${Math.min(0.98, nowLoupe) * 100}%`,
                  background: "var(--color-accent)",
                }}
              />
            </div>
          </div>

          {/* External key for thin loupe bands — names live here, not truncated inside */}
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {loupeBands
              .filter(
                ({ stage, width }) =>
                  stage.id !== "main-sequence" && width < 0.12,
              )
              .map(({ stage }) => (
                <li key={stage.id} className="flex items-baseline gap-2">
                  <span
                    className="inline-block h-2 w-2 shrink-0"
                    style={{ background: bandFill(stage, false) }}
                    aria-hidden
                  />
                  <span
                    className="font-serif text-[0.95rem]"
                    style={{
                      color: stage.isEvent
                        ? "var(--color-accent)"
                        : "var(--color-bone-2)",
                    }}
                  >
                    {stage.isEvent ? "Helium flash" : SHORT_NAME[stage.id]}
                  </span>
                  <span className="type-mono-sm text-dim">
                    {stage.isEvent
                      ? "~1 min"
                      : formatLogYears(stageDurationYears(stage))}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <p className="type-body max-w-2xl">
          On a true clock, white-dwarf cooling owns nearly the whole bar. The
          luminous career — Now mid–main-sequence, then a brief giant sequence —
          is the left-edge sliver the loupe expands. Nearly all of that luminous
          life is the main sequence we&rsquo;re already in.
        </p>
      </div>
    </div>
  );
}
