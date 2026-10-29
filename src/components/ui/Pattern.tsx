import { generatePattern, toneVar } from "@/lib/pattern";

/**
 * A band of stepped geometry used as a section divider. Draws itself in when
 * it scrolls into view (via the shared Reveal observer).
 */
export default function Pattern({ cols = 24, seed = 3, className = "", allow }: { cols?: number; seed?: number; className?: string; allow?: string[] }) {
  const shapes = generatePattern({ cols, seed, allow });
  return (
    <div data-reveal="draw" className={`pattern ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${cols} 1`} preserveAspectRatio="xMidYMid meet" className="h-auto w-full" role="presentation">
        {shapes.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            fill={s.fill ? toneVar[s.tone] : "none"}
            stroke={s.fill ? "none" : toneVar[s.tone]}
            strokeWidth={0.025}
            strokeLinejoin="miter"
            style={{ transitionDelay: `${(i % cols) * 18}ms` }}
          />
        ))}
      </svg>
    </div>
  );
}
