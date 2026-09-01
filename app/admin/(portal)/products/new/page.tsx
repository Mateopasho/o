import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/lib/data/categories";
import { getStoreInfo } from "@/lib/catalogue";
import { createProductAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "New product" };
export const dynamic = "force-dynamic";

/**
 * The one place in the portal that is a plain form rather than the page itself.
 *
 * A new record has no page to edit yet, so this asks for the two things that
 * decide its URL and where it files — name and category — and hands straight
 * over to A02. Everything else is filled in there, in place, where it will be
 * seen. The record starts as a DRAFT, so nothing reaches the public site until
 * it is switched live.
 */
export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const name = typeof sp.name === "string" ? sp.name : "";
  const store = getStoreInfo();

  return (
    <div className="px-5 py-10 md:px-14">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-[14px] text-muted hover:text-ink">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Products
      </Link>

      <h1 className="mb-2 mt-5 text-[28px] tracking-[-0.022em]">New product</h1>
      <p className="mb-7 max-w-[62ch] text-[15px] leading-[1.6] text-muted" style={{ textWrap: "pretty" }}>
        Name it and file it. Everything else — grades, packages, properties, safety — is
        filled in on the page itself. It starts as a draft, so nothing goes live until you
        switch it on.
      </p>

      {!store.writable && (
        <p className="mb-6 max-w-[86ch] rounded-card border border-line bg-surface px-5 py-4 text-[13.5px] leading-[1.55] text-ink-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-danger">
            Read-only
          </span>{" "}
          — {store.reason}
        </p>
      )}

      {error && (
        <p className="mb-6 max-w-[86ch] rounded-card border border-danger/30 bg-gold-wash px-5 py-4 text-[14px] text-danger">
          {error}
        </p>
      )}

      <form action={createProductAction} className="flex max-w-[560px] flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
            Product name
          </span>
          <input
            name="name"
            type="text"
            required
            defaultValue={name}
            placeholder="Nitrogen"
            className="h-12 rounded-inner border border-dashed border-line-2 bg-surface px-4 text-[17px] outline-none placeholder:text-faint-2 focus:border-solid focus:border-gold focus:bg-paper"
          />
          <span className="text-[12.5px] text-muted">
            The URL is built from this and cannot be changed afterwards.
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
            Category
          </span>
          <select
            name="categorySlug"
            defaultValue={categories[0]?.slug}
            className="h-12 rounded-inner border border-dashed border-line-2 bg-surface px-3 text-[15px] outline-none focus:border-solid focus:border-gold focus:bg-paper"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!store.writable}
            className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[14.5px] text-paper transition-opacity duration-150 hover:opacity-[0.82] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create draft
          </button>
          <Link href="/admin/products" className="text-[14.5px] text-muted hover:text-ink">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
