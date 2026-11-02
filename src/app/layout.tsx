import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/data/site";
import { isStudio } from "@/lib/variant";

// The private studio profile stays out of search engines unless NEXT_PUBLIC_STUDIO_INDEX=1.
const indexable = !isStudio || process.env.NEXT_PUBLIC_STUDIO_INDEX === "1";
const ogImage = isStudio ? "/og-studio.png" : "/og.png";
const pageTitle = isStudio ? `${site.name} — Web Developer, Kempton Park` : `${site.name} — Software Developer, Kempton Park`;
const pageDescription = isStudio
  ? "Katlego Nkuna designs and builds websites, online stores and web apps for South African businesses, from Kempton Park, Gauteng."
  : site.description;
import Header from "@/components/chrome/Header";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import FinePointerOnly from "@/components/chrome/FinePointerOnly";
import Preloader from "@/components/chrome/Preloader";
import NegativeMode from "@/components/chrome/NegativeMode";
import Reveal from "@/components/chrome/Reveal";
import ScrollFx from "@/components/chrome/ScrollFx";
import Contact from "@/components/sections/Contact";

const unbounded = localFont({
  src: "../fonts/unbounded-latin-wght-normal.woff2",
  variable: "--font-unbounded",
  weight: "200 900",
  display: "swap",
  preload: true,
  fallback: ["Arial Black", "sans-serif"],
  adjustFontFallback: "Arial",
});
const hanken = localFont({
  src: [
    { path: "../fonts/hanken-grotesk-latin-wght-normal.woff2", style: "normal", weight: "100 900" },
    { path: "../fonts/hanken-grotesk-latin-wght-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-hanken",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});
const jetbrains = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: pageTitle, template: `%s — ${site.name}` },
  description: pageDescription,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: isStudio
    ? ["Katlego Nkuna", "web developer", "web design", "website", "online store", "Johannesburg", "Kempton Park", "Gauteng", "South Africa"]
    : ["Katlego Nkuna", "software developer", "frontend developer", "React", "Angular", "Vue", "fintech", "South Africa", "Johannesburg", "Kempton Park", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: site.url,
    siteName: site.name,
    title: isStudio ? `${site.name} — Websites for South African businesses` : `${site.name} — Highveld to Interface`,
    description: pageDescription,
    images: [{ url: ogImage, width: 1200, height: 630, alt: `Katlego Nkuna — ${isStudio ? "Web Developer" : "Software Developer"}. A dusk sky over a low ridge with stepped geometric linework.` }],
  },
  twitter: { card: "summary_large_image", title: `${site.name} — Highveld to Interface`, description: pageDescription, images: [ogImage] },
  robots: { index: indexable, follow: indexable },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#16120e",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: theme, JS flag and whether to show the intro (no flash, no layout shift).
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var p=JSON.parse(localStorage.getItem('kn-prefs')||'{}');d.dataset.theme=p.theme==='light'?'light':'dark';if(p.theme==='light'){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute('content','#f1e7d6')}}catch(e){d.dataset.theme='dark'}try{if(sessionStorage.getItem('kn-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(pointer: coarse)').matches)d.classList.add('preloaded')}catch(e){d.classList.add('preloaded')}})();`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: isStudio ? "Web Developer" : "Software Developer",
  description: pageDescription,
  address: { "@type": "PostalAddress", addressLocality: "Kempton Park", addressRegion: "Gauteng", addressCountry: "ZA" },
  ...(isStudio
    ? { knowsAbout: ["Web design", "Web development", "E-commerce", "React", "Next.js", "UI/UX design"] }
    : {
        alumniOf: { "@type": "CollegeOrUniversity", name: "University of Pretoria" },
        worksFor: { "@type": "Organization", name: "Dashpay" },
        sameAs: [site.linkedin],
        knowsAbout: ["React", "Angular", "Vue", "TypeScript", "React Native", ".NET", "Node.js", "Microsoft Azure", "Fintech", "Payments", "UI/UX design"],
      }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" data-theme="dark" className={`${unbounded.variable} ${hanken.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Preloader />
        <ScrollProgress />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
        <div className="curtain" aria-hidden="true" />
        <FinePointerOnly />
        <Reveal />
        <ScrollFx />
        <NegativeMode />
      </body>
    </html>
  );
}
