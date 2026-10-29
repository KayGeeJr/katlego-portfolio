import SplitHeading from "./SplitHeading";

export default function SectionHead({ tag, title, id, children, className = "" }: { tag: string; title: React.ReactNode; id: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-14 grid gap-6 md:mb-20 lg:grid-cols-12 ${className}`}>
      <p className="section-tag lg:col-span-3 lg:pt-3">
        <span aria-hidden="true" className="inline-block h-2 w-2 translate-y-[-1px] bg-ochre" />
        {tag}
      </p>
      <div className="lg:col-span-9">
        <SplitHeading id={id} className="t-h2 max-w-[18ch]">
          {title}
        </SplitHeading>
        {children && <div className="mt-6 max-w-[58ch] text-muted">{children}</div>}
      </div>
    </div>
  );
}
