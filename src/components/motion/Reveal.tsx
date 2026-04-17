"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
  style?: CSSProperties;
};

export function Reveal({
  children,
  delay = 0,
  y = 22,
  duration = 0.9,
  className,
  once = true,
  threshold = 0.05,
  style,
}: RevealProps) {
  const durationMs = duration * 1000;
  const delayMs = delay * 1000;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Above-the-fold elements: trigger immediately on mount so content never stays hidden.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateY(${y}px)`,
        transition: `opacity ${durationMs}ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
