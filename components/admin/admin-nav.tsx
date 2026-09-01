"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Admin sidebar. One destination today — Products — exactly as the A01 artboard
 * shows it. Kept as its own client component so the active state can be derived
 * from the route rather than passed down from every page.
 *
 * Below `lg` it becomes a horizontal strip: a 188px rail costs too much of a
 * phone screen, and the A02 mobile artboard drops it for the same reason.
 */
const ITEMS = [
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M9 9v11" />
      </>
    ),
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin sections"
      className="scroll-x flex gap-2 border-b border-line bg-surface px-3 py-3 lg:flex-col lg:border-b-0 lg:border-r lg:px-3.5 lg:py-5"
    >
      {ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-2.5 rounded-full px-3.5 py-2.5 text-[14.5px] transition-colors duration-150 ${
              active
                ? "bg-gold-ribbon text-gold-ink hover:text-gold-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
              className="shrink-0"
            >
              {item.icon}
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
