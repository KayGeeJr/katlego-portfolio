import { skills } from "@/data/site";
import SectionHead from "@/components/ui/SectionHead";

export default function Skills() {
  const total = skills.reduce((n, g) => n + g.items.length, 0);
  return (
    <section id="skills" aria-labelledby="skills-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="Stack" id="skills-title" title={<>The toolkit, all {total} of it.</>}>
          Grouped the way I reach for them. Where I&apos;m still learning, it says so.
        </SectionHead>
        <dl className="border-t border-line">
          {skills.map((g) => (
            <div key={g.group} className="group grid gap-3 border-b border-line py-6 transition-colors duration-300 hover:bg-bg-raised md:grid-cols-12 md:items-baseline md:gap-6 md:px-3">
              <dt className="flex items-baseline justify-between gap-4 font-semibold md:col-span-3">
                {g.group}
                <span className="t-data text-muted">{g.items.length}</span>
              </dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[1.0625rem] md:text-[1.1875rem]">
                  {g.items.map((s) => (
                    <li key={s.name} className="transition-colors duration-300 group-hover:text-fg">
                      {s.name}
                      {s.note && <span className="ml-2 rounded-full border border-dusk/60 px-2 py-0.5 align-middle text-[0.75rem] text-dusk">{s.note}</span>}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
