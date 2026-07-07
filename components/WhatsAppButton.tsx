import { waLink } from "@/lib/site";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

type Size = "sm" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "h-9 gap-2 px-4 text-sm",
  lg: "h-12 gap-2.5 px-7 text-base",
};

export function WhatsAppButton({
  size = "sm",
  label = "Pedir por WhatsApp",
  message,
  className = "",
}: {
  size?: Size;
  label?: string;
  message?: string;
  className?: string;
}) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-full bg-wa font-bold text-ink shadow-[3px_4px_0_0_var(--color-ink)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[1px_2px_0_0_var(--color-ink)] active:translate-y-0 ${sizeClasses[size]} ${className}`}
    >
      <WhatsAppGlyph className="h-[1.15em] w-[1.15em]" />
      {label}
    </a>
  );
}
