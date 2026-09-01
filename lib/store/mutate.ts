import "server-only";
import type { Product, ProductStatus } from "@/lib/types";
import { staticProducts } from "@/lib/data/products";
import { readSnapshot, writeSnapshot } from "./driver";
import type { StoredRecord } from "./snapshot";

/**
 * Writes against the catalogue overlay.
 *
 * Every write is read-modify-write on the whole snapshot. The catalogue is
 * nineteen records of a few kilobytes each and one editor at a time, so the
 * cost is irrelevant and the alternative — per-slug keys — buys nothing but a
 * partially-written catalogue when something fails halfway.
 */

const staticBySlug = new Map(staticProducts.map((p) => [p.slug, p]));

/** Structural equality via JSON. Adequate here: the model is plain data. */
function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/**
 * Drop fields that match the verified baseline.
 *
 * This is what keeps "edited back to the original" identical to "never edited",
 * so a later correction in code reaches the field again instead of being
 * shadowed by an overlay that says the same thing.
 */
function pruneAgainstBase(patch: Partial<Product>, base: Product | undefined): Partial<Product> {
  if (!base) return patch;
  const pruned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (!same(value, (base as unknown as Record<string, unknown>)[key])) pruned[key] = value;
  }
  return pruned as Partial<Product>;
}

export interface SaveResult {
  ok: boolean;
  /** ISO timestamp of the write, for the "Saved HH:MM" marker. */
  savedAt?: string;
  error?: string;
}

/** Merge `patch` into the stored overlay for `slug`. */
export async function saveProductPatch(
  slug: string,
  patch: Partial<Product>,
): Promise<SaveResult> {
  try {
    const snapshot = await readSnapshot();
    const base = staticBySlug.get(slug);
    const existing = snapshot.records[slug];

    if (!base && !existing) {
      return { ok: false, error: `No product with the slug “${slug}”.` };
    }

    const merged = { ...(existing?.patch ?? {}), ...patch };
    const record: StoredRecord = {
      base: existing?.base ?? (base ? "static" : "new"),
      patch: base ? pruneAgainstBase(merged, base) : merged,
      updatedAt: new Date().toISOString(),
    };

    /*
     * An overlay that no longer differs from the baseline is removed outright.
     * Leaving an empty record would keep the row marked "edited" for ever.
     */
    if (record.base === "static" && Object.keys(record.patch).length === 0) {
      delete snapshot.records[slug];
    } else {
      snapshot.records[slug] = record;
    }

    await writeSnapshot(snapshot);
    return { ok: true, savedAt: record.updatedAt };
  } catch (error) {
    console.error("[store] save failed:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Save failed." };
  }
}

export async function setProductStatus(slug: string, status: ProductStatus): Promise<SaveResult> {
  return saveProductPatch(slug, { status });
}

/**
 * Restore a record to the verified baseline by discarding its overlay.
 * Only meaningful for a code-defined product; a portal-authored one has no
 * baseline to fall back to.
 */
export async function revertProduct(slug: string): Promise<SaveResult> {
  try {
    if (!staticBySlug.has(slug)) {
      return { ok: false, error: "This product was created in the portal — there is nothing to revert to." };
    }
    const snapshot = await readSnapshot();
    delete snapshot.records[slug];
    await writeSnapshot(snapshot);
    return { ok: true, savedAt: new Date().toISOString() };
  } catch (error) {
    console.error("[store] revert failed:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Revert failed." };
  }
}

/* ------------------------------------------------------------- creation -- */

const SLUG_RE = /[^a-z0-9]+/g;

export function slugify(value: string): string {
  return value.toLowerCase().trim().replace(SLUG_RE, "-").replace(/^-|-$/g, "");
}

