/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  projects.ts — the single source of truth for every project on the site.
 *
 *  To add / edit a project:
 *    1. Add or edit an entry below (slug must be URL-safe and unique).
 *    2. Run `npm run capture -- --only <slug>` to shoot screenshots + metadata.
 *       (or `npm run capture` for everything). Output lands in
 *       public/projects/<slug>/ and src/data/captures.json — the site picks
 *       those up automatically; until then a generated cover is shown.
 *    3. Search for TODO(confirm) and replace anything that isn't accurate.
 *
 *  Descriptions were written from what each live site actually shows
 *  (fetched 29 Oct 2026). Anything uncertain is marked TODO(confirm).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ProjectGroup = "client" | "concept";

export type Project = {
  slug: string;
  name: string;
  url: string;
  group: ProjectGroup;
  /** One line for cards and the strip. */
  tagline: string;
  /** 2–4 sentences for the detail page. */
  summary: string;
  /** What's on the site, as observed. Shown as a list on the detail page. */
  highlights: string[];
  /** Katlego's role. */
  role: string;
  /** Stack — only list what is known. Clues from the capture script go in `techClues`. */
  stack: string[];
  year?: string;
  /** Cover art colours used until real screenshots exist (and for accents). */
  palette: { bg: string; ink: string; accent: string };
  /** Motif for the generated cover art. */
  motif: "waves" | "grid" | "rings" | "steps" | "sun" | "leaf" | "code" | "cup";
  /** Record a hover-preview video for this project when capturing. */
  video?: boolean;
  /** Hide from the public site (e.g. URL not resolving yet). */
  hidden?: boolean;
  /** Notes for Katlego — never rendered. */
  todo?: string[];
};

