"use client";

import { useEffect, useId, useRef, useState, useEffectEvent } from "react";
import {
  formatCostUsd,
  PRICING_SNAPSHOT,
  SCENARIO_LIMITS,
  type CostResult,
  type CostScenario,
  type ImageSizeBand,
  type TextInput,
  type VideoFormatBand,
} from "@/lib/token-cost";
import { formatTokens } from "@/lib/tokens";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModelPicker } from "./ModelPicker";
import { PRESETS } from "./presets";

type TextMode = TextInput["mode"];

const DEFAULT: CostScenario = {
  modelId: "claude-sonnet-5.5",
  text: { mode: "tokens", tokens: 4_000 },
  images: { count: 0, size: "medium" },
  audioSeconds: 0,
  video: { seconds: 0, format: "default" },
  cacheHitPercent: 0,
  outputTokens: 800,
  requestsPerDay: 100,
  users: 1,
};

const underlineField =
  "w-full border-0 border-b border-line bg-transparent px-0 py-2 type-mono text-[0.85rem] text-bone outline-none transition-colors hover:border-line-2 focus:border-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

function Segmented<T extends string>({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  "aria-label": string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={ariaLabel}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className="type-mono-sm px-2.5 py-1 transition-colors"
            style={{
              border: `1px solid ${on ? "var(--color-accent)" : "var(--color-line)"}`,
              color: on ? "var(--color-accent)" : "var(--color-bone-3)",
              background: on ? "rgba(228,199,138,0.06)" : "transparent",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline gap-2">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="type-mono-sm text-muted">
            {label}
          </label>
        ) : (
          <span className="type-mono-sm text-muted">{label}</span>
        )}
        {hint ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="type-mono-sm text-dim underline decoration-line-2 underline-offset-2 transition-colors hover:text-bone-3 hover:decoration-accent"
              >
                note
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{hint}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function NumberField({
  id,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix,
}: {
  id: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const raw = e.target.valueAsNumber;
          if (!Number.isFinite(raw)) {
            onChange(min);
            return;
          }
          onChange(Math.min(max, Math.max(min, raw)));
        }}
        className={`${underlineField}${suffix ? " pr-10" : ""}`}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 type-mono-sm text-dim">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function Disclosure({
  id,
  title,
  open,
  onToggle,
  summary,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line">
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="group flex w-full items-baseline justify-between gap-4 py-4 text-left"
      >
        <span className="type-mono-sm text-bone transition-colors group-hover:text-accent">
          {title}
        </span>
        <span className="type-mono-sm text-dim transition-colors group-hover:text-bone-3">
          {open ? "Hide" : summary}
        </span>
      </button>
      {open ? (
        <div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={id}
          className="pb-5"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function hasModalities(s: CostScenario): boolean {
  return (
    (s.images?.count ?? 0) > 0 ||
    (s.audioSeconds ?? 0) > 0 ||
    (s.video?.seconds ?? 0) > 0
  );
}

export function Calculator() {
  const uid = useId();
  const [scenario, setScenario] = useState<CostScenario>(DEFAULT);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [result, setResult] = useState<CostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [modsOpen, setModsOpen] = useState(false);
  const [scaleOpen, setScaleOpen] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const textMode: TextMode = scenario.text?.mode ?? "tokens";
  const textValue =
    scenario.text?.mode === "words"
      ? scenario.text.words
      : scenario.text?.mode === "chars"
        ? scenario.text.chars
        : (scenario.text?.tokens ?? 0);

  const activePresetMeta = PRESETS.find((p) => p.id === activePreset);

  const runCalc = useEffectEvent(async (body: CostScenario) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/token-cost", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: ac.signal,
      });
      const data = (await res.json()) as CostResult & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Calculation failed.");
        setResult(null);
        return;
      }
      setResult(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Could not reach the calculator.");
      setResult(null);
    } finally {
      if (abortRef.current === ac) setPending(false);
    }
  });

  useEffect(() => {
    const t = window.setTimeout(() => {
      void runCalc(scenario);
    }, 220);
    return () => window.clearTimeout(t);
  }, [scenario]);

  function patch(partial: Partial<CostScenario>) {
    setActivePreset(null);
    setScenario((s) => ({ ...s, ...partial }));
  }

  function setText(mode: TextMode, value: number) {
    setActivePreset(null);
    const capped =
      mode === "words"
        ? Math.min(value, SCENARIO_LIMITS.words)
        : mode === "chars"
          ? Math.min(value, SCENARIO_LIMITS.chars)
          : Math.min(value, SCENARIO_LIMITS.tokens);
    const text: TextInput =
      mode === "words"
        ? { mode: "words", words: capped }
        : mode === "chars"
          ? { mode: "chars", chars: capped }
          : { mode: "tokens", tokens: capped };
    setScenario((s) => ({ ...s, text }));
  }

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setActivePreset(id);
    const next: CostScenario = {
      ...DEFAULT,
      ...preset.scenario,
      modelId: preset.scenario.modelId ?? scenario.modelId,
    };
    setScenario(next);
    setModsOpen(hasModalities(next));
    setScaleOpen(true);
  }

  const verifiedHuman = new Date(
    PRICING_SNAPSHOT.verifiedDate,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const modsSummary = (() => {
    const parts: string[] = [];
    if ((scenario.images?.count ?? 0) > 0) {
      parts.push(`${scenario.images!.count} img`);
    }
    if ((scenario.audioSeconds ?? 0) > 0) {
      parts.push(`${scenario.audioSeconds}s audio`);
    }
    if ((scenario.video?.seconds ?? 0) > 0) {
      parts.push(`${scenario.video!.seconds}s video`);
    }
    return parts.length ? parts.join(" · ") : "None";
  })();

  const scaleSummary = `${scenario.requestsPerDay ?? 0}/day · ${scenario.users ?? 1} user${
    (scenario.users ?? 1) === 1 ? "" : "s"
  }`;

  return (
    <TooltipProvider>
      <div
        className="border border-line"
        style={{ background: "rgba(15, 15, 18, 0.6)" }}
      >
        {/* Presets — TaskPicker rhythm */}
        <div className="px-5 pt-5 md:px-8 md:pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="type-mono-sm">What are you modelling?</span>
            <span className="type-mono-sm text-dim">
              Pricing verified {verifiedHuman}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const on = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  aria-pressed={on}
                  className="type-mono-sm px-3 py-1.5 transition-colors"
                  style={{
                    border: `1px solid ${on ? "var(--color-accent)" : "var(--color-line)"}`,
                    color: on ? "var(--color-accent)" : "var(--color-bone-3)",
                    background: on
                      ? "rgba(228,199,138,0.06)"
                      : "var(--color-glass)",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <p className="mt-6 type-body max-w-2xl text-bone-2">
            {activePresetMeta
              ? activePresetMeta.blurb
              : "Pick a shape that looks like the app you are building, then nudge the numbers until the monthly line feels honest."}
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          {/* Controls */}
          <div className="border-t border-line px-5 py-6 md:border-r md:px-8 md:py-8">
            <Field
              label="Model"
              hint="USD per 1M tokens. Cache is the hit/read rate, not a cache write."
            >
              <ModelPicker
                value={scenario.modelId}
                onChange={(modelId) => patch({ modelId })}
              />
            </Field>

            <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field
                label={
                  textMode === "tokens"
                    ? "Input"
                    : textMode === "words"
                      ? "Words"
                      : "Characters"
                }
                htmlFor={`${uid}-text`}
                hint="Words ≈ 0.75 / token · characters ≈ 4 / token."
              >
                <NumberField
                  id={`${uid}-text`}
                  value={textValue}
                  onChange={(n) => setText(textMode, n)}
                  max={
                    textMode === "tokens"
                      ? SCENARIO_LIMITS.tokens
                      : textMode === "words"
                        ? SCENARIO_LIMITS.words
                        : SCENARIO_LIMITS.chars
                  }
                  step={textMode === "tokens" ? 100 : 50}
                />
                <div className="mt-3">
                  <Segmented
                    aria-label="Text unit"
                    value={textMode}
                    onChange={(mode) => setText(mode, textValue)}
                    options={[
                      { value: "tokens", label: "Tokens" },
                      { value: "words", label: "Words" },
                      { value: "chars", label: "Chars" },
                    ]}
                  />
                </div>
              </Field>

              <Field label="Output" htmlFor={`${uid}-out`}>
                <NumberField
                  id={`${uid}-out`}
                  value={scenario.outputTokens}
                  onChange={(outputTokens) => patch({ outputTokens })}
                  max={SCENARIO_LIMITS.outputTokens}
                  step={50}
                  suffix="tok"
                />
              </Field>

              <Field
                label="Cache hit"
                htmlFor={`${uid}-cache`}
                hint="Share of text tokens billed at the cache-hit rate."
              >
                <NumberField
                  id={`${uid}-cache`}
                  value={scenario.cacheHitPercent ?? 0}
                  onChange={(cacheHitPercent) =>
                    patch({ cacheHitPercent })
                  }
                  max={SCENARIO_LIMITS.cacheHitPercent}
                  step={5}
                  suffix="%"
                />
              </Field>
            </div>

            <div className="mt-8">
              <Disclosure
                id={`${uid}-mods`}
                title="Modalities"
                open={modsOpen}
                onToggle={() => setModsOpen((o) => !o)}
                summary={modsSummary}
              >
                <p className="mb-5 type-mono-sm text-dim max-w-md">
                  Published approximations — not a tokenizer substitute.
                </p>
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <Field label="Images" htmlFor={`${uid}-img`}>
                    <NumberField
                      id={`${uid}-img`}
                      value={scenario.images?.count ?? 0}
                      onChange={(count) =>
                        patch({
                          images: {
                            count,
                            size: scenario.images?.size ?? "medium",
                          },
                        })
                      }
                      max={SCENARIO_LIMITS.images}
                    />
                    <div className="mt-3">
                      <Segmented
                        aria-label="Image size"
                        value={
                          (scenario.images?.size ?? "medium") as ImageSizeBand
                        }
                        onChange={(size) =>
                          patch({
                            images: {
                              count: scenario.images?.count ?? 0,
                              size,
                            },
                          })
                        }
                        options={[
                          { value: "small", label: "Small" },
                          { value: "medium", label: "Med" },
                          { value: "large", label: "Large" },
                        ]}
                      />
                    </div>
                  </Field>
                  <Field label="Audio" htmlFor={`${uid}-audio`}>
                    <NumberField
                      id={`${uid}-audio`}
                      value={scenario.audioSeconds ?? 0}
                      onChange={(audioSeconds) => patch({ audioSeconds })}
                      max={SCENARIO_LIMITS.audioSeconds}
                      step={5}
                      suffix="sec"
                    />
                  </Field>
                  <Field label="Video" htmlFor={`${uid}-video`}>
                    <NumberField
                      id={`${uid}-video`}
                      value={scenario.video?.seconds ?? 0}
                      onChange={(seconds) =>
                        patch({
                          video: {
                            seconds,
                            format: scenario.video?.format ?? "default",
                          },
                        })
                      }
                      max={SCENARIO_LIMITS.videoSeconds}
                      step={5}
                      suffix="sec"
                    />
                    <div className="mt-3">
                      <Segmented
                        aria-label="Video format"
                        value={
                          (scenario.video?.format ??
                            "default") as VideoFormatBand
                        }
                        onChange={(format) =>
                          patch({
                            video: {
                              seconds: scenario.video?.seconds ?? 0,
                              format,
                            },
                          })
                        }
                        options={[
                          { value: "low", label: "Low" },
                          { value: "default", label: "Default" },
                          { value: "high", label: "High" },
                        ]}
                      />
                    </div>
                  </Field>
                </div>
              </Disclosure>

              <Disclosure
                id={`${uid}-scale`}
                title="Monthly scale"
                open={scaleOpen}
                onToggle={() => setScaleOpen((o) => !o)}
                summary={scaleSummary}
              >
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <Field label="Requests / day" htmlFor={`${uid}-rpd`}>
                    <NumberField
                      id={`${uid}-rpd`}
                      value={scenario.requestsPerDay ?? 0}
                      onChange={(requestsPerDay) => patch({ requestsPerDay })}
                      max={SCENARIO_LIMITS.requestsPerDay}
                      step={10}
                    />
                  </Field>
                  <Field label="Users" htmlFor={`${uid}-users`}>
                    <NumberField
                      id={`${uid}-users`}
                      value={scenario.users ?? 1}
                      onChange={(users) => patch({ users })}
                      min={1}
                      max={SCENARIO_LIMITS.users}
                    />
                  </Field>
                </div>
              </Disclosure>
            </div>
          </div>

          {/* Result ledger */}
          <div
            className="flex flex-col border-t border-line px-5 py-6 md:px-8 md:py-8"
            aria-live="polite"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="type-mono-sm">Per request</span>
              {pending ? (
                <span className="type-mono-sm text-dim">Calculating</span>
              ) : null}
            </div>

            {error ? (
              <p className="mt-6 type-body text-accent" role="alert">
                {error}
              </p>
            ) : null}

            {result ? (
              <>
                <div className="mt-6 min-w-0">
                  <span className="type-numeral block truncate text-[3rem] leading-none text-bone md:text-[3.5rem]">
                    {formatCostUsd(result.costs.perRequestUsd)}
                  </span>
                  <div className="mt-3 font-serif text-[1.15rem] text-bone-2">
                    {result.model.name}
                  </div>
                </div>

                <dl className="mt-8 flex flex-col border-t border-line">
                  {(
                    [
                      ["Uncached input", result.costs.uncachedInputUsd],
                      ["Cached input", result.costs.cachedInputUsd],
                      ["Output", result.costs.outputUsd],
                    ] as const
                  ).map(([label, usd]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                    >
                      <dt className="type-mono-sm text-muted">{label}</dt>
                      <dd className="type-mono text-bone tabular-nums">
                        {formatCostUsd(usd)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 type-mono-sm text-dim leading-relaxed">
                  {formatTokens(result.tokens.inputTotal)} in
                  {result.tokens.cachedText > 0
                    ? ` · ${formatTokens(result.tokens.cachedText)} cached`
                    : ""}
                  {result.tokens.images > 0
                    ? ` · ${formatTokens(result.tokens.images)} image`
                    : ""}
                  {result.tokens.audio > 0
                    ? ` · ${formatTokens(result.tokens.audio)} audio`
                    : ""}
                  {result.tokens.video > 0
                    ? ` · ${formatTokens(result.tokens.video)} video`
                    : ""}
                  {" · "}
                  {formatTokens(result.tokens.output)} out
                </p>

                {result.monthly ? (
                  <div className="mt-auto border-t border-line pt-8">
                    <span className="type-mono-sm">Thirty-day estimate</span>
                    <div className="mt-3 min-w-0">
                      <span className="type-numeral block truncate text-[2.25rem] leading-none text-accent md:text-[2.75rem]">
                        {formatCostUsd(result.monthly.usd)}
                      </span>
                    </div>
                    <p className="mt-3 type-mono-sm text-dim">
                      {result.monthly.requests.toLocaleString("en-US")} requests
                    </p>
                  </div>
                ) : null}

                {result.notes.length > 0 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="mt-6 self-start type-mono-sm text-dim underline decoration-line-2 underline-offset-4 transition-colors hover:text-bone-3 hover:decoration-accent"
                      >
                        {result.notes.length} caveat
                        {result.notes.length === 1 ? "" : "s"}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-xs whitespace-pre-line"
                    >
                      {result.notes.join("\n\n")}
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </>
            ) : !error ? (
              <p className="mt-6 type-body text-muted">Waiting for numbers…</p>
            ) : null}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
