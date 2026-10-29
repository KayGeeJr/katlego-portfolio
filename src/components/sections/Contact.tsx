"use client";

import { useState } from "react";
import { site } from "@/data/site";
import Clock from "@/components/chrome/Clock";
import Magnetic from "@/components/chrome/Magnetic";
import TransitionLink from "@/components/chrome/TransitionLink";
import Pattern from "@/components/ui/Pattern";
import { tick } from "@/lib/sound";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      tick(0.9);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      location.href = `mailto:${site.email}`;
    }
  };
  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line pt-[var(--section-y)]">
      <div className="wrap">
        <p className="section-tag mb-6">
          <span aria-hidden="true" className="inline-block h-2 w-2 bg-ochre" />
          Contact
        </p>
        <h2 id="contact-title" className="t-h1 max-w-[14ch]">Got something that needs building? Let&apos;s talk.</h2>

        <div className="mt-14 flex flex-col gap-6 border-y border-line py-8 md:flex-row md:items-center md:justify-between">
          <a href={`mailto:${site.email}`} className="link-u break-all font-display text-[clamp(1.25rem,3.4vw,2.75rem)] font-semibold tracking-[-0.02em]" data-cursor="Write">
            {site.email}
          </a>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <button type="button" onClick={copy} className="btn" aria-live="polite">
                {copied ? "Copied to clipboard" : "Copy email"}
              </button>
            </Magnetic>
            <Magnetic>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
                LinkedIn <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-3">
          <div>
            <p className="mb-3 text-[0.875rem] text-muted">Resume</p>
            <ul className="grid gap-2">
              <li><TransitionLink href="/cv" className="link-u">View resume</TransitionLink></li>
              <li><a href={site.cvPdf} download className="link-u">Download PDF (CV, 2026)</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[0.875rem] text-muted">Based in</p>
            <p>Kempton Park, Gauteng</p>
            <p className="t-data mt-1 text-muted">26.10° S, 28.23° E</p>
            <Clock className="mt-1 block text-muted" />
          </div>
          <div>
            <p className="mb-3 text-[0.875rem] text-muted">Elsewhere on the site</p>
            <ul className="grid gap-2">
              <li><TransitionLink href="/projects" className="link-u">Project index</TransitionLink></li>
              <li><a href="/#lab" className="link-u">The lab</a></li>
              <li><a href="#top" className="link-u">Back to the top</a></li>
            </ul>
          </div>
        </div>
      </div>

      <Pattern cols={28} seed={19} className="wrap opacity-80" />

      <div className="wrap flex flex-col gap-3 py-8 text-[0.875rem] text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Katlego Nkuna. Designed and built in Gauteng.</p>
        <p>
          Psst: press <kbd className="rounded border border-line-strong px-1.5 t-data">N</kbd>.
        </p>
      </div>
    </footer>
  );
}
