"use client";

import { useEffect, useRef, useState } from "react";
import { aiWorkflow } from "@/data/site";
import SectionHead from "@/components/ui/SectionHead";
import { tick } from "@/lib/sound";
import { prefersReducedMotion } from "@/lib/motion";

const N = aiWorkflow.length;
const xs = aiWorkflow.map((_, i) => ((i + 0.5) / N) * 100);
const ys = aiWorkflow.map((s) => (s.who === "me" ? 28 : 62));

export default function Workflow() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = aiWorkflow[active];

  // "Run the loop" steps through once, on request only.
  useEffect(() => {
    if (!running) return;
    if (active >= N - 1) {
      const t = setTimeout(() => setRunning(false), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => select(active + 1, false), prefersReducedMotion() ? 2400 : 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, active]);

  function select(i: number, focus = true) {
    const n = (i + N) % N;
    setActive(n);
    tick(n / N);
    if (focus) tabs.current[n]?.focus();
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), select(active + 1));
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), select(active - 1));
    if (e.key === "Home") (e.preventDefault(), select(0));
    if (e.key === "End") (e.preventDefault(), select(N - 1));
  };

  const path = xs.map((x, i) => `${i ? "L" : "M"}${x} ${ys[i]}`).join(" ");
  const progress = active / (N - 1);

  return (
    <section id="workflow" aria-labelledby="workflow-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="AI-native workflow" id="workflow-title" title="I diagnose before I code. Then I bring the tools.">
          Claude Code, Cursor AI, JetBrains AI and Copilot are daily pair programmers for me. They don&apos;t replace the judgement; they give it more time. Step through how a piece of work moves from problem to production.
        </SectionHead>

        <div className="relative border border-line bg-bg-sunk">
          {/* lanes */}
          <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[260px] md:block" aria-hidden="true">
            <div className="absolute inset-x-0 top-0 h-1/2 border-b border-dashed border-line" />
            <span className="absolute left-4 top-3 t-data text-muted">Me</span>
            <span className="absolute left-4 top-[calc(50%+12px)] t-data text-muted">Me + AI tools</span>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d={path} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: 1 - progress, transition: "stroke-dashoffset .8s cubic-bezier(.16,1,.3,1)" }} />
            </svg>
          </div>

          <div role="tablist" aria-label="Workflow steps" aria-orientation="horizontal" onKeyDown={onKey} className="relative flex gap-2 overflow-x-auto p-4 md:block md:h-[260px] md:overflow-visible md:p-0">
            {aiWorkflow.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <button
                  key={s.key}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`wf-tab-${s.key}`}
                  aria-selected={on}
                  aria-controls="wf-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  data-cursor={on ? undefined : "Step"}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-[0.9375rem] font-semibold transition-[background-color,color,border-color,transform] duration-500 [transition-timing-function:var(--ease-out)] md:absolute md:-translate-x-1/2 md:-translate-y-1/2 ${on ? "border-accent bg-accent text-[var(--accent-ink)] md:scale-110" : done ? "border-accent/60 bg-bg text-fg" : "border-line-strong bg-bg text-muted hover:text-fg"}`}
                  style={{ left: `${xs[i]}%`, top: `${ys[i]}%` }}
                >
                  <span className="t-data mr-2 opacity-70">{i + 1}</span>
                  {s.title}
                </button>
              );
            })}
          </div>

          <div id="wf-panel" role="tabpanel" aria-labelledby={`wf-tab-${step.key}`} className="grid gap-8 border-t border-line p-6 md:grid-cols-12 md:p-10" aria-live="polite">
            <div className="md:col-span-5">
              <p className="t-data text-ochre">
                Step {active + 1} of {N} · {step.who === "me" ? "Human judgement" : "Me, paired with AI"}
              </p>
              <h3 key={step.key} className="t-h2 mt-3 !text-[clamp(1.75rem,3.4vw,3rem)] [animation:menu-in_.6s_var(--ease-out)]">
                {step.title}
              </h3>
            </div>
            <div className="md:col-span-7">
              <p key={step.key + "b"} className="max-w-[52ch] text-[1.125rem] [animation:menu-in_.6s_.05s_var(--ease-out)_both]">
                {step.body}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools used in this step">
                {step.tools.map((t) => (
                  <li key={t} className={`chip ${["Claude Code", "Cursor AI", "JetBrains AI", "Copilot", "AI review"].includes(t) ? "border-accent/70 text-fg" : "text-muted"}`}>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="btn" onClick={() => (active === N - 1 ? (setActive(0), setRunning(true)) : setRunning((r) => !r))}>
                  {running ? "Pause" : active === N - 1 ? "Run it again" : "Run the loop"}
                </button>
                <button type="button" className="btn" onClick={() => select(active + 1)} aria-label="Next step">
                  Next step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
