"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up when it scrolls into view.
 *
 * Only the numeric part animates — a value like "24h" keeps its suffix, and a
 * non-numeric value is rendered as-is rather than being coerced into something
 * meaningless. It runs once, then stops.
 *
 * Under `prefers-reduced-motion` the final value renders immediately: an
 * animated number is decoration, and decoration is exactly what that setting
 * asks us to drop.
 */
export function CountUp({
  value,
  durationMs = 1100,
}: {
  value: string | number;
  durationMs?: number;
}) {
  const raw = String(value);
  const match = raw.match(/^(\d[\d,]*)(.*)$/);
  const target = match ? Number(match[1].replace(/,/g, "")) : null;
  const suffix = match ? match[2] : "";

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => (target === null ? raw : `0${suffix}`));

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(raw);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          // Same decelerating curve as the mask reveals, so the whole hero
          // settles on one rhythm rather than two competing ones.
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplay(`${Math.round(target * eased).toLocaleString("en-CA")}${suffix}`);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, suffix, raw, durationMs]);

  // aria-label carries the settled value so a screen reader never announces a
  // partial count.
  return (
    <span ref={ref} aria-label={raw}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
