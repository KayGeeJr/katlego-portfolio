"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { defaultParams, type ShaderParams } from "@/components/hero/shader";
import { generatePattern, motifNames, toneVar } from "@/lib/pattern";
import { toggleNegative } from "@/components/chrome/NegativeMode";
import { usePrefs } from "@/lib/prefs";
import { tick } from "@/lib/sound";
import { prefersReducedMotion } from "@/lib/motion";

const ShaderCanvas = dynamic(() => import("@/components/hero/ShaderCanvas"), { ssr: false });

function useInView<T extends HTMLElement>(margin = "200px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

function Experiment({ n, title, children, note, className = "" }: { n: number; title: string; note: string; children: React.ReactNode; className?: string }) {
  return (
    <article className={`flex flex-col bg-bg ${className}`} aria-labelledby={`lab-${n}`}>
      <header className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
        <h3 id={`lab-${n}`} className="font-semibold">{title}</h3>
        <span className="t-data text-muted">Exp. {String(n).padStart(2, "0")}</span>
      </header>
      <div className="relative flex-1">{children}</div>
      <p className="border-t border-line px-5 py-3 text-[0.875rem] text-muted">{note}</p>
    </article>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-[0.875rem]">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-[var(--accent)]" data-cursor="native" />
      <output className="t-data text-right text-muted">{value}</output>
    </label>
  );
}

function ShaderPlayground() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [p, setP] = useState<ShaderParams>(defaultParams);
  const live = useRef<ShaderParams>(defaultParams);
  live.current = p;
  const set = (k: keyof ShaderParams) => (v: number) => setP((o) => ({ ...o, [k]: v }));
  return (
    <div className="flex h-full flex-col">
      <div ref={ref} className="relative aspect-[16/10] overflow-hidden bg-[#16120e]">
        {seen && <ShaderCanvas className="absolute inset-0" paramsRef={live} maxDpr={1} />}
      </div>
      <div className="grid gap-3 p-5">
        <Slider label="Heat haze" value={p.warp} min={0} max={2} step={0.05} onChange={set("warp")} />
        <Slider label="Grain" value={p.grain} min={0} max={1} step={0.05} onChange={set("grain")} />
        <Slider label="Lattice" value={p.density} min={2} max={10} step={0.5} onChange={set("density")} />
        <Slider label="Dither steps" value={p.levels} min={3} max={40} step={1} onChange={set("levels")} />
        <button type="button" className="link-u justify-self-start text-[0.875rem] font-semibold" onClick={() => setP(defaultParams)}>
          Reset to the hero
        </button>
      </div>
    </div>
  );
}

