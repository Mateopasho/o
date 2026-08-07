"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal observer, ported from the design document's own script.
 *
 * Progressive enhancement: `[data-reveal]` elements start hidden in CSS, and
 * this adds `.og-in` when they enter the viewport. Anything already above the
 * fold reveals immediately rather than animating in. Under
 * `prefers-reduced-motion` the CSS neutralises both states, so this becomes a
 * no-op rather than a jump.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("og-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    const scan = () => {
      for (const el of document.querySelectorAll("[data-reveal]")) {
        if (seen.has(el)) continue;
        seen.add(el);
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add("og-in");
        } else {
          io.observe(el);
        }
      }
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
