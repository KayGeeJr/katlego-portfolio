"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import Magnetic from "./Magnetic";
import Clock from "./Clock";
import { isStudio } from "@/lib/variant";
import { setPrefsAnimated, setPrefs, usePrefs } from "@/lib/prefs";
import { resumeAudio, tick } from "@/lib/sound";

const nav = isStudio
  ? [
      { href: "/#work", label: "Work" },
      { href: "/#services", label: "Services" },
      { href: "/#workflow", label: "Process" },
      { href: "/#lab", label: "Lab" },
    ]
  : [
      { href: "/#work", label: "Work" },
      { href: "/#experience", label: "Experience" },
      { href: "/#fintech", label: "Fintech" },
      { href: "/cv", label: "CV" },
    ];

export function ThemeToggle() {
  const { theme } = usePrefs();
  const light = theme === "light";
  return (
    <button
      type="button"
      onClick={(e) => {
        tick(light ? 0.2 : 0.8);
        setPrefsAnimated({ theme: light ? "dark" : "light" }, { x: e.clientX, y: e.clientY });
      }}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Dusk" : "Daylight"}
      className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:border-accent"
    >
      {/* a sun on the horizon: risen in light mode, set in dark mode */}
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <clipPath id="hz"><rect x="0" y="0" width="22" height="14" /></clipPath>
        <circle cx="11" cy={light ? 9 : 16} r="5" fill="var(--ochre)" clipPath="url(#hz)" style={{ transition: "cy .6s cubic-bezier(.16,1,.3,1)" }} />
        <path d="M3 14.5h16" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 18h10" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
      </svg>
    </button>
  );
}

export function SoundToggle() {
  const { sound } = usePrefs();
  return (
    <button
      type="button"
      onClick={() => {
        resumeAudio();
        setPrefs({ sound: !sound });
        if (!sound) setTimeout(() => tick(0.7, 0.06), 30);
      }}
      aria-pressed={sound}
      aria-label={sound ? "Turn sound off" : "Turn sound on"}
      className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:border-accent"
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-current"
            style={{
              height: sound ? undefined : "3px",
              animation: sound ? `eq 0.9s ${i * 0.12}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </span>
    </button>
  );
}

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    let last = scrollY;
    const check = () => {
      const y = scrollY;
      setScrolled(y > 40);
      setHidden((h) => (y > 400 && y > last + 4 ? true : y < last - 4 ? false : h));
      last = y;
      // keep the header readable over always-dark sections (the dusk hero), in either theme
      const dark = Array.from(document.querySelectorAll("[data-header-dark]")).some((d) => {
        const r = d.getBoundingClientRect();
        return r.top <= 36 && r.bottom >= 36;
      });
      setOnDark(dark);
    };
    check();
    addEventListener("scroll", check, { passive: true });
    return () => removeEventListener("scroll", check);
  }, [path]);

  // Escape closes the mobile menu; focus moves into it when it opens
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    window.__lenis?.stop();
    return () => {
      removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [open]);

  const forceDark = onDark && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color] duration-500 [transition-timing-function:var(--ease-out)] ${hidden && !open ? "-translate-y-full" : ""} ${scrolled && !open && !onDark ? "bg-bg/80 backdrop-blur-md" : ""}`}
        style={forceDark ? ({ "--fg": "#efe6d8", "--line": "rgb(239 230 216 / .22)", color: "#efe6d8" } as React.CSSProperties) : { color: "var(--fg)" }}
      >
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
          <TransitionLink href="/" className="group flex items-center gap-3" aria-label="Katlego Nkuna, home">
            <Monogram />
            <span className="hidden text-[0.9375rem] font-semibold sm:inline">Katlego Nkuna</span>
          </TransitionLink>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.map((n) => (
              <TransitionLink key={n.href} href={n.href} className="link-u text-[0.9375rem]">
                {n.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Clock className="mr-3 hidden xl:inline" />
            <ThemeToggle />
            <SoundToggle />
            <span className="hidden md:block">
              <Magnetic>
                <a href="#contact" className="btn !h-11 ml-1">
                  {isStudio ? "Get a quote" : "Contact"}
                </a>
              </Magnetic>
            </span>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-[var(--gutter)] pb-10 pt-28 md:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-2">
            {[...nav, { href: "/#contact", label: isStudio ? "Get a quote" : "Contact" }].map((n, i) => (
              <li key={n.href} style={{ animation: open ? `menu-in .6s ${i * 0.05}s var(--ease-out) both` : undefined }}>
                <TransitionLink href={n.href} onClick={() => setOpen(false)} className="t-h2 block py-1">
                  {n.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <Clock withPhrase />
      </div>
    </>
  );
}

function Monogram() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-90 [transition-timing-function:var(--ease-out)]">
      <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* K and N built from stepped strokes */}
      <path d="M9 10v20M9 20h4l6-10M13 20l6 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
      <path d="M23 30V10l8 20V10" fill="none" stroke="var(--ochre)" strokeWidth="2" strokeLinejoin="miter" />
    </svg>
  );
}