export const projects: Project[] = [
  // ── Client & Brand Sites ───────────────────────────────────────────────────
  {
    slug: "mb-communications",
    name: "MB Communications",
    url: "https://mbcommunications.co.za",
    group: "client",
    tagline: "African-language radio, TV and print — in all 11 official languages.",
    summary:
      "The site for MB Communications, a black-owned African-language content specialist established in 2005. It introduces their radio and TV productions, script development, translation, voice-overs and radio adverts, then backs it up with a portfolio of past work and the numbers behind it.",
    highlights: [
      "Services laid out from script to studio: productions, scripts, translation, voice-overs, adverts, workshops",
      "Portfolio of previous work, a 'how we work' process and recognition section",
      "Key figures up front: established 2005, 2 000+ episodes, 11 languages",
      "Modern image formats (AVIF/WebP) and full Open Graph/Twitter metadata",
    ],
    role: "Design & build — TODO(confirm)",
    stack: ["TODO(confirm)"],
    palette: { bg: "#1D2433", ink: "#F3EBDD", accent: "#E0A93B" },
    motif: "waves",
    video: true,
    todo: [
      "Confirm your role and stack (Next.js? the page has a next-size-adjust meta tag, which isn't conclusive).",
      "Is this the same company as your 2019–2020 internship (MB Communications & Projects)? If so we can link them.",
    ],
  },
  {
    slug: "the-royal-affair",
    name: "The Royal Affair",
    url: "https://theroyalaffair.co.za",
    group: "client",
    tagline: "A home for TRA Creations, TRAC Magazine and Princess Mobeng. TODO(confirm)",
    summary:
      "A brand site connected to TRA Creations, TRAC Magazine and Princess Mobeng, positioned around digital media, brand strategy and creative work. TODO(confirm) — the page renders client-side, so this summary comes from its metadata only.",
    highlights: [
      "Brand hub tying together a creative studio, a magazine and a personal brand — TODO(confirm)",
      "Responsive build — TODO(confirm) details after capture",
    ],
    role: "Design & build — TODO(confirm)",
    stack: ["TODO(confirm)"],
    palette: { bg: "#24162A", ink: "#F4E9DA", accent: "#C9A55A" },
    motif: "rings",
    todo: ["Write 2–3 real highlights once screenshots are captured."],
  },
  {
    slug: "anti",
    name: "ANTI",
    url: "https://shopanti.online",
    group: "client",
    tagline: "A South African fashion label for custom, made-for-you pieces.",
    summary:
      "The online home of ANTI, a South African label that makes custom pieces — graduation and matric dance dresses, suits — through personal consultations. The site tells the brand story, shows client feedback and invites custom-order enquiries.",
    highlights: [
      "Brand story and positioning around self-expression",
      "Client feedback section and a custom-order enquiry path",
      "Newsletter sign-up",
    ],
    role: "Design & build — TODO(confirm)",
    stack: ["TODO(confirm)"],
    palette: { bg: "#151515", ink: "#EDE7DC", accent: "#B98B5E" },
    motif: "steps",
    todo: ["Confirm whether this is a storefront (e-commerce) or a brand/enquiry site."],
  },

  // ── Product & Concept Builds ───────────────────────────────────────────────
  {
    slug: "tadaa-icecream",
    name: "Tadaa!",
    url: "https://tadaa-icecream.netlify.app",
    group: "concept",
    tagline: "An artisanal ice cream shop in Cape Town, with flavours sorted by mood.",
    summary:
      "A playful site for Tadaa!, an artisanal ice cream shop in Cape Town. Flavours are colour-coded by mood, the full menu is priced, and Scoop Cards (prepaid 5- and 10-scoop cards) get their own section.",
    highlights: [
      "Colour-coded flavour 'moods' — strawberry pink, pistachio green",
      "Full priced menu, from a R5 waffle cone to take-home tubs",
      "Scoop Cards section and an Instagram-style gallery",
    ],
    role: "Design & build — TODO(confirm)",
    stack: ["Next.js", "Netlify"],
    palette: { bg: "#F6C9D2", ink: "#3D1F24", accent: "#E8692C" },
    motif: "rings",
    video: true,
    todo: [
      "og:image points at localhost:3000 on the live site — worth fixing so link previews work.",
      "Real client or concept? TODO(confirm)",
    ],
  },
  {
    slug: "rooted-in-culture",
    name: "Rooted In Culture",
    url: "https://rooted-in-culture.netlify.app",
    group: "concept",
    tagline: "Heritage outerwear from Johannesburg.",
    summary:
      "A brand site for Rooted In Culture, a heritage outerwear label from Johannesburg. TODO(confirm) — the page renders client-side, so this comes from its title only.",
    highlights: ["TODO(confirm) — add 2–3 highlights after capture"],
    role: "Design & build — TODO(confirm)",
    stack: ["TODO(confirm)"],
    palette: { bg: "#33241A", ink: "#F1E3CF", accent: "#C47A3A" },
    motif: "steps",
  },
  {
    slug: "breathe",
    name: "Breathe",
    url: "https://breathe--hb.netlify.app",
    group: "concept",
    tagline: "TODO(confirm)",
    summary: "TODO(confirm) — this URL did not resolve when checked.",
    highlights: [],
    role: "TODO(confirm)",
    stack: ["TODO(confirm)"],
    palette: { bg: "#DCE6DF", ink: "#1F3B33", accent: "#2F7D66" },
    motif: "leaf",
    hidden: true,
    todo: [
      "URL fails: tried breathe--hb, breathe-hb, breathehb, breathe-health (.netlify.app). 'x--y.netlify.app' is Netlify's branch-deploy format — please send the real production URL, then set hidden: false.",
    ],
  },
  {
    slug: "solar-republic",
    name: "Solar Republic",
    url: "https://solar-republic.netlify.app",
    group: "concept",
    tagline: "A solar installer site built around a live savings calculator.",
    summary:
      "A marketing site for a South African solar installer selling grid-tied and hybrid systems across Gauteng and the Western Cape. Three priced system tiers, a slider-driven savings calculator, a four-step process from quote to switch-on, and before-and-after case studies.",
    highlights: [
      "Savings calculator with sliders: system size, cost, finance and 25-year savings",
      "Three system tiers with transparent price ranges",
      "Four-step journey: quote → site visit → install → switch-on",
      "Case studies with before-and-after monthly costs",
    ],
    role: "Design & build — TODO(confirm)",
    stack: ["Next.js", "Netlify"],
    palette: { bg: "#10283A", ink: "#F3EEE2", accent: "#F2B705" },
    motif: "sun",
    video: true,
    todo: ["Stats counters render as 0 before JS kicks in — worth server-rendering the real numbers."],
  },
  {
    slug: "khula-stokvel",
    name: "Khula",
    url: "https://khula-stokvel.netlify.app",
    group: "concept",
    tagline: "Stokvels, managed and transparent — a fintech landing page.",
    summary:
      "A landing page for Khula, a concept that turns stokvels into managed savings groups: automatic contributions, a shared live balance and group-voted payouts. An interactive calculator projects how a pool grows, and the page ends in a waitlist.",
    highlights: [
      "Pool → Track → Pay out, explained in three steps",
      "Interactive growth calculator, clearly labelled as an estimate",
      "Scenarios for burial societies, family clubs and investment circles",
      "Waitlist sign-up and regulatory/legal footer",
    ],
    role: "Design & build — TODO(confirm)",
    stack: ["TODO(confirm)", "Netlify"],
    palette: { bg: "#0F3A2E", ink: "#EFF3E6", accent: "#A6E07C" },
    motif: "grid",
    video: true,
  },
  {
    slug: "codeline-academy",
    name: "Codeline Academy",
    url: "https://codeline-academy.netlify.app",
    group: "concept",
    tagline: "A 12-week coding bootcamp site with a live code playground.",
    summary:
      "An admissions site for Codeline Academy, a Johannesburg coding bootcamp concept with 12-week cohorts in full-stack web, data & AI, and mobile. The hero hands you an in-browser JavaScript editor before it asks you to apply.",
    highlights: [
      "In-browser JavaScript playground (FizzBuzz) right on the landing page",
      "Three priced cohorts with a live 'seats remaining' block",
      "Email-gated free sample lesson and an employer-partnership pitch",
    ],
    role: "Design & build — TODO(confirm)",
    stack: ["TODO(confirm)", "Netlify"],
    palette: { bg: "#0E1420", ink: "#E9EEF7", accent: "#5CC8E0" },
    motif: "code",
    video: true,
  },
  {
    slug: "mokala-reserve",
    name: "Mokala Reserve",
    url: "https://mokala-reserve.netlify.app",
    group: "concept",
    tagline: "Six suites on the edge of the Kruger — a slow, editorial lodge site.",
    summary:
      "An editorial site for Mokala Reserve, a six-suite safari lodge concept on a private concession bordering the Kruger. Suites, days in the bush, a journal and an enquiry flow — no booking engine, just a conversation.",
    highlights: [
      "Six named suites with per-person rates",
      "'The Days': drives, walking safaris, sleep-outs, dining and spa",
      "A journal section and an enquiry-led booking flow",
      "Skip-to-content link and full social metadata",
    ],
    role: "Design & build — TODO(confirm)",
    stack: ["Next.js", "Netlify"],
    palette: { bg: "#27261C", ink: "#EFE6D3", accent: "#C9A66B" },
    motif: "sun",
    todo: ["The footer 'Now in the bush' clock shows '— : —' without JS — consider a server-rendered fallback."],
  },
  {
    slug: "naked-kitchen",
    name: "Naked Kitchen & Coffee Bar",
    url: "https://naked-kitchen.netlify.app",
    group: "concept",
    tagline: "A modern coffee shop in Morningside, Sandton.",
    summary:
      "A site for Naked Kitchen & Coffee Bar, a modern coffee shop in Morningside, Sandton. TODO(confirm) — the page renders client-side, so this comes from its metadata only.",
    highlights: ["TODO(confirm) — add 2–3 highlights after capture"],
    role: "Design & build — TODO(confirm)",
    stack: ["TODO(confirm)"],
    palette: { bg: "#EAE1D2", ink: "#2B2621", accent: "#9A6B3F" },
    motif: "cup",
  },
  {
    slug: "coffee-canony",
    name: "Coffee Canony",
    url: "https://coffee-canony.netlify.app",
    group: "concept",
    tagline: "Not just your average coffee — Shop 15, Karaglen Mall.",
    summary:
      "A site for Coffee Canony, a coffee shop at Karaglen Mall. TODO(confirm) — the page renders client-side, so this comes from its metadata only.",
    highlights: ["TODO(confirm) — add 2–3 highlights after capture"],
    role: "Design & build — TODO(confirm)",
    stack: ["TODO(confirm)"],
    palette: { bg: "#3A2418", ink: "#F3E6D6", accent: "#D9A86C" },
    motif: "cup",
    todo: ["Spelling: 'Canony' as on the site title — or 'Canopy'?"],
  },
];

export const publicProjects = projects.filter((p) => !p.hidden);

export const groupLabel: Record<ProjectGroup, string> = {
  client: "Client & brand sites",
  concept: "Product & concept builds",
};

export function getProject(slug: string) {
  return publicProjects.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = publicProjects.findIndex((p) => p.slug === slug);
  return publicProjects[(i + 1) % publicProjects.length];
}

/** Strip TODO(confirm) markers for public rendering (they stay in this file for Katlego to resolve). */
export function clean(text: string) {
  return text.replace(/\s*[—-]?\s*TODO\(confirm\)[^.]*\.?/g, "").trim();
}

/** Stack entries that are known (TODO placeholders removed). */
export function knownStack(p: Project) {
  return p.stack.filter((s) => !s.includes("TODO"));
}
