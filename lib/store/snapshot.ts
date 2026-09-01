/**
 * Catalogue overlay — shape and merge rules.
 *
 * The 19 verified products stay in `lib/data/products`. They carry
 * safety-critical data (CGA outlet numbers, thread specifications, TC/DOT
 * markings) that was checked against CGA V-1 and cylinder standards, and that
 * belongs in git where a change shows up in a diff and a review.
 *
 * What the admin portal writes is therefore an **overlay**: one patch per slug,
 * merged over the code-defined record at read time. That has three properties
 * worth having:
 *
 *  · A field nobody has touched keeps tracking the verified source. Correcting
 *    a CGA number in code reaches every product that never overrode it.
 *  · An edit is legible on its own — the store holds only what differs.
 *  · Dropping the store restores the verified baseline exactly.
 *
 * Products created in the portal have no code-defined base, so their patch is
 * the whole record and `base` is "new".
 *
 * Pure module — no Node or fetch. Safe in any runtime.
 */

import type { Product } from "@/lib/types";

export interface StoredRecord {
  /** Overridden fields. For `base: "new"` this is the complete record. */
  patch: Partial<Product>;
  base: "static" | "new";
  /** ISO 8601, set on every write. */
  updatedAt: string;
  /**
   * Soft delete. A static product is never removed from code by the portal, so
   * "delete" means "stop publishing it" — which is also what keeps the action
   * reversible.
   */
  deleted?: boolean;
}

export interface CatalogueSnapshot {
  version: 1;
  records: Record<string, StoredRecord>;
}

export const EMPTY_SNAPSHOT: CatalogueSnapshot = { version: 1, records: {} };

/** Provenance and edit time for one merged product. */
export interface RecordMeta {
  origin: "static" | "new";
  /** null when the record has never been edited in the portal. */
  updatedAt: string | null;
  edited: boolean;
  /** Withdrawn from the catalogue but still restorable. */
  deleted: boolean;
}

export interface MergedCatalogue {
  /** The live catalogue. Never contains a deleted record. */
  products: Product[];
  /**
   * Withdrawn records, held separately so the admin can list and restore them
   * while nothing on the public site can reach them by accident. Only ever
   * code-defined products: a portal-authored one has no baseline to come back
   * to, so deleting it removes it outright.
   */
  removed: Product[];
  meta: Record<string, RecordMeta>;
}

/**
 * Tolerant parse. A snapshot that fails to parse or carries an unknown version
 * is treated as absent rather than fatal: the site falls back to the verified
 * baseline and keeps serving. Silently dropping *edits* would be worse, so the
 * caller logs it.
 */
export function parseSnapshot(raw: string | null | undefined): CatalogueSnapshot | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed as CatalogueSnapshot).version !== 1 ||
      typeof (parsed as CatalogueSnapshot).records !== "object"
    ) {
      return null;
    }
    return parsed as CatalogueSnapshot;
  } catch {
    return null;
  }
}

/**
 * Merge an overlay over the code-defined catalogue.
 *
 * Arrays replace wholesale rather than merging element-by-element. The editor
 * always submits a complete array for any section it touches, and an
 * index-wise merge would make "delete the third grade" impossible to express.
 */
export function mergeCatalogue(
  base: readonly Product[],
  snapshot: CatalogueSnapshot | null,
): MergedCatalogue {
  const records = snapshot?.records ?? {};
  const meta: Record<string, RecordMeta> = {};
  const products: Product[] = [];
  const removed: Product[] = [];

  for (const product of base) {
    const record = records[product.slug];
    const merged = record ? { ...product, ...record.patch } : product;

    (record?.deleted ? removed : products).push(merged);
    meta[product.slug] = {
      origin: "static",
      updatedAt: record?.updatedAt ?? null,
      edited: Boolean(record),
      deleted: Boolean(record?.deleted),
    };
  }

  /* Portal-authored products, in creation order. */
  const created = Object.values(records)
    .filter((r) => r.base === "new" && !r.deleted)
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

  for (const record of created) {
    const product = record.patch as Product;
    if (!product?.slug) continue;
    products.push(product);
    meta[product.slug] = {
      origin: "new",
      updatedAt: record.updatedAt,
      edited: true,
      deleted: false,
    };
  }

  return { products, removed, meta };
}
