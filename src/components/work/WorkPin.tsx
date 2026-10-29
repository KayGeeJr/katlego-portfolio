"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { whenIdle } from "@/lib/motion";

/** Pins #work and scrubs its track sideways on wider screens. Touch/narrow/reduced-motion keep native horizontal scroll. */
export default function WorkPin() {
  // Layout effect on purpose: the pin wraps #work in a pin-spacer, and that has to be undone
  // before React removes the section on navigation, or React removes a node from the wrong parent.
  useLayoutEffect(() => {
    const section = document.getElementById("work");
    const el = section?.querySelector<HTMLElement>("[data-work-track]");
    if (!section || !el) return;
    const mm = gsap.matchMedia();
    const cancel = whenIdle(() =>
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => el.scrollWidth - el.clientWidth;
        const bar = section.querySelector<HTMLElement>(".work-progress");
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (st) => bar && (bar.style.transform = `scaleX(${st.progress})`),
          },
        });
        return () => tween.kill();
      }),
    );
    return () => {
      cancel();
      mm.revert();
    };
  }, []);
  return null;
}
