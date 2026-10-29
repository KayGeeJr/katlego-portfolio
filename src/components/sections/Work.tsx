"use client";

import { useEffect, useRef } from "react";
import { publicProjects, groupLabel, clean, type Project } from "@/data/projects";
import { getCapture } from "@/lib/captures";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import TransitionLink from "@/components/chrome/TransitionLink";
import ProjectMedia from "@/components/work/ProjectMedia";

function Card({ p, index }: { p: Project; index: number }) {
  const video = getCapture(p.slug)?.video;
  const vid = useRef<HTMLVideoElement>(null);
  const play = () => {
    const v = vid.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  };
  const stop = () => {
    const v = vid.current;
    if (!v) return;
    v.pause();
  };
  return (
    <li className="work-card w-[82vw] shrink-0 snap-start sm:w-[60vw] md:w-[44vw] xl:w-[36vw]">
      <TransitionLink href={`/project/${p.slug}`} data-cursor="View" className="group block" onPointerEnter={play} onPointerLeave={stop} onFocus={play} onBlur={stop}>
        <div className="relative aspect-[16/10] overflow-hidden border border-line bg-bg-raised">
          <div className="h-full w-full transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]">
            <ProjectMedia project={p} sizes="(min-width: 1280px) 36vw, (min-width: 768px) 44vw, 82vw" />
          </div>
          {video && (
            <video ref={vid} muted loop playsInline preload="none" poster={video.poster} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
              <source src={video.webm} type="video/webm" />
              <source src={video.mp4} type="video/mp4" />
            </video>
          )}
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <h3 className="t-h3">{p.name}</h3>
          <span className="t-data text-muted">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p className="mt-2 max-w-[44ch] text-[0.9375rem] text-muted">{clean(p.tagline)}</p>
      </TransitionLink>
    </li>
  );
}

export default function Work() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - el.clientWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      const bar = section.current!.querySelector<HTMLElement>(".work-progress");
      const st = tween.scrollTrigger!;
      const upd = () => bar && (bar.style.transform = `scaleX(${st.progress})`);
      st.vars.onUpdate = upd;
      ScrollTrigger.refresh();
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  const client = publicProjects.filter((p) => p.group === "client");
  const concept = publicProjects.filter((p) => p.group === "concept");

  return (
    <section ref={section} id="work" aria-labelledby="work-title" className="relative overflow-hidden border-t border-line py-[clamp(4rem,8vw,6rem)] md:flex md:h-[100svh] md:flex-col md:justify-center md:py-0">
      <div className="wrap mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
        <div>
          <p className="section-tag mb-4">
            <span aria-hidden="true" className="inline-block h-2 w-2 bg-ochre" />
            Selected work
          </p>
          <h2 id="work-title" className="t-h2">Sites I&apos;ve shipped.</h2>
        </div>
        <TransitionLink href="/projects" className="btn">
          All {publicProjects.length} projects
        </TransitionLink>
      </div>

      <ul ref={track} className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-4 md:snap-none md:gap-10 md:overflow-visible" aria-label="Projects">
        <li className="flex w-[38vw] shrink-0 snap-start flex-col justify-end border-l border-line pl-4 sm:w-[30vw] md:w-[18vw]" aria-hidden="true">
          <p className="t-data text-ochre">{client.length}</p>
          <p className="t-h3 mt-2">{groupLabel.client}</p>
        </li>
        {client.map((p, i) => (
          <Card key={p.slug} p={p} index={i} />
        ))}
        <li className="flex w-[38vw] shrink-0 snap-start flex-col justify-end border-l border-line pl-4 sm:w-[30vw] md:w-[18vw]" aria-hidden="true">
          <p className="t-data text-ochre">{concept.length}</p>
          <p className="t-h3 mt-2">{groupLabel.concept}</p>
        </li>
        {concept.map((p, i) => (
          <Card key={p.slug} p={p} index={client.length + i} />
        ))}
        <li className="flex w-[70vw] shrink-0 snap-start items-center sm:w-[40vw] md:w-[28vw]">
          <TransitionLink href="/projects" data-cursor="Index" className="group flex aspect-square w-full flex-col justify-between border border-line p-8 transition-colors duration-500 hover:border-accent">
            <span className="t-data text-muted">Index</span>
            <span className="t-h2">See everything, side by side.</span>
          </TransitionLink>
        </li>
      </ul>

      <div className="wrap mt-8 hidden md:block" aria-hidden="true">
        <div className="h-px w-full bg-line">
          <div className="work-progress h-px origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </section>
  );
}
