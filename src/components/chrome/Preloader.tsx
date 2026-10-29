"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { generatePattern, toneVar } from "@/lib/pattern";

declare global {
  interface Window {
    __knIntro?: boolean;
  }
}

export function onIntro(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__knIntro) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("kn:intro", h, { once: true });
  return () => window.removeEventListener("kn:intro", h);
}

function done() {
  window.__knIntro = true;
  window.dispatchEvent(new Event("kn:intro"));
}

const shapes = generatePattern({ cols: 7, seed: 11, allow: ["steps", "diamond", "frame", "chevron"] });

/**
 * ≤2s intro: a band of stepped geometry draws in while a counter runs, then the
 * curtain lifts on the dusk. Shown once per session; skipped for reduced motion.
 * The inline head script decides visibility before first paint (no flash).
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || html.classList.contains("preloaded")) {
      done();
      return;
    }
    const paths = el.querySelectorAll("path");
    const n = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        html.classList.add("preloaded");
        try { sessionStorage.setItem("kn-intro", "1"); } catch {}
      },
    });
    tl.to(paths, { strokeDashoffset: 0, duration: 1.0, stagger: 0.03, ease: "expo.out" }, 0)
      .to(n, { v: 100, duration: 1.15, ease: "power2.inOut", onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, "0"); } }, 0)
      .to(el.querySelector(".pl-inner"), { yPercent: -30, opacity: 0, duration: 0.5, ease: "power3.in" }, 1.2)
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power3.inOut", onStart: done }, 1.25);
    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={root} className="preloader fixed inset-0 z-[80] items-center justify-center bg-[#16120e] text-[#efe6d8]" style={{ clipPath: "inset(0 0 0 0)" }} aria-hidden="true">
      <div className="pl-inner flex w-[min(80vw,520px)] flex-col gap-6">
        <svg viewBox="0 0 7 1" className="w-full">
          {shapes.map((s, i) => (
            <path key={i} d={s.d} pathLength={1} fill="none" stroke={s.tone === "fg" ? "#efe6d8" : toneVar[s.tone]} strokeWidth={0.03} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
          ))}
        </svg>
        <div className="flex items-baseline justify-between t-data">
          <span>Highveld to interface</span>
          <span ref={count}>000</span>
        </div>
      </div>
    </div>
  );
}
