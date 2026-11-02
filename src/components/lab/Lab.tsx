import { Suspense } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { ShaderPlayground, PatternGenerator, CursorPhysics, NegativeCard } from "./experiments";

function Experiment({ n, title, children, note, className = "" }: { n: number; title: string; note: string; children: React.ReactNode; className?: string }) {
  return (
    <article className={`flex min-w-0 flex-col bg-bg ${className}`} aria-labelledby={`lab-${n}`}>
      <header className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
        <h3 id={`lab-${n}`} className="font-semibold">{title}</h3>
        <span className="t-data text-muted">Exp. {String(n).padStart(2, "0")}</span>
      </header>
      <div className="relative flex-1">{children}</div>
      <p className="border-t border-line px-5 py-3 text-[0.875rem] text-muted">{note}</p>
    </article>
  );
}

const anatomy = [
  { k: "Hero", v: "One fragment shader (OGL + GLSL): domain-warped fBm sky, Bayer dither, stepped lattice lens. No images." },
  { k: "Fallback", v: "A CSS-only dusk for low-power devices, data-saver and reduced motion." },
  { k: "Motion", v: "GSAP, ScrollTrigger and SplitText on Lenis smooth scroll. One easing family: expo-out." },
  { k: "Type", v: "Unbounded, Hanken Grotesk and JetBrains Mono, self-hosted and subset to Latin." },
  { k: "Build", v: "Next.js static export, TypeScript, Tailwind CSS. No runtime server." },
  { k: "Shots", v: "Every project image is encoded to AVIF and WebP with a blur placeholder; a Playwright pipeline can capture live sites automatically." },
];

export default function Lab() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="Lab" id="lab-title" title="The site, taken apart.">
          The pieces this site is made of, pulled out so you can play with them.
        </SectionHead>
        <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
          <Experiment n={1} title="Shader playground" note="The hero's own shader. Drag the sliders; hover the canvas for the lattice lens.">
            <Suspense fallback={null}>
              <ShaderPlayground />
            </Suspense>
          </Experiment>
          <Experiment n={2} title="Pattern generator" note="Stepped geometry from a seeded generator. The dividers on this site come from it.">
            <Suspense fallback={null}>
              <PatternGenerator />
            </Suspense>
          </Experiment>
          <Experiment n={3} title="Cursor physics" note="Verlet rope, 22 links, six constraint passes a frame. Move to swing, click to pluck.">
            <Suspense fallback={null}>
              <CursorPhysics />
            </Suspense>
          </Experiment>
          <Experiment n={4} title="Negative mode" note="The easter egg. A single CSS filter on the root, revealed with a View Transition.">
            <Suspense fallback={null}>
              <NegativeCard />
            </Suspense>
          </Experiment>
        </div>
        <dl className="mt-14 grid gap-x-10 gap-y-6 border-t border-line pt-10 md:grid-cols-2 lg:grid-cols-3">
          {anatomy.map((a) => (
            <div key={a.k}>
              <dt className="t-data text-ochre">{a.k}</dt>
              <dd className="mt-2 text-[0.9375rem] text-muted">{a.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
