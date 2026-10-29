"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/** Re-mounts on every navigation: lifts the curtain if a TransitionLink dropped it, and resets scroll. */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const curtain = document.querySelector<HTMLElement>(".curtain");
    if (curtain?.dataset.state === "covered") {
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      gsap.to(curtain, {
        yPercent: -100, duration: 0.7, ease: "power3.inOut", delay: 0.05,
        onComplete: () => {
          gsap.set(curtain, { yPercent: 100 });
          curtain.dataset.state = "";
        },
      });
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, []);
  return <>{children}</>;
}
