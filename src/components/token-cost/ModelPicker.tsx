"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  PRICING_SNAPSHOT,
  type ModelPricing,
} from "@/lib/token-cost";

const FAMILY_LABEL: Record<ModelPricing["family"], string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google",
  deepseek: "DeepSeek",
  meta: "Meta",
  qwen: "Qwen",
  moonshot: "Moonshot",
  mistral: "Mistral",
};

const FAMILY_ORDER: ModelPricing["family"][] = [
  "anthropic",
  "openai",
  "google",
  "deepseek",
  "meta",
  "qwen",
  "moonshot",
  "mistral",
];

function rateLine(m: ModelPricing): string {
  const cache =
    m.priceCachedInput != null ? ` · cache $${m.priceCachedInput}` : "";
  return `$${m.priceInput}${cache} · $${m.priceOutput}`;
}

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export function ModelPicker({ value, onChange }: Props) {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected =
    PRICING_SNAPSHOT.models.find((m) => m.id === value) ??
    PRICING_SNAPSHOT.models[0];

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const groups = FAMILY_ORDER.map((family) => ({
    family,
    models: PRICING_SNAPSHOT.models.filter((m) => m.family === family),
  })).filter((g) => g.models.length > 0);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={uid}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-end justify-between gap-4 border-b border-line pb-3 text-left transition-colors hover:border-line-2"
      >
        <span className="min-w-0">
          <span className="block truncate font-serif text-[1.35rem] leading-none text-bone md:text-[1.5rem]">
            {selected.name}
          </span>
          <span className="mt-2 block type-mono-sm text-dim">
            {FAMILY_LABEL[selected.family]} · {rateLine(selected)}
            <span className="text-muted"> / 1M</span>
          </span>
        </span>
        <span
          className="mb-0.5 type-mono-sm text-muted transition-colors group-hover:text-accent"
          aria-hidden
        >
          {open ? "Close" : "Change"}
        </span>
      </button>

      {open ? (
        <ul
          id={`${uid}-list`}
          role="listbox"
          aria-labelledby={uid}
          className="absolute left-0 right-0 z-20 mt-0 max-h-80 overflow-y-auto border border-line bg-ink-2"
        >
          {groups.map(({ family, models }) => (
            <li key={family} role="presentation">
              <div className="sticky top-0 border-b border-line bg-ink-3/95 px-4 py-2 type-mono-sm text-dim backdrop-blur-sm">
                {FAMILY_LABEL[family]}
              </div>
              <ul role="group" aria-label={FAMILY_LABEL[family]}>
                {models.map((m) => {
                  const on = m.id === selected.id;
                  return (
                    <li key={m.id} role="option" aria-selected={on}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(m.id);
                          setOpen(false);
                        }}
                        className={`grid w-full grid-cols-[1fr_auto] items-baseline gap-4 border-b border-line px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-glass ${
                          on ? "bg-accent-soft/40" : ""
                        }`}
                      >
                        <span>
                          <span
                            className={`block font-serif text-[1.1rem] leading-tight ${
                              on ? "text-accent" : "text-bone"
                            }`}
                          >
                            {m.name}
                          </span>
                          <span className="mt-1 block type-mono-sm text-dim">
                            {rateLine(m)}
                            <span className="text-muted"> / 1M</span>
                          </span>
                        </span>
                        {on ? (
                          <span className="type-mono-sm text-accent">Selected</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
