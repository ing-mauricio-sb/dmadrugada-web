"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth-scroll for the home page (Lenis). Disabled under prefers-reduced-motion.
 * No GSAP/ScrollTrigger anymore — the new home uses lightweight in-view reveals.
 * Renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
