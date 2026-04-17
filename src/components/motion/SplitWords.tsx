"use client";

import { useEffect, useState } from "react";

type SplitWordsProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
};

export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.04,
  duration = 0.95,
}: SplitWordsProps) {
  const durationMs = duration * 1000;
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-baseline pb-[0.08em]"
        >
          <span
            className={`inline-block ${wordClassName ?? ""}`}
            style={{
              transform: visible ? "translateY(0)" : "translateY(105%)",
              transition: `transform ${durationMs}ms cubic-bezier(0.22,1,0.36,1) ${
                (delay + i * stagger) * 1000
              }ms`,
              willChange: "transform",
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
