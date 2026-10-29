import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export: deploys to Netlify, Vercel, or any static host.
  output: "export",
  images: { unoptimized: true }, // images are pre-optimised to AVIF/WebP by scripts/capture.ts
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
