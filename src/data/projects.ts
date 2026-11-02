/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  projects.ts — every site shown in the work strip (both the CV and the
 *  studio versions read from here).
 *
 *  Cards link straight to the live site — there are no detail pages.
 *
 *  To add a site:
 *    1. Add an entry below (slug must be unique and URL-safe).
 *    2. Put a screenshot at shots-in/<slug>.png and run `npm run import-shots`
 *       (or capture the live site with `npm run capture -- --only <slug>`).
 *    3. Rebuild. Order in this file = order on the site.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ProjectGroup = "client" | "concept";

export type Project = {
  slug: string;
  name: string;
  url: string;
  group: ProjectGroup;
  /** Short category, e.g. "Yoga studio, Parkhurst". */
  kind: string;
  /** One line under the card. */
  tagline: string;
  /** Fallback cover art (used only if there's no screenshot). */
  palette: { bg: string; ink: string; accent: string };
  motif: "waves" | "grid" | "rings" | "steps" | "sun" | "leaf" | "code" | "cup";
  hidden?: boolean;
};

export const projects: Project[] = [
  // ── Client & brand sites ───────────────────────────────────────────────────
  {
    slug: "mb-communications",
    name: "MB Communications",
    url: "https://mbcommunications.co.za",
    group: "client",
    kind: "Media & language services",
    tagline: "African-language radio, TV and print, in all 11 official languages.",
    palette: { bg: "#1D2433", ink: "#F3EBDD", accent: "#E0A93B" },
    motif: "waves",
  },
  {
    slug: "the-royal-affair",
    name: "The Royal Affair",
    url: "https://theroyalaffair.co.za",
    group: "client",
    kind: "Digital media & brand strategy",
    tagline: "A home for TRA Creations, TRAC Magazine and Princess Mobeng.",
    palette: { bg: "#24162A", ink: "#F4E9DA", accent: "#C9A55A" },
    motif: "rings",
  },
  {
    slug: "anti",
    name: "ANTI",
    url: "https://shopanti.online",
    group: "client",
    kind: "Fashion e-commerce",
    tagline: "Progressive South African fashion, from Johannesburg to the global runway.",
    palette: { bg: "#151515", ink: "#EDE7DC", accent: "#B98B5E" },
    motif: "steps",
  },
  {
    slug: "luxe-era",
    name: "Luxe Era",
    url: "https://luxe-era.netlify.app",
    group: "client",
    kind: "Home décor e-commerce",
    tagline: "Handmade concrete home collections, made in South Africa.",
    palette: { bg: "#E9EBEE", ink: "#151515", accent: "#6B6F76" },
    motif: "grid",
  },

  // ── Product & concept builds ───────────────────────────────────────────────
  {
    slug: "breathe",
    name: "Breathe JHB",
    url: "https://breathe-jhb.netlify.app",
    group: "concept",
    kind: "Yoga & breathwork studio",
    tagline: "A calm booking-first site for a Parkhurst yoga studio.",
    palette: { bg: "#F1EBE3", ink: "#2A211C", accent: "#C0623F" },
    motif: "leaf",
  },
  {
    slug: "solar-republic",
    name: "Solar Republic",
    url: "https://solar-republic.netlify.app",
    group: "concept",
    kind: "Solar installer",
    tagline: "Quotes in 90 seconds, with a live savings calculator.",
    palette: { bg: "#10283A", ink: "#F3EEE2", accent: "#F2B705" },
    motif: "sun",
  },
  {
    slug: "khula-stokvel",
    name: "Khula",
    url: "https://khula-stokvel.netlify.app",
    group: "concept",
    kind: "Fintech: stokvels",
    tagline: "Stokvels, managed and transparent.",
    palette: { bg: "#0F3A2E", ink: "#EFF3E6", accent: "#A6E07C" },
    motif: "grid",
  },
  {
    slug: "codeline-academy",
    name: "Codeline Academy",
    url: "https://codeline-academy.netlify.app",
    group: "concept",
    kind: "Coding bootcamp",
    tagline: "Become a full-stack developer in 12 weeks, with a live code playground.",
    palette: { bg: "#0E1420", ink: "#E9EEF7", accent: "#5CC8E0" },
    motif: "code",
  },
  {
    slug: "mokala-reserve",
    name: "Mokala Reserve",
    url: "https://mokala-reserve.netlify.app",
    group: "concept",
    kind: "Private safari lodge",
    tagline: "Six suites on the edge of the Kruger. The whole of the bush, slowly.",
    palette: { bg: "#27261C", ink: "#EFE6D3", accent: "#C9A66B" },
    motif: "sun",
  },
];

export const publicProjects = projects.filter((p) => !p.hidden);

export const groupLabel: Record<ProjectGroup, string> = {
  client: "Client & brand sites",
  concept: "Product & concept builds",
};

export function hostOf(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
