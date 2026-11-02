import type { Project } from "@/data/projects";
import { getCapture, type Frame } from "@/lib/captures";
import { generatePattern } from "@/lib/pattern";

/** Responsive <picture> for a captured frame: AVIF → WebP, with an inline blur placeholder. */
export function FramePicture({ frame, alt, sizes, className = "", priority = false, fit = "cover" }: { frame: Frame; alt: string; sizes: string; className?: string; priority?: boolean; fit?: "cover" | "top" }) {
  const avif = frame.sources.map((s) => `${s.avif} ${s.w}w`).join(", ");
  const webp = frame.sources.map((s) => `${s.webp} ${s.w}w`).join(", ");
  const largest = frame.sources[frame.sources.length - 1];
  const h = Math.round((frame.height / frame.width) * largest.w);
  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={largest.webp}
        width={largest.w}
        height={h}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`h-full w-full ${fit === "top" ? "object-cover object-top" : "object-cover"} ${className}`}
        style={{ backgroundImage: `url(${frame.blur})`, backgroundSize: "cover" }}
      />
    </picture>
  );
}

const motifFor: Record<Project["motif"], string[]> = {
  waves: ["chevron", "steps"],
  grid: ["frame", "split"],
  rings: ["diamond", "frame"],
  steps: ["steps", "ladder"],
  sun: ["steps", "split"],
  leaf: ["chevron", "diamond"],
  code: ["ladder", "frame"],
  cup: ["frame", "chevron"],
};

function hashSlug(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * Generated cover art, used until real screenshots are captured. Built from the
 * project's own palette and a stepped motif — clearly art, never a fake screenshot.
 */
export function ProjectCover({ project, className = "", variant = "card" }: { project: Project; className?: string; variant?: "card" | "wide" }) {
  const { bg, ink, accent } = project.palette;
  const cols = variant === "wide" ? 8 : 5;
  const shapes = generatePattern({ cols, rows: 1, seed: hashSlug(project.slug), allow: motifFor[project.motif], gap: 0.18 });
  const tone = (t: string) => (t === "fg" ? ink : t === "accent" || t === "ochre" ? accent : t === "dusk" ? accent : ink);
  const host = project.url.replace(/^https?:\/\//, "");
  const W = variant === "wide" ? 1600 : 1000;
  const H = variant === "wide" ? 900 : 625;
  const cell = W / cols;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-full w-full ${className}`} role="img" aria-label={`${project.name} — cover art`} preserveAspectRatio="xMidYMid slice">
      <rect width={W} height={H} fill={bg} />
      {/* browser chrome hint */}
      <g opacity="0.5">
        <rect x={W * 0.05} y={H * 0.07} width={W * 0.9} height={1.5} fill={ink} opacity="0.3" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={W * 0.05 + 6 + i * 18} cy={H * 0.045} r="5" fill="none" stroke={ink} strokeWidth="1.5" />
        ))}
        <text x={W * 0.95} y={H * 0.052} textAnchor="end" fill={ink} fontFamily="var(--font-jetbrains), monospace" fontSize={W * 0.016}>
          {host}
        </text>
      </g>
      <g transform={`translate(0 ${(variant === "wide" ? H * 0.62 : H * 0.55) - cell / 2}) scale(${cell})`}>
        {shapes.map((s, i) => (
          <path key={i} d={s.d} fill={s.fill ? tone(s.tone) : "none"} stroke={s.fill ? "none" : tone(s.tone)} strokeWidth={0.02} opacity={s.fill ? 0.9 : 0.75} />
        ))}
      </g>
      {variant === "wide" && <text x={W * 0.05} y={H * 0.3} fill={ink} fontFamily="var(--font-unbounded), sans-serif" fontWeight="700" fontSize={W * (project.name.length > 14 ? 0.055 : 0.075)} letterSpacing="-0.03em">
        {project.name}
      </text>}
    </svg>
  );
}

/** Captured screenshot if available, otherwise generated cover art. */
export default function ProjectMedia({ project, frameKey = "desktop-hero", sizes = "(min-width: 1024px) 40vw, 85vw", priority = false, variant = "card", className = "" }: { project: Project; frameKey?: string; sizes?: string; priority?: boolean; variant?: "card" | "wide"; className?: string }) {
  const cap = getCapture(project.slug);
  const frame = cap?.frames.find((f) => f.key === frameKey) ?? cap?.frames.find((f) => f.key === cap.chosen[0]);
  if (frame) return <FramePicture frame={frame} sizes={sizes} priority={priority} alt={`The ${project.name} website on desktop and mobile`} className={className} fit={frame.key === "mockup" ? "cover" : "top"} />;
  return <ProjectCover project={project} variant={variant} className={className} />;
}
