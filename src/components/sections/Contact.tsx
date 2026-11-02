"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { studioContact } from "@/data/studio";
import { isStudio } from "@/lib/variant";
import Clock from "@/components/chrome/Clock";
import Magnetic from "@/components/chrome/Magnetic";
import TransitionLink from "@/components/chrome/TransitionLink";
import Pattern from "@/components/ui/Pattern";
import { tick } from "@/lib/sound";

function CopyEmail() {
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
    <Magnetic>
      <button type="button" onClick={copy} className="btn" aria-live="polite">
        {copied ? "Copied to clipboard" : "Copy email"}
      </button>
    </Magnetic>
  );
}

/**
 * Quote form. Works out of the box on Netlify Forms (the form is in the static HTML,
 * so Netlify detects it at deploy). Anywhere else, submitting falls back to a pre-filled email.
 */
function QuoteForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const field = "w-full border-b border-line-strong bg-transparent py-3 text-[1.0625rem] outline-none transition-colors placeholder:text-muted focus:border-accent";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      tick(0.9);
      form.reset();
    } catch {
      const body = `Hi Katlego,\n\nName: ${data.get("name")}\nBusiness: ${data.get("business") || "-"}\nI need: ${data.get("need")}\n\n${data.get("message")}`;
      location.href = `mailto:${site.email}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
      setState("idle");
    }
  };

  if (state === "sent")
    return (
      <div role="status" className="border border-accent p-8">
        <p className="t-h3">Thanks, message received.</p>
        <p className="mt-3 text-muted">I&apos;ll get back to you soon, usually within a couple of working days.</p>
      </div>
    );

  return (
    <form name="quote" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} className="grid gap-6 md:grid-cols-2">
      <input type="hidden" name="form-name" value="quote" />
      <p className="hidden">
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="grid gap-1">
        <span className="text-[0.875rem] text-muted">Your name</span>
        <input required name="name" autoComplete="name" className={field} data-cursor="native" />
      </label>
      <label className="grid gap-1">
        <span className="text-[0.875rem] text-muted">Email</span>
        <input required type="email" name="email" autoComplete="email" className={field} data-cursor="native" />
      </label>
      <label className="grid gap-1">
        <span className="text-[0.875rem] text-muted">Business name (optional)</span>
        <input name="business" autoComplete="organization" className={field} data-cursor="native" />
      </label>
      <label className="grid gap-1">
        <span className="text-[0.875rem] text-muted">What do you need?</span>
        <select name="need" className={`${field} [&>option]:bg-bg`} defaultValue={studioContact.needs[0]} data-cursor="native">
          {studioContact.needs.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 md:col-span-2">
        <span className="text-[0.875rem] text-muted">Tell me about it</span>
        <textarea required name="message" rows={4} className={`${field} resize-y`} data-cursor="native" />
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="btn btn-solid" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

export default function Contact() {
  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line pt-[var(--section-y)]">
      <div className="wrap">
        <p className="section-tag mb-6">
          <span aria-hidden="true" className="inline-block h-2 w-2 bg-ochre" />
          {isStudio ? "Start a project" : "Contact"}
        </p>
        <h2 id="contact-title" className="t-h1 max-w-[14ch]">
          {isStudio ? studioContact.title : "Got something that needs building? Let's talk."}
        </h2>

        {isStudio && (
          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <p className="max-w-[36ch] text-[1.125rem] text-muted lg:col-span-4">{studioContact.intro}</p>
            <div className="lg:col-span-8">
              <QuoteForm />
            </div>
          </div>
        )}

        <div className="mt-14 flex flex-col gap-6 border-y border-line py-8 md:flex-row md:items-center md:justify-between">
          <a href={`mailto:${site.email}`} className="link-u break-all font-display text-[clamp(1.25rem,3.4vw,2.75rem)] font-semibold tracking-[-0.02em]" data-cursor="Write">
            {site.email}
          </a>
          <div className="flex flex-wrap gap-3">
            <CopyEmail />
            {!isStudio && (
              <Magnetic>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
                  LinkedIn <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Magnetic>
            )}
          </div>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-3">
          {isStudio ? (
            <div>
              <p className="mb-3 text-[0.875rem] text-muted">What I build</p>
              <ul className="grid gap-2">
                <li><a href="/#services" className="link-u">Websites, stores and web apps</a></li>
                <li><a href="/#work" className="link-u">See the work</a></li>
              </ul>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-[0.875rem] text-muted">Resume</p>
              <ul className="grid gap-2">
                <li><TransitionLink href="/cv" className="link-u">View resume</TransitionLink></li>
                <li><a href={site.cvPdf} download className="link-u">Download PDF (CV, 2026)</a></li>
              </ul>
            </div>
          )}
          <div>
            <p className="mb-3 text-[0.875rem] text-muted">Based in</p>
            <p>Kempton Park, Gauteng</p>
            <p className="t-data mt-1 text-muted">26.10° S, 28.23° E</p>
            <Clock className="mt-1 block text-muted" />
          </div>
          <div>
            <p className="mb-3 text-[0.875rem] text-muted">Elsewhere on the site</p>
            <ul className="grid gap-2">
              <li><a href="/#work" className="link-u">Live sites</a></li>
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
