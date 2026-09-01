"use client";

import { useEffect, useState } from "react";

/**
 * In-page jump navigation that stays reachable while you scroll.
 *
 * Two behaviours the static version lacked:
 *
 *  · **Sticky.** On desktop it pins below the site header, so any section is one
 *    click away at any scroll depth instead of only at the top of the page.
 *  · **Active tracking.** An IntersectionObserver highlights whichever section
 *    you are actually reading, so the list reports position rather than just
 *    offering links.
 *
 * `rootMargin` biases the observer toward the upper third of the viewport:
 * without it, whichever section merely touches the bottom edge wins and the
 * highlight runs ahead of what you are reading.
 *
 * Below `lg` it degrades to a horizontal scroller — a sticky rail would eat too
 * much of a phone screen.
 */
export function StickyJumpNav({
  label,
  items,
}: {
  label: string;
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={label}
      className="scroll-x flex gap-5 border-b border-line py-4 lg:sticky lg:top-[100px] lg:max-h-[calc(100vh-140px)] lg:flex-col lg:gap-3.5 lg:overflow-y-auto lg:self-start lg:border-b-0 lg:border-r lg:py-8 lg:pr-6"
    >
      <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted lg:mb-1 lg:block">
        {label}
      </span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
          className={`shrink-0 text-[14.5px] transition-colors duration-150 ${
            active === item.id
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
