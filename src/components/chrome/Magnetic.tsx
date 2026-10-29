"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Pulls its child towards the pointer while hovered and springs back on leave. */
export default function Magnetic({ children, strength = 0.35, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = el.current;
    if (!node || prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const xTo = gsap.quickTo(node, "x", { duration: 0.6, ease: "expo.out" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.6, ease: "expo.out" });
    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      gsap.to(node, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
    return () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <span ref={el} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
