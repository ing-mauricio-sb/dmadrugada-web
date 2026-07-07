// Hand-drawn doodles taken from Sicán's bandana (moon / stars / sparkles / bone).
// Blue 3px linework to match the mascot; amber fills for warmth. Pure SVG, no deps.
// Color via Tailwind fill-*/stroke-* utilities so they read from the design tokens.

type DoodleProps = { className?: string };

/** Crescent moon — the "madrugada" motif, in a bright/friendly key. */
export function MoonDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M27 5.5a16 16 0 1 0 0 29A13 13 0 0 1 27 5.5Z"
        className="fill-amber stroke-blue"
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Four-point sparkle star. */
export function StarDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path
        d="M16 3c1.6 6.9 5.1 10.4 12 12-6.9 1.6-10.4 5.1-12 12-1.6-6.9-5.1-10.4-12-12 6.9-1.6 10.4-5.1 12-12Z"
        className="fill-amber stroke-blue"
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Tiny sparkle (used as separators / accents). */
export function SparkleDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2v20M2 12h20"
        className="stroke-blue"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M5 5l2 2M19 19l-2-2M19 5l-2 2M5 19l2-2"
        className="stroke-blue"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Little bone (from Sicán's bandana). */
export function BoneDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M11 6a4 4 0 1 0-3.6 6A4 4 0 1 0 11 18h18a4 4 0 1 0 3.6-6A4 4 0 1 0 29 6Z"
        className="fill-paper stroke-blue"
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
  );
}
