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
      <Intro />
      <Marquee items={["Diagnose before I code", "Engineer first", "Ship it clean", "Lowveld to Highveld"]} className="border-y border-line" />
      <Journey />
      <Services />
      <Workflow />
      <Skills />
      <div className="wrap py-4"><Pattern cols={24} seed={5} /></div>
      <Experience />
      <Impact />
      <Work />
      <CaseStudies />
      <Lab />
      <Education />
    </>
  );
}
