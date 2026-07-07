import Image from "next/image";

/**
 * Brand lockup: Sicán (the dog mascot) + "D'Madrugada" wordmark.
 * Replaces the old lucide Moon placeholder. `tone` flips the wordmark color
 * for use on light (default) vs. dark/night backgrounds (e.g. the footer).
 */
export function Logo({
  tone = "ink",
  className = "",
}: {
  tone?: "ink" | "paper";
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/mascota.png"
        alt="Sicán, la mascota de D'Madrugada"
        width={40}
        height={40}
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
        priority
      />
      <span
        className={`font-display text-xl font-extrabold tracking-tight ${
          tone === "paper" ? "text-paper" : "text-ink"
        }`}
      >
        <span className="text-blue">D&apos;</span>Madrugada
      </span>
    </span>
  );
}
