import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { isStudio } from "@/lib/variant";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // The studio profile is private by default: shared by link, not listed in search.
  if (isStudio && process.env.NEXT_PUBLIC_STUDIO_INDEX !== "1") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${site.url}/sitemap.xml`, host: site.url };
}
