import type { Metadata } from "next";
import ProjectIndex from "./ProjectIndex";
import SplitHeading from "@/components/ui/SplitHeading";
import { publicProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Every site Katlego Nkuna has shipped: client and brand sites, plus product and concept builds.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="wrap pb-[var(--section-y)] pt-32 md:pt-44">
      <p className="section-tag mb-6">
        <span aria-hidden="true" className="inline-block h-2 w-2 bg-ochre" />
        Index
      </p>
      <SplitHeading as="h1" className="t-h1 mb-6 max-w-[14ch]">All {publicProjects.length} projects, side by side.</SplitHeading>
      <p className="mb-16 max-w-[52ch] text-muted">
        Client and brand sites first, then the product and concept builds where I try ideas out. The fintech work lives on the home page, under NDA.
      </p>
      <ProjectIndex />
    </div>
  );
}
