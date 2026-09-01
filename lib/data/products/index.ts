import type { Product } from "@/lib/types";
import { argon } from "./argon";
import { oxygen, nitrogen, hydrogen, compressedAir } from "./industrial";
import { arCo2_7525, arCo2_928, arO2_982 } from "./welding";
import { acetylene, propane, propylene } from "./fuel";
import {
  carbonDioxide, helium, nitrousOxide,
  liquidNitrogen, liquidArgon, liquidOxygen,
  foodGradeNitrogen, dryIce,
} from "./specialty";

/**
 * The verified catalogue baseline.
 *
 * These records are the source of truth for everything safety-critical — CGA
 * outlet numbers and thread specifications, TC/DOT markings, UN numbers, TDG
 * classes, GHS pictograms — checked against CGA V-1 and the cylinder standards
 * and kept in git so a change is a reviewable diff.
 *
 * The admin portal never rewrites this file. It stores an overlay that merges
 * over these records at read time; see `lib/store/snapshot.ts`. Read the merged
 * catalogue through `lib/catalogue.ts`, not from here — this module is the
 * baseline, not the published state.
 */
export const staticProducts: Product[] = [
  argon, oxygen, nitrogen, hydrogen, compressedAir,
  arCo2_7525, arCo2_928, arO2_982,
  acetylene, propane, propylene,
  carbonDioxide, helium, nitrousOxide,
  liquidNitrogen, liquidArgon, liquidOxygen,
  foodGradeNitrogen, dryIce,
];

/* -------------------------------------------------------------------------- */
/* Derivations                                                                 */
/*                                                                             */
/* Each takes the product list explicitly so the same logic serves the static   */
/* baseline and the merged, portal-edited catalogue. Nothing below reads a      */
/* module-level array.                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Only ACTIVE products are exposed publicly. Design system section 08:
 * "Draft state — public requests 404."
 */
export function publishedFrom(all: readonly Product[]): Product[] {
  return all.filter((p) => p.status === "ACTIVE");
}

export function bySlugFrom(list: readonly Product[], slug: string): Product | undefined {
  return list.find((p) => p.slug === slug);
}

export function byCategoryFrom(list: readonly Product[], categorySlug: string): Product[] {
  return list.filter((p) => p.categorySlug === categorySlug);
}

/**
 * Products for a category *view*. Propane, Dry Ice and Laser Gases are the
 * three of nine categories that present as filter views over the primary six —
 * see lib/data/categories.ts for why.
 */
export function forCategoryViewFrom(list: readonly Product[], categorySlug: string): Product[] {
  switch (categorySlug) {
    case "propane":
      return list.filter((p) => ["propane", "propylene"].includes(p.slug));
    case "dry-ice":
      return list.filter((p) => ["dry-ice", "carbon-dioxide"].includes(p.slug));
    case "laser-gases":
      return list.filter((p) =>
        ["nitrogen", "oxygen", "carbon-dioxide", "helium"].includes(p.slug),
      );
    default:
      return byCategoryFrom(list, categorySlug);
  }
}

/** Home-page carousel, ordered by the design's featured ranking. */
export function featuredFrom(list: readonly Product[]): Product[] {
  return list
    .filter((p) => p.featuredRank !== null)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));
}

export function relatedFrom(list: readonly Product[], product: Product): Product[] {
  return product.relatedSlugs
    .map((slug) => bySlugFrom(list, slug))
    .filter((p): p is Product => Boolean(p));
}

/** Flattened SDS library for the safety page. */
export function sdsLibraryFrom(list: readonly Product[]) {
  return list
    .flatMap((p) =>
      p.documents
        .filter((d) => d.title.includes("Safety Data Sheet") || d.title.includes("sécurité"))
        .map((d) => ({
          product: p.name,
          slug: p.slug,
          unNumber: p.unNumber.replace(/^UN/, ""),
          tdgClass: p.tdgClass,
          phase: d.phase ?? "—",
          language: d.language,
          version: d.version,
          revised: d.revised,
        })),
    )
    .sort((a, b) => a.product.localeCompare(b.product) || a.language.localeCompare(b.language));
}

/** Every distinct SKU row, used to pre-fill the quote form from a URL. */
export function findSkuIn(list: readonly Product[], sku: string) {
  for (const product of list) {
    const pack = product.packages.find((c) => c.sku === sku);
    if (pack) return { product, pack };
  }
  return null;
}
