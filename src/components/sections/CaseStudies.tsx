import { caseStudies, site, type CaseStudy } from "@/data/site";
import SectionHead from "@/components/ui/SectionHead";

/* Abstract, code-drawn visuals. Deliberately not UI: no screens, logos or bank colours. */
function Visual({ kind }: { kind: CaseStudy["visual"] }) {
  if (kind === "inventory")
    return (
      <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => {
          const h = [60, 92, 74, 120, 98, 140, 88, 112, 150, 104, 132, 158][i];
          return <rect key={i} x={14 + i * 25} y={170 - h} width="15" height={h} fill={i % 4 === 3 ? "var(--dusk)" : "var(--line-strong)"} className="cs-bar" style={{ animationDelay: `${i * 90}ms`, transformOrigin: `${21 + i * 25}px 170px` }} />;
        })}
        <path d="M14 120 L64 104 L114 110 L164 70 L214 84 L264 46 L306 30" fill="none" stroke="var(--ochre)" strokeWidth="2" pathLength={1} className="cs-draw" />
      </svg>
    );
  if (kind === "terminals")
    return (
      <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => {
          const x = 14 + (i % 12) * 25, y = 14 + Math.floor(i / 12) * 32;
          const s = (i * 37) % 11;
          return <rect key={i} x={x} y={y} width="16" height="22" rx="2" fill="none" stroke={s === 0 ? "var(--dusk)" : s === 5 ? "var(--accent)" : "var(--line-strong)"} strokeWidth="1.5" className={s === 0 || s === 5 ? "cs-blink" : ""} style={{ animationDelay: `${(i % 7) * 300}ms` }} />;
        })}
      </svg>
    );
  if (kind === "pulse")
    return (
      <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true">
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="var(--line)" />
        ))}
        <path d="M0 110 L40 108 L60 112 L80 104 L96 108 L110 60 L120 140 L132 100 L160 106 L200 102 L220 108 L236 96 L250 104 L320 102" fill="none" stroke="var(--ochre)" strokeWidth="2" pathLength={1} className="cs-draw cs-loop" />
        <circle cx="114" cy="60" r="10" fill="none" stroke="var(--dusk)" strokeWidth="2" className="cs-ping" />
        <circle cx="114" cy="60" r="3" fill="var(--dusk)" />
      </svg>
    );
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true">
      <rect x="110" y="10" width="100" height="160" rx="10" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
      <rect x="122" y="24" width="76" height="34" rx="3" fill="none" stroke="var(--ochre)" strokeWidth="1.5" />
      <rect x="128" y="38" width="40" height="6" fill="var(--ochre)" className="cs-type" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={124 + (i % 3) * 26} y={70 + Math.floor(i / 3) * 24} width="20" height="16" rx="2" fill="none" stroke={i === 11 ? "var(--accent)" : "var(--line-strong)"} strokeWidth="1.5" className={i === 11 ? "cs-blink" : ""} />
      ))}
    </svg>
  );
}

export default function CaseStudies() {
  return (
    <section id="fintech" aria-labelledby="fintech-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="Fintech case studies" id="fintech-title" title="The work I can't screenshot.">
          These are proprietary platforms built at Dashpay for South African banks. What follows is only what&apos;s on my CV; the visuals are abstractions drawn in code, not product UI.
        </SectionHead>

        <ul className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {caseStudies.map((c) => (
            <li key={c.slug} className="bg-bg"><div className="flex h-full flex-col" data-reveal>
              <div className="relative aspect-[16/9] border-b border-line bg-bg-sunk p-6">
                <Visual kind={c.visual} />
              </div>
              <article className="flex flex-1 flex-col gap-5 p-6 md:p-8" aria-labelledby={`cs-${c.slug}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 id={`cs-${c.slug}`} className="t-h3 !text-[1.75rem]">{c.name}</h3>
                  <span className="text-[0.875rem] text-muted">{c.kind}</span>
                </div>
                <p className="t-data text-ochre">{c.clients}</p>
                <dl className="grid gap-4 text-[0.9375rem]">
                  <div>
                    <dt className="font-semibold">The problem</dt>
                    <dd className="text-muted">{c.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">What I built</dt>
                    <dd className="text-muted">{c.built}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Outcome</dt>
                    <dd className="text-muted">{c.outcome}</dd>
                  </div>
                </dl>
                <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label="Stack">
                  {c.stack.map((s) => (
                    <li key={s} className="chip">{s}</li>
                  ))}
                </ul>
              </article>
            </div></li>
          ))}
        </ul>
        <p className="mt-8 flex flex-wrap items-center gap-3 text-[0.9375rem] text-muted">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          Under NDA, walkthrough on request.
          <a className="link-u text-fg" href={`mailto:${site.email}?subject=${encodeURIComponent("Fintech walkthrough request")}`}>
            Ask for one
          </a>
        </p>
      </div>
    </section>
  );
}
