import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { authState, getAdminSession } from "@/lib/auth/server";
import { signInAction } from "./actions";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

/**
 * Sign-in.
 *
 * Chromeless by construction — it sits outside the `(portal)` route group, so
 * it does not inherit the navigation of a portal you have not been admitted to.
 *
 * A plain server action, which means it works with JavaScript disabled and
 * carries Next's built-in Origin check against cross-site submission. The error
 * is carried in the query string; the password never is.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

  const next = one(sp.next) || "/admin/products";
  const error = one(sp.error);
  const username = one(sp.username);
  const state = authState();

  /* Already signed in — no reason to show a form. */
  if (await getAdminSession()) redirect(next.startsWith("/admin") ? next : "/admin/products");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5 py-16">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-9 inline-block" title="Back to the public site">
          <Image
            src="/assets/orion-logo.png"
            alt="Orion Gases"
            width={96}
            height={43}
            priority
            className="block h-[38px] w-auto"
          />
        </Link>

        <div className="rounded-card border border-line bg-paper p-7">
          <h1 className="mb-1.5 text-[24px] tracking-[-0.02em]">Sign in</h1>
          <p className="mb-6 text-[14.5px] leading-[1.6] text-muted" style={{ textWrap: "pretty" }}>
            The product portal edits the live catalogue.
          </p>

          {!state.configured ? (
            /*
             * No password configured. The sign-in page is the one route the
             * middleware always lets through, so this renders on a deployed host
             * too — and there the portal behind it is refused, not open. The two
             * cases therefore get different copy: offering "continue to the
             * portal" on a deployment would be a button that leads to a 503.
             */
            state.deployed ? (
              <p className="rounded-inner border border-line bg-surface px-4 py-3.5 text-[13.5px] leading-[1.55] text-ink-2">
                The portal is disabled on this deployment. No{" "}
                <span className="font-mono text-[12.5px]">ADMIN_PASSWORD</span> is set, so it
                is refused rather than left open — it can edit the published catalogue. Set
                one in the hosting dashboard and redeploy.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="rounded-inner border border-line bg-surface px-4 py-3.5 text-[13.5px] leading-[1.55] text-ink-2">
                  No <span className="font-mono text-[12.5px]">ADMIN_PASSWORD</span> is set on
                  this machine, so there is nothing to sign in against and the portal is open.
                  Set one in <span className="font-mono text-[12.5px]">.env.local</span> to
                  turn sign-in on here too.
                </p>
                <Link
                  href="/admin/products"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-[14.5px] text-paper hover:text-paper"
                >
                  Continue to the portal
                </Link>
              </div>
            )
          ) : (
            <form action={signInAction} className="flex flex-col gap-4">
              <input type="hidden" name="next" value={next} />

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                  Username
                </span>
                <input
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  defaultValue={username || "admin"}
                  className="h-12 rounded-inner border border-line bg-surface px-4 text-[15.5px] outline-none focus:border-gold focus:bg-paper"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  autoFocus
                  className="h-12 rounded-inner border border-line bg-surface px-4 text-[15.5px] outline-none focus:border-gold focus:bg-paper"
                />
              </label>

              {error && (
                <p role="alert" className="text-[13.5px] leading-[1.5] text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-1 inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-[15px] text-paper transition-opacity duration-150 hover:opacity-[0.85]"
              >
                Sign in
              </button>
            </form>
          )}
        </div>

        {state.weakPassword && (
          <p className="mt-5 text-[12.5px] leading-[1.55] text-muted">
            The configured password is under 12 characters. It is also the key the session
            cookie is signed with unless{" "}
            <span className="font-mono text-[11.5px]">ADMIN_SESSION_SECRET</span> is set, so
            a longer one is worth the trouble.
          </p>
        )}

        <Link
          href="/"
          className="mt-6 inline-block text-[13.5px] text-muted hover:text-ink"
        >
          ← Back to the site
        </Link>
      </div>
    </main>
  );
}
