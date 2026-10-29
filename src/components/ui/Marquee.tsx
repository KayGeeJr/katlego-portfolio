/** Big outlined kinetic type. Pauses on hover, stops for reduced motion. Decorative: content is duplicated for the loop. */
export default function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <div className="marquee__track" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-12">
          <span className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.03em] [-webkit-text-stroke:1.5px_var(--fg)] [color:transparent]">{t}</span>
          <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" className="shrink-0">
            <path d="M22 2l20 20-20 20L2 22z M22 12l10 10-10 10-10-10z" fill="none" stroke="var(--ochre)" strokeWidth="2" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee py-6 ${className}`}>
      <p className="sr-only">{items.join(". ")}</p>
      {row(true)}
      {row(true)}
    </div>
  );
}
