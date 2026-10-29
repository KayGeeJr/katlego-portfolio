import { intro, differentiators } from "@/data/site";

export default function Intro() {
  return (
    <section id="intro" aria-labelledby="intro-title" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="section-tag lg:col-span-3 lg:pt-3">
          <span aria-hidden="true" className="inline-block h-2 w-2 bg-ochre" />
          <h2 id="intro-title" className="inline">About</h2>
        </div>
        <div className="lg:col-span-9">
          <p data-fx="read" className="t-h2 max-w-[20ch] !font-medium">
            {intro.lead}
          </p>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {intro.body.map((p, i) => (
              <p key={i} data-reveal data-reveal-delay={i * 100} className="max-w-[46ch] text-[1.125rem] text-muted">
                {p}
              </p>
            ))}
          </div>
          <ul className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {differentiators.map((d) => (
              <li key={d.title} className="bg-bg p-6">
                <h3 className="mb-3 text-[1.0625rem] font-semibold">{d.title}</h3>
                <p className="text-[0.9375rem] text-muted">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
