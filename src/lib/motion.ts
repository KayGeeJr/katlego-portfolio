/** One motion system for the whole site. Mirrors the CSS custom properties in globals.css. */
export const EASE = {
  out: "expo.out", // reveals, entrances: cubic-bezier(0.16, 1, 0.3, 1)
  inOut: "power3.inOut", // curtains, transitions: ~cubic-bezier(0.65, 0, 0.35, 1)
  loop: "sine.inOut", // ambient loops
  spring: "back.out(1.4)", // magnetic release
} as const;

export const DUR = { quick: 0.18, base: 0.45, slow: 0.9, curtain: 0.7 } as const;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Heuristic for devices that should get the CSS hero instead of WebGL. */
export function isLowPower() {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return true;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 3) return true;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return true;
  return false;
}

/** Run after the page settles (keeps scroll-driven setup out of the critical start-up window). */
export function whenIdle(cb: () => void, timeout = 2000) {
  if (typeof window === "undefined") return () => {};
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (n: number) => void };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const t = setTimeout(cb, 300);
  return () => clearTimeout(t);
}
