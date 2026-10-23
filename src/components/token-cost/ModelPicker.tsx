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

function rateLine(m: ModelPricing): string {
  const cache =
    m.priceCachedInput != null ? ` · cache $${m.priceCachedInput}` : "";
  return `$${m.priceInput}${cache} · $${m.priceOutput} / 1M`;
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

  // Group models by family for scanability
  const groups = PRICING_SNAPSHOT.models.reduce(
    (acc, m) => {
      (acc[m.family] ??= []).push(m);
      return acc;
    },
    {} as Partial<Record<ModelPricing["family"], ModelPricing[]>>,
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={uid}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between gap-3 border border-line bg-ink-3 px-3 py-2.5 text-left transition-colors hover:border-line-2 hover:bg-ink-4 focus-visible:border-accent"
      >
        <span className="min-w-0">
          <span className="block truncate font-serif text-[1.05rem] text-bone leading-tight">
            {selected.name}
          </span>
          <span className="mt-0.5 block type-mono-sm text-dim truncate">
            {FAMILY_LABEL[selected.family]} · {rateLine(selected)}
          </span>
        </span>
        <span
          className="type-mono-sm text-muted transition-colors group-hover:text-accent"
          aria-hidden
        >
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open ? (
        <ul
          id={`${uid}-list`}
          role="listbox"
          aria-labelledby={uid}
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto border border-line-2 bg-ink-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
        >
          {(Object.keys(groups) as ModelPricing["family"][]).map((family) => (
            <li key={family} role="presentation">
              <div className="sticky top-0 border-b border-line bg-ink-3 px-3 py-1.5 type-mono-sm text-dim">
                {FAMILY_LABEL[family]}
              </div>
              <ul role="group" aria-label={FAMILY_LABEL[family]}>
                {groups[family]!.map((m) => {
                  const on = m.id === selected.id;
                  return (
                    <li key={m.id} role="option" aria-selected={on}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(m.id);
                          setOpen(false);
                        }}
                        className={`flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent-soft ${
                          on ? "bg-glass" : ""
                        }`}
                      >
                        <span className="min-w-0">
                          <span
                            className={`block truncate text-[0.95rem] ${
                              on ? "text-accent" : "text-bone"
                            }`}
                          >
                            {m.name}
                          </span>
                          <span className="mt-0.5 block type-mono-sm text-dim">
                            {rateLine(m)}
                          </span>
                        </span>
                        {on ? (
                          <span className="type-mono-sm text-accent" aria-hidden>
                            ●
                          </span>
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
