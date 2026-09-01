import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getAnyProductBySlug, getRecordMeta, getStoreInfo } from "@/lib/catalogue";
import { ProductEditor } from "@/components/admin/product-editor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getAnyProductBySlug(slug);
  return { title: product ? `Editing ${product.name}` : "Product editor" };
}

/**
 * A02 — product editor route.
 *
 * Unlike the public product page this must never be cached: it renders the
 * current draft, and a stale render would show an editor full of values that
 * are no longer in the store.
 */
export const dynamic = "force-dynamic";

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, meta, all] = await Promise.all([
    getAnyProductBySlug(slug),
    getRecordMeta(),
    getAllProducts(),
  ]);

  if (!product) notFound();

  const store = getStoreInfo();
  const linkable = all
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({ slug: p.slug, name: p.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ProductEditor
      /* Remount cleanly when the route changes to a different record. */
      key={product.slug}
      initial={product}
      storeWritable={store.writable}
      storeReason={store.reason}
      lastSavedAt={meta[product.slug]?.updatedAt ?? null}
      origin={meta[product.slug]?.origin ?? "static"}
      linkable={linkable}
    />
  );
}
