"use client";

import { useEffect, useRef } from "react";
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
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || html.classList.contains("preloaded")) {
      done();
      return;
    }
    // Native Web Animations: no animation library on the critical path.
    const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
    const anims: Animation[] = [];
    el.querySelectorAll("path").forEach((p, i) =>
      anims.push(p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1000, delay: i * 30, easing: ease, fill: "forwards" })),
    );
    const start = performance.now();
    let raf = 0;
    const count = () => {
      const t = Math.min(1, (performance.now() - start) / 1150);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      if (countRef.current) countRef.current.textContent = String(Math.round(e * 100)).padStart(3, "0");
      if (t < 1) raf = requestAnimationFrame(count);
    };
    raf = requestAnimationFrame(count);
    const inner = el.querySelector<HTMLElement>(".pl-inner")!;
    anims.push(inner.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(-30%)", opacity: 0 }], { duration: 500, delay: 1200, easing: "cubic-bezier(0.55, 0, 1, 0.45)", fill: "forwards" }));
    const t1 = setTimeout(done, 1250);
    const lift = el.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: 700, delay: 1250, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
    anims.push(lift);
    lift.finished
      .then(() => {
        html.classList.add("preloaded");
        try { sessionStorage.setItem("kn-intro", "1"); } catch {}
      })
      .catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      anims.forEach((a) => a.cancel());
    };
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
          <span ref={countRef}>000</span>
        </div>
      </div>
    </div>
  );
}
