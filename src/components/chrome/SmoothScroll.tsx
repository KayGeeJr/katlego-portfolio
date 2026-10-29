"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scroll, synced to GSAP's ticker. Off for reduced motion and touch-first devices (native scroll is better there). */
export default function SmoothScroll() {
  useEffect(() => {
    // native scroll is better on touch; Lenis only for mouse/trackpad
    if (prefersReducedMotion() || matchMedia("(pointer: coarse)").matches) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, syncTouch: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // smooth in-page anchor links
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!a || e.metaKey || e.ctrlKey) return;
      const hash = a.getAttribute("href")!.replace(/^\//, "");
      if (location.pathname !== "/" && a.getAttribute("href")!.startsWith("/#")) return;
      const target = hash === "#" || hash === "#top" ? 0 : (document.querySelector(hash) as HTMLElement | null);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement | number, { offset: 0, duration: 1.4 });
      history.replaceState(null, "", hash === "#top" ? location.pathname : hash);
      if (target instanceof HTMLElement) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}
