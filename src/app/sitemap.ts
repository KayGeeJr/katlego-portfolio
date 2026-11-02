import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { isStudio } from "@/lib/variant";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...(isStudio ? [] : [{ url: `${site.url}/cv`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.7 }]),
  ];
}
