/**
 * One codebase, two sites:
 *  - "cv"     → for recruiters and employers: experience, fintech case studies, skills, education, resume.
 *  - "studio" → the private web-dev profile for clients: the sites, services, process and a quote form.
 *
 * Chosen at build time with NEXT_PUBLIC_VARIANT (defaults to "cv").
 *   npm run build:cv      → out-cv/
 *   npm run build:studio  → out-studio/
 */
export type Variant = "cv" | "studio";

export const VARIANT: Variant = process.env.NEXT_PUBLIC_VARIANT === "studio" ? "studio" : "cv";
export const isCV = VARIANT === "cv";
export const isStudio = VARIANT === "studio";
