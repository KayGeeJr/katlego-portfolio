"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { tick } from "@/lib/sound";

type Props = React.ComponentProps<typeof Link> & { href: string };

/** Internal link that plays the curtain before navigating between pages. Falls back to a normal link. */
export default function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const router = useRouter();
  const path = usePathname();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        tick(0.6);
        const samePage = href.split("#")[0] === path || href.startsWith("#");
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || samePage || prefersReducedMotion()) return;
        const curtain = document.querySelector<HTMLElement>(".curtain");
        if (!curtain) return;
        e.preventDefault();
        router.prefetch(href);
        curtain.dataset.state = "covering";
        gsap.fromTo(curtain, { yPercent: 100 }, {
          yPercent: 0, duration: 0.6, ease: "power3.inOut",
          onComplete: () => {
            curtain.dataset.state = "covered";
            router.push(href);
          },
        });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
