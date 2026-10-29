import { education } from "@/data/site";
import SectionHead from "@/components/ui/SectionHead";

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="Education" id="education-title" title="Business first, then the code." />
        <ul className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {education.map((e) => (
            <li key={e.title} className="bg-bg"><div className="flex flex-col gap-4 p-6 md:p-10" data-reveal>
              <p className="t-data text-ochre">{e.years}</p>
              <h3 className="t-h3">{e.title}</h3>
              <p className="font-semibold">{e.school}</p>
              <p className="max-w-[52ch] text-muted">{e.body}</p>
            </div></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
