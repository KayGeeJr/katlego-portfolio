/**
 * All biographical content. Every fact here comes from Katlego's CV (Apr 2026).
 * Don't add employers, metrics or testimonials that aren't in the CV.
 */

export const site = {
  name: "Katlego Nkuna",
  shortName: "Katlego",
  role: "Software Developer",
  roleLong: "Software Developer — Frontend, Full-Stack, AI-augmented builder",
  location: "Kempton Park, Gauteng, South Africa",
  email: "katlegonkunajr@gmail.com",
  linkedin: "https://www.linkedin.com/in/katlegonkuna",
  linkedinLabel: "linkedin.com/in/katlegonkuna",
  cvPdf: "/katlego-nkuna-cv.pdf",
  // TODO(confirm): set the production domain once you have one.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://katlegonkuna.netlify.app",
  timezone: "Africa/Johannesburg",
  description:
    "Katlego Nkuna is a Kempton Park–based software developer with 6+ years of frontend-focused work on South African fintech and banking platforms, pairing engineering judgement with AI tooling.",
};

export const intro = {
  lead: "I build interfaces that move money, and the sites that move people.",
  body: [
    "I'm a software developer with 6+ years of frontend-focused experience, most of it inside South African fintech: payment terminals, merchant platforms and the dashboards that keep banking APIs honest.",
    "I work in React, Angular and Vue, and I'm growing into the full stack with .NET/C#, Node.js and Azure. I'm an engineer first and a programmer second — I diagnose before I code, weigh the trade-offs, then build the clean, maintainable version.",
  ],
};

export type JourneyStop = {
  place: string;
  region: string;
  lat: number;
  lon: number;
  note: string;
  years?: string;
};

// Coordinates are city centres (WGS84). Order follows the path Katlego described.
export const journey: JourneyStop[] = [
  { place: "Nelspruit", region: "Mpumalanga", lat: -25.4753, lon: 30.9694, note: "Web developer at Umshiny IT Solutions", years: "2020–2023" },
  { place: "Pretoria", region: "Gauteng", lat: -25.7545, lon: 28.2314, note: "BCom Informatics, University of Pretoria", years: "2018–2020" },
  { place: "Sandton", region: "Gauteng", lat: -26.1076, lon: 28.0567, note: "Software developer at Dashpay", years: "2023–now" },
  { place: "Kempton Park", region: "Gauteng", lat: -26.1003, lon: 28.2300, note: "Home base. Where I started, as an intern at MB Communications", years: "2019 · now" },
];

export const services = [
  {
    title: "Frontend & design systems",
    body: "Component libraries, responsive UI and the Figma work that comes before it. I've owned wireframes-to-prototype flows and introduced a reusable React library that cut feature delivery time across projects.",
    tags: ["React", "Angular", "Vue", "Figma", "Component-driven design"],
  },
  {
    title: "Fintech & payments platforms",
    body: "Merchant tools, POS terminal management and real-time monitoring for South Africa's major banks. Software where 'it mostly works' isn't a state you can ship.",
    tags: ["POS & microPOS", "REST integration", "Monitoring", "Agile delivery"],
  },
  {
    title: "AI-augmented full-stack",
    body: "Frontend depth, a growing backend in .NET/C#, Node.js and Azure, and AI tools as daily pair programmers. Faster delivery, same bar for quality.",
    tags: [".NET", "Node.js", "Azure", "Claude Code", "Cursor"],
  },
];

export type SkillGroup = { group: string; items: { name: string; note?: string }[] };

export const skills: SkillGroup[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript (ES2022+)", "C#", "Java", "Kotlin", "HTML5", "CSS3"].map((name) => ({ name })) },
  {
    group: "Frontend",
    items: [
      { name: "React 18" }, { name: "Angular 17+" }, { name: "Vue 3" }, { name: "React Native" },
      { name: "Next.js", note: "learning" }, { name: "SASS/LESS" }, { name: "Tailwind CSS" },
    ],
  },
  { group: "State & architecture", items: ["Redux", "NgRx", "RxJS", "Component-driven design", "Micro-frontend patterns", "REST API integration"].map((name) => ({ name })) },
  { group: "Backend & APIs", items: [".NET Core / .NET 6+", "ASP.NET Core", "Node.js", "Express.js", "RESTful APIs", "Microservices"].map((name) => ({ name })) },
  { group: "Cloud & DevOps", items: ["Azure Functions", "App Services", "Service Bus", "API Management", "Azure DevOps", "CI/CD", "Git", "GitHub"].map((name) => ({ name })) },
  { group: "Data", items: ["SQL Server", "MongoDB", "RESTful data design", "Entity Framework (basics)"].map((name) => ({ name })) },
  { group: "Testing & quality", items: ["Jest", "Cypress (E2E)", "Jasmine", "Karma", "Unit testing", "TDD principles", "Code review"].map((name) => ({ name })) },
  { group: "Design & UX", items: ["Figma", "Adobe XD", "Wireframing", "Hi-fi prototyping", "Responsive design", "Accessibility (WCAG basics)"].map((name) => ({ name })) },
  { group: "AI dev tooling", items: ["Claude Code", "Cursor AI", "JetBrains Rider & WebStorm AI", "GitHub Copilot", "AI-assisted review & refactoring"].map((name) => ({ name })) },
  { group: "Workflow", items: ["Agile / Scrum", "Jira", "Confluence", "Postman", "VS Code", "SDLC"].map((name) => ({ name })) },
];

