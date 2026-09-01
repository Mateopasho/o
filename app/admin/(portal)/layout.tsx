import Image from "next/image";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { authState, getAdminSession } from "@/lib/auth/server";
import { signOutAction } from "@/app/admin/login/actions";

/**
 * Admin chrome.
 *
 * Structure is the A01/A02 artboards verbatim: a 60px top bar over a
 * 188px sidebar + content grid.
 *
 * The skin is the premium system — hairline #E4E1DA borders, Schibsted Grotesk
 * at a single weight, pill controls, mono micro-labels. There are no premium
 * admin artboards (that zip carried Website, Nav and Footer only), so the
 * original admin's own palette would have left the two halves of the product
 * looking like different applications.
 *
 * `robots: noindex` is set on the /admin root layout so it covers the sign-in
 * page as well; it is not repeated here.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const state = authState();
  const session = await getAdminSession();

  /* Initials for the avatar — "admin" → AD, "dana osei" → DO. */
  const name = session?.sub ?? "Local";
  const initials =
    name
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-line px-5 md:px-8">
        <div className="flex items-center gap-3.5">
          <Link href="/" className="shrink-0" title="Back to the public site">
            <Image
              src="/assets/orion-logo.png"
              alt="Orion Gases"
              width={75}
              height={34}
              priority
              className="block h-[30px] w-auto self-start md:h-[34px]"
            />
          </Link>
          <span className="border-l border-line pl-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <span className="hidden text-[13.5px] text-muted sm:block">{name}</span>
          <span className="inline-flex size-[30px] items-center justify-center rounded-full bg-surface text-xs text-ink-2">
            {initials.slice(0, 2)}
          </span>
          {state.enforced && (
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-[13.5px] text-ink-2 transition-colors duration-150 hover:text-ink"
              >
                Sign out
              </button>
            </form>
          )}
        </div>
      </header>

      {/*
        An unprotected portal says so. This is only reachable on a local machine
        — a deployed host without a password is refused by the middleware — but
        it is exactly the state that gets forgotten before a deploy.
      */}
      {!state.enforced && (
        <div className="border-b border-line bg-gold-wash px-5 py-2.5 md:px-8">
          <p className="text-[13px] leading-[1.5] text-gold-ink">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em]">
              Unprotected
            </span>{" "}
            — no sign-in is required on this machine. Set{" "}
            <span className="font-mono text-[12px]">ADMIN_PASSWORD</span> before deploying;
            a deployment without one refuses to open the portal at all.
          </p>
        </div>
      )}

      <div className="grid flex-1 lg:grid-cols-[188px_minmax(0,1fr)]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
