/**
 * CSS-only dusk: the same composition as the shader (sky bands, sun on the ridge,
 * faint lattice on the land). Shown first, and permanently on low-power devices.
 */
export default function HeroFallback() {
  return (
    <div aria-hidden="true" className="grain absolute inset-0 overflow-hidden" style={{
      background:
        "radial-gradient(ellipse 13% 11% at 80% 47%, rgba(239,230,216,.75), rgba(217,164,65,.9) 45%, transparent 75%)," +
        "linear-gradient(to top, #16120e 0 47%, #d9a441 47%, #e8692c 53%, #a4472a 60%, #3a1d1c 78%, #1e1523 100%)",
    }}>
      <svg className="absolute inset-x-0 bottom-0 h-[50%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <defs>
          <pattern id="lat" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0h28v28H0z M7 7h14v14H7z" fill="none" stroke="#d9a441" strokeOpacity=".08" strokeWidth="1" />
          </pattern>
        </defs>
        <path d="M0 26 C 220 6, 380 40, 620 20 S 1100 4, 1440 30 V400 H0 Z" fill="#16120e" />
        <path d="M0 26 C 220 6, 380 40, 620 20 S 1100 4, 1440 30 V400 H0 Z" fill="url(#lat)" />
        <path d="M0 26 C 220 6, 380 40, 620 20 S 1100 4, 1440 30" fill="none" stroke="#e8692c" strokeOpacity=".5" strokeWidth="2" />
      </svg>
    </div>
  );
}
