/**
 * Copy for the private, client-facing web-dev profile (NEXT_PUBLIC_VARIANT=studio).
 * Keep it about what clients get. Employer detail (banks, fintech platforms) lives only in the CV version.
 */

export const studioHero = {
  lead: "I design and build websites for South African businesses: brand sites, online stores and sites that do something, made to load fast and look like nobody else.",
  strap: "Websites, online stores & web apps",
};

export const studioIntro = {
  lead: "Your website should feel like your business, not a template.",
  body: [
    "I'm a Kempton Park–based web developer with more than six years of building production web and mobile apps. I design in Figma first, so you see and approve your site before a line of code is written.",
    "Then I build it properly: fast, responsive on every phone, accessible, and easy to grow. I use AI tools to move quickly on the routine work, and I check every line myself.",
  ],
  points: [
    { title: "Design before code", body: "Wireframes and a clickable prototype to agree on before the build starts, so there are no surprises." },
    { title: "Phone-first", body: "Most of your customers will meet you on a phone. Every site is built for small screens first." },
    { title: "Fast and findable", body: "Optimised images, clean code and search basics, so the site loads quickly and Google can read it." },
  ],
};

export const studioServices = [
  {
    title: "Brand & business websites",
    body: "A site that tells your story and gets people to call, book or visit. Think MB Communications, The Royal Affair or Breathe JHB.",
    tags: ["Custom design", "Mobile-first", "Booking & enquiry flows", "Search basics"],
  },
  {
    title: "Online stores",
    body: "Product pages, collections and custom-order flows for brands that sell online, like ANTI and Luxe Era.",
    tags: ["Product catalogue", "Custom orders", "Newsletter sign-up", "Brand photography layouts"],
  },
  {
    title: "Web apps & interactive tools",
    body: "When your site needs to do something, not just say something: calculators, dashboards, portals and playgrounds, like Solar Republic's savings calculator or Codeline's live code editor.",
    tags: ["React", "Angular", "Calculators", "Dashboards"],
  },
];

export const studioProcess = {
  lanes: { top: "With you", bottom: "In the studio" },
  steps: [
    { key: "talk", title: "Talk", lane: "top", body: "We talk about your business, your customers and what the site has to achieve. I'll tell you what you need and what you can skip.", tools: ["Call or meeting", "Brief"] },
    { key: "design", title: "Design", lane: "bottom", body: "Wireframes, then a clickable prototype in Figma. You see the real look and flow, and we change it until it's right.", tools: ["Figma", "Prototype"] },
    { key: "build", title: "Build", lane: "bottom", body: "I build it with modern tools (React, Next.js, Tailwind), with AI pair programmers for the routine work and my own eyes on every line.", tools: ["React / Next.js", "AI-assisted", "Tested"] },
    { key: "review", title: "Review", lane: "top", body: "You click through the real site on your own phone and laptop. We fix, tweak and polish together.", tools: ["Preview link", "Feedback round"] },
    { key: "launch", title: "Launch", lane: "top", body: "Domain, hosting and a final check on real devices. Then a walkthrough, so you know how everything works.", tools: ["Go live", "Handover"] },
  ],
} as const;

export const studioContact = {
  title: "Got a project? Let's build it.",
  intro: "Tell me a little about your business and what you need. I'll reply with questions and next steps.",
  needs: ["A new website", "An online store", "A redesign", "A web app or tool", "Something else"],
};
