import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/data/site";
import Header from "@/components/chrome/Header";
import SmoothScroll from "@/components/chrome/SmoothScroll";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import Cursor from "@/components/chrome/Cursor";
import Preloader from "@/components/chrome/Preloader";
import NegativeMode from "@/components/chrome/NegativeMode";
import Reveal from "@/components/chrome/Reveal";
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
  title: { default: `${site.name} — Software Developer, Kempton Park`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: ["Katlego Nkuna", "software developer", "frontend developer", "React", "Angular", "Vue", "fintech", "South Africa", "Johannesburg", "Kempton Park", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Highveld to Interface`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Katlego Nkuna — Software Developer. A dusk sky over a low ridge with stepped geometric linework." }],
  },
  twitter: { card: "summary_large_image", title: `${site.name} — Highveld to Interface`, description: site.description, images: ["/og.png"] },
  robots: { index: true, follow: true },
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
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var p=JSON.parse(localStorage.getItem('kn-prefs')||'{}');d.dataset.theme=p.theme==='light'?'light':'dark';if(p.theme==='light'){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute('content','#f1e7d6')}}catch(e){d.dataset.theme='dark'}try{if(sessionStorage.getItem('kn-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('preloaded')}catch(e){d.classList.add('preloaded')}})();`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "Software Developer",
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: "Kempton Park", addressRegion: "Gauteng", addressCountry: "ZA" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Pretoria" },
  worksFor: { "@type": "Organization", name: "Dashpay" },
  sameAs: [site.linkedin],
  knowsAbout: ["React", "Angular", "Vue", "TypeScript", "React Native", ".NET", "Node.js", "Microsoft Azure", "Fintech", "Payments", "UI/UX design"],
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
        <Contact />
        <div className="curtain" aria-hidden="true" />
        <Cursor />
        <SmoothScroll />
        <Reveal />
        <NegativeMode />
      </body>
    </html>
  );
}
