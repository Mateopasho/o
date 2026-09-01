import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllProducts, getRecordMeta, getRemovedProducts, getStoreInfo, type RecordMeta,
} from "@/lib/catalogue";
import { restoreProductFormAction } from "@/app/admin/actions";
import { categoryBySlug } from "@/lib/data/categories";
import { Formula } from "@/lib/format";
import type { Product, ProductStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Products" };

/**
 * A01 — catalogue index.
 *
 * Layout and logic follow the artboard exactly: status segment with counts,
 * search across name / UN / SKU, then the Product · Category · UN · Sizes ·
 * Grades · Status · Updated table.
 *
 * Filter state lives in the URL for the same reason it does on the public
 * catalogue — a filtered admin view is a link you can send someone.
 */

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * The Updated column shows a real date in both states. Once a record has been
 * edited in the portal the store carries a true write timestamp; until then it
 * falls back to the newest document revision the product itself carries, which
 * is the most recent thing that genuinely changed about it. Nothing here is
 * invented.
 */
function lastTouched(product: Product, meta: RecordMeta | undefined): string {
  if (meta?.updatedAt) return meta.updatedAt.slice(0, 10);
  const dates = product.documents.map((d) => d.revised).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : "—";
}

function matches(product: Product, status: string, q: string): boolean {
  if (status && status !== "all" && product.status !== status.toUpperCase()) return false;
  if (!q) return true;
  const hay = [
    product.name,
    product.unNumber,
    product.cas ?? "",
    ...product.packages.map((p) => p.sku),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

const STATUS_TONE: Record<ProductStatus, string> = {
  ACTIVE: "bg-[#E4F1EA] text-[#1E7A4B]",
  DRAFT: "bg-gold-ribbon text-gold-ink",
  ARCHIVED: "bg-surface text-muted",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  const status = one(sp.status) || "all";
  const q = one(sp.q).trim();

  const [allProducts, removedProducts, meta] = await Promise.all([
    getAllProducts(),
    getRemovedProducts(),
    getRecordMeta(),
  ]);
  const store = getStoreInfo();

  /* Notices from a delete or a restore that redirected back here. */
  const removedName = one(sp.removed);
  const deleteKind = one(sp.kind);
  const restoredSlug = one(sp.restored);
  const error = one(sp.error);

  /*
   * "Removed" is a view over a different list, not another status filter — a
   * withdrawn product keeps whatever status it had, and mixing the two would
   * make the segment counts lie.
   */
  const showingRemoved = status === "removed";
  const rows = showingRemoved
    ? removedProducts.filter((p) => matches(p, "all", q))
    : allProducts.filter((p) => matches(p, status, q));

  const counts = {
    all: allProducts.length,
    active: allProducts.filter((p) => p.status === "ACTIVE").length,
    draft: allProducts.filter((p) => p.status === "DRAFT").length,
    archived: allProducts.filter((p) => p.status === "ARCHIVED").length,
  };

  const segment = [
    { key: "all", label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "draft", label: "Draft", count: counts.draft },
    ...(counts.archived > 0
      ? [{ key: "archived", label: "Archived", count: counts.archived }]
      : []),
    /* Only offered once there is something in it. */
    ...(removedProducts.length > 0 || showingRemoved
      ? [{ key: "removed", label: "Removed", count: removedProducts.length }]
      : []),
  ];

  const hrefFor = (s: string) => {
    const p = new URLSearchParams();
    if (s !== "all") p.set("status", s);
    if (q) p.set("q", q);
    const qs = p.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-line px-5 pb-5 pt-7 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <h1 className="mb-1.5 text-[26px] tracking-[-0.022em] md:text-[28px]">Products</h1>
          <p className="text-[14.5px] text-muted">
            Everything published in the catalogue, plus drafts in progress.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full bg-ink px-5 text-[14.5px] text-paper transition-opacity duration-150 hover:text-paper hover:opacity-[0.82]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New product
        </Link>
      </div>

      {/*
        A deployment with nowhere to write says so here rather than accepting
        edits and losing them at the next cold start.
      */}
      {!store.writable && (
        <div className="border-b border-line bg-gold-wash px-5 py-3.5 md:px-8">
          <p className="max-w-[86ch] text-[13.5px] leading-[1.6] text-gold-ink">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em]">
              Read-only
            </span>{" "}
            — {store.reason} Until then the catalogue below is the published
            baseline and Save is disabled.
          </p>
        </div>
      )}

      {removedName && (
        <div className="border-b border-line bg-surface px-5 py-3.5 md:px-8">
          <p className="text-[13.5px] leading-[1.55] text-ink-2">
            <span className="text-ink">{removedName}</span>{" "}
            {deleteKind === "destroyed" ? (
              "was deleted. It was created in the portal, so there was no published version to keep."
            ) : (
              <>
                is off the public site. The verified record is intact — restore it from{" "}
                <Link href="/admin/products?status=removed" className="text-gold-link">
                  Removed
                </Link>
                .
              </>
            )}
          </p>
        </div>
      )}

      {restoredSlug && (
        <div className="border-b border-line bg-surface px-5 py-3.5 md:px-8">
          <p className="text-[13.5px] text-ink-2">
            <span className="font-mono text-[12.5px] text-ink">/{restoredSlug}</span> is back
            in the catalogue.
          </p>
        </div>
      )}

      {error && (
        <div className="border-b border-line bg-surface px-5 py-3.5 md:px-8">
          <p role="alert" className="text-[13.5px] text-danger">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 border-b border-line px-5 py-4 md:flex-row md:items-center md:px-8">
        <div className="scroll-x inline-flex shrink-0 gap-1 rounded-full bg-surface p-1">
          {segment.map((s) => {
            const active = status === s.key;
            return (
              <Link
                key={s.key}
                href={hrefFor(s.key)}
                aria-current={active ? "true" : undefined}
                className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13.5px] transition-colors duration-150 ${
                  active ? "bg-paper text-ink shadow-[var(--shadow-card)]" : "text-muted hover:text-ink"
                }`}
              >
                {s.label}
                <span className={`font-mono text-[11.5px] ${active ? "text-faint" : "text-faint-2"}`}>
                  {s.count}
                </span>
              </Link>
            );
          })}
        </div>

        <form action="/admin/products" role="search" className="flex h-10 w-full items-center gap-2.5 rounded-full bg-surface px-4 md:max-w-[340px]">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <label htmlFor="admin-search" className="sr-only">
            Search by name, UN number or SKU
          </label>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A29E96" strokeWidth="1.8" aria-hidden="true" className="shrink-0">
            <circle cx="11" cy="11" r="7" />
            <path d="M16 16l5 5" />
          </svg>
          <input
            id="admin-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search by name, UN number or SKU"
            className="w-full bg-transparent text-sm outline-none"
          />
        </form>

        <span className="shrink-0 font-mono text-[11.5px] text-faint md:ml-auto">
          {rows.length} of {showingRemoved ? removedProducts.length : counts.all}
        </span>
      </div>

      {showingRemoved && (
        <div className="border-b border-line px-5 py-3.5 md:px-8">
          <p className="max-w-[86ch] text-[13.5px] leading-[1.55] text-muted">
            Withdrawn from the public site. The verified record is still in the codebase, so
            restoring one brings it back exactly as it was, including any edits it carried.
          </p>
        </div>
      )}

      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-[14.5px]">
            <caption className="sr-only">Product catalogue</caption>
            <thead>
              <tr className="border-b border-line bg-surface text-left">
                {["Product", "Category", "UN", "Sizes", "Grades", "Status", "Updated"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="whitespace-nowrap px-5 py-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-faint first:pl-5 md:first:pl-8"
                  >
                    {h}
                  </th>
                ))}
                <th scope="col" className="px-5 py-3 md:pr-8">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.slug} className="border-b border-line last:border-0 hover:bg-surface">
                  <th scope="row" className="px-5 py-3.5 text-left font-normal md:pl-8">
                    <span className="block text-ink">
                      {p.name}{" "}
                      {p.formula && (
                        <span className="font-mono text-[13px] text-faint">
                          <Formula value={p.formula} />
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[11.5px] text-faint">/{p.slug}</span>
                  </th>
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                    {categoryBySlug(p.categorySlug)?.shortName ?? p.categorySlug}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 font-mono text-muted">{p.unNumber}</td>
                  <td className="px-5 py-3.5 font-mono text-muted">{p.packages.length}</td>
                  <td className="px-5 py-3.5 font-mono text-muted">{p.grades.length}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] ${STATUS_TONE[p.status]}`}>
                      {p.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[13px] text-faint">
                    {lastTouched(p, meta[p.slug])}
                    {meta[p.slug]?.edited && (
                      <span className="ml-2 text-gold-link" title="Edited in the portal">•</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right md:pr-8">
                    {showingRemoved ? (
                      <form action={restoreProductFormAction} className="inline">
                        <input type="hidden" name="slug" value={p.slug} />
                        <button
                          type="submit"
                          disabled={!store.writable}
                          title={store.writable ? undefined : store.reason}
                          className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-[13px] text-ink transition-colors duration-150 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Restore
                        </button>
                      </form>
                    ) : (
                      <Link
                        href={`/admin/products/${p.slug}`}
                        className="text-[13.5px] text-gold-link underline-offset-2 hover:underline"
                      >
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 px-5 py-16 md:px-8">
          <p className="text-[17px]">
            {showingRemoved && !q ? "Nothing has been removed." : "Nothing matches that."}
          </p>
          <p className="max-w-[52ch] text-[15px] leading-[1.65] text-muted">
            {showingRemoved && !q
              ? "Deleted products land here so they can be put back."
              : "Try a different status, or search by product name, UN number or SKU."}
          </p>
          <Link href="/admin/products" className="text-[15px] text-gold-link">
            Clear filters
          </Link>
        </div>
      )}
    </>
  );
}
