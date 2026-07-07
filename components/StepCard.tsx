import type { LucideIcon } from "lucide-react";

export function StepCard({
  n,
  title,
  desc,
  Icon,
}: {
  n: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="sticker sticker-hover h-full p-6">
      <div className="flex items-center justify-between">
        <span className="font-display text-2xl font-extrabold text-blue">{n}</span>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-amber">
          <Icon className="h-6 w-6 text-ink" strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}
