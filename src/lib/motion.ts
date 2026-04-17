import type { Transition, Variants } from "motion/react";

export const easeExpo = [0.22, 1, 0.36, 1] as const;
export const easeQuart = [0.25, 1, 0.5, 1] as const;
export const easeQuint = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const stagger = (gap = 0.06, delay = 0): Transition => ({
  staggerChildren: gap,
  delayChildren: delay,
});

export const baseTransition: Transition = {
  duration: 0.9,
  ease: easeExpo,
};

export const quickTransition: Transition = {
  duration: 0.5,
  ease: easeExpo,
};
