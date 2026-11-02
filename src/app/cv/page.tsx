import type { Metadata } from "next";
import { site, cvSummary, skills, experience, differentiators, education } from "@/data/site";
import PrintButton from "./PrintButton";
import { notFound } from "next/navigation";
import { isStudio } from "@/lib/variant";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Katlego Nkuna, software developer (frontend, full-stack, AI-augmented) in Kempton Park, South Africa.",
  alternates: { canonical: "/cv" },
};

export default function CvPage() {
  // The resume only exists on the CV site (the studio build also deletes this page after export).
  if (isStudio) notFound();
  return (
    <div className="cv wrap max-w-[1100px] pb-[var(--section-y)] pt-32 md:pt-40">
      <header className="flex flex-col gap-8 border-b border-line pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="t-h1">{site.name}</h1>
          <p className="mt-4 text-[1.125rem]">Software Developer — Frontend, Full-Stack, AI-Augmented Builder</p>
          <p className="mt-2 text-muted">
            <a className="link-u" href={`mailto:${site.email}`}>{site.email}</a>
            <span aria-hidden="true"> / </span>
            <a className="link-u" href={site.linkedin} target="_blank" rel="noopener noreferrer">{site.linkedinLabel}</a>
            <span aria-hidden="true"> / </span>
            {site.location}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-3">
          <a href={site.cvPdf} download className="btn btn-solid">Download PDF</a>
          <PrintButton />
        </div>
      </header>

      <section aria-labelledby="cv-summary" className="cv-block">
        <h2 id="cv-summary">Professional summary</h2>
        <p className="max-w-[70ch]">{cvSummary}</p>
      </section>

      <section aria-labelledby="cv-skills" className="cv-block">
        <h2 id="cv-skills">Core competencies</h2>
        <dl className="grid gap-3">
          {skills.map((g) => (
            <div key={g.group} className="grid gap-1 md:grid-cols-[14rem_1fr]">
              <dt className="font-semibold">{g.group}</dt>
              <dd className="text-muted">{g.items.map((i) => (i.note ? `${i.name} (${i.note})` : i.name)).join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="cv-exp" className="cv-block">
        <h2 id="cv-exp">Experience</h2>
        <ol className="grid gap-10">
          {experience.map((r) => (
            <li key={r.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                <h3 className="text-[1.25rem] font-semibold">{r.title}</h3>
                <p className="t-data text-muted">{r.period}</p>
              </div>
              <p>{r.company}, {r.place}</p>
              <p className="mb-3 text-[0.875rem] text-muted">{r.stack}</p>
              <ul className="grid max-w-[75ch] list-disc gap-1.5 pl-5 text-muted marker:text-ochre">
                {r.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cv-diff" className="cv-block">
        <h2 id="cv-diff">What makes me different</h2>
        <dl className="grid gap-3">
          <div className="grid gap-1 md:grid-cols-[14rem_1fr]">
            <dt className="font-semibold">AI-native workflow</dt>
            <dd className="text-muted">I use Claude Code, Cursor AI, JetBrains AI and Copilot as daily pair programmers, shipping production-quality code faster without cutting corners.</dd>
          </div>
          {differentiators.map((d) => (
            <div key={d.title} className="grid gap-1 md:grid-cols-[14rem_1fr]">
              <dt className="font-semibold">{d.title}</dt>
              <dd className="text-muted">{d.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="cv-edu" className="cv-block">
        <h2 id="cv-edu">Education</h2>
        <ul className="grid gap-6">
          {education.map((e) => (
            <li key={e.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                <h3 className="text-[1.125rem] font-semibold">{e.title}</h3>
                <p className="t-data text-muted">{e.years}</p>
              </div>
              <p>{e.school}</p>
              <p className="mt-1 max-w-[75ch] text-muted">{e.body}</p>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-12 text-[0.875rem] text-muted">References and portfolio available on request.</p>
    </div>
  );
}
