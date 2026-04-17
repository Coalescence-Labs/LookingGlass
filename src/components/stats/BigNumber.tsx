"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { easeExpo } from "@/lib/motion";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
  format?: (n: number) => string;
};

const defaultFormat = (n: number) => Math.round(n).toLocaleString("en-US");

export function BigNumber({
  value,
  suffix,
  className,
  duration = 2.2,
  format = defaultFormat,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = reduce ? 0 : duration * 1000;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = dur === 0 ? 1 : Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, ease: easeExpo }}
    >
      <span className="type-numeral">{format(n)}</span>
      {suffix && <span className="type-numeral">{suffix}</span>}
    </motion.span>
  );
}
