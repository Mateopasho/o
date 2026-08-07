"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, nav } from "@/lib/data/site";

/**
 * Global header.
 *
 * Design: a 40px utility strip above a 76px sticky nav bar. The active section
 * carries a 2px gold-400 underline. Below 1120px the nav collapses to a
 * disclosure panel; the search and menu controls are 44px targets throughout.
 */
export function SiteHeader({ showUtility = true }: { showUtility?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/gases" ? pathname.startsWith("/gases") : pathname.startsWith(href);

  /*
   * The utility strip is a sibling of <header>, not a child of it.
   *
   * A sticky element can only stay pinned while its own containing block is
   * still in view. With the strip and the nav bar both inside one <header>,
   * that container was only 116px tall, so the nav unstuck and vanished the
   * moment you scrolled past it. Hoisting the strip out leaves <header> as the
   * sticky element itself, with the page as its containing block — so it stays
   * pinned for the whole document.
   */
  return (
    <>
      {showUtility && (
        <div data-print="hide" className="hidden border-b border-n-100 bg-n-25 lg:block">
          <div className="gutter flex h-10 items-center justify-between font-mono text-[11.5px] tracking-[0.06em] text-n-600">
          <div className="flex items-center gap-6">
            <span>Order desk {site.orderDesk.hours}</span>
            <span aria-hidden="true">|</span>
            <span>Depot pickup until {site.depot.pickupUntil}</span>
          </div>
          <div className="flex items-center gap-[22px]">
            <span className="text-gold-800">
              Emergency · {site.emergency.label} {site.emergency.phone}
            </span>
            <span aria-hidden="true">|</span>
            <span>EN / FR</span>
          </div>
          </div>
        </div>
      )}

      <header
        data-print="hide"
        className="sticky top-0 z-60 border-b border-n-100 bg-white"
      >
        <div className="gutter flex h-[76px] items-center justify-between">
          <div className="flex items-center gap-11">
            <Link href="/" className="flex shrink-0 flex-col gap-1">
              <Image
                src="/assets/orion-logo.png"
                alt="Orion Gases"
                width={84}
                height={38}
                priority
                className="block h-[34px] w-auto md:h-[38px]"
              />
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-n-600 lg:block">
                {site.locality} · Est. {site.established}
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden gap-[26px] text-[14.5px] xl:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-7 text-n-800 hover:text-n-900 ${
                    isActive(item.href)
                      ? "border-b-2 border-gold-400 font-medium text-n-900"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-[18px]">
            <Link
              href="/gases"
              aria-label="Search the catalogue"
              className="inline-flex size-11 items-center justify-center"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5c626b" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M16 16l5 5" />
              </svg>
            </Link>

            <a href={site.orderDesk.phoneHref} className="hidden flex-col items-end gap-px lg:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-n-600">
                Order desk
              </span>
              <span className="font-mono text-[15px] font-medium text-n-900">
                {site.orderDesk.phone}
              </span>
            </a>

            <Link
              href="/quote"
              className="hidden h-11 items-center rounded-[3px] bg-linear-[180deg,var(--color-gold-300)_0%,var(--color-gold-400)_100%] px-5 text-[14.5px] font-medium text-n-900 transition-colors duration-150 hover:bg-gold-300 sm:inline-flex"
            >
              Request a Quote
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-11 items-center justify-center xl:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a2e34" strokeWidth="2" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Primary"
            className="border-t border-n-100 bg-white px-[18px] pb-4 xl:hidden"
          >
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-[52px] items-center border-b border-n-100 text-[15.5px] ${
                      isActive(item.href) ? "font-medium text-gold-800" : "text-n-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2 sm:hidden">
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="flex h-12 items-center justify-center rounded-[3px] bg-linear-[180deg,var(--color-gold-300)_0%,var(--color-gold-400)_100%] text-[15.5px] font-medium text-n-900"
              >
                Request a Quote
              </Link>
              <a
                href={site.orderDesk.phoneHref}
                className="flex h-12 items-center justify-center rounded-[3px] border border-n-200 text-[15.5px] font-medium text-n-800"
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
