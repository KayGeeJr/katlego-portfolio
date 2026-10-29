"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type Tag = "h1" | "h2" | "h3" | "p";

/** Heading whose lines rise out of a mask when it scrolls into view. Plain text without JS / with reduced motion. */
export default function SplitHeading({ as = "h2", className = "", children, id }: { as?: Tag; className?: string; children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;
    const run = () => {
      split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line" });
      tween = gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    };
    // Split lazily, just before the heading scrolls in (keeps start-up main-thread work low),
    // and only after fonts load so line breaks are measured with the real face.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        (document.fonts?.ready ?? Promise.resolve()).then(run);
      },
      { rootMargin: "0px 0px 25% 0px" },
    );
    // headings already on screen at load animate immediately
    io.observe(el);
    return () => {
      io.disconnect();
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, []);
  const Comp = as as React.ElementType;
  return (
    <Comp ref={ref} id={id} className={className}>
      {children}
    </Comp>
  );
}
