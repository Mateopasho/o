"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { FeaturedCard } from "./product-card";

/**
 * Top-products carousel.
 *
 * Two behaviours matter here and the earlier version got both wrong:
 *
 *  1. **Whole cards only.** Card width is derived from the track width so an
 *     exact number fit per view — 4 at ≥1280px, 3 at ≥1024px, 2 at ≥640px. No
 *     card is ever bisected at a desktop breakpoint. Mobile deliberately keeps
 *     an 85% card so the next one peeks, which is the affordance that tells a
 *     thumb it can swipe.
 *
 *  2. **Advance by exactly one card.** Free scrolling snaps to card starts, and
 *     the arrows step one card at a time by measuring the real rendered card
 *     width plus the real gap, rather than guessing a pixel amount. That is why
 *     the previous version overshot and left a half card in view.
 *
 * The arrows are the `prevProduct` / `nextProduct` controls from the design
 * document; they disable at each end instead of scrolling into empty space.
 */
export function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 2px tolerance absorbs sub-pixel rounding at fractional zoom levels.
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateBounds();
    el.addEventListener("scroll", updateBounds, { passive: true });
    const ro = new ResizeObserver(updateBounds);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateBounds);
      ro.disconnect();
    };
  }, [updateBounds]);

  /** One step = one card width + one gap, measured from the DOM. */
  const step = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-card]");
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    el.scrollBy({ left: direction * (first.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <>
      <div className="gutter mb-4 flex items-end justify-between md:mb-8">
        <div>
          <div className="mb-4 flex items-center gap-[14px]">
            <span className="h-px w-8 bg-gold" />
            <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted">
              Top products
            </span>
          </div>
          <h2 className="text-[26px] leading-[1.1] tracking-[-0.024em] md:text-[48px] md:leading-[1.08] md:tracking-[-0.028em]">
            <span className="md:hidden">What leaves daily</span>
            <span className="hidden md:inline">What leaves the depot every day</span>
          </h2>
        </div>

        <span className="font-mono text-[11px] text-faint md:hidden">swipe →</span>

        <div className="hidden items-center gap-2.5 md:flex">
          <ArrowButton direction="prev" onClick={() => step(-1)} disabled={atStart} />
          <ArrowButton direction="next" onClick={() => step(1)} disabled={atEnd} />
        </div>
      </div>

      {/*
        `scroll-p*` matches the gutter so a snapped card lands flush with the
        content column rather than against the raw viewport edge.
      */}
      <ul
        ref={trackRef}
        className="scroll-x gutter flex snap-x snap-mandatory gap-3 scroll-pl-[18px] pb-2 md:gap-5 md:scroll-pl-14 xl:scroll-pl-[72px]"
      >
        {products.map((product) => (
          <li
            key={product.slug}
            data-card
            className="w-[85%] shrink-0 grow-0 snap-start sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/4)]"
          >
            <FeaturedCard product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous products" : "Next products"}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line transition-colors duration-150 hover:border-ink disabled:cursor-not-allowed disabled:border-line disabled:opacity-40 disabled:hover:border-line"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A18" strokeWidth="2" aria-hidden="true">
        <path d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
