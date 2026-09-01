"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, isDeployed, sessionSecret } from "@/lib/auth/session";
import { verifyCredentials } from "@/lib/auth/server";

/**
 * Sign in / sign out.
 *
 * The cookie is scoped to `/admin`, not to the whole site. That is not tidiness:
 * a server action is addressed by its action id rather than its URL, so an
 * attacker can replay the save action's id against a public route. With the
 * cookie confined to /admin the browser does not attach it to such a request,
 * and `adminGate()` inside the action sees no session and refuses. The narrow
 * path turns a bypass attempt into an ordinary rejection.
 */

const COOKIE_PATH = "/admin";

/**
 * Only ever redirect back inside the portal.
 *
 * `next` arrives from the query string, so it is attacker-controlled: without
 * this an emailed /admin/login?next=https://evil.example link would bounce a
 * freshly-authenticated admin straight off-site. A protocol-relative `//host`
 * is rejected for the same reason — it is an absolute URL wearing a path's
 * clothes.
 */
function safeNext(value: unknown): string {
  const target = typeof value === "string" ? value : "";
  if (!target.startsWith("/admin") || target.startsWith("//")) return "/admin/products";
  if (target.startsWith("/admin/login")) return "/admin/products";
  return target;
}

export async function signInAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const result = await verifyCredentials(username, password);

  if (!result.ok || !result.subject) {
    /* The username is echoed back so a typo is visible; the password never is. */
    redirect(
      `/admin/login?error=${encodeURIComponent(result.error ?? "Sign-in failed.")}` +
        `&username=${encodeURIComponent(username)}&next=${encodeURIComponent(next)}`,
    );
  }

  const secret = sessionSecret();
  if (!secret) redirect("/admin/login?error=Server%20is%20not%20configured%20for%20sign-in.");

  const token = await createSessionToken(result.subject, secret);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isDeployed(),
    path: COOKIE_PATH,
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect(next);
}

export async function signOutAction(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isDeployed(),
    path: COOKIE_PATH,
    maxAge: 0,
  });
  redirect("/admin/login");
}
