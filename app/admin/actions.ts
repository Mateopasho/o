"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Product, ProductStatus } from "@/lib/types";
import {
  saveProductPatch, revertProduct, createProduct, deleteProduct, restoreProduct,
  type SaveResult, type DeleteResult,
} from "@/lib/store/mutate";
import { adminGate } from "@/lib/auth/server";

/**
 * Editor actions — the only way anything writes to the catalogue.
 *
 * **Every one of these begins with `adminGate()`, and that is load-bearing.**
 * A server action is dispatched by its action id, not by the URL it was posted
 * to, so `middleware.ts` — which matches on `/admin/:path*` — cannot see a POST
 * aimed at a public route that carries one of these ids. Without the gate here,
 * the middleware would be protecting the editor's pages while leaving its
 * writes reachable by anyone who read the action id out of the client bundle.
 *
 * The client submits the whole draft record rather than a diff. Working out
 * what changed is the store's job — `saveProductPatch` prunes every field that
 * still matches the verified baseline, so the overlay stays minimal without the
 * browser having to track dirty fields correctly. One less thing to get wrong
 * on a form this size.
 */

/** Bust every cached render. A product surfaces on the home page, the
 *  catalogue, the SDS library, the compare view and its own page. */
function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function saveProductAction(draft: Product): Promise<SaveResult> {
  const gate = await adminGate();
  if (!gate.ok) return { ok: false, error: gate.error };

  const result = await saveProductPatch(draft.slug, draft);
  if (result.ok) revalidateSite();
  return result;
}

export async function setStatusAction(
  slug: string,
  status: ProductStatus,
): Promise<SaveResult> {
  const gate = await adminGate();
  if (!gate.ok) return { ok: false, error: gate.error };

  const result = await saveProductPatch(slug, { status });
  if (result.ok) revalidateSite();
  return result;
}

export async function revertProductAction(slug: string): Promise<SaveResult> {
  const gate = await adminGate();
  if (!gate.ok) return { ok: false, error: gate.error };

  const result = await revertProduct(slug);
  if (result.ok) revalidateSite();
  return result;
}

/**
 * Create a draft and land the editor on it. Errors come back through the URL
 * rather than thrown, so a duplicate slug re-renders the form with the reason
 * instead of a crash page.
 */
export async function createProductAction(formData: FormData): Promise<void> {
  const gate = await adminGate();
  if (!gate.ok) redirect("/admin/login?next=%2Fadmin%2Fproducts%2Fnew");

  const name = String(formData.get("name") ?? "");
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const result = await createProduct(name, categorySlug);

  if (!result.ok || !result.slug) {
    redirect(
      `/admin/products/new?error=${encodeURIComponent(result.error ?? "Could not create it.")}` +
        `&name=${encodeURIComponent(name)}`,
    );
  }

  revalidateSite();
  redirect(`/admin/products/${result.slug}`);
}

export async function deleteProductAction(slug: string): Promise<DeleteResult> {
  const gate = await adminGate();
  if (!gate.ok) return { ok: false, error: gate.error };

  const result = await deleteProduct(slug);
  if (result.ok) revalidateSite();
  return result;
}

export async function restoreProductAction(slug: string): Promise<SaveResult> {
  const gate = await adminGate();
  if (!gate.ok) return { ok: false, error: gate.error };

  const result = await restoreProduct(slug);
  if (result.ok) revalidateSite();
  return result;
}

/**
 * Form-shaped restore, for the Removed tab on the product list.
 *
 * A `<form action>` must resolve to void, so this wrapper exists rather than
 * binding `restoreProductAction` — which returns a result the form has no way
 * to render. Failures surface in the URL, the same way the create form's do.
 */
export async function restoreProductFormAction(formData: FormData): Promise<void> {
  const gate = await adminGate();
  if (!gate.ok) redirect("/admin/login?next=%2Fadmin%2Fproducts%3Fstatus%3Dremoved");

  const slug = String(formData.get("slug") ?? "");
  const result = await restoreProduct(slug);

  if (!result.ok) {
    redirect(
      `/admin/products?status=removed&error=${encodeURIComponent(result.error ?? "Restore failed.")}`,
    );
  }

  revalidateSite();
  redirect(`/admin/products?restored=${encodeURIComponent(slug)}`);
}
