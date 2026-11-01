"use client";

import type { ComponentProps } from "react";
import { trackOutboundClick } from "@/lib/analytics";

type Props = Omit<ComponentProps<"a">, "target" | "rel"> & {
  href: string;
};

export function SourceOutboundLink({ href, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        trackOutboundClick(href);
        onClick?.(e);
      }}
    />
  );
}