function PatternGenerator() {
  const [seed, setSeed] = useState(2026);
  const [allow, setAllow] = useState<string[]>(motifNames);
  const svgRef = useRef<SVGSVGElement>(null);
  const cols = 8, rows = 4;
  const shapes = useMemo(() => generatePattern({ cols, rows, seed, allow: allow.length ? allow : motifNames }), [seed, allow]);

  const download = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const cs = getComputedStyle(document.documentElement);
    clone.querySelectorAll("path").forEach((p) => {
      ["fill", "stroke"].forEach((attr) => {
        const v = p.getAttribute(attr);
        const m = v?.match(/var\((--[\w-]+)\)/);
        if (m) p.setAttribute(attr, cs.getPropertyValue(m[1]).trim());
      });
    });
    clone.insertAdjacentHTML("afterbegin", `<rect width="${cols}" height="${rows}" fill="${cs.getPropertyValue("--bg").trim()}"/>`);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const url = URL.createObjectURL(new Blob([clone.outerHTML], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `highveld-pattern-${seed}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="aspect-[16/10] bg-bg-sunk p-4">
        <svg ref={svgRef} viewBox={`0 0 ${cols} ${rows}`} className="h-full w-full" role="img" aria-label={`Generated geometric pattern, seed ${seed}`}>
          {shapes.map((s, i) => (
            <path key={`${seed}-${i}`} d={s.d} fill={s.fill ? toneVar[s.tone] : "none"} stroke={s.fill ? "none" : toneVar[s.tone]} strokeWidth={0.03} className="lab-pop" style={{ animationDelay: `${(i % 40) * 12}ms` }} />
          ))}
        </svg>
      </div>
      <div className="grid gap-4 p-5">
        <fieldset>
          <legend className="mb-2 text-[0.875rem]">Motifs</legend>
          <div className="flex flex-wrap gap-2">
            {motifNames.map((m) => {
              const on = allow.includes(m);
              return (
                <button key={m} type="button" aria-pressed={on} onClick={() => setAllow((a) => (on ? a.filter((x) => x !== m) : [...a, m]))} className={`chip transition-colors ${on ? "border-accent text-fg" : "text-muted line-through"}`}>
                  {m}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn !h-11" onClick={() => (setSeed(Math.floor(Math.random() * 99999)), tick(Math.random()))}>
            Regenerate
          </button>
          <button type="button" className="btn !h-11" onClick={download}>
            Download SVG
          </button>
          <span className="t-data text-muted">seed {seed}</span>
        </div>
      </div>
    </div>
  );
}

function CursorPhysics() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const N = 22, SEG = 9;
    const reduce = prefersReducedMotion();
    let w = 0, h = 0, raf = 0, visible = false;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const pts = Array.from({ length: N }, (_, i) => ({ x: 0, y: i * SEG, px: 0, py: i * SEG }));
    const anchor = { x: 0, y: 30 };
    const resize = () => {
      const r = c.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!anchor.x) {
        anchor.x = w / 2;
        pts.forEach((p, i) => { p.x = p.px = w / 2; p.y = p.py = 30 + i * SEG; });
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const css = getComputedStyle(document.documentElement);
    const col = (v: string) => css.getPropertyValue(v).trim();
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      anchor.x = e.clientX - r.left;
      anchor.y = e.clientY - r.top;
    };
    const pluck = () => {
      pts.forEach((p, i) => (p.px -= (Math.random() - 0.5) * i * 3));
      tick(Math.random(), 0.04);
    };
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerdown", pluck);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);

    const step = () => {
      raf = requestAnimationFrame(step);
      if (!visible && !reduce) return;
      // verlet integration
      for (let i = 1; i < N; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * 0.985, vy = (p.y - p.py) * 0.985;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + 0.45;
      }
      pts[0].x = anchor.x; pts[0].y = anchor.y;
      for (let k = 0; k < 6; k++) {
        for (let i = 0; i < N - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const diff = (d - SEG) / d;
          if (i === 0) { b.x -= dx * diff; b.y -= dy * diff; }
          else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; b.x -= dx * diff * 0.5; b.y -= dy * diff * 0.5; }
        }
        for (const p of pts) { p.x = Math.max(4, Math.min(w - 4, p.x)); p.y = Math.max(4, Math.min(h - 4, p.y)); }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = col("--line-strong");
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      pts.forEach((p, i) => {
        const s = i === N - 1 ? 9 : 5;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = i === N - 1 ? col("--accent") : i % 3 === 0 ? col("--dusk") : col("--ochre");
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      });
      if (reduce) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerdown", pluck);
    };
  }, []);
  return <canvas ref={canvas} className="block h-full min-h-[300px] w-full touch-none bg-bg-sunk" aria-label="A string of diamonds hanging from your pointer. Move to swing it, click to pluck it." role="img" data-cursor="Pluck" />;
}

function NegativeCard() {
  const { negative } = usePrefs();
  return (
    <div className="flex h-full min-h-[300px] flex-col items-start justify-between gap-6 bg-bg-sunk p-6">
      <svg viewBox="0 0 200 120" className="keep-positive w-full max-w-[280px]" aria-hidden="true">
        <rect x="0" y="0" width="100" height="120" fill="#16120e" />
        <rect x="100" y="0" width="100" height="120" fill="#e9edf1" />
        <circle cx="100" cy="64" r="34" fill="#d9a441" />
        <path d="M100 30 a34 34 0 0 1 0 68z" fill="#265bbe" />
        <path d="M0 96 H200" stroke="#e8692c" strokeWidth="2" />
      </svg>
      <div>
        <p className="mb-4 max-w-[34ch] text-[0.9375rem] text-muted">
          Every pixel on the site, inverted. The dusk turns to a blue noon. Press <kbd className="rounded border border-line-strong px-1.5 py-0.5 t-data">N</kbd> anywhere to toggle it.
        </p>
        <button type="button" className="btn" aria-pressed={negative} onClick={(e) => toggleNegative({ x: e.clientX, y: e.clientY })}>
          {negative ? "Develop the print" : "Flip to negative"}
        </button>
      </div>
    </div>
  );
}

const anatomy = [
  { k: "Hero", v: "One fragment shader (OGL + GLSL): domain-warped fBm sky, Bayer dither, stepped lattice lens. No images." },
  { k: "Fallback", v: "A CSS-only dusk for low-power devices, data-saver and reduced motion." },
  { k: "Motion", v: "GSAP, ScrollTrigger and SplitText on Lenis smooth scroll. One easing family: expo-out." },
  { k: "Type", v: "Unbounded, Hanken Grotesk and JetBrains Mono, self-hosted and subset to Latin." },
  { k: "Build", v: "Next.js static export, TypeScript, Tailwind CSS. No runtime server." },
  { k: "Shots", v: "A Playwright pipeline captures every project at two viewports and encodes AVIF/WebP." },
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
            <ShaderPlayground />
          </Experiment>
          <Experiment n={2} title="Pattern generator" note="Stepped geometry from a seeded generator. The dividers on this site come from it.">
            <PatternGenerator />
          </Experiment>
          <Experiment n={3} title="Cursor physics" note="Verlet rope, 22 links, six constraint passes a frame. Move to swing, click to pluck.">
            <CursorPhysics />
          </Experiment>
          <Experiment n={4} title="Negative mode" note="The easter egg. A single CSS filter on the root, revealed with a View Transition.">
            <NegativeCard />
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
