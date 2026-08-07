import Image from "next/image";
import Link from "next/link";
import { site, footerColumns } from "@/lib/data/site";
import { MonoLabel } from "./ui";

/**
 * Global footer. Carries the standing technical disclaimer and the CANUTEC
 * emergency panel — a global setting that appears on every safety surface.
 */
export function SiteFooter() {
  // The tinted band spans the viewport; the columns inside it sit on the
  // content column, so the footer lines up with the page above it.
  return (
    <footer data-print="hide" className="mt-[84px] bg-n-25 pt-12 md:pt-16">
      <div className="gutter">
      <div className="grid gap-10 border-b border-n-100 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-[18px]">
          <Image
            src="/assets/orion-logo.png"
            alt="Orion Gases"
            width={89}
            height={40}
            className="block h-10 w-auto"
          />
          <p className="max-w-[280px] text-[14.5px] leading-[1.65] text-n-600" style={{ textWrap: "pretty" }}>
            Industrial, specialty, welding and food-grade gas supply across Southern
            Ontario and the GTA since {site.established}.
          </p>
          <div className="flex flex-col gap-[5px]">
            <MonoLabel>Order desk</MonoLabel>
            <a href={site.orderDesk.phoneHref} className="font-mono text-[19px] font-medium text-n-900">
              {site.orderDesk.phone}
            </a>
            <a href={`mailto:${site.orderDesk.email}`} className="text-sm text-gold-800">
              {site.orderDesk.email}
            </a>
          </div>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className="flex flex-col gap-[13px]">
            <MonoLabel className="mb-1">{col.heading}</MonoLabel>
            {col.links.map((link) => (
              <Link key={link.label} href={link.href} className="text-[14.5px] text-n-800 hover:text-gold-800">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="flex flex-col gap-4">
          <MonoLabel>Emergency</MonoLabel>
          <div className="flex flex-col gap-[7px] rounded-[3px] border border-n-200 border-l-[3px] border-l-gold-400 px-[18px] py-4">
            <span className="text-[13.5px] text-n-700">{site.emergency.label}, 24 hours</span>
            <a href={site.emergency.phoneHref} className="font-mono text-[17px] font-medium text-n-900">
              {site.emergency.phone}
            </a>
            <span className="font-mono text-[12.5px] text-n-600">
              or {site.emergency.cellular} from a cell in Canada
            </span>
          </div>
        </div>
      </div>

      <div
        className="border-b border-n-100 py-[26px] text-[12.5px] leading-[1.65] text-n-600"
        style={{ textWrap: "pretty" }}
      >
        {site.disclaimer}
      </div>

      <div className="flex flex-col gap-4 py-[22px] pb-8 text-[13px] text-n-600 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 {site.name}. All rights reserved.</span>
        <div className="flex flex-wrap gap-6">
          <Link href="/privacy" className="text-n-600 hover:text-gold-800">Privacy Policy</Link>
          <Link href="/terms" className="text-n-600 hover:text-gold-800">Terms of Use</Link>
          <Link href="/accessibility" className="text-n-600 hover:text-gold-800">Accessibility Statement</Link>
        </div>
      </div>
      </div>
    </footer>
  );
}

/**
 * Mobile bottom tab bar — M01 in the mobile design. Sticky, four 62px targets.
 * Hidden at md and above where the header nav takes over.
 */
export function MobileTabBar() {
  const tabs = [
    { label: "Home", href: "/", icon: <path d="M4 11l8-7 8 7v9H4z" /> },
    { label: "Gases", href: "/gases", icon: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16" /></> },
    { label: "SDS", href: "/safety#sds", icon: <path d="M12 3v12M7 11l5 5 5-5M4 20h16" /> },
    { label: "Call", href: site.orderDesk.phoneHref, icon: <path d="M4 5c0 8 7 15 15 15l3-3-4-3-2 2c-3-1-6-4-7-7l2-2-3-4z" /> },
  ];

  return (
    <nav
      aria-label="Quick actions"
      data-print="hide"
      className="sticky bottom-0 z-50 grid grid-cols-4 border-t border-n-100 bg-white md:hidden"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className="flex h-[62px] flex-col items-center justify-center gap-[5px] text-n-600"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {tab.icon}
          </svg>
          <span className="text-[10.5px]">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
