import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Journey from "@/components/sections/Journey";
import Services from "@/components/sections/Services";
import Workflow from "@/components/sections/Workflow";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Impact from "@/components/sections/Impact";
import Work from "@/components/sections/Work";
import CaseStudies from "@/components/sections/CaseStudies";
import Lab from "@/components/lab/Lab";
import Education from "@/components/sections/Education";
import Marquee from "@/components/ui/Marquee";
import Pattern from "@/components/ui/Pattern";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={null}><Intro /></Suspense>
      <Suspense fallback={null}><Marquee items={["Diagnose before I code", "Engineer first", "Ship it clean", "Lowveld to Highveld"]} className="border-y border-line" /></Suspense>
      <Suspense fallback={null}><Journey /></Suspense>
      <Suspense fallback={null}><Services /></Suspense>
      <Suspense fallback={null}><Workflow /></Suspense>
      <Suspense fallback={null}><Skills /></Suspense>
      <div className="wrap py-4"><Pattern cols={24} seed={5} /></div>
      <Suspense fallback={null}><Experience /></Suspense>
      <Suspense fallback={null}><Impact /></Suspense>
      <Suspense fallback={null}><Work /></Suspense>
      <Suspense fallback={null}><CaseStudies /></Suspense>
      <Suspense fallback={null}><Lab /></Suspense>
      <Suspense fallback={null}><Education /></Suspense>
    </>
  );
}
