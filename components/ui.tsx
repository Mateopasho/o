import Link from "next/link";
import type { ReactNode } from "react";
import type { Availability } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* Section label — gold rule + mono caps. Used above every section heading.    */
/* -------------------------------------------------------------------------- */

export function SectionLabel({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "gold";
}) {
  return (
    <div className="mb-4 flex items-center gap-[14px]">
      <span className="h-px w-8 bg-gold-400" />
      <span
        className={`font-mono text-[11.5px] uppercase tracking-[0.16em] ${
          tone === "gold" ? "text-gold-800" : "text-n-600"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

/** Mono uppercase micro-label used on tiles and table headers. */
export function MonoLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[10.5px] uppercase tracking-[0.14em] text-n-600 ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                     */
/*                                                                             */
/* Design system 05: 44px height, 3px radius, 150ms ease-out on background     */
/* only. No transform, no bounce. Gold 400 is the primary button fill; gold    */
/* 800 carries text-link affordances.                                          */
/* -------------------------------------------------------------------------- */

const BTN_BASE =
  "inline-flex items-center justify-center gap-[10px] rounded-[3px] font-medium transition-colors duration-150 ease-out";

export function PrimaryButton({
  href,
  children,
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "lg"
      ? "h-[52px] px-7 text-base"
      : size === "sm"
        ? "h-9 px-[14px] text-[13px]"
        : "h-11 px-5 text-[14.5px]";
  return (
    <Link
      href={href}
      className={`${BTN_BASE} ${dims} bg-linear-[180deg,var(--color-gold-300)_0%,var(--color-gold-400)_100%] text-n-900 hover:bg-gold-300 hover:text-n-900 ${className}`}
    >
      {children}
    </Link>
  );
}

export function SecondaryButton({
  href,
  children,
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "lg"
      ? "h-[52px] px-[26px] text-base"
      : size === "sm"
        ? "h-9 px-[14px] text-[13px]"
        : "h-11 px-5 text-[14.5px]";
  return (
    <Link
      href={href}
      className={`${BTN_BASE} ${dims} border border-n-200 text-n-800 transition-colors hover:border-gold-600 hover:text-n-800 ${className}`}
    >
      {children}
    </Link>
  );
}

/** Outlined gold quote button used on every package table row. */
export function QuoteButton({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center whitespace-nowrap rounded-[3px] border border-gold-300 px-[14px] text-[13px] font-medium text-gold-800 transition-colors duration-150 hover:bg-gold-100 ${className}`}
    >
      Quote
    </Link>
  );
}

/** Underlined text link with a gold rule, used for section-level navigation. */
export function RuleLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-[10px] border-b border-gold-300 pb-1 text-[15px] font-medium text-gold-800 ${className}`}
    >
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Availability dot                                                            */
/* -------------------------------------------------------------------------- */

export function AvailabilityTag({ value }: { value: Availability }) {
  const map: Record<Availability, { dot: string; text: string }> = {
    Stocked: { dot: "bg-[#1E7A4B]", text: "text-[#1E7A4B]" },
    "Available to order": { dot: "bg-gold-600", text: "text-gold-800" },
    "Ask us": { dot: "bg-n-400", text: "text-n-600" },
  };
  const tone = map[value];
  return (
    <span className={`inline-flex items-center gap-[7px] text-[13px] font-medium ${tone.text}`}>
      <span className={`size-[7px] rounded-full ${tone.dot}`} />
      {value}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Hazard callout                                                              */
/*                                                                             */
/* Design system 04: persistent, never dismissible. Gold 400 marks hazard —    */
/* this is the one place the accent is allowed to carry meaning.               */
/* -------------------------------------------------------------------------- */

export function HazardCallout({
  title,
  body,
  compact = false,
}: {
  title: string;
  body: string;
  compact?: boolean;
}) {
  return (
    <div
      role="note"
      aria-label={title}
      className={`flex gap-[18px] rounded-[3px] border border-gold-300 border-l-4 border-l-gold-400 bg-gold-100 ${
        compact ? "p-4" : "px-[26px] py-[22px]"
      }`}
    >
      <svg
        width={compact ? 22 : 28}
        height={compact ? 22 : 28}
        viewBox="0 0 24 24"
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      >
        <path d="M12 3l10 18H2z" fill="none" stroke="#deab38" strokeWidth="2" strokeLinejoin="round" />
        <rect x="11" y="9" width="2" height="6" fill="#deab38" />
        <rect x="11" y="17" width="2" height="2" fill="#deab38" />
      </svg>
      <div className="flex flex-col gap-[7px]">
        <span className={`font-semibold ${compact ? "text-[15px]" : "text-[16.5px]"}`}>{title}</span>
        <span
          className={`max-w-[800px] leading-[1.6] text-n-800 ${compact ? "text-[13.5px]" : "text-[15px]"}`}
          style={{ textWrap: "pretty" }}
        >
          {body}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Informational note — hairline icon + muted text                             */
/* -------------------------------------------------------------------------- */

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[14px] flex items-center gap-[10px]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8d939b" strokeWidth="2" aria-hidden="true" className="shrink-0">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </svg>
      <span className="text-[13.5px] text-n-600">{children}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Breadcrumb                                                                  */
/* -------------------------------------------------------------------------- */

export function Breadcrumb({
  trail,
}: {
  trail: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-xs text-n-600">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {item.href ? (
              <Link href={item.href} className="text-n-600 hover:text-gold-800">
                {item.label}
              </Link>
            ) : (
              <span className="text-n-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Page shell — 1280px content column, 56px gutters                            */
/* -------------------------------------------------------------------------- */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`gutter ${className}`}>
      {children}
    </div>
  );
}

/** Table wrapper: hairline border, 4px radius, horizontal scroll inside itself. */
export function TableFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[4px] border border-n-100 ${className}`}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

/** Sticky table header cell — mono caps, 10.5px. */
export function Th({
  children,
  align = "left",
  className = "",
}: {
  children?: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-[18px] py-[14px] font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {children}
    </th>
  );
}
