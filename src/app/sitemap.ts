import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { publicProjects } from "@/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/cv`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    ...publicProjects.map((p) => ({ url: `${site.url}/project/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
