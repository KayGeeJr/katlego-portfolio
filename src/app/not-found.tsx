import type { Metadata } from "next";
import TransitionLink from "@/components/chrome/TransitionLink";
import Pattern from "@/components/ui/Pattern";

export const metadata: Metadata = { title: "Off the map", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[100svh] flex-col justify-center gap-10 pb-16 pt-32">
      <p className="t-data text-ochre">00.00° S, 00.00° E</p>
      <h1 className="t-display">404</h1>
      <div className="grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <p className="t-h2">Off the map.</p>
          <p className="mt-4 max-w-[44ch] text-muted">
            This page isn&apos;t anywhere between Nelspruit and Kempton Park. It may have moved, or the link has a typo.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <TransitionLink href="/" className="btn btn-solid">Back home</TransitionLink>
          <a href="/#work" className="btn">See the work</a>
        </div>
      </div>
      <Pattern cols={20} seed={404} />
    </div>
  );
}
