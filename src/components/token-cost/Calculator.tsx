"use client";

import { useEffect, useId, useRef, useState, useEffectEvent } from "react";
import {
  formatCostUsd,
  PRICING_SNAPSHOT,
  type CostResult,
  type CostScenario,
  type ImageSizeBand,
  type TextInput,
  type VideoFormatBand,
} from "@/lib/token-cost";
import { formatTokens } from "@/lib/tokens";
import { PRESETS } from "./presets";

type TextMode = TextInput["mode"];

const DEFAULT: CostScenario = {
  modelId: "claude-sonnet-4.6",
  text: { mode: "tokens", tokens: 4_000 },
  images: { count: 0, size: "medium" },
  audioSeconds: 0,
  video: { seconds: 0, format: "default" },
  cacheHitPercent: 0,
  outputTokens: 800,
  requestsPerDay: 100,
  users: 1,
};

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="type-mono-sm text-bone-3">{children}</span>
      {hint ? <span className="text-[0.75rem] text-muted leading-snug">{hint}</span> : null}
    </label>
  );
}

function NumberInput({
  id,
  value,
  onChange,
  min = 0,
  step = 1,
  "aria-label": ariaLabel,
}: {
  id: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  "aria-label"?: string;
}) {
  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      min={min}
      step={step}
      value={Number.isFinite(value) ? value : 0}
      aria-label={ariaLabel}
      onChange={(e) => {
        const n = e.target.valueAsNumber;
        onChange(Number.isFinite(n) ? n : 0);
      }}
      className="w-full bg-ink-3 border border-line px-3 py-2.5 type-mono text-bone outline-none focus:border-accent transition-colors"
    />
  );
}

