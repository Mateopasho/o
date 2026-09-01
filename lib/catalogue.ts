import "server-only";
import { cache } from "react";
import type { Product, ProductStatus } from "@/lib/types";
import {
  staticProducts, publishedFrom, bySlugFrom, forCategoryViewFrom,
  featuredFrom, relatedFrom, sdsLibraryFrom, findSkuIn,
} from "@/lib/data/products";
import { mergeCatalogue, type MergedCatalogue, type RecordMeta } from "@/lib/store/snapshot";
import { readSnapshot, driverInfo, type DriverInfo } from "@/lib/store/driver";

/**
 * The published catalogue — the verified baseline with portal edits applied.
 *
 * Everything that renders a product reads from here. `lib/data/products` is the
 * baseline underneath and is not the published state.
 *
 * Wrapped in React `cache()`, so a page that asks for products in
 * `generateMetadata` and again in the component reads the store once per
 * request, not twice.
 */
const load = cache(async (): Promise<MergedCatalogue> => {
  return mergeCatalogue(staticProducts, await readSnapshot());
});

/* ---------------------------------------------------------------- reading -- */

/** Every record, any status. Admin only — drafts must not reach the public site. */
export async function getAllProducts(): Promise<Product[]> {
  return (await load()).products;
}

/** ACTIVE records only. This is what the public site renders. */
export async function getProducts(): Promise<Product[]> {
  return publishedFrom((await load()).products);
}

/** Provenance and last-edit time, keyed by slug. */
export async function getRecordMeta(): Promise<Record<string, RecordMeta>> {
  return (await load()).meta;
}

/**
 * Withdrawn products. Admin only, and kept off every other accessor by
 * construction — nothing on the public site can reach this list.
 */
export async function getRemovedProducts(): Promise<Product[]> {
  return (await load()).removed;
}

/** Published lookup. Returns undefined for a draft, which the route 404s. */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return bySlugFrom(await getProducts(), slug);
}

/** Admin lookup — finds drafts and archived records too. */
export async function getAnyProductBySlug(slug: string): Promise<Product | undefined> {
  return bySlugFrom(await getAllProducts(), slug);
}

export async function getProductsForCategoryView(categorySlug: string): Promise<Product[]> {
  return forCategoryViewFrom(await getProducts(), categorySlug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return featuredFrom(await getProducts());
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  return relatedFrom(await getProducts(), product);
}

export async function getSdsLibrary() {
  return sdsLibraryFrom(await getProducts());
}

export async function findSku(sku: string) {
  return findSkuIn(await getProducts(), sku);
}

/** Where edits are stored, and whether they can be written at all. */
export function getStoreInfo(): DriverInfo {
  return driverInfo();
}

export type { RecordMeta } from "@/lib/store/snapshot";
export type { DriverInfo } from "@/lib/store/driver";

/* -------------------------------------------------------------- statuses -- */

export const STATUS_LABEL: Record<ProductStatus, string> = {
  ACTIVE: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};
