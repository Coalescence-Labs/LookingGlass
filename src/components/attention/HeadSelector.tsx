"use client";

type Head = { id: number; label: string };

type Props = {
  heads: Head[];
  activeId: number;
  onSelect: (id: number) => void;
};

export function HeadSelector({ heads, activeId, onSelect }: Props) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Choose an attention head"
    >
      {heads.map((h) => {
        const active = h.id === activeId;
        return (
          <button
            key={h.id}
            type="button"
            onClick={() => onSelect(h.id)}
            aria-pressed={active}
            className={`type-mono-sm border px-3 py-2 transition-colors ${
              active
                ? "border-accent text-accent"
                : "border-line bg-glass text-bone-3 hover:border-accent hover:text-accent"
            }`}
          >
            {h.label}
          </button>
        );
      })}
    </div>
  );
}
