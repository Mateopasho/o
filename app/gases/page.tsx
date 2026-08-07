import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { MobileFilterDrawer } from "@/components/mobile-filter-drawer";
import { Breadcrumb, MonoLabel } from "@/components/ui";
import { products } from "@/lib/data/products";
import {
  categories, categoryBySlug, containerTypes, gradeTiers,
  tdgClassFilters, processFilters,
} from "@/lib/data/categories";
import { site } from "@/lib/data/site";
import {
  buildHref, matchesFacet, parseParams, toFacet, toggleValue, activeCount,
  type FilterGroupDef, type FilterKey, type FilterState, type RawParams,
} from "@/lib/filters";

export const metadata: Metadata = {
  title: "All gases",
  description:
    "The full Orion Gases catalogue — industrial, welding, specialty, food-grade, fuel and cryogenic products with grades, cylinder sizes, fill pressures and CGA connections published.",
};

/**
 * Screen 02 — catalogue listing.
 *
 * Filter state lives entirely in the URL (design system §05), so every filtered
 * view is shareable and indexable and the page stays a server component.
 *
 * Two different interaction models, deliberately:
 *  · **Desktop rail** — each option is a link that toggles a query parameter and
 *    applies immediately. Cheap on a wide screen where the results stay in view.
 *  · **Mobile drawer** — selections are staged and committed with one button, so
 *    a multi-filter change is one navigation rather than several on a phone.
 */
