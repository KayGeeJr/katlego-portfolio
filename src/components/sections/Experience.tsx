"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "@/data/site";
import SectionHead from "@/components/ui/SectionHead";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function Experience() {
  const line = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!line.current || prefersReducedMotion()) return;
    const t = gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: line.current.parentElement, start: "top 70%", end: "bottom 60%", scrub: true } });
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
    };
  }, []);

  return (
    <section id="experience" aria-labelledby="experience-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="Experience" id="experience-title" title="From intern to the payments stack." />
        <div className="relative lg:ml-[25%]">
          <div aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-[15px]" />
          <div ref={line} aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-dusk md:left-[15px]" />
          <ol className="flex flex-col gap-16">
            {experience.map((r, i) => {
              const isOpen = !!open[i];
              const shown = isOpen ? r.points : r.points.slice(0, 3);
              return (
                <li key={r.company} className="relative grid gap-4 pl-12 md:pl-16" data-reveal>
                  <span aria-hidden="true" className="absolute left-0 top-1 grid h-6 w-6 place-items-center bg-bg md:h-8 md:w-8">
                    <span className="h-3 w-3 rotate-45 border-2 border-dusk bg-bg md:h-4 md:w-4" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="t-data text-ochre">
                      {String(i + 1).padStart(2, "0")} · {r.period}
                    </p>
                    <p className="text-[0.875rem] text-muted">{r.stack}</p>
                  </div>
                  <h3 className="t-h3 !text-[clamp(1.5rem,2.6vw,2.25rem)]">{r.title}</h3>
                  <p className="text-[1.0625rem]">
                    {r.company}, <span className="text-muted">{r.place}</span>
                  </p>
                  <ul id={`exp-${i}`} className="mt-2 grid max-w-[68ch] gap-3 text-muted">
                    {shown.map((p) => (
                      <li key={p} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-line-strong">
                        {p}
                      </li>
                    ))}
                  </ul>
                  {r.points.length > 3 && (
                    <button type="button" aria-expanded={isOpen} aria-controls={`exp-${i}`} onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))} className="link-u justify-self-start text-[0.9375rem] font-semibold">
                      {isOpen ? "Show less" : `Show all ${r.points.length}`}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
