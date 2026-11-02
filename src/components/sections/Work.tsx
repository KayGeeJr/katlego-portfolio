import { publicProjects, groupLabel, hostOf, type Project } from "@/data/projects";
import { isStudio } from "@/lib/variant";
import WorkPin from "@/components/work/WorkPin";
import ProjectMedia from "@/components/work/ProjectMedia";

/** Each card opens the live site directly, in a new tab. */
function Card({ p, index }: { p: Project; index: number }) {
  return (
    <li className="work-card w-[84vw] shrink-0 snap-start sm:w-[62vw] md:w-[46vw] xl:w-[40vw]">
      <a href={p.url} target="_blank" rel="noopener" data-cursor="Visit" className="group block">
        <div className="relative aspect-[16/9] overflow-hidden border border-line bg-[#1b1d24]">
          <div className="h-full w-full transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.035]">
            <ProjectMedia project={p} sizes="(min-width: 1280px) 40vw, (min-width: 768px) 46vw, 84vw" />
          </div>
        </div>
        <p className="mt-5 text-[0.875rem] text-ochre">{p.kind}</p>
        <div className="mt-1 flex items-baseline justify-between gap-6">
          <h3 className="t-h3 transition-colors duration-300 group-hover:text-accent">{p.name}</h3>
          <span className="t-data text-muted">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p className="mt-2 max-w-[48ch] text-[0.9375rem] text-muted">{p.tagline}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-[0.875rem]">
          <span className="t-data link-u">{hostOf(p.url)}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <path d="M3 9L9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="sr-only">(opens the live site in a new tab)</span>
        </p>
      </a>
    </li>
  );
}

function GroupLabel({ count, label }: { count: number; label: string }) {
  return (
    <li className="hidden shrink-0 flex-col justify-end border-l border-line pl-4 md:flex md:w-[16vw]" aria-hidden="true">
      <p className="t-data text-ochre">{count}</p>
      <p className="t-h3 mt-2">{label}</p>
    </li>
  );
}

export default function Work() {
  const client = publicProjects.filter((p) => p.group === "client");
  const concept = publicProjects.filter((p) => p.group === "concept");

  return (
    <section id="work" aria-labelledby="work-title" className="relative overflow-hidden border-t border-line py-[clamp(4rem,8vw,6rem)] md:flex md:h-[100svh] md:flex-col md:justify-center md:py-0">
      <div className="wrap mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
        <div>
          <p className="section-tag mb-4">
            <span aria-hidden="true" className="inline-block h-2 w-2 bg-ochre" />
            {isStudio ? "Work" : "Selected work"}
          </p>
          <h2 id="work-title" className="t-h2">{isStudio ? "Sites I've designed and built." : "Sites I've shipped."}</h2>
        </div>
        <p className="max-w-[34ch] text-[0.9375rem] text-muted">Every card opens the live site. Take them for a spin.</p>
      </div>

      <ul data-work-track className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-4 md:snap-none md:gap-10 md:overflow-visible" aria-label="Live sites">
        <GroupLabel count={client.length} label={groupLabel.client} />
        {client.map((p, i) => (
          <Card key={p.slug} p={p} index={i} />
        ))}
        <GroupLabel count={concept.length} label={groupLabel.concept} />
        {concept.map((p, i) => (
          <Card key={p.slug} p={p} index={client.length + i} />
        ))}
        <li className="flex w-[70vw] shrink-0 snap-start items-center sm:w-[40vw] md:w-[26vw]">
          <a href={isStudio ? "#contact" : "#fintech"} data-cursor={isStudio ? "Talk" : "Read"} className="group flex aspect-square w-full flex-col justify-between border border-line p-8 transition-colors duration-500 hover:border-accent">
            <span className="t-data text-muted">{isStudio ? "Next" : "Also"}</span>
            <span className="t-h2">{isStudio ? "Yours could be next." : "The fintech work I can't link to."}</span>
          </a>
        </li>
      </ul>

      <WorkPin />
      <div className="wrap mt-8 hidden md:block" aria-hidden="true">
        <div className="h-px w-full bg-line">
          <div className="work-progress h-px origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </section>
  );
}
