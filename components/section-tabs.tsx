"use client";

import { useState, type ReactNode } from "react";

/**
 * Product-page section tabs.
 *
 * Replaces the anchor-scroll section nav. Each tab is a discrete panel: opening
 * "Grades" shows the grades table and nothing else, so the reader never scrolls
 * a long page underneath a floating bar.
 *
 * Why every panel stays in the DOM rather than being conditionally rendered:
 *
 *  · **Print.** Design system §08 prints sections 2, 3, 7, 8, 9 and 13 only.
 *    That is impossible if the inactive sections do not exist, so panels are
 *    hidden with CSS and the print-relevant ones are forced visible via
 *    `print:block`.
 *  · **Findability.** All of the technical record ships in the initial HTML, so
 *    a crawler or an in-page browser search still reaches every impurity limit
 *    and CGA number.
 *
 * `hidden` (the attribute) is used rather than a utility class so the panel is
 * removed from the accessibility tree and from tab order while inactive.
 */

export interface Panel {
  id: string;
  label: string;
  content: ReactNode;
  /** Included in the printed spec sheet — design system §08. */
  print?: boolean;
}

const PRINT_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#816412" strokeWidth="2" aria-hidden="true">
    <path d="M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z" />
  </svg>
);

export function SectionTabs({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(panels[0]?.id ?? "");

  return (
    <>
      {/* Tab bar. Sticks under the 76px site header. */}
      <div
        data-print="hide"
        className="sticky top-[76px] z-50 border-y border-n-100 bg-n-25"
      >
        <div
          role="tablist"
          aria-label="Product sections"
          className="scroll-x gutter flex items-center gap-5 text-sm md:gap-7"
        >
          {panels.map((panel) => {
            const selected = panel.id === active;
            return (
              <button
                key={panel.id}
                type="button"
                role="tab"
                id={`tab-${panel.id}`}
                aria-selected={selected}
                aria-controls={`panel-${panel.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(panel.id)}
                onKeyDown={(e) => {
                  const i = panels.findIndex((p) => p.id === active);
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const next =
                      e.key === "ArrowRight"
                        ? (i + 1) % panels.length
                        : (i - 1 + panels.length) % panels.length;
                    setActive(panels[next].id);
                    document.getElementById(`tab-${panels[next].id}`)?.focus();
                  }
                }}
                className={`shrink-0 cursor-pointer whitespace-nowrap border-b-2 py-4 transition-colors duration-150 md:py-0 md:leading-[54px] ${
                  selected
                    ? "border-gold-600 font-medium text-gold-800"
                    : "border-transparent text-n-800 hover:text-gold-800"
                }`}
              >
                {panel.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => window.print()}
            className="ml-auto hidden shrink-0 cursor-pointer items-center gap-[9px] font-medium text-gold-800 lg:inline-flex"
          >
            {PRINT_ICON}
            Print spec sheet
          </button>
        </div>
      </div>

      {panels.map((panel) => (
        <div
          key={panel.id}
          role="tabpanel"
          id={`panel-${panel.id}`}
          aria-labelledby={`tab-${panel.id}`}
          hidden={panel.id !== active}
          className={panel.print ? "print:block!" : "print:hidden"}
        >
          {panel.content}
        </div>
      ))}
    </>
  );
}
