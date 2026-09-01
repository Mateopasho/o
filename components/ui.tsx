import Link from "next/link";
import type { ReactNode } from "react";
import type { Availability } from "@/lib/types";

/* ==========================================================================
   Premium primitives.

   The shape language changed wholesale from the first build:
     · Controls are pills (9999px), not 3px rectangles.
     · The primary action is ink-black, not a gold gradient. Gold is demoted to
       ribbon / rule / chip, which is what keeps it meaningful next to the
       regulated red of a GHS diamond.
     · Secondary actions are underlined text, not outlined boxes — far quieter
       beside a black pill.
     · Cards are 20px, tinted #F6F5F1, and separated by hairlines rather than
       shadow.
   ========================================================================== */

/* --------------------------------------------------------------- labels -- */

/** Mono uppercase micro-label. The workhorse label of the premium system. */
export function MonoLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Centred section divider: hairline — label — hairline.
 * Replaces the old left-aligned gold tick.
 */
export function SectionRule({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-6 md:mb-12">
      <span className="h-px flex-1 bg-line" />
      <span className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted">
        {children}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** Left-aligned eyebrow for interior page sections. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- buttons -- */

/** Ink pill. The only "loud" control in the system. */
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
      ? "h-[46px] px-[26px] text-[15px]"
      : size === "sm"
        ? "h-[34px] px-4 text-[13px]"
        : "h-[38px] px-[18px] text-sm";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-ink text-paper transition-opacity duration-150 ease-out hover:text-paper hover:opacity-[0.82] ${dims} ${className}`}
    >
      {children}
    </Link>
  );
}

/** Underlined text link. The premium secondary action — no box. */
export function QuietLink({
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
      className={`inline-flex items-center gap-2 whitespace-nowrap border-b border-faint-2 pb-0.5 text-[15px] text-ink transition-colors duration-150 ease-out hover:border-ink hover:text-ink ${className}`}
    >
      {children}
    </Link>
  );
}

/** Outlined pill — used for filters, sort, pagination "Next". */
export function OutlineButton({
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
      className={`inline-flex h-[38px] items-center gap-2.5 whitespace-nowrap rounded-full border border-line px-4 text-sm text-ink transition-colors duration-150 hover:border-faint-2 hover:text-ink ${className}`}
    >
      {children}
    </Link>
  );
}

/** Per-row quote action inside a package table. */
export function QuoteButton({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-[34px] items-center whitespace-nowrap rounded-full border border-line px-4 text-[13px] text-ink transition-colors duration-150 hover:border-ink hover:text-ink ${className}`}
    >
      Quote
    </Link>
  );
}

/* ---------------------------------------------------------------- chips -- */

type ChipTone = "gold" | "neutral";

/** Pill chip. Gold marks the primary classification; neutral the rest. */
export function Chip({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  const palette =
    tone === "gold"
      ? "bg-gold-ribbon text-gold-ink"
      : "bg-surface text-muted";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${palette} ${className}`}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------- availability -- */

export function AvailabilityTag({ value }: { value: Availability }) {
  const tone: Record<Availability, string> = {
    Stocked: "text-[#1E7A4B]",
    "Available to order": "text-gold-link",
    "Ask us": "text-faint",
  };
  const dot: Record<Availability, string> = {
    Stocked: "bg-[#1E7A4B]",
    "Available to order": "bg-gold",
    "Ask us": "bg-faint-2",
  };
  return (
    <span className={`inline-flex items-center gap-2 text-[13px] ${tone[value]}`}>
      <span className={`size-[6px] rounded-full ${dot[value]}`} />
      {value}
    </span>
  );
}

/* -------------------------------------------------------------- callout -- */

/**
 * Hazard callout.
 *
 * The premium document renders warnings as a quiet surface panel with the GHS
 * diamond doing the signalling, rather than the old gold-bordered banner. The
 * regulated red stays on the pictogram where it is legally meaningful; the
 * container itself is neutral.
 */
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
      className={`flex gap-5 rounded-panel bg-surface ${compact ? "p-4" : "px-6 py-5"}`}
    >
      <svg
        width={compact ? 24 : 32}
        height={compact ? 24 : 32}
        viewBox="0 0 24 24"
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      >
        <path d="M12 3l10 18H2z" fill="none" stroke="#C0392B" strokeWidth="1.8" strokeLinejoin="round" />
        <rect x="11.1" y="9" width="1.8" height="6" fill="#C0392B" />
        <rect x="11.1" y="17" width="1.8" height="1.8" fill="#C0392B" />
      </svg>
      <div className="flex flex-col gap-1.5">
        <span className={compact ? "text-[15px]" : "text-[17px]"}>{title}</span>
        <span
          className={`max-w-[80ch] leading-[1.6] text-muted ${compact ? "text-[13.5px]" : "text-[15px]"}`}
          style={{ textWrap: "pretty" }}
        >
          {body}
        </span>
      </div>
    </div>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[13.5px] leading-[1.6] text-faint" style={{ textWrap: "pretty" }}>
      {children}
    </p>
  );
}

/* ----------------------------------------------------------- breadcrumb -- */

/**
 * Premium breadcrumb: mono uppercase, dot-separated, no chevrons.
 * "Home · Gases · Industrial & Pure · Argon"
 */
export function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-faint">
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">·</span>}
            {item.href ? (
              <Link href={item.href} className="text-faint hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-2">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* --------------------------------------------------------------- tables -- */

/** Table frame: 16px radius, hairline border, scrolls inside itself. */
export function TableFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-panel border border-line ${className}`}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

/** Table header cell — mono caps on the surface tint. */
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
      className={`whitespace-nowrap px-5 py-3.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-faint ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {children}
    </th>
  );
}

/** Stat cell for the hairline-divided figure rows. */
export function StatCell({
  value,
  label,
  className = "",
}: {
  value: ReactNode;
  label: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="font-mono text-[32px] leading-none tracking-[-0.02em] md:text-[40px]">
        {value}
      </span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
