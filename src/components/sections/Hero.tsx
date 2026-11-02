"use client";

import { useEffect, useRef } from "react";
import HeroFallback from "@/components/hero/HeroFallback";
import LazyShader from "@/components/hero/LazyShader";
import Clock from "@/components/chrome/Clock";
import { onIntro } from "@/components/chrome/Preloader";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { isStudio } from "@/lib/variant";
import { studioHero } from "@/data/studio";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const scroll = useRef(0);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // the sun sets as you scroll out of the hero
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (st) => (scroll.current = st.progress),
      });
      if (reduce) return;
      gsap.to(".hero-copy", { yPercent: -18, ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true } });
    }, section);

    let split: SplitText | null = null;
    const off = onIntro(() => {
      if (reduce || !title.current) {
        gsap.set(".hero-fade", { opacity: 1 });
        return;
      }
      split = new SplitText(title.current, { type: "chars,lines", mask: "lines", charsClass: "hero-char" });
      gsap.from(split.chars, { yPercent: 110, duration: 1.3, stagger: 0.035, ease: "expo.out" });
      gsap.fromTo(".hero-fade", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.45, ease: "expo.out" });
    });
    return () => {
      off();
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} id="top" data-header-dark aria-labelledby="hero-title" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[#16120e] text-[#efe6d8]">
      <HeroFallback />
      <LazyShader className="absolute inset-0" scrollRef={scroll} trackRef={section} />

      <div className="hero-copy wrap relative z-10 flex h-full flex-col pb-6 pt-24 sm:pb-8">
        <div className="hero-fade flex justify-end">
          <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-right t-data text-[#efe6d8]/85">
            <dt className="sr-only">Coordinates</dt>
            <dd className="col-span-2">26.10° S, 28.23° E</dd>
            <dt className="sr-only">Based in</dt>
            <dd className="col-span-2">Kempton Park, Gauteng</dd>
            <dt className="sr-only">Local time</dt>
            <dd className="col-span-2"><Clock withPhrase /></dd>
          </dl>
        </div>

        <div className="mt-auto">
          <div className="grid items-end gap-6 lg:[grid-template-areas:'stack']">
            <h1 id="hero-title" ref={title} className="hero-name t-display -ml-[0.04em] uppercase lg:[grid-area:stack]">
              <span className="block">Katlego</span>
              <span className="block">Nkuna</span>
            </h1>
            <p className="hero-fade max-w-[34ch] pb-[0.4em] text-[1.0625rem] leading-snug text-[#efe6d8]/90 sm:text-[1.1875rem] lg:max-w-[26rem] lg:justify-self-end lg:[grid-area:stack]">
              {isStudio
                ? studioHero.lead
                : "Software developer building frontends for South African fintech, and growing into the full stack with AI tools as my daily pair."}
            </p>
          </div>
          <div className="hero-fade mt-6 flex items-end justify-between gap-6 border-t border-[#efe6d8]/20 pt-4 text-[0.9375rem]">
            <span>{isStudio ? studioHero.strap : "Frontend, fintech & AI-native full-stack"}</span>
            <a href="#intro" className="group flex items-center gap-3" aria-label="Scroll to introduction">
              <span className="hidden sm:inline">Scroll</span>
              <span aria-hidden="true" className="relative block h-9 w-[1.5px] overflow-hidden bg-[#efe6d8]/25">
                <span className="absolute inset-x-0 top-0 h-1/2 bg-[#d9a441] [animation:scrollcue_1.8s_var(--ease-in-out)_infinite]" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