function SelectInput<T extends string>({
  id,
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: {
  id: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  "aria-label"?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full bg-ink-3 border border-line px-3 py-2.5 type-mono text-bone outline-none focus:border-accent transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Calculator() {
  const uid = useId();
  const [scenario, setScenario] = useState<CostScenario>(DEFAULT);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [result, setResult] = useState<CostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const textMode: TextMode = scenario.text?.mode ?? "tokens";
  const textValue =
    scenario.text?.mode === "words"
      ? scenario.text.words
      : scenario.text?.mode === "chars"
        ? scenario.text.chars
        : (scenario.text?.tokens ?? 0);

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
    const text: TextInput =
      mode === "words"
        ? { mode: "words", words: value }
        : mode === "chars"
          ? { mode: "chars", chars: value }
          : { mode: "tokens", tokens: value };
    setScenario((s) => ({ ...s, text }));
  }

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setActivePreset(id);
    setScenario({
      ...DEFAULT,
      ...preset.scenario,
      modelId: preset.scenario.modelId ?? scenario.modelId,
    });
  }

  const verifiedHuman = new Date(
    PRICING_SNAPSHOT.verifiedDate,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const selected = PRICING_SNAPSHOT.models.find((m) => m.id === scenario.modelId);

  return (
    <div className="border border-line" style={{ background: "rgba(15,15,18,0.55)" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-4 md:px-8">
        <div>
          <span className="type-mono-sm">Token cost calculator</span>
          <p className="mt-1 text-[0.8rem] text-muted max-w-xl">
            Authoritative math runs on Looking Glass — change inputs and the
            backend recomputes.
          </p>
        </div>
        <p className="type-mono-sm text-dim">
          Pricing verified {verifiedHuman}
        </p>
      </div>

      {/* Presets */}
      <div className="border-b border-line px-5 py-4 md:px-8">
        <span className="type-mono-sm text-bone-3">App-shaped presets</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const on = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                aria-pressed={on}
                className={`type-mono-sm px-3 py-2 border transition-colors ${
                  on
                    ? "border-accent text-accent bg-accent-soft"
                    : "border-line text-bone-3 hover:border-line-2 hover:text-bone"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        {activePreset ? (
          <p className="mt-3 text-[0.85rem] text-bone-3 max-w-2xl">
            {PRESETS.find((p) => p.id === activePreset)?.blurb}
          </p>
        ) : null}
      </div>

      <div className="grid md:grid-cols-[1.15fr_0.85fr]">
        {/* Controls */}
        <div className="flex flex-col gap-6 border-b border-line px-5 py-6 md:border-b-0 md:border-r md:px-8 md:py-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor={`${uid}-model`}>Model</FieldLabel>
              <div className="mt-2">
                <SelectInput
                  id={`${uid}-model`}
                  value={scenario.modelId}
                  onChange={(modelId) => patch({ modelId })}
                  options={PRICING_SNAPSHOT.models.map((m) => ({
                    value: m.id,
                    label: `${m.name} · $${m.priceInput}/$${m.priceOutput} per 1M`,
                  }))}
                />
              </div>
              {selected ? (
                <p className="mt-2 type-mono-sm text-dim">
                  Input ${selected.priceInput}
                  {selected.priceCachedInput != null
                    ? ` · cached $${selected.priceCachedInput}`
                    : " · no cache rate"}
                  {" · "}output ${selected.priceOutput} / 1M tokens
                </p>
              ) : null}
            </div>

            <div>
              <FieldLabel htmlFor={`${uid}-text-mode`}>Text as</FieldLabel>
              <div className="mt-2">
                <SelectInput
                  id={`${uid}-text-mode`}
                  value={textMode}
                  onChange={(mode) => setText(mode, textValue)}
                  options={[
                    { value: "tokens", label: "Tokens" },
                    { value: "words", label: "Words (~0.75 words/token)" },
                    { value: "chars", label: "Characters (~4 chars/token)" },
                  ]}
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor={`${uid}-text-val`}>
                {textMode === "tokens"
                  ? "Input tokens"
                  : textMode === "words"
                    ? "Words"
                    : "Characters"}
              </FieldLabel>
              <div className="mt-2">
                <NumberInput
                  id={`${uid}-text-val`}
                  value={textValue}
                  onChange={(n) => setText(textMode, n)}
                  step={textMode === "tokens" ? 100 : 50}
                />
              </div>
            </div>

            <div>
              <FieldLabel
                htmlFor={`${uid}-cache`}
                hint="Share of text tokens billed at the cache-hit rate."
              >
                Cache hit %
              </FieldLabel>
              <div className="mt-2">
                <NumberInput
                  id={`${uid}-cache`}
                  value={scenario.cacheHitPercent ?? 0}
                  onChange={(cacheHitPercent) =>
                    patch({
                      cacheHitPercent: Math.min(100, Math.max(0, cacheHitPercent)),
                    })
                  }
                  step={5}
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor={`${uid}-out`}>Output tokens</FieldLabel>
              <div className="mt-2">
                <NumberInput
                  id={`${uid}-out`}
                  value={scenario.outputTokens}
                  onChange={(outputTokens) => patch({ outputTokens })}
                  step={50}
                />
              </div>
            </div>
          </div>

          <div className="rule" />

          <div>
            <span className="type-mono-sm text-bone">Modalities</span>
            <p className="mt-1 text-[0.8rem] text-muted max-w-lg">
              Estimates using published approximations — not a tokenizer
              substitute.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor={`${uid}-img-n`}>Images</FieldLabel>
                <div className="mt-2">
                  <NumberInput
                    id={`${uid}-img-n`}
                    value={scenario.images?.count ?? 0}
                    onChange={(count) =>
                      patch({
                        images: {
                          count,
                          size: scenario.images?.size ?? "medium",
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor={`${uid}-img-sz`}>Image size</FieldLabel>
                <div className="mt-2">
                  <SelectInput
                    id={`${uid}-img-sz`}
                    value={(scenario.images?.size ?? "medium") as ImageSizeBand}
                    onChange={(size) =>
                      patch({
                        images: {
                          count: scenario.images?.count ?? 0,
                          size,
                        },
                      })
                    }
                    options={[
                      { value: "small", label: "Small (~500 tok)" },
                      { value: "medium", label: "Medium (~1.1k tok)" },
                      { value: "large", label: "Large (~2.5k tok)" },
                    ]}
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor={`${uid}-audio`}>Audio (seconds)</FieldLabel>
                <div className="mt-2">
                  <NumberInput
                    id={`${uid}-audio`}
                    value={scenario.audioSeconds ?? 0}
                    onChange={(audioSeconds) => patch({ audioSeconds })}
                    step={5}
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor={`${uid}-video`}>Video (seconds)</FieldLabel>
                <div className="mt-2">
                  <NumberInput
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
                    step={5}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor={`${uid}-vfmt`}>Video format band</FieldLabel>
                <div className="mt-2">
                  <SelectInput
                    id={`${uid}-vfmt`}
                    value={(scenario.video?.format ?? "default") as VideoFormatBand}
                    onChange={(format) =>
                      patch({
                        video: {
                          seconds: scenario.video?.seconds ?? 0,
                          format,
                        },
                      })
                    }
                    options={[
                      { value: "low", label: "Low (0.5× tokens/sec)" },
                      { value: "default", label: "Default (~258 tok/sec)" },
                      { value: "high", label: "High (1.5× tokens/sec)" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rule" />

          <div>
            <span className="type-mono-sm text-bone">Scale to a month</span>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor={`${uid}-rpd`}>Requests / day</FieldLabel>
                <div className="mt-2">
                  <NumberInput
                    id={`${uid}-rpd`}
                    value={scenario.requestsPerDay ?? 0}
                    onChange={(requestsPerDay) => patch({ requestsPerDay })}
                    step={10}
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor={`${uid}-users`}>Users</FieldLabel>
                <div className="mt-2">
                  <NumberInput
                    id={`${uid}-users`}
                    value={scenario.users ?? 1}
                    onChange={(users) => patch({ users: Math.max(1, users) })}
                    min={1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div
          className="flex flex-col gap-6 px-5 py-6 md:px-8 md:py-8"
          aria-live="polite"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="type-mono-sm">Per request</span>
            {pending ? (
              <span className="type-mono-sm text-dim">Calculating…</span>
            ) : null}
          </div>

          {error ? (
            <p className="type-body text-accent" role="alert">
              {error}
            </p>
          ) : null}

          {result ? (
            <>
              <div>
                <span className="type-numeral text-[2.75rem] leading-none text-bone md:text-[3.5rem]">
                  {formatCostUsd(result.costs.perRequestUsd)}
                </span>
                <div className="mt-2 type-mono text-bone-3">
                  {result.model.name}
                </div>
              </div>

              <dl className="flex flex-col gap-3 type-mono-sm">
                <div className="flex justify-between gap-4 border-b border-line pb-2">
                  <dt className="text-muted">Uncached input</dt>
                  <dd className="text-bone">
                    {formatCostUsd(result.costs.uncachedInputUsd)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-2">
                  <dt className="text-muted">Cached input</dt>
                  <dd className="text-bone">
                    {formatCostUsd(result.costs.cachedInputUsd)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-2">
                  <dt className="text-muted">Output</dt>
                  <dd className="text-bone">
                    {formatCostUsd(result.costs.outputUsd)}
                  </dd>
                </div>
              </dl>

              <div>
                <span className="type-mono-sm text-bone-3">Token mix</span>
                <ul className="mt-3 flex flex-col gap-1.5 type-mono-sm text-muted">
                  <li>
                    Text {formatTokens(result.tokens.text)}
                    {result.tokens.cachedText > 0
                      ? ` · ${formatTokens(result.tokens.cachedText)} cached`
                      : ""}
                  </li>
                  {result.tokens.images > 0 ? (
                    <li>Images {formatTokens(result.tokens.images)}</li>
                  ) : null}
                  {result.tokens.audio > 0 ? (
                    <li>Audio {formatTokens(result.tokens.audio)}</li>
                  ) : null}
                  {result.tokens.video > 0 ? (
                    <li>Video {formatTokens(result.tokens.video)}</li>
                  ) : null}
                  <li className="text-bone-3">
                    Input total {formatTokens(result.tokens.inputTotal)} · out{" "}
                    {formatTokens(result.tokens.output)}
                  </li>
                </ul>
              </div>

              {result.monthly ? (
                <div className="border-t border-line pt-5">
                  <span className="type-mono-sm">Monthly estimate</span>
                  <div className="mt-2">
                    <span className="type-numeral text-[2rem] leading-none text-accent md:text-[2.5rem]">
                      {formatCostUsd(result.monthly.usd)}
                    </span>
                  </div>
                  <p className="mt-2 type-mono-sm text-dim">
                    {result.monthly.requests.toLocaleString("en-US")} requests ·
                    30-day month
                  </p>
                </div>
              ) : null}

              {result.notes.length > 0 ? (
                <ul className="flex flex-col gap-2 text-[0.8rem] text-muted leading-snug">
                  {result.notes.map((n) => (
                    <li key={n}>· {n}</li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : !error ? (
            <p className="type-body text-muted">Waiting for first result…</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
