/**
 * CSS-only sky: the same composition as the shader (sky bands, sun on the ridge,
 * faint lattice on the land), coloured by the --hero-* tokens so it follows the theme.
 * Shown first, and permanently on low-power devices.
 */
export default function HeroFallback() {
  return (
    <div aria-hidden="true" className="grain absolute inset-0 overflow-hidden" style={{
      background:
        "radial-gradient(ellipse 13% 11% at 80% 47%, color-mix(in srgb, var(--hero-sun) 75%, transparent), color-mix(in srgb, var(--hero-horizon) 90%, transparent) 45%, transparent 75%)," +
        "linear-gradient(to top, var(--hero-land) 0 47%, var(--hero-horizon) 47%, var(--hero-band) 53%, var(--hero-upper) 64%, var(--hero-zenith) 90%)",
    }}>
      <svg className="absolute inset-x-0 bottom-0 h-[50%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <defs>
          <pattern id="lat" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0h28v28H0z M7 7h14v14H7z" fill="none" stroke="var(--ochre)" strokeOpacity=".08" strokeWidth="1" />
          </pattern>
        </defs>
        <path d="M0 26 C 220 6, 380 40, 620 20 S 1100 4, 1440 30 V400 H0 Z" fill="var(--hero-land)" />
        <path d="M0 26 C 220 6, 380 40, 620 20 S 1100 4, 1440 30 V400 H0 Z" fill="url(#lat)" />
        <path d="M0 26 C 220 6, 380 40, 620 20 S 1100 4, 1440 30" fill="none" stroke="var(--hero-rim)" strokeOpacity=".5" strokeWidth="2" />
      </svg>
    </div>
  );
}