export type Role = {
  title: string;
  company: string;
  place: string;
  period: string;
  stack: string;
  points: string[];
};

export const experience: Role[] = [
  {
    title: "Software Developer (Frontend & Full-Stack)",
    company: "Dashpay — Merchant Solutions",
    place: "Sandton",
    period: "Aug 2023 — Present",
    stack: "Angular · Vue · React Native · C# · Java",
    points: [
      "Developed GetPaid+, an inventory and reporting platform for small merchants built for FNB — React Native on mobile, Angular on web — giving merchants real-time visibility into stock, sales and performance.",
      "Built ARMS, a POS terminal management platform for FNB, ABSA, Standard Bank and Nedbank, streamlining onboarding and repair workflows for thousands of terminals nationwide.",
      "Developed features in Dashpay POS, a payment app on Android terminals for Dashpay, ABSA and Standard Bank (Java, Kotlin, XML).",
      "Designed and shipped Lighthouse, a real-time Angular monitoring dashboard with live alerts for banking APIs, improving uptime and incident response.",
      "Owned UI/UX end-to-end in Figma and Adobe XD for microPOS and generic payment interfaces.",
      "Adopted Claude Code and Cursor AI as core tools — less boilerplate, faster reviews and refactors.",
    ],
  },
  {
    title: "Web Developer",
    company: "Umshiny IT Solutions",
    place: "Nelspruit",
    period: "Dec 2020 — Jun 2023",
    stack: "MERN · Angular · .NET/C# · WordPress",
    points: [
      "Built and maintained 10+ responsive web applications in React and Angular for SME clients.",
      "Delivered full-stack MERN and .NET/C# features, owning UI and API layers end-to-end.",
      "Introduced a reusable React component library that cut average feature delivery time.",
      "Wrote Jest and Cypress test suites that built a testing culture and reduced production bugs on key client sites.",
      "Extended WordPress with custom plugins and third-party APIs for e-commerce and services clients.",
      "Used Figma wireframes and prototypes to agree on UX before writing a line of code.",
    ],
  },
  {
    title: "Web Development Intern",
    company: "MB Communications & Projects",
    place: "Kempton Park",
    period: "Jun 2019 — Nov 2020",
    stack: "Angular · TypeScript · C#",
    points: [
      "Built and tested reusable Angular components, learning state, routing and service injection in production code.",
      "Wrote unit tests with Jasmine and Karma — an early test-first habit.",
      "Diagnosed and fixed front-end bugs under senior supervision, the start of the systematic problem-solving I still lean on.",
    ],
  },
];

/** Only numbers stated in the CV. */
export const impact = [
  { value: 6, suffix: "+", label: "years building production web and mobile apps" },
  { value: 4, suffix: "", label: "of South Africa's major banks served: FNB, ABSA, Standard Bank, Nedbank" },
  { value: 10, suffix: "+", label: "responsive web applications built for SME clients" },
  { value: 1000, suffix: "s", label: "of POS terminals nationwide managed through ARMS", display: "1 000s" },
] as const;

export const differentiators = [
  { title: "Problem-solver first", body: "I map the problem and the trade-offs, then choose the right tool — not the familiar one." },
  { title: "Fintech domain depth", body: "POS, microPOS, portals and monitoring across South Africa's big four banks." },
  { title: "Frontend → full-stack", body: "Strong in React, Angular and Vue; actively broadening into .NET, Node.js and Azure — versatile without overclaiming." },
];

