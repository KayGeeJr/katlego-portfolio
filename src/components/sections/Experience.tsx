import { experience } from "@/data/site";
import SectionHead from "@/components/ui/SectionHead";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="Experience" id="experience-title" title="From intern to the payments stack." />
        <div className="relative lg:ml-[25%]">
          <div aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-[15px]" />
          <div data-fx="timeline" aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-dusk md:left-[15px]" />
          <ol className="flex flex-col gap-16">
            {experience.map((r, i) => {
              const shown = r.points.slice(0, 3);
              const more = r.points.slice(3);
              return (
                <li key={r.company} className="relative grid gap-4 pl-12 md:pl-16" data-reveal>
                  <span aria-hidden="true" className="absolute left-0 top-1 grid h-6 w-6 place-items-center bg-bg md:h-8 md:w-8">
                    <span className="h-3 w-3 rotate-45 border-2 border-dusk bg-bg md:h-4 md:w-4" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="t-data text-ochre">
                      {String(i + 1).padStart(2, "0")} · {r.period}
                    </p>
                    <p className="text-[0.875rem] text-muted">{r.stack}</p>
                  </div>
                  <h3 className="t-h3 !text-[clamp(1.5rem,2.6vw,2.25rem)]">{r.title}</h3>
                  <p className="text-[1.0625rem]">
                    {r.company}, <span className="text-muted">{r.place}</span>
                  </p>
                  <ul className="mt-2 grid max-w-[68ch] gap-3 text-muted">
                    {shown.map((p) => (
                      <li key={p} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-line-strong">
                        {p}
                      </li>
                    ))}
                  </ul>
                  {more.length > 0 && (
                    <details className="group/more max-w-[68ch] text-muted">
                      <summary className="link-u w-fit cursor-pointer list-none text-[0.9375rem] font-semibold text-fg [&::-webkit-details-marker]:hidden">
                        <span className="group-open/more:hidden">Show all {r.points.length}</span>
                        <span className="hidden group-open/more:inline">Show less</span>
                      </summary>
                      <ul className="mt-3 grid gap-3">
                        {more.map((p) => (
                          <li key={p} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-line-strong">
                            {p}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
