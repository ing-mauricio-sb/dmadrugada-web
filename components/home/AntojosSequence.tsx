import Image from "next/image";
import Link from "next/link";
import { MENU, formatPrice } from "@/lib/menu";
import { Reveal } from "@/components/Reveal";
import { AddToCartButton } from "@/components/AddToCartButton";

// Top dishes that have a photo — the friendly highlight grid.
const ANTOJOS = MENU.flatMap((c) => c.items)
  .filter((i) => i.tag === "top" && i.img)
  .slice(0, 4);

/** Section 4 — friendly grid of top antojos as sticker cards. */
export function AntojosSequence() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <Reveal>
        <h2 className="text-center font-display text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold text-ink">
          Antojos que no esperan
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted">
          Los favoritos de la madrugada, calientitos hasta tu puerta.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ANTOJOS.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.08}>
            <article className="sticker sticker-hover group flex h-full flex-col p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sky">
                <Image
                  src={item.img!}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">
                {item.name}
              </h3>
              <p className="mt-1 flex-1 text-sm text-muted">{item.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="badge-amber text-sm">
                  {formatPrice(item.price)}
                </span>
                <AddToCartButton name={item.name} price={item.price} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/carta"
          className="group inline-flex items-center gap-1.5 font-bold text-blue-ink transition-colors hover:text-blue"
        >
          Ver toda la carta
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
