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

function Hint({ label }: { label: string }) {
  return (
    <span
      className="ml-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-line-2 type-mono text-[0.55rem] text-muted cursor-help align-middle"
      title={label}
      aria-label={label}
      tabIndex={0}
    >
      ?
    </span>
  );
}

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
    <label htmlFor={htmlFor} className="flex items-center gap-0.5">
      <span className="type-mono-sm text-bone-3">{children}</span>
      {hint ? <Hint label={hint} /> : null}
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
      className="w-full bg-ink-3 border border-line px-2.5 py-1.5 type-mono text-bone text-[0.8rem] outline-none focus:border-accent transition-colors"
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
      className="w-full bg-ink-3 border border-line px-2.5 py-1.5 type-mono text-bone text-[0.8rem] outline-none focus:border-accent transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Collapse({
  id,
  title,
  hint,
  open,
  onToggle,
  summary,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  open: boolean;
  onToggle: () => void;
  summary?: string;
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
        className="flex w-full items-center justify-between gap-3 py-2 text-left"
      >
        <span className="flex items-center gap-1.5">
          <span className="type-mono-sm text-bone">{title}</span>
          {hint ? <Hint label={hint} /> : null}
          {!open && summary ? (
            <span className="type-mono-sm text-dim truncate">{summary}</span>
          ) : null}
        </span>
        <span className="type-mono-sm text-dim" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div id={`${id}-panel`} role="region" aria-labelledby={id} className="pb-2">
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

  const selected = PRICING_SNAPSHOT.models.find((m) => m.id === scenario.modelId);

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
    return parts.length ? parts.join(" · ") : "none";
  })();

  const scaleSummary = `${scenario.requestsPerDay ?? 0}/day · ${scenario.users ?? 1} user${(scenario.users ?? 1) === 1 ? "" : "s"}`;

  return (
    <div
      className="flex max-h-[100dvh] flex-col border border-line overflow-hidden"
      style={{ background: "rgba(15,15,18,0.55)" }}
    >
      {/* Header + presets */}
      <div className="shrink-0 border-b border-line px-4 py-2.5 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="flex items-center type-mono-sm text-bone">
            Token cost calculator
            <Hint label="Authoritative math runs on Looking Glass — change inputs and the backend recomputes." />
          </span>
          <p className="type-mono-sm text-dim">Verified {verifiedHuman}</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => {
            const on = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                title={p.blurb}
                onClick={() => applyPreset(p.id)}
                aria-pressed={on}
                className={`type-mono-sm px-2.5 py-1 border transition-colors ${
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
      </div>

      <div className="grid min-h-0 flex-1 md:grid-cols-[1.15fr_0.85fr]">
        {/* Controls */}
        <div className="min-h-0 overflow-y-auto border-b border-line px-4 py-3 md:border-b-0 md:border-r md:px-5">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel
                htmlFor={`${uid}-model`}
                hint={
                  selected
                    ? `Input $${selected.priceInput}${
                        selected.priceCachedInput != null
                          ? ` · cached $${selected.priceCachedInput}`
                          : " · no cache rate"
                      } · output $${selected.priceOutput} / 1M tokens`
                    : undefined
                }
              >
                Model
              </FieldLabel>
              <div className="mt-1">
                <SelectInput
                  id={`${uid}-model`}
                  value={scenario.modelId}
                  onChange={(modelId) => patch({ modelId })}
                  options={PRICING_SNAPSHOT.models.map((m) => ({
                    value: m.id,
                    label: `${m.name} · $${m.priceInput}/$${m.priceOutput}`,
                  }))}
                />
              </div>
            </div>

            <div>
              <FieldLabel
                htmlFor={`${uid}-text-mode`}
                hint="Words ≈ 0.75 words/token · chars ≈ 4 chars/token (English estimate)."
              >
                Text as
              </FieldLabel>
              <div className="mt-1">
                <SelectInput
                  id={`${uid}-text-mode`}
                  value={textMode}
                  onChange={(mode) => setText(mode, textValue)}
                  options={[
                    { value: "tokens", label: "Tokens" },
                    { value: "words", label: "Words" },
                    { value: "chars", label: "Characters" },
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
              <div className="mt-1">
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
              <div className="mt-1">
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
              <div className="mt-1">
                <NumberInput
                  id={`${uid}-out`}
                  value={scenario.outputTokens}
                  onChange={(outputTokens) => patch({ outputTokens })}
                  step={50}
                />
              </div>
            </div>
          </div>

          <div className="mt-2">
            <Collapse
              id={`${uid}-mods`}
              title="Modalities"
              hint="Image, audio, and video token counts are published approximations — not a tokenizer substitute."
              open={modsOpen}
              onToggle={() => setModsOpen((o) => !o)}
              summary={modsSummary}
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={`${uid}-img-n`}>Images</FieldLabel>
                  <div className="mt-1">
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
                  <div className="mt-1">
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
                        { value: "small", label: "Small (~500)" },
                        { value: "medium", label: "Medium (~1.1k)" },
                        { value: "large", label: "Large (~2.5k)" },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor={`${uid}-audio`}>Audio (sec)</FieldLabel>
                  <div className="mt-1">
                    <NumberInput
                      id={`${uid}-audio`}
                      value={scenario.audioSeconds ?? 0}
                      onChange={(audioSeconds) => patch({ audioSeconds })}
                      step={5}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor={`${uid}-video`}>Video (sec)</FieldLabel>
                  <div className="mt-1">
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
                  <FieldLabel
                    htmlFor={`${uid}-vfmt`}
                    hint="Scales the base ~258 tokens/sec video rate."
                  >
                    Video format
                  </FieldLabel>
                  <div className="mt-1">
                    <SelectInput
                      id={`${uid}-vfmt`}
                      value={
                        (scenario.video?.format ?? "default") as VideoFormatBand
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
                        { value: "low", label: "Low (0.5×)" },
                        { value: "default", label: "Default (1×)" },
                        { value: "high", label: "High (1.5×)" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </Collapse>

            <Collapse
              id={`${uid}-scale`}
              title="Monthly scale"
              hint="requests/day × users × 30."
              open={scaleOpen}
              onToggle={() => setScaleOpen((o) => !o)}
              summary={scaleSummary}
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={`${uid}-rpd`}>Requests / day</FieldLabel>
                  <div className="mt-1">
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
                  <div className="mt-1">
                    <NumberInput
                      id={`${uid}-users`}
                      value={scenario.users ?? 1}
                      onChange={(users) => patch({ users: Math.max(1, users) })}
                      min={1}
                    />
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>

        {/* Results */}
        <div
          className="flex min-h-0 flex-col gap-3 overflow-y-auto px-4 py-3 md:px-5"
          aria-live="polite"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="type-mono-sm">Per request</span>
            {pending ? (
              <span className="type-mono-sm text-dim">…</span>
            ) : null}
          </div>

          {error ? (
            <p className="text-[0.85rem] text-accent" role="alert">
              {error}
            </p>
          ) : null}

          {result ? (
            <>
              <div>
                <span className="type-numeral text-[2.25rem] leading-none text-bone md:text-[2.75rem]">
                  {formatCostUsd(result.costs.perRequestUsd)}
                </span>
                <div className="mt-1 type-mono-sm text-bone-3">
                  {result.model.name}
                </div>
              </div>

              <dl className="flex flex-col gap-1.5 type-mono-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Uncached in</dt>
                  <dd className="text-bone">
                    {formatCostUsd(result.costs.uncachedInputUsd)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Cached in</dt>
                  <dd className="text-bone">
                    {formatCostUsd(result.costs.cachedInputUsd)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-1.5">
                  <dt className="text-muted">Output</dt>
                  <dd className="text-bone">
                    {formatCostUsd(result.costs.outputUsd)}
                  </dd>
                </div>
              </dl>

              <p className="type-mono-sm text-muted">
                Text {formatTokens(result.tokens.text)}
                {result.tokens.cachedText > 0
                  ? ` · ${formatTokens(result.tokens.cachedText)} cached`
                  : ""}
                {result.tokens.images > 0
                  ? ` · img ${formatTokens(result.tokens.images)}`
                  : ""}
                {result.tokens.audio > 0
                  ? ` · audio ${formatTokens(result.tokens.audio)}`
                  : ""}
                {result.tokens.video > 0
                  ? ` · video ${formatTokens(result.tokens.video)}`
                  : ""}
                <span className="text-bone-3">
                  {" "}
                  · in {formatTokens(result.tokens.inputTotal)} · out{" "}
                  {formatTokens(result.tokens.output)}
                </span>
              </p>

              {result.monthly ? (
                <div className="border-t border-line pt-3">
                  <span className="type-mono-sm">Monthly</span>
                  <div className="mt-1">
                    <span className="type-numeral text-[1.75rem] leading-none text-accent md:text-[2.1rem]">
                      {formatCostUsd(result.monthly.usd)}
                    </span>
                  </div>
                  <p className="mt-1 type-mono-sm text-dim">
                    {result.monthly.requests.toLocaleString("en-US")} req · 30d
                  </p>
                </div>
              ) : null}

              {result.notes.length > 0 ? (
                <p
                  className="type-mono-sm text-dim truncate"
                  title={result.notes.join(" · ")}
                >
                  {result.notes.length} note{result.notes.length === 1 ? "" : "s"}
                  <Hint label={result.notes.join("\n\n")} />
                </p>
              ) : null}
            </>
          ) : !error ? (
            <p className="type-mono-sm text-muted">Waiting…</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
