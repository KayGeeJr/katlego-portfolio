"use client";

import { useEffect, useRef, useState } from "react";
import { publicProjects, groupLabel, clean, knownStack, type ProjectGroup } from "@/data/projects";
import TransitionLink from "@/components/chrome/TransitionLink";
import ProjectMedia from "@/components/work/ProjectMedia";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const filters: { key: "all" | ProjectGroup; label: string }[] = [
  { key: "all", label: "All" },
  { key: "client", label: groupLabel.client },
  { key: "concept", label: groupLabel.concept },
];

/** Index list with a preview that follows the cursor on fine pointers; inline thumbnails on touch. */
export default function ProjectIndex() {
  const [filter, setFilter] = useState<"all" | ProjectGroup>("all");
  const [hover, setHover] = useState<string | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const list = filter === "all" ? publicProjects : publicProjects.filter((p) => p.group === filter);

  useEffect(() => {
    const el = preview.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "expo.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "expo.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX + 24);
      y(e.clientY - 120);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)} className={`chip !py-2 transition-colors ${filter === f.key ? "border-accent bg-accent text-[var(--accent-ink)]" : "hover:border-line-strong"}`}>
            {f.label}
            <span className="t-data">{f.key === "all" ? publicProjects.length : publicProjects.filter((p) => p.group === f.key).length}</span>
          </button>
        ))}
      </div>

      <ol className="border-t border-line" onPointerLeave={() => setHover(null)}>
        {list.map((p) => {
          const i = publicProjects.indexOf(p);
          return (
            <li key={p.slug} className="border-b border-line">
              <TransitionLink
                href={`/project/${p.slug}`}
                onPointerEnter={() => setHover(p.slug)}
                onFocus={() => setHover(p.slug)}
                data-cursor="Open"
                className="group grid grid-cols-[3rem_1fr] items-center gap-x-4 gap-y-3 py-6 transition-[padding] duration-500 [transition-timing-function:var(--ease-out)] md:grid-cols-[4rem_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,14rem)] md:py-8 md:hover:pl-4"
              >
                <span className="t-data text-ochre">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-h3 !text-[clamp(1.375rem,3vw,2.5rem)] transition-colors duration-300 group-hover:text-accent">{p.name}</span>
                <span className="col-start-2 text-[0.9375rem] text-muted md:col-start-auto">{clean(p.tagline)}</span>
                <span className="col-start-2 hidden text-[0.875rem] text-muted md:col-start-auto md:block md:text-right">{knownStack(p).join(", ") || groupLabel[p.group]}</span>
                <span className="col-span-2 mt-2 block aspect-[16/10] overflow-hidden border border-line md:hidden">
                  <ProjectMedia project={p} sizes="90vw" />
                </span>
              </TransitionLink>
            </li>
          );
        })}
      </ol>

      <div ref={preview} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[340px] [@media(hover:hover)_and_(pointer:fine)]:block">
        {publicProjects.map((p) => (
          <div
            key={p.slug}
            className="absolute inset-x-0 top-0 aspect-[16/10] overflow-hidden border border-line-strong bg-bg-raised transition-[opacity,transform,clip-path] duration-500 [transition-timing-function:var(--ease-out)]"
            style={{ opacity: hover === p.slug ? 1 : 0, transform: hover === p.slug ? "scale(1) rotate(-2deg)" : "scale(.9) rotate(0deg)", clipPath: hover === p.slug ? "inset(0)" : "inset(50% 0 50% 0)" }}
          >
            <ProjectMedia project={p} sizes="340px" />
          </div>
        ))}
      </div>
    </>
  );
}