export type CaseStudy = {
  slug: string;
  name: string;
  kind: string;
  clients: string;
  stack: string[];
  problem: string;
  built: string;
  outcome: string;
  visual: "inventory" | "terminals" | "pulse" | "keypad";
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "getpaid",
    name: "GetPaid+",
    kind: "Merchant inventory & reporting",
    clients: "Built for FNB",
    stack: ["React Native", "Angular"],
    problem: "Small merchants needed to see stock, sales and business performance without a back office.",
    built: "A React Native mobile app and an Angular web app sharing one inventory and reporting model.",
    outcome: "Real-time visibility into stock, sales and performance, on the phone and on the web.",
    visual: "inventory",
  },
  {
    slug: "arms",
    name: "ARMS",
    kind: "POS terminal management",
    clients: "FNB · ABSA · Standard Bank · Nedbank",
    stack: ["Angular", "REST APIs"],
    problem: "Thousands of POS terminals nationwide, each with its own onboarding and repair lifecycle.",
    built: "A management platform that moves devices through onboarding and repair workflows.",
    outcome: "Streamlined device onboarding and repair across four banks' terminal fleets.",
    visual: "terminals",
  },
  {
    slug: "lighthouse",
    name: "Lighthouse",
    kind: "Real-time service monitoring",
    clients: "Banking APIs",
    stack: ["Angular"],
    problem: "Banking APIs fail loudly for customers and quietly for teams.",
    built: "A real-time Angular dashboard with live alerts and alarms for banking APIs. Designed and shipped end-to-end.",
    outcome: "Directly improved system uptime and incident response time.",
    visual: "pulse",
  },
  {
    slug: "dashpay-pos",
    name: "Dashpay POS",
    kind: "Payment app on Android terminals",
    clients: "Dashpay · ABSA · Standard Bank",
    stack: ["Java", "Kotlin", "XML"],
    problem: "One generic payment application, deployed for several banks on Android-based terminals.",
    built: "Features in Java, Kotlin and XML, plus UI/UX for microPOS and generic payment interfaces in Figma and Adobe XD.",
    outcome: "A single payment app serving multiple banks' terminals.",
    visual: "keypad",
  },
];

export const education = [
  {
    title: "BCom Informatics — Information Systems",
    school: "University of Pretoria",
    years: "2018 — 2020",
    body: "Systems analysis and design, databases, software development, business information systems and IT project management. It's why I think about the business problem before the code.",
  },
  {
    title: "Generic Management Certificate",
    school: "Training Force",
    years: "2023 — 2024",
    body: "Management principles, business communication, marketing fundamentals and operational planning — the skills for working beyond a purely technical role.",
  },
];

export const aiWorkflow = [
  {
    key: "diagnose",
    title: "Diagnose",
    who: "me",
    body: "Before any tool opens, I find the root cause. Reproduce it, map what's actually broken, and decide what 'fixed' means.",
    tools: ["Judgement", "Logs", "Postman"],
  },
  {
    key: "tradeoffs",
    title: "Weigh trade-offs",
    who: "me",
    body: "I pick the approach — and the tool — that fits the problem, not the one I used last week.",
    tools: ["Judgement", "Figma", "Jira"],
  },
  {
    key: "pair",
    title: "Pair & build",
    who: "both",
    body: "Claude Code and Cursor carry the boilerplate and explore options with me; JetBrains AI and Copilot keep inline flow fast. I steer.",
    tools: ["Claude Code", "Cursor AI", "JetBrains AI", "Copilot"],
  },
  {
    key: "review",
    title: "Review & refactor",
    who: "both",
    body: "AI-assisted review catches the obvious so human review can focus on the important. Then tests: Jest, Cypress, Jasmine.",
    tools: ["AI review", "Jest", "Cypress"],
  },
  {
    key: "ship",
    title: "Ship",
    who: "me",
    body: "I own what goes out. Production-quality, readable, and something the next developer will thank me for.",
    tools: ["Azure DevOps", "CI/CD", "Git"],
  },
] as const;

/** Professional summary, as on the CV. */
export const cvSummary =
  "Software developer with 6+ years of frontend-focused experience building production-grade web and mobile applications for the South African fintech and banking sector — including FNB, ABSA, Standard Bank and Nedbank. Proficient in React, Angular and Vue, with growing full-stack capability in .NET/C#, Node.js and Azure. I approach every problem as an engineer first and a programmer second: I diagnose root causes, weigh trade-offs, then build clean, maintainable solutions. I actively pair deep problem-solving with AI development tools (Claude Code, Cursor AI, JetBrains) to ship faster without sacrificing quality.";
