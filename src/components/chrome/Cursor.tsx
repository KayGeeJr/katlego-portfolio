"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Custom cursor: a dot that tracks exactly and a ring that follows with lag.
 * Elements with data-cursor="label" grow the ring and show the label.
 * Only for fine pointers; touch and reduced-motion users keep the system cursor.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    document.documentElement.classList.add("has-cursor");
    const d = dot.current!, r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "expo.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "expo.out" });
    let current: Element | null = null;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      gsap.to([d, r], { opacity: 1, duration: 0.3, overwrite: "auto" });
      const t = (e.target as Element).closest?.("[data-cursor], a, button, [role=button], input, label, select, textarea");
      if (t === current) return;
      current = t;
      const text = t?.getAttribute("data-cursor") ?? "";
      const interactive = !!t;
      const big = text && text !== "native";
      if (label.current) label.current.textContent = big ? text : "";
      gsap.to(r, { width: big ? 88 : interactive ? 44 : 30, height: big ? 88 : interactive ? 44 : 30, backgroundColor: big ? "var(--accent)" : "rgba(0,0,0,0)", borderColor: interactive ? "var(--accent)" : "var(--fg)", duration: 0.45, ease: "expo.out" });
      gsap.to(d, { scale: big ? 0 : interactive ? 0.5 : 1, duration: 0.3 });
    };
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const down = () => gsap.to(r, { scale: 0.85, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.5, ease: "back.out(2)" });
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} className="fixed left-0 top-0 grid h-[30px] w-[30px] place-items-center rounded-full border border-fg/60 opacity-0">
        <span ref={label} className="text-[0.75rem] font-semibold text-[var(--accent-ink)]" />
      </div>
      <div ref={dot} className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-accent opacity-0" />
    </div>
  );
}
