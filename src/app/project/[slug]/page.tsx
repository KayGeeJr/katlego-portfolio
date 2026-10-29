import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicProjects, getProject, nextProject, groupLabel, clean, knownStack } from "@/data/projects";
import { getCapture } from "@/lib/captures";
import { site } from "@/data/site";
import ProjectMedia, { FramePicture, ProjectCover } from "@/components/work/ProjectMedia";
import TransitionLink from "@/components/chrome/TransitionLink";
import SplitHeading from "@/components/ui/SplitHeading";
import Magnetic from "@/components/chrome/Magnetic";

export const dynamicParams = false;

export function generateStaticParams() {
  return publicProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const cap = getCapture(slug);
  const og = cap?.frames.find((f) => f.key === "desktop-hero")?.sources.at(-1)?.webp;
  const description = clean(p.summary).slice(0, 158);
  return {
    title: p.name,
    description,
    alternates: { canonical: `/project/${slug}` },
    openGraph: { title: `${p.name} — ${site.name}`, description, url: `/project/${slug}`, images: og ? [{ url: og, width: 1440, height: 900, alt: `Screenshot of ${p.name}` }] : undefined },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const cap = getCapture(slug);
  const next = nextProject(slug);
  const stack = knownStack(p);
  const highlights = p.highlights.map(clean).filter(Boolean);
  const host = p.url.replace(/^https?:\/\//, "");
  const desktopGallery = cap?.frames.filter((f) => f.key.startsWith("desktop") && f.key !== "desktop-hero") ?? [];
  const mobileGallery = cap?.frames.filter((f) => f.key.startsWith("mobile")) ?? [];
  const index = publicProjects.findIndex((x) => x.slug === slug);

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    url: p.url,
    description: clean(p.summary),
    creator: { "@type": "Person", name: site.name, url: site.url },
  };

  return (
    <article className="pt-28 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-3 text-[0.9375rem] text-muted">
          <TransitionLink href="/projects" className="link-u">Projects</TransitionLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-fg">{p.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="section-tag mb-6">
              <span aria-hidden="true" className="inline-block h-2 w-2" style={{ background: p.palette.accent }} />
              {groupLabel[p.group]}
              <span className="t-data text-ochre">{String(index + 1).padStart(2, "0")}/{String(publicProjects.length).padStart(2, "0")}</span>
            </p>
            <SplitHeading as="h1" className="t-h1">{p.name}</SplitHeading>
            <p className="t-lead mt-6 max-w-[34ch] text-muted">{clean(p.tagline)}</p>
          </div>
          <dl className="grid content-end gap-5 text-[0.9375rem] lg:col-span-4">
            <div className="border-t border-line pt-3">
              <dt className="text-muted">Role</dt>
              <dd>{clean(p.role) || "Design & build"}</dd>
            </div>
            {stack.length > 0 && (
              <div className="border-t border-line pt-3">
                <dt className="text-muted">Stack</dt>
                <dd>{stack.join(", ")}</dd>
              </div>
            )}
            {p.year && (
              <div className="border-t border-line pt-3">
                <dt className="text-muted">Year</dt>
                <dd>{p.year}</dd>
              </div>
            )}
            <div className="border-t border-line pt-3">
              <dt className="text-muted">Live site</dt>
              <dd>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="link-u t-data">
                  {host} <span className="sr-only">(opens in a new tab)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="wrap mt-14 md:mt-20">
        <div className="relative aspect-[16/9] overflow-hidden border border-line bg-bg-raised">
          <ProjectMedia project={p} variant="wide" priority sizes="(min-width: 1600px) 1500px, 100vw" />
        </div>
      </div>

      <section className="section wrap grid gap-12 lg:grid-cols-12" aria-labelledby="overview">
        <h2 id="overview" className="section-tag lg:col-span-3 lg:pt-2">
          <span aria-hidden="true" className="inline-block h-2 w-2 bg-ochre" />
          Overview
        </h2>
        <div className="lg:col-span-9">
          <p className="t-lead max-w-[40ch]">{clean(p.summary)}</p>
          {highlights.length > 0 && (
            <ul className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
              {highlights.map((h, i) => (
                <li key={h} className="flex gap-4 bg-bg p-6">
                  <span className="t-data text-ochre">{String(i + 1).padStart(2, "0")}</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-12">
            <Magnetic>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                Visit {host} <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      {cap && (desktopGallery.length > 0 || mobileGallery.length > 0) && (
        <section className="wrap pb-[var(--section-y)]" aria-labelledby="gallery">
          <h2 id="gallery" className="section-tag mb-10">
            <span aria-hidden="true" className="inline-block h-2 w-2 bg-ochre" />
            Gallery
          </h2>
          <div className="grid gap-6 lg:grid-cols-12">
            {desktopGallery.map((f) => (
              <figure key={f.key} className="lg:col-span-8">
                <div className={`overflow-hidden border border-line bg-bg-raised ${f.key.includes("full") ? "max-h-[80vh] overflow-y-auto" : ""}`} tabIndex={f.key.includes("full") ? 0 : undefined} aria-label={f.key.includes("full") ? `${f.label}, scrollable` : undefined}>
                  <FramePicture frame={f} alt={`${p.name}, ${f.label.toLowerCase()}`} sizes="(min-width: 1024px) 66vw, 100vw" />
                </div>
                <figcaption className="mt-3 text-[0.875rem] text-muted">{f.label}</figcaption>
              </figure>
            ))}
            <div className="grid grid-cols-2 gap-6 lg:col-span-4 lg:grid-cols-1">
              {mobileGallery.map((f) => (
                <figure key={f.key}>
                  <div className={`mx-auto max-w-[300px] overflow-hidden rounded-[2rem] border-[6px] border-bg-raised bg-bg-raised ring-1 ring-line ${f.key.includes("full") ? "max-h-[640px] overflow-y-auto" : ""}`}>
                    <FramePicture frame={f} alt={`${p.name}, ${f.label.toLowerCase()}`} sizes="300px" />
                  </div>
                  <figcaption className="mt-3 text-center text-[0.875rem] text-muted">{f.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          {cap.tech.length > 0 && (
            <p className="mt-10 text-[0.875rem] text-muted">
              Detected under the hood: <span className="t-data text-fg">{cap.tech.filter((t) => !t.startsWith("server")).join(", ")}</span>
            </p>
          )}
        </section>
      )}

      <nav aria-label="Next project" className="border-t border-line">
        <TransitionLink href={`/project/${next.slug}`} data-cursor="Next" className="group wrap grid items-center gap-8 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <p className="mb-4 text-[0.9375rem] text-muted">Next project</p>
            <p className="t-h1 transition-colors duration-500 group-hover:text-accent">{next.name}</p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden border border-line md:col-span-5">
            <div className="h-full w-full transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out)] group-hover:scale-105">
              {getCapture(next.slug) ? <ProjectMedia project={next} sizes="40vw" /> : <ProjectCover project={next} />}
            </div>
          </div>
        </TransitionLink>
      </nav>
    </article>
  );
}
