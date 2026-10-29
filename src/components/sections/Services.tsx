import { services } from "@/data/site";
import SectionHead from "@/components/ui/SectionHead";

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="What I do" id="services-title" title="Three things I'm good at, in the order I learned them." />
        <ol className="border-t border-line">
          {services.map((s, i) => (
            <li key={s.title} className="group relative grid gap-6 border-b border-line py-10 md:grid-cols-12 md:py-14" data-reveal>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-bg-raised transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-y-100" />
              <span className="relative t-data text-ochre md:col-span-1 md:pt-2">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="relative t-h2 !text-[clamp(1.75rem,3.6vw,3.25rem)] md:col-span-6">{s.title}</h3>
              <div className="relative md:col-span-5">
                <p className="max-w-[48ch] text-muted">{s.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${s.title} tools`}>
                  {s.tags.map((t) => (
                    <li key={t} className="chip">{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
