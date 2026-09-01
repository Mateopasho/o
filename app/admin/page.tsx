import { redirect } from "next/navigation";

/**
 * /admin has no screen of its own — the portal starts at the product list.
 *
 * Without this the bare path falls through to a 404, which is what you get by
 * typing the obvious URL, and worse: signing in from /admin carries
 * `next=/admin`, so a *successful* login landed on a 404. A one-line redirect
 * is the whole fix. Access is already decided by the middleware before this
 * renders.
 */
export default function AdminIndexPage() {
  redirect("/admin/products");
}
