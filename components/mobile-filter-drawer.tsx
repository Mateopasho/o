"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  activeCount, buildHref, countMatches, toggleValue,
  type FilterGroupDef, type FilterState, type ProductFacet,
} from "@/lib/filters";

/**
 * Mobile filter drawer.
 *
 * Design system §03 breakpoints: "< 768 … Filters → bottom drawer."
 *
 * The behaviour that matters, and the reason this is not just the desktop rail
 * in a panel: **selections are staged, not applied.** Tapping a checkbox edits
 * local state only. Nothing navigates until "Show N results" is pressed, so a
 * three-filter change costs one page load instead of three, and the count
 * updates live so you can see whether a combination is about to strand you on
 * an empty result set before you commit to it.
 *
 * "Clear all" is deliberately destructive-looking but non-committal too: it
 * empties the staged selection and leaves you in the drawer, rather than
 * navigating and forcing you to reopen it.
 *
 * The drawer is only mounted below `lg`; the desktop rail keeps its instant
 * link-based toggles, which stay shareable and crawlable.
 */
export function MobileFilterDrawer({
  groups,
  applied,
  facets,
}: {
  groups: FilterGroupDef[];
  applied: FilterState;
  facets: ProductFacet[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [staged, setStaged] = useState<FilterState>(applied);

  // Re-seed from the URL whenever an applied filter set arrives, so reopening
  // the drawer never shows a stale selection.
  useEffect(() => setStaged(applied), [applied]);

  // Escape closes; body scroll locks while open so the page behind cannot move.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const stagedCount = activeCount(staged);
  const appliedCount = activeCount(applied);
  const resultCount = countMatches(facets, staged);

  const apply = () => {
    setOpen(false);
    router.push(buildHref(staged));
  };

  return (
    <div className="lg:hidden">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-[7px] rounded-[3px] border border-n-200 px-[13px] text-[13.5px] font-medium text-n-800"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        Filters
        {appliedCount > 0 && (
          <span className="rounded-[2px] bg-gold-100 px-1.5 py-0.5 font-mono text-[11px] text-gold-800">
            {appliedCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-90 bg-n-950/40"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            className="fixed inset-x-0 bottom-0 z-100 flex max-h-[88vh] flex-col rounded-t-[14px] bg-white"
          >
            <div className="flex items-center justify-between border-b border-n-100 px-[18px] py-4">
              <h2 className="text-[17px] font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="inline-flex size-11 items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a2e34" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Staged selection */}
            <div className="flex-1 overflow-y-auto px-[18px] py-2">
              {groups.map((group) => (
                <fieldset key={group.key} className="border-b border-n-100 py-4 last:border-b-0">
                  <legend className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-n-600">
                    {group.label}
                  </legend>
                  <div className="flex flex-col">
                    {group.options.map((option) => {
                      const checked = staged[group.key].includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className="flex min-h-11 cursor-pointer items-center justify-between gap-2 text-[15px]"
                        >
                          <span className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setStaged((s) => toggleValue(s, group.key, option.value))
                              }
                              className="sr-only"
                            />
                            <span
                              aria-hidden="true"
                              className={`inline-flex size-[19px] shrink-0 items-center justify-center rounded-[2px] border ${
                                checked
                                  ? "border-gold-600 bg-linear-[180deg,var(--color-gold-300)_0%,var(--color-gold-400)_100%]"
                                  : "border-n-200"
                              }`}
                            >
                              {checked && (
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#15191d" strokeWidth="3.5">
                                  <path d="M5 13l5 5L19 7" />
                                </svg>
                              )}
                            </span>
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="font-mono text-xs text-n-600">{option.count}</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            {/*
              Commit bar. "Show N results" is the only thing that navigates —
              which is what makes the selection above feel staged rather than
              live. It disables at zero so you cannot apply a combination that
              lands on an empty page.
            */}
            <div className="flex items-center gap-2.5 border-t border-n-100 px-[18px] py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setStaged({ ...staged, ...{ category: [], grade: [], container: [], tdg: [], process: [] } })}
                disabled={stagedCount === 0}
                className="inline-flex h-12 items-center rounded-[3px] border border-n-200 px-4 text-[14.5px] font-medium text-n-800 disabled:opacity-40"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={resultCount === 0}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-[3px] bg-linear-[180deg,var(--color-gold-300)_0%,var(--color-gold-400)_100%] text-[15px] font-medium text-n-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resultCount === 0
                  ? "No products match"
                  : `Show ${resultCount} product${resultCount === 1 ? "" : "s"}`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
