"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeExpo } from "@/lib/motion";

const SPINES = [
  { color: "#8A6A3B", h: 0.94, w: 14 },
  { color: "#4B5E5A", h: 1.0, w: 12 },
  { color: "#C6A56C", h: 0.88, w: 16 },
  { color: "#2F2A24", h: 0.96, w: 11 },
  { color: "#6A4A32", h: 0.92, w: 15 },
  { color: "#3E4E40", h: 1.0, w: 13 },
  { color: "#A88253", h: 0.9, w: 14 },
  { color: "#1C1A17", h: 0.98, w: 12 },
];

export function BookSpines({ count = 8 }: { count?: number }) {
  const reduce = useReducedMotion();
  const spines = Array.from({ length: count }, (_, i) => SPINES[i % SPINES.length]);

  return (
    <div
      className="flex h-40 items-end gap-1 overflow-hidden rounded-sm border-b border-line"
      aria-hidden
    >
      {spines.map((s, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            duration: 0.9,
            delay: 0.1 + i * 0.06,
            ease: easeExpo,
          }}
          style={{
            backgroundColor: s.color,
            width: `${s.w * 3}px`,
            height: `${s.h * 100}%`,
          }}
          className="relative border-r border-black/20"
        >
          <span
            className="absolute inset-x-0 top-2 text-center font-serif text-[0.55rem] italic"
            style={{ color: "rgba(236, 232, 222, 0.25)" }}
          >
            •
          </span>
        </motion.div>
      ))}
    </div>
  );
}
