"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion, whenIdle } from "@/lib/motion";

/**
 * Scroll effects for server-rendered sections, attached by selector after the page is idle.
 * Keeping the sections themselves as server components means far less hydration work.
 *  - [data-fx="journey"]   draws the journey legs and lights the stops
 *  - [data-fx="timeline"]  fills the experience line
 *  - [data-fx="count"]     counts a number up (data-count, data-suffix)
 *  - [data-fx="read"]      brightens words as you read
 */
export default function ScrollFx() {
  const path = usePathname();
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const splits: SplitText[] = [];
    const cancel = whenIdle(() => {
      ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>('[data-fx="journey"]').forEach((el) => {
          const paths = el.querySelectorAll<SVGPathElement>(".leg");
          const stops = el.querySelectorAll<SVGGElement>(".stop");
          gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(stops, { opacity: 0.25 });
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 40%", scrub: 0.6 } });
          tl.to(stops[0], { opacity: 1, duration: 0.2 });
          paths.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, duration: 1, ease: "none" }).to(stops[i + 1], { opacity: 1, duration: 0.2 }, "<0.85"));
        });

        document.querySelectorAll<HTMLElement>('[data-fx="timeline"]').forEach((el) => {
          gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top 70%", end: "bottom 60%", scrub: true } });
        });

        document.querySelectorAll<HTMLElement>('[data-fx="count"]').forEach((n) => {
          const to = Number(n.dataset.count);
          const suffix = n.dataset.suffix ?? "";
          const fmt = (v: number) => (to >= 1000 ? Math.round(v).toLocaleString("en-ZA").replace(/[,\s ]/g, " ") : String(Math.round(v))) + suffix;
          const o = { v: 0 };
          n.textContent = fmt(0);
          gsap.to(o, { v: to, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 85%", once: true }, onUpdate: () => (n.textContent = fmt(o.v)) });
        });
      });

      // word highlight is split lazily, when it approaches the viewport
      document.querySelectorAll<HTMLElement>('[data-fx="read"]').forEach((el) => {
        const io = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          (document.fonts?.ready ?? Promise.resolve()).then(() => {
            const split = new SplitText(el, { type: "words", aria: "none" });
            splits.push(split);
            ctx?.add(() => {
              gsap.fromTo(split.words, { opacity: 0.5 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
            });
          });
        }, { rootMargin: "0px 0px 30% 0px" });
        io.observe(el);
      });
    });
    return () => {
      cancel();
      ctx?.revert();
      splits.forEach((s) => s.revert());
    };
  }, [path]);
  return null;
}