/** A record with every field present and nothing invented. Starts as a DRAFT. */
function blankProduct(slug: string, name: string, categorySlug: string): Product {
  return {
    slug, name, formula: null, tagline: "", categorySlug, badge: "",
    status: "DRAFT", synonyms: "", overview: [],

    unNumber: "", cas: null, tdgClass: "2.2", properShippingName: "",
    erapRequired: false, pictograms: [], signalWord: null,
    hazardStatements: [], hazardSummary: "", documents: [],

    properties: [], grades: [], impuritySpecies: [], packages: [],
    applications: [], processes: [], industries: [],

    safety: {
      oxygenDisplacementWarning: false, callout: null, storage: "",
      segregation: "", leakDetection: "", ppe: [], never: [], requalification: "",
    },
    compatibility: {
      cga: "", cgaThread: "", cgaNote: "", recommendedEquipment: [],
      compatibleMaterials: "", incompatible: "",
    },
    relatedSlugs: [], featuredRank: null, featuredBadge: null,
    faq: [], metaDescription: "",
  };
}

export interface CreateResult {
  ok: boolean;
  slug?: string;
  error?: string;
}

export async function createProduct(
  name: string,
  categorySlug: string,
): Promise<CreateResult> {
  try {
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, error: "Give the product a name." };

    const slug = slugify(trimmed);
    if (!slug) return { ok: false, error: "That name has no letters or digits to build a URL from." };

    const snapshot = await readSnapshot();
    if (staticBySlug.has(slug) || snapshot.records[slug]) {
      return { ok: false, error: `A product already uses the URL /${slug}.` };
    }

    snapshot.records[slug] = {
      base: "new",
      patch: blankProduct(slug, trimmed, categorySlug),
      updatedAt: new Date().toISOString(),
    };
    await writeSnapshot(snapshot);
    return { ok: true, slug };
  } catch (error) {
    console.error("[store] create failed:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Could not create it." };
  }
}

/* -------------------------------------------------------------- deletion -- */

export type DeleteKind = "withdrawn" | "destroyed";

export interface DeleteResult extends SaveResult {
  /**
   * What actually happened, because the two are not the same thing and the
   * caller has to be able to say so:
   *  · `withdrawn` — a code-defined product, taken off the site but restorable.
   *  · `destroyed` — a portal-authored product, gone for good.
   */
  kind?: DeleteKind;
}

/**
 * Delete a product.
 *
 * A code-defined record is never removed from the overlay, because the overlay
 * is not where it lives — the record is in `lib/data/products` and will still
 * be there after any number of deletions. Marking it `deleted` is therefore the
 * only representation that means anything, and it has the useful property of
 * being exactly reversible.
 *
 * A portal-authored record has no such baseline: its overlay entry *is* the
 * product, so deleting the entry destroys it. Callers must warn accordingly.
 */
export async function deleteProduct(slug: string): Promise<DeleteResult> {
  try {
    const snapshot = await readSnapshot();
    const base = staticBySlug.get(slug);
    const existing = snapshot.records[slug];

    if (!base && !existing) {
      return { ok: false, error: `No product with the slug “${slug}”.` };
    }

    if (!base) {
      delete snapshot.records[slug];
      await writeSnapshot(snapshot);
      return { ok: true, kind: "destroyed", savedAt: new Date().toISOString() };
    }

    const record: StoredRecord = {
      base: "static",
      patch: existing?.patch ?? {},
      updatedAt: new Date().toISOString(),
      deleted: true,
    };
    snapshot.records[slug] = record;
    await writeSnapshot(snapshot);
    return { ok: true, kind: "withdrawn", savedAt: record.updatedAt };
  } catch (error) {
    console.error("[store] delete failed:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Delete failed." };
  }
}

/** Put a withdrawn product back, keeping whatever edits it carried. */
export async function restoreProduct(slug: string): Promise<SaveResult> {
  try {
    const snapshot = await readSnapshot();
    const record = snapshot.records[slug];
    if (!record?.deleted) {
      return { ok: false, error: "That product is not withdrawn." };
    }

    /*
     * An untouched record that was only ever deleted has no edits worth
     * keeping, so restoring it drops the overlay entirely and returns the
     * product to tracking the verified baseline.
     */
    if (Object.keys(record.patch).length === 0) {
      delete snapshot.records[slug];
    } else {
      snapshot.records[slug] = {
        ...record,
        deleted: false,
        updatedAt: new Date().toISOString(),
      };
    }

    await writeSnapshot(snapshot);
    return { ok: true, savedAt: new Date().toISOString() };
  } catch (error) {
    console.error("[store] restore failed:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Restore failed." };
  }
}
