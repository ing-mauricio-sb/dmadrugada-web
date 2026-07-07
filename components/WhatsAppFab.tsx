import { waLink } from "@/lib/site";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

export function WhatsAppFab() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border-2 border-ink bg-wa text-ink shadow-[3px_4px_0_0_var(--color-ink)] transition hover:-translate-y-0.5"
    >
      <span
        className="absolute inset-0 rounded-full bg-wa/50 animate-pulse-halo"
        aria-hidden="true"
      />
      <WhatsAppGlyph className="relative h-7 w-7" />
    </a>
  );
}
