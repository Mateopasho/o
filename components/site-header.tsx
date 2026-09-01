"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, nav } from "@/lib/data/site";

/**
 * Global header — premium reformat.
 *
 * Two bands:
 *  1. A gold ribbon carrying opening hours and the CANUTEC number as an ink
 *     pill. This is where the brand yellow lives now — as a ribbon rather than
 *     on every button.
 *  2. An 84px white bar with a hairline underline. The active section is marked
 *     by a 1px gold underline under the label; everything else is transparent
 *     until hover, which is why the nav reads so quietly.
 *
 * The bar is the sticky element itself, not a child of <header>, because a
 * sticky element only stays pinned while its own containing block is in view.
 */
export function SiteHeader({ showUtility = true }: { showUtility?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/gases" ? pathname.startsWith("/gases") : pathname.startsWith(href);

  return (
    <>
      {showUtility && (
        <div
          data-print="hide"
          className="hidden items-center justify-center gap-[18px] bg-gold-ribbon px-10 py-[9px] lg:flex"
        >
          <span className="font-mono text-[11.5px] tracking-[0.06em] text-gold-ink">
            Order desk {site.orderDesk.hours} · depot pickup until {site.depot.pickupUntil} ·
            emergency fills 24h
          </span>
          <a
            href={site.emergency.phoneHref}
            className="inline-flex h-[26px] items-center rounded-full bg-ink px-[13px] text-xs text-paper hover:text-paper"
          >
            {site.emergency.label} {site.emergency.phone}
          </a>
        </div>
      )}

      <header
        data-print="hide"
        className="sticky top-0 z-60 border-b border-line bg-paper"
      >
        <div className="gutter flex h-[68px] items-center justify-between md:h-[84px]">
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/orion-logo.svg"
              alt="Orion Gases"
              width={96}
              height={43}
              fetchPriority="high"
              className="block h-[38px] w-auto md:h-[43px]"
            />
          </Link>

          <nav aria-label="Primary" className="hidden gap-7 text-[14.5px] text-ink-2 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b pb-[3px] transition-colors duration-150 hover:text-ink ${
                  isActive(item.href)
                    ? "border-gold text-ink"
                    : "border-transparent hover:border-line"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/gases"
              aria-label="Search the catalogue"
              className="hidden size-9 items-center justify-center rounded-full bg-surface md:inline-flex"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E6B64" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M16 16l5 5" />
              </svg>
            </Link>

            <a
              href={site.orderDesk.phoneHref}
              className="hidden font-mono text-sm text-ink-2 hover:text-ink lg:block"
            >
              {site.orderDesk.phone}
            </a>

            <Link
              href="/quote"
              className="hidden h-[38px] items-center rounded-full bg-ink px-[18px] text-sm text-paper transition-opacity duration-150 hover:text-paper hover:opacity-[0.82] sm:inline-flex"
            >
              Request a quote
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-11 items-center justify-center xl:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A18" strokeWidth="1.8" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="Primary" className="gutter border-t border-line pb-5 xl:hidden">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-[52px] items-center border-b border-line text-[15.5px] ${
                      isActive(item.href) ? "text-ink" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2.5 sm:hidden">
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] text-paper hover:text-paper"
              >
                Request a quote
              </Link>
              <a
                href={site.orderDesk.phoneHref}
                className="flex h-12 items-center justify-center rounded-full border border-line text-[15px] text-ink"
              >
                {site.orderDesk.phone}
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
