import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE, isDeployed, sessionSecret, verifySessionToken,
} from "@/lib/auth/session";

/**
 * First boundary: every request under /admin.
 *
 * This runs before any admin page renders, so an unauthenticated visitor never
 * reaches a route handler and never sees a draft. It is **not** the only
 * boundary — see `adminGate()` in lib/auth/server.ts for why a server action
 * needs its own check even with this in place.
 *
 * States, in the order they are decided:
 *
 *  1. `/admin/login` is always reachable, or there is no way back in.
 *  2. No password configured, deployed → refused with the reason. Failing
 *     closed is the only safe default when the portal can edit a live site.
 *  3. No password configured, local → open. Nothing to protect on your own
 *     machine, and requiring setup before the portal runs buys nothing.
 *  4. Valid session cookie → through.
 *  5. Anything else → GET redirects to the sign-in page, everything else gets a
 *     bare 401. A non-GET here is a form post or a server action, and answering
 *     it with a redirect to an HTML page would make a failure look like a
 *     success to whatever sent it.
 */
export const config = { matcher: "/admin/:path*" };

const LOGIN_PATH = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === LOGIN_PATH) return NextResponse.next();

  const secret = sessionSecret();

  if (!secret) {
    if (isDeployed()) {
      return new NextResponse(
        "The admin portal is disabled on this deployment.\n\n" +
          "Set an ADMIN_PASSWORD environment variable in your hosting dashboard and " +
          "redeploy. Until then /admin is refused rather than left open, because it " +
          "can edit the published catalogue.\n",
        { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
      );
    }
    return NextResponse.next();
  }

  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
    secret,
  );
  if (session) return NextResponse.next();

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new NextResponse("Sign in required.", {
      status: 401,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}
