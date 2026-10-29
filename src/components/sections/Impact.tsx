"use client";

import { useEffect, useRef } from "react";
import { impact } from "@/data/site";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import SectionHead from "@/components/ui/SectionHead";

export default function Impact() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const to = Number(n.dataset.count);
        const suffix = n.dataset.suffix ?? "";
        const fmt = (v: number) => (to >= 1000 ? Math.round(v).toLocaleString("en-ZA").replace(/,/g, " ") : String(Math.round(v))) + suffix;
        const o = { v: 0 };
        n.textContent = fmt(0);
        gsap.to(o, { v: to, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 85%", once: true }, onUpdate: () => (n.textContent = fmt(o.v)) });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="impact" aria-labelledby="impact-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="Impact" id="impact-title" title="The numbers I can stand behind." />
        <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {impact.map((m) => (
            <li key={m.label} className="flex min-h-[15rem] flex-col justify-between gap-10 bg-bg p-6 md:p-10">
              <span className="font-display text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.85] tracking-[-0.04em] tabular-nums" data-count={m.value} data-suffix={m.suffix} aria-hidden="true">
                {"display" in m ? m.display : `${m.value}${m.suffix}`}
              </span>
              <p className="max-w-[32ch] text-[1.0625rem] text-muted">
                <span className="sr-only">{"display" in m ? m.display : `${m.value}${m.suffix}`} </span>
                {m.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
