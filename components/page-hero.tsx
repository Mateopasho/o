import type { ReactNode } from "react";
import { Breadcrumb } from "./ui";

/**
 * Standard interior-page hero: breadcrumb, 46px heading, lede.
 * `grid` adds the animated gold gridlines used on the Industries and About
 * pages; other pages use the plain variant.
 */
export function PageHero({
  breadcrumb,
  title,
  lede,
  grid = false,
  children,
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  lede?: string;
  grid?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden bg-white ${grid ? "" : ""}`}>
      {grid && (
        <div
          className="absolute inset-0 [background-image:repeating-linear-gradient(to_right,rgba(245,198,77,0.22)_0_1px,transparent_1px_72px)]"
          aria-hidden="true"
        />
      )}
      <div className="gutter relative pb-9 pt-11 md:pb-12 md:pt-14">
        <Breadcrumb trail={breadcrumb} />
        <h1
          className="mb-4 mt-[18px] max-w-[720px] text-[32px] tracking-[-0.025em] md:text-[60px] md:tracking-[-0.032em]"
          style={{ textWrap: "pretty" }}
        >
          {title}
        </h1>
        {lede && (
          <p
            className="max-w-[620px] text-[16px] leading-[1.6] text-muted md:text-[18px]"
            style={{ textWrap: "pretty" }}
          >
            {lede}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

/** In-page jump nav used by the Cylinder Guide, Industries and FAQ pages. */
export function JumpNav({
  label,
  items,
  activeId,
}: {
  label: string;
  items: { id: string; label: string }[];
  activeId?: string;
}) {
  return (
    <nav aria-label={label} className="scroll-x flex gap-5 border-b border-line pb-3 lg:flex-col lg:gap-3.5 lg:border-b-0 lg:pb-0">
      <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted lg:mb-1 lg:block">
        {label}
      </span>
      {items.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`shrink-0 text-[14.5px] ${
            (activeId ?? items[0].id) === item.id || (!activeId && i === 0)
              ? "text-gold-link"
              : "text-ink-2 hover:text-gold-link"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
