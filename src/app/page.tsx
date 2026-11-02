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
import { isStudio } from "@/lib/variant";

/** Each section hydrates in its own Suspense chunk, so start-up work is split into small tasks. */
const S = ({ children }: { children: React.ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

function StudioHome() {
  // For clients: the work first, then what I build, how we'll work, and the lab. No employer detail.
  return (
    <>
      <Hero />
      <S><Intro /></S>
      <S><Work /></S>
      <S><Marquee items={["Design before code", "Phone-first", "Made in Gauteng", "Fast and findable"]} className="border-y border-line" /></S>
      <S><Services /></S>
      <S><Workflow /></S>
      <div className="wrap py-4"><Pattern cols={24} seed={5} /></div>
      <S><Lab /></S>
    </>
  );
}

function CvHome() {
  // For recruiters and employers: the full professional story, fintech included.
  return (
    <>
      <Hero />
      <S><Intro /></S>
      <S><Marquee items={["Diagnose before I code", "Engineer first", "Ship it clean", "Lowveld to Highveld"]} className="border-y border-line" /></S>
      <S><Journey /></S>
      <S><Services /></S>
      <S><Workflow /></S>
      <S><Skills /></S>
      <div className="wrap py-4"><Pattern cols={24} seed={5} /></div>
      <S><Experience /></S>
      <S><Impact /></S>
      <S><Work /></S>
      <S><CaseStudies /></S>
      <S><Lab /></S>
      <S><Education /></S>
    </>
  );
}

export default function Home() {
  return isStudio ? <StudioHome /> : <CvHome />;
}
