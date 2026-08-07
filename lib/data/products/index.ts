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
 * The published catalogue.
 *
 * Only ACTIVE products are exposed publicly. Design system section 08:
 * "Draft state — public requests 404."
 */
export const allProducts: Product[] = [
  argon, oxygen, nitrogen, hydrogen, compressedAir,
  arCo2_7525, arCo2_928, arO2_982,
  acetylene, propane, propylene,
  carbonDioxide, helium, nitrousOxide,
  liquidNitrogen, liquidArgon, liquidOxygen,
  foodGradeNitrogen, dryIce,
];

export const products = allProducts.filter((p) => p.status === "ACTIVE");

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

/**
 * Products for a category *view*. Propane, Dry Ice and Laser Gases are the
 * three of nine categories that present as filter views over the primary six —
 * see lib/data/categories.ts for why.
 */
export function productsForCategoryView(categorySlug: string): Product[] {
  switch (categorySlug) {
    case "propane":
      return products.filter((p) => ["propane", "propylene"].includes(p.slug));
    case "dry-ice":
      return products.filter((p) => ["dry-ice", "carbon-dioxide"].includes(p.slug));
    case "laser-gases":
      return products.filter((p) =>
        ["nitrogen", "oxygen", "carbon-dioxide", "helium"].includes(p.slug),
      );
    default:
      return productsByCategory(categorySlug);
  }
}

/** Home-page carousel, ordered by the design's featured ranking. */
export const featuredProducts = products
  .filter((p) => p.featuredRank !== null)
  .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));

export function relatedProducts(product: Product): Product[] {
  return product.relatedSlugs
    .map((slug) => productBySlug(slug))
    .filter((p): p is Product => Boolean(p));
}

/** Flattened SDS library for the safety page. */
export function sdsLibrary() {
  return products
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
export function findSku(sku: string) {
  for (const product of products) {
    const pack = product.packages.find((c) => c.sku === sku);
    if (pack) return { product, pack };
  }
  return null;
}
