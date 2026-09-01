import Link from "next/link";
import { site, footerColumns } from "@/lib/data/site";

/**
 * Global footer — premium reformat.
 *
 * Inverted to ink (#1A1A18) with the reversed logo. Text steps down through
 * white at 78% / 62% / 50% / 42% opacity rather than through separate greys,
 * which is what keeps the panel feeling like one surface.
 *
 * The CANUTEC card is the one gold element: a 16px gold-ribbon block sitting in
 * the dark, so the emergency number is the brightest thing on the page. That is
 * the correct hierarchy for a safety-critical number.
 */
export function SiteFooter() {
  return (
    <footer data-print="hide" className="mt-24 bg-ink text-paper md:mt-32">
      <div className="gutter pb-10 pt-16 md:pt-[72px]">
        <div className="grid gap-12 border-b border-white/12 pb-14 md:grid-cols-2 lg:grid-cols-[320px_1fr_1fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/orion-logo-reversed.svg"
              alt="Orion Gases"
              width={96}
              height={43}
              loading="lazy"
              className="block h-[43px] w-auto self-start"
            />
            <p className="text-[14.5px] leading-[1.6] text-white/62" style={{ textWrap: "pretty" }}>
              Industrial, specialty, welding and food-grade gas supply across Southern
              Ontario and the GTA since {site.established}.
            </p>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/42">
                Order desk
              </span>
              <a href={site.orderDesk.phoneHref} className="font-mono text-lg text-paper hover:text-paper">
                {site.orderDesk.phone}
              </a>
              <a href={`mailto:${site.orderDesk.email}`} className="text-sm text-gold hover:text-gold">
                {site.orderDesk.email}
              </a>
            </div>
          </div>

          {footerColumns.map((col, i) => (
            <div key={col.heading} className="flex flex-col gap-8">
              <nav aria-label={col.heading} className="flex flex-col gap-3.5">
                <span className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/42">
                  {col.heading}
                </span>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[14.5px] text-white/78 transition-colors duration-150 hover:text-paper"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/*
                The emergency card lives inside the last column rather than as a
                fifth grid child. Previously it was pinned to col 4 / row 1 —
                the same cell the Company nav auto-placed into — so the two
                stacked on top of each other.
              */}
              {i === footerColumns.length - 1 && (
                <div className="flex flex-col gap-1 rounded-panel bg-gold-ribbon px-5 py-[18px] text-ink">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-gold-ink">
                    Emergency · 24 hours
                  </span>
                  <a href={site.emergency.phoneHref} className="font-mono text-[17px] text-ink hover:text-ink">
                    {site.emergency.phone}
                  </a>
                  <span className="text-[12.5px] text-gold-ink">
                    {site.emergency.label}, or {site.emergency.cellular} from a cell in Canada
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p
          className="mt-8 max-w-[96ch] text-[13px] leading-[1.7] text-white/50"
          style={{ textWrap: "pretty" }}
        >
          {site.disclaimer}
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/12 pt-7 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {site.name}. All rights reserved.</span>
          <div className="flex flex-wrap gap-8">
            <Link href="/privacy" className="text-white/50 hover:text-paper">Privacy Policy</Link>
            <Link href="/terms" className="text-white/50 hover:text-paper">Terms of Use</Link>
            <Link href="/accessibility" className="text-white/50 hover:text-paper">Accessibility Statement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Mobile bottom tab bar. Sticky, four 62px targets, hairline top. */
export function MobileTabBar() {
  const tabs = [
    { label: "Home", href: "/", icon: <path d="M4 11l8-7 8 7v9H4z" /> },
    { label: "Gases", href: "/gases", icon: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16" /></> },
    { label: "SDS", href: "/safety#sds", icon: <path d="M12 3v12M7 11l5 5 5-5M4 20h16" /> },
    { label: "Call", href: "/quote", icon: <path d="M4 5c0 8 7 15 15 15l3-3-4-3-2 2c-3-1-6-4-7-7l2-2-3-4z" /> },
  ];

  return (
    <nav
      aria-label="Quick actions"
      data-print="hide"
      className="sticky bottom-0 z-50 grid grid-cols-4 border-t border-line bg-paper md:hidden"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className="flex h-[62px] flex-col items-center justify-center gap-1.5 text-muted"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {tab.icon}
          </svg>
          <span className="text-[10.5px]">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