export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const params = await searchParams;
  const state = parseParams(params);

  const facets = products.map(toFacet);
  const filtered = products.filter((p, i) => matchesFacet(facets[i], state));

  const sorted = [...filtered].sort((a, b) =>
    state.sort === "sizes"
      ? b.packages.length - a.packages.length
      : a.name.localeCompare(b.name),
  );

  const countFor = (categorySlug: string) =>
    products.filter((p) => p.categorySlug === categorySlug).length;

  /* Group definitions are shared with the mobile drawer. */
  const groups: FilterGroupDef[] = [
    {
      key: "category",
      label: "Category",
      options: categories
        .filter((c) => c.featured)
        .map((c) => ({ value: c.slug, label: c.shortName, count: countFor(c.slug) })),
    },
    {
      key: "grade",
      label: "Grade / purity tier",
      options: gradeTiers.map((t) => ({ value: t, label: t })),
    },
    {
      key: "container",
      label: "Container type",
      options: containerTypes.map((c) => ({ value: c, label: c })),
    },
    {
      key: "tdg",
      label: "TDG class",
      options: tdgClassFilters.map((t) => ({ value: t.value, label: t.label })),
    },
    {
      key: "process",
      label: "Process",
      options: processFilters.map((p) => ({ value: p, label: p })),
    },
  ];

  /** Chips for the applied selection, with a link that removes each one. */
  const chips = groups.flatMap((group) =>
    state[group.key].map((value) => ({
      key: group.key,
      value,
      label: group.options.find((o) => o.value === value)?.label ?? value,
    })),
  );

  const heading =
    state.category.length === 1
      ? (categoryBySlug(state.category[0])?.name ?? "All gases")
      : "All gases";

  const removeHref = (key: FilterKey, value: string) =>
    buildHref(toggleValue(state, key, value));

  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <div className="gutter pt-7">
          <Breadcrumb
            trail={[
              { label: "Home", href: "/" },
              ...(state.category.length === 1
                ? [{ label: "Gases", href: "/gases" }, { label: heading }]
                : [{ label: "Gases" }]),
            ]}
          />

          <div className="mt-[18px] flex flex-col gap-4 border-b border-n-100 pb-[26px] md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="mb-2.5 text-[32px] font-semibold tracking-[-0.022em] md:text-[40px]">
                {heading}
              </h1>
              <p className="text-base text-n-700">
                Showing{" "}
                <span className="font-mono font-medium text-n-900">{sorted.length}</span> of{" "}
                <span className="font-mono font-medium text-n-900">
                  {site.stats.publishedProducts}
                </span>{" "}
                products
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Below lg the drawer replaces the rail entirely. */}
              <MobileFilterDrawer groups={groups} applied={state} facets={facets} />

              <form action="/gases" className="flex items-center gap-2.5">
                {chips.map((chip) => (
                  <input key={`${chip.key}-${chip.value}`} type="hidden" name={chip.key} value={chip.value} />
                ))}
                {state.q && <input type="hidden" name="q" value={state.q} />}
                <label htmlFor="sort" className="hidden text-sm text-n-600 sm:block">Sort</label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={state.sort}
                  className="inline-flex h-11 items-center rounded-[3px] border border-n-200 bg-white px-3 text-[13.5px] font-medium md:px-3.5 md:text-sm"
                >
                  <option value="name">Name A–Z</option>
                  <option value="sizes">Most configurations</option>
                </select>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center rounded-[3px] border border-n-200 px-3 text-[13.5px] font-medium md:px-3.5 md:text-sm"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="gutter grid gap-10 pb-16 pt-7 lg:grid-cols-[272px_1fr]">
          {/* ---------------------------- Desktop rail (lg and above) ------ */}
          <aside aria-label="Filters" className="hidden flex-col gap-[26px] lg:flex">
            <form action="/gases" role="search" className="flex h-11 items-center gap-2.5 rounded-[3px] border border-n-200 px-3.5">
              <label htmlFor="catalogue-search" className="sr-only">Search products</label>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5c626b" strokeWidth="2" aria-hidden="true" className="shrink-0">
                <circle cx="11" cy="11" r="7" />
                <path d="M16 16l5 5" />
              </svg>
              <input
                id="catalogue-search"
                name="q"
                type="search"
                defaultValue={state.q}
                placeholder="Search products"
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>

            {groups.map((group, gi) => (
              <fieldset
                key={group.key}
                className={`flex flex-col gap-3 ${
                  gi < groups.length - 1 ? "border-b border-n-100 pb-[22px]" : ""
                }`}
              >
                <legend className="mb-0.5"><MonoLabel>{group.label}</MonoLabel></legend>
                {group.options.map((option) => {
                  const checked = state[group.key].includes(option.value);
                  return (
                    <Link
                      key={option.value}
                      href={removeHref(group.key, option.value)}
                      aria-pressed={checked}
                      className="flex items-center justify-between gap-2 text-[14.5px] text-n-900 hover:text-n-900"
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className={`inline-flex size-[17px] shrink-0 items-center justify-center rounded-[2px] border ${
                            checked
                              ? "border-gold-600 bg-linear-[180deg,var(--color-gold-300)_0%,var(--color-gold-400)_100%]"
                              : "border-n-200"
                          }`}
                        >
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#15191d" strokeWidth="3.5">
                              <path d="M5 13l5 5L19 7" />
                            </svg>
                          )}
                        </span>
                        {option.label}
                      </span>
                      {option.count !== undefined && (
                        <span className="font-mono text-xs text-n-600">{option.count}</span>
                      )}
                    </Link>
                  );
                })}
              </fieldset>
            ))}
          </aside>

          {/* -------------------------------------------------- Results ---- */}
          <div>
            {/* Mobile search sits above the grid; the rail's copy is hidden. */}
            <form action="/gases" role="search" className="mb-5 flex h-11 items-center gap-2.5 rounded-[3px] border border-n-200 px-3.5 lg:hidden">
              <label htmlFor="catalogue-search-mobile" className="sr-only">Search products</label>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5c626b" strokeWidth="2" aria-hidden="true" className="shrink-0">
                <circle cx="11" cy="11" r="7" />
                <path d="M16 16l5 5" />
              </svg>
              <input
                id="catalogue-search-mobile"
                name="q"
                type="search"
                defaultValue={state.q}
                placeholder="Search products"
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>

            {chips.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2.5">
                {chips.map((chip) => (
                  <Link
                    key={`${chip.key}-${chip.value}`}
                    href={removeHref(chip.key, chip.value)}
                    className="inline-flex h-9 items-center gap-[9px] rounded-[3px] bg-gold-100 pl-3.5 pr-[9px] text-[13.5px] font-medium text-gold-800"
                  >
                    {chip.label}
                    <svg width="11" height="11" viewBox="0 0 24 24" stroke="#816412" strokeWidth="3" aria-hidden="true">
                      <path d="M5 5l14 14M19 5L5 19" />
                    </svg>
                    <span className="sr-only">Remove filter</span>
                  </Link>
                ))}
                {activeCount(state) > 0 && (
                  <Link href="/gases" className="text-[13.5px] text-n-600 underline">
                    Clear all
                  </Link>
                )}
              </div>
            )}

            {sorted.length > 0 ? (
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {sorted.map((product) => (
                  <li key={product.slug} className="contents">
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            ) : (
              /* Design system 7.2 — empty state. */
              <div className="flex flex-col items-start gap-4 rounded-[4px] border border-n-100 bg-n-25 px-8 py-12">
                <p className="text-[17px] font-medium text-n-900">
                  No products match these filters.
                </p>
                <p className="max-w-[46ch] text-[15px] leading-[1.65] text-n-600">
                  We fill more than the catalogue publishes. Tell us the application and the
                  grade you need and the order desk will match it.
                </p>
                <Link href="/quote" className="text-[15px] font-medium text-gold-800">
                  Tell us what you need →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
