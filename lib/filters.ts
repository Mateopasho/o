import type { Product } from "@/lib/types";

/**
 * Catalogue filtering.
 *
 * Extracted into its own module because two places need the same rules: the
 * server page, which renders the filtered result set, and the mobile filter
 * drawer, which shows a live "Show N results" count for a staged selection
 * before anything is applied. Duplicating the match logic would let the count
 * drift away from the actual result — this keeps one definition.
 *
 * Filter state lives entirely in the URL query string, per design system §05:
 * "All filter state lives in the URL query string so a filtered view is
 * shareable and indexable."
 */

export type RawParams = Record<string, string | string[] | undefined>;

/** Normalised filter state: every key holds an array, so callers never branch. */
export interface FilterState {
  category: string[];
  grade: string[];
  container: string[];
  tdg: string[];
  process: string[];
  q: string;
  sort: string;
}

export const FILTER_KEYS = ["category", "grade", "container", "tdg", "process"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

const asArray = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

const first = (v: string | string[] | undefined): string =>
  (Array.isArray(v) ? v[0] : v) ?? "";

export function parseParams(params: RawParams): FilterState {
  return {
    category: asArray(params.category),
    grade: asArray(params.grade),
    container: asArray(params.container),
    tdg: asArray(params.tdg),
    process: asArray(params.process),
    q: first(params.q).trim(),
    sort: first(params.sort) || "name",
  };
}

/** Build a `/gases` URL from filter state. Empty values are omitted. */
export function buildHref(state: FilterState): string {
  const qs = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    for (const value of state[key]) qs.append(key, value);
  }
  if (state.q) qs.set("q", state.q);
  if (state.sort && state.sort !== "name") qs.set("sort", state.sort);
  const s = qs.toString();
  return s ? `/gases?${s}` : "/gases";
}

/** Toggle one value inside one repeatable key, returning new state. */
export function toggleValue(state: FilterState, key: FilterKey, value: string): FilterState {
  const current = state[key];
  return {
    ...state,
    [key]: current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value],
  };
}

export function activeCount(state: FilterState): number {
  return FILTER_KEYS.reduce((n, key) => n + state[key].length, 0);
}

export const EMPTY_STATE: FilterState = {
  category: [], grade: [], container: [], tdg: [], process: [], q: "", sort: "name",
};

/* -------------------------------------------------------------------------- */
/* Facets                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The minimum a product needs to be matched against a filter. Serialising this
 * rather than whole `Product` objects keeps the payload sent to the mobile
 * drawer small — it only needs enough to count results.
 */
export interface ProductFacet {
  slug: string;
  categorySlug: string;
  grades: string[];
  containers: string[];
  tdgClass: string;
  processes: string[];
  /** Lower-cased searchable text. */
  haystack: string;
}

export function toFacet(product: Product): ProductFacet {
  return {
    slug: product.slug,
    categorySlug: product.categorySlug,
    grades: product.grades.map((g) => g.name),
    containers: [...new Set(product.packages.map((p) => p.container))],
    tdgClass: product.tdgClass,
    processes: product.processes,
    haystack: [
      product.name,
      product.formula ?? "",
      product.tagline,
      product.unNumber,
      product.cas ?? "",
      product.synonyms,
      product.badge,
      ...product.packages.map((p) => `${p.sku} ${p.size} ${p.cga}`),
      ...product.processes,
    ]
      .join(" ")
      .toLowerCase(),
  };
}

export function matchesFacet(facet: ProductFacet, state: FilterState): boolean {
  if (state.category.length && !state.category.includes(facet.categorySlug)) return false;
  if (state.grade.length && !state.grade.some((g) => facet.grades.includes(g))) return false;
  if (state.container.length && !state.container.some((c) => facet.containers.includes(c)))
    return false;
  if (state.tdg.length && !state.tdg.some((t) => facet.tdgClass.includes(t))) return false;
  if (state.process.length && !state.process.some((p) => facet.processes.includes(p)))
    return false;
  if (state.q && !facet.haystack.includes(state.q.toLowerCase())) return false;
  return true;
}

export function countMatches(facets: ProductFacet[], state: FilterState): number {
  return facets.reduce((n, f) => (matchesFacet(f, state) ? n + 1 : n), 0);
}

/* -------------------------------------------------------------------------- */
/* Filter group definitions — shared by the desktop rail and the mobile drawer */
/* -------------------------------------------------------------------------- */

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroupDef {
  key: FilterKey;
  label: string;
  options: FilterOption[];
}
