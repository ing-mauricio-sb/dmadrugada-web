"use client";

import { useEffect, useState } from "react";
import type { MenuCategory } from "@/lib/menu";

/**
 * Sticky category pills for /carta: smooth-scrolls to each section (safe —
 * /carta doesn't run Lenis) and highlights the active pill via IntersectionObserver.
 */
export function CategoryNav({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Categorías de la carta"
      className="no-scrollbar sticky top-16 z-30 -mx-5 mt-10 overflow-x-auto border-y-2 border-hair bg-paper/90 px-5 py-3 backdrop-blur"
    >
      <ul className="flex gap-2 whitespace-nowrap">
        {categories.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              onClick={(e) => handleClick(e, c.id)}
              aria-current={active === c.id ? "true" : undefined}
              className={`inline-block rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
                active === c.id
                  ? "border-blue bg-blue text-paper"
                  : "border-hair text-muted hover:border-blue hover:text-blue-ink"
              }`}
            >
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
