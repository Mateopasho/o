import type { Metadata } from "next";

/**
 * Admin root.
 *
 * Deliberately chromeless. The portal's header and sidebar live in the
 * `(portal)` route group below this, so the sign-in page — which is under
 * /admin and must be, or the middleware would have to punch a hole somewhere
 * else — does not inherit the navigation of the thing you have not signed into
 * yet.
 *
 * `noindex` belongs here rather than in the group: it must cover the sign-in
 * page too.
 */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Orion Gases Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
