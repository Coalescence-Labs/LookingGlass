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

const fieldClass =
  "w-full bg-ink-3 border border-line px-3 py-2 type-mono text-bone text-[0.8rem] outline-none transition-colors hover:border-line-2 focus:border-accent";

function Hint({ label }: { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="ml-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-line-2 type-mono text-[0.55rem] text-muted transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
          aria-label={label}
        >
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="whitespace-pre-line">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  const inner = (
    <>
      <span className="type-mono-sm text-bone-3">{children}</span>
      {hint ? <Hint label={hint} /> : null}
    </>
  );
  if (!htmlFor) {
    return <div className="mb-1.5 flex items-center">{inner}</div>;
  }
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center">
      {inner}
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
      className={fieldClass}
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
    <div className="relative">
      <select
        id={id}
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value as T)}
        className={`${fieldClass} appearance-none pr-8`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 type-mono-sm text-dim"
        aria-hidden
      >
        ▾
      </span>
    </div>
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
    <div>
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-3 border border-transparent px-1 py-2.5 text-left transition-colors hover:border-line hover:bg-glass"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="type-mono-sm text-bone transition-colors group-hover:text-accent">
            {title}
          </span>
          {hint ? <Hint label={hint} /> : null}
          {!open && summary ? (
            <span className="type-mono-sm text-dim truncate">{summary}</span>
          ) : null}
        </span>
        <span
          className="type-mono-sm text-dim transition-colors group-hover:text-accent"
          aria-hidden
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={id}
          className="pb-1 pt-1"
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
    return parts.length ? parts.join(" · ") : "off";
  })();

  const scaleSummary = `${scenario.requestsPerDay ?? 0}/day · ${scenario.users ?? 1}u`;

  return (
    <TooltipProvider>
    <div
      className="flex max-h-[100dvh] flex-col border border-line overflow-hidden"
      style={{ background: "rgba(15,15,18,0.55)" }}
    >
      {/* Identity strip */}
      <div className="shrink-0 border-b border-line px-5 py-3.5 md:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="flex items-center type-mono-sm text-bone">
            Token cost calculator
            <Hint label="Authoritative math runs on Looking Glass — change inputs and the backend recomputes." />
          </span>
          <p className="type-mono-sm text-dim">Verified {verifiedHuman}</p>
        </div>
      </div>

      {/* Presets — their own band */}
      <div className="shrink-0 border-b border-line px-5 py-3.5 md:px-6">
        <div className="mb-2.5 type-mono-sm text-dim">App-shaped presets</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const on = activePreset === p.id;
            return (
              <Tooltip key={p.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => applyPreset(p.id)}
                    aria-pressed={on}
                    className={`type-mono-sm px-3 py-1.5 border transition-colors ${
                      on
                        ? "border-accent text-accent bg-accent-soft"
                        : "border-line text-bone-3 hover:border-line-2 hover:text-bone hover:bg-glass"
                    }`}
                  >
                    {p.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start">
                  {p.blurb}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        {/* Controls */}
        <div className="min-h-0 overflow-y-auto border-b border-line px-5 py-5 md:border-b-0 md:border-r md:px-6 md:py-6">
          {/* Model — primary control */}
          <div className="mb-6">
            <FieldLabel hint="Rates are USD per 1M tokens (pay-as-you-go). Cache is the hit/read rate.">
              Model
            </FieldLabel>
            <ModelPicker
              value={scenario.modelId}
              onChange={(modelId) => patch({ modelId })}
            />
          </div>

          {/* Core token budget */}
          <div className="mb-2">
            <div className="mb-3 type-mono-sm text-dim">Request shape</div>
            <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <div>
                <FieldLabel
                  htmlFor={`${uid}-text-mode`}
                  hint="Words ≈ 0.75 words/token · chars ≈ 4 chars/token (English estimate)."
                >
                  Text as
                </FieldLabel>
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
              <div>
                <FieldLabel htmlFor={`${uid}-text-val`}>
                  {textMode === "tokens"
                    ? "Input tokens"
                    : textMode === "words"
                      ? "Words"
                      : "Characters"}
                </FieldLabel>
                <NumberInput
                  id={`${uid}-text-val`}
                  value={textValue}
                  onChange={(n) => setText(textMode, n)}
                  step={textMode === "tokens" ? 100 : 50}
                />
              </div>
              <div>
                <FieldLabel
                  htmlFor={`${uid}-cache`}
                  hint="Share of text tokens billed at the cache-hit rate."
                >
                  Cache hit %
                </FieldLabel>
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
              <div>
                <FieldLabel htmlFor={`${uid}-out`}>Output tokens</FieldLabel>
                <NumberInput
                  id={`${uid}-out`}
                  value={scenario.outputTokens}
                  onChange={(outputTokens) => patch({ outputTokens })}
                  step={50}
                />
              </div>
            </div>
          </div>

          <div className="my-4 rule" />

          <Collapse
            id={`${uid}-mods`}
            title="Modalities"
            hint="Image, audio, and video token counts are published approximations — not a tokenizer substitute."
            open={modsOpen}
            onToggle={() => setModsOpen((o) => !o)}
            summary={modsSummary}
          >
            <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor={`${uid}-img-n`}>Images</FieldLabel>
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
              <div>
                <FieldLabel htmlFor={`${uid}-img-sz`}>Image size</FieldLabel>
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
              <div>
                <FieldLabel htmlFor={`${uid}-audio`}>Audio (sec)</FieldLabel>
                <NumberInput
                  id={`${uid}-audio`}
                  value={scenario.audioSeconds ?? 0}
                  onChange={(audioSeconds) => patch({ audioSeconds })}
                  step={5}
                />
              </div>
              <div>
                <FieldLabel htmlFor={`${uid}-video`}>Video (sec)</FieldLabel>
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
              <div className="sm:col-span-2">
                <FieldLabel
                  htmlFor={`${uid}-vfmt`}
                  hint="Scales the base ~258 tokens/sec video rate."
                >
                  Video format
                </FieldLabel>
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
                    { value: "low", label: "Low (0.5×)" },
                    { value: "default", label: "Default (1×)" },
                    { value: "high", label: "High (1.5×)" },
                  ]}
                />
              </div>
            </div>
          </Collapse>

          <div className="my-1 rule" />

          <Collapse
            id={`${uid}-scale`}
            title="Monthly scale"
            hint="requests/day × users × 30."
            open={scaleOpen}
            onToggle={() => setScaleOpen((o) => !o)}
            summary={scaleSummary}
          >
            <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor={`${uid}-rpd`}>Requests / day</FieldLabel>
                <NumberInput
                  id={`${uid}-rpd`}
                  value={scenario.requestsPerDay ?? 0}
                  onChange={(requestsPerDay) => patch({ requestsPerDay })}
                  step={10}
                />
              </div>
              <div>
                <FieldLabel htmlFor={`${uid}-users`}>Users</FieldLabel>
                <NumberInput
                  id={`${uid}-users`}
                  value={scenario.users ?? 1}
                  onChange={(users) => patch({ users: Math.max(1, users) })}
                  min={1}
                />
              </div>
            </div>
          </Collapse>
        </div>

        {/* Results */}
        <div
          className="flex min-h-0 flex-col gap-5 overflow-y-auto px-5 py-5 md:px-6 md:py-6"
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
                <span className="type-numeral text-[2.35rem] leading-none text-bone md:text-[2.85rem]">
                  {formatCostUsd(result.costs.perRequestUsd)}
                </span>
                <div className="mt-2 type-mono-sm text-bone-3">
                  {result.model.name}
                </div>
              </div>

              <dl className="flex flex-col gap-2 type-mono-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Uncached in</dt>
                  <dd className="text-bone tabular-nums">
                    {formatCostUsd(result.costs.uncachedInputUsd)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Cached in</dt>
                  <dd className="text-bone tabular-nums">
                    {formatCostUsd(result.costs.cachedInputUsd)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-2">
                  <dt className="text-muted">Output</dt>
                  <dd className="text-bone tabular-nums">
                    {formatCostUsd(result.costs.outputUsd)}
                  </dd>
                </div>
              </dl>

              <p className="type-mono-sm text-muted leading-relaxed">
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
                <div className="mt-auto border-t border-line pt-5">
                  <span className="type-mono-sm">Monthly</span>
                  <div className="mt-2">
                    <span className="type-numeral text-[1.85rem] leading-none text-accent md:text-[2.2rem]">
                      {formatCostUsd(result.monthly.usd)}
                    </span>
                  </div>
                  <p className="mt-2 type-mono-sm text-dim">
                    {result.monthly.requests.toLocaleString("en-US")} req · 30d
                  </p>
                </div>
              ) : null}

              {result.notes.length > 0 ? (
                <p className="flex items-center type-mono-sm text-dim">
                  {result.notes.length} note
                  {result.notes.length === 1 ? "" : "s"}
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
    </TooltipProvider>
  );
}
