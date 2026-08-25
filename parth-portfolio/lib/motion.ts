import type Lenis from "lenis";

/**
 * Shared motion vocabulary for the whole site.
 * Keep every GSAP animation sourced from here so timing feels cohesive.
 */

export const EASE = {
  /** default entrances */
  out: "power3.out",
  /** UI moves that need symmetry (accordions, overlays) */
  inOut: "power3.inOut",
  /** SVG line drawing */
  draw: "power1.inOut",
} as const;

export const DUR = {
  fast: 0.5,
  base: 0.9,
  slow: 1.6,
} as const;

/** Standard stagger for sibling reveals */
export const STAGGER = 0.08;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

declare global {
  interface Window {
    __lenis?: Lenis | undefined;
  }
}
