"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { getDefinition } from "@/lib/definitions";

type Props = {
  children: ReactNode;
  lookup?: string;
};

export function Term({ children, lookup }: Props) {
  const key = lookup ?? (typeof children === "string" ? children : "");
  const def = getDefinition(key);

  if (!def) return <>{children}</>;

  return (
    <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="cursor-help border-b border-dotted border-muted bg-transparent p-0 font-[inherit] text-[inherit] leading-[inherit] transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
          >
            {children}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            align="center"
            sideOffset={10}
            collisionPadding={16}
            avoidCollisions
            className="z-50 block w-72 border border-line-2 px-4 py-3 backdrop-blur-md data-[state=delayed-open]:animate-[tooltip-in_220ms_var(--ease-expo)] data-[state=instant-open]:animate-[tooltip-in_180ms_var(--ease-expo)]"
            style={{
              background: "rgba(15, 15, 18, 0.94)",
              boxShadow: "0 14px 34px -14px rgba(0, 0, 0, 0.75)",
            }}
          >
            <span className="type-mono-sm block text-accent">{def.term}</span>
            <span className="mt-2 block text-[0.9rem] leading-[1.55] text-bone-2">
              {def.body}
            </span>
            {def.source && (
              <a
                href={def.source.href}
                target="_blank"
                rel="noreferrer"
                className="type-mono-sm mt-3 block text-bone-3 underline decoration-line-2 underline-offset-4 hover:text-accent hover:decoration-accent"
              >
                {def.source.label} ↗
              </a>
            )}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
