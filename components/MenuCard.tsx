import Image from "next/image";
import { formatPrice, type MenuItem } from "@/lib/menu";
import { AddToCartButton } from "./AddToCartButton";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="sticker sticker-hover flex gap-4 p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-blue">
        {item.img ? (
          <Image
            src={item.img}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-sky font-display text-2xl font-extrabold text-blue">
            {item.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold leading-tight text-ink">
            {item.name}
            {item.tag === "top" && (
              <span className="ml-2 align-middle rounded-full bg-blue px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-paper">
                Top
              </span>
            )}
          </h3>
          <span className="badge-amber whitespace-nowrap text-sm">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">{item.desc}</p>
        <div className="mt-3">
          <AddToCartButton name={item.name} price={item.price} />
        </div>
      </div>
    </div>
  );
}
