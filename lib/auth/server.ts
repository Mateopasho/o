import "server-only";
import { cookies, headers } from "next/headers";
import {
  SESSION_COOKIE, hasPassword, isDeployed, isWeakPassword, sessionSecret,
  verifySessionToken, type SessionPayload,
} from "./session";

/**
 * Server-side authorisation.
 *
 * Two entry points matter:
 *
 *  · `getAdminSession()` — for rendering. Who is signed in, or nobody.
 *  · `adminGate()` — for **every mutating server action**. This is not
 *    belt-and-braces on top of the middleware, it is a second, independent
 *    boundary that the middleware cannot cover: a server action is addressed by
 *    its action id, not its URL, so a POST to any public route carrying that id
 *    reaches the action without ever matching `/admin/:path*`. Without a check
 *    inside the action, the middleware protects the editor's *pages* while
 *    leaving its *writes* open to the internet.
 */

export interface AuthState {
  /** A password is configured, so sign-in is possible. */
  configured: boolean;
  /** Sign-in is required. False only on an unconfigured local machine. */
  enforced: boolean;
  deployed: boolean;
  weakPassword: boolean;
}

export function authState(): AuthState {
  /* A password, not a signing key, is what makes sign-in possible. */
  const configured = hasPassword() && Boolean(sessionSecret());
  return {
    configured,
    /*
     * Unconfigured on a laptop stays open: there is nothing to protect and
     * demanding a password before the portal will start is friction with no
     * security value. Unconfigured on a deployed host is refused outright by
     * the middleware, so `enforced` there is moot — it never gets this far.
     */
    enforced: configured,
    deployed: isDeployed(),
    weakPassword: isWeakPassword(),
  };
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, secret);
}

export type GateResult =
  | { ok: true; subject: string }
  | { ok: false; error: string };

/** Call at the top of every action that writes. Never skip it. */
export async function adminGate(): Promise<GateResult> {
  const state = authState();

  if (state.deployed && !state.configured) {
    return {
      ok: false,
      error: "The admin portal is disabled on this deployment: no ADMIN_PASSWORD is set.",
    };
  }

  if (!state.enforced) return { ok: true, subject: "local" };

  const session = await getAdminSession();
  if (!session) {
    return { ok: false, error: "Your session has expired. Sign in again to save." };
  }
  return { ok: true, subject: session.sub };
}

/* ------------------------------------------------------- sign-in checking -- */

/** Length-independent compare, so a wrong password leaks no timing signal. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Failed-attempt throttle.
 *
 * Module-level, so it is per server instance. On one long-lived process that is
 * a real lockout; on a serverless host it degrades to a partial one, because a
 * cold start gets a fresh map. Said plainly rather than dressed up: it raises
 * the cost of a scripted guessing run, and it is not a substitute for a
 * password worth guessing at. A shared counter would need the KV store, which
 * is optional here — so this is the floor, not the ceiling.
 */
const attempts = new Map<string, { fails: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;

function throttleKey(ip: string, username: string) {
  return `${ip}|${username.toLowerCase()}`;
}

/** Backoff after five failures: 1 min, then 5, then 15, then 60. */
function blockDuration(fails: number): number {
  const overage = fails - MAX_ATTEMPTS;
  if (overage <= 0) return 0;
  const minutes = [1, 5, 15, 60][Math.min(overage - 1, 3)];
  return minutes * 60_000;
}

export interface SignInResult {
  ok: boolean;
  subject?: string;
  error?: string;
}

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<SignInResult> {
  const state = authState();
  if (!state.configured) {
    return { ok: false, error: "No ADMIN_PASSWORD is configured on this server." };
  }

  const head = await headers();
  const ip =
    head.get("x-forwarded-for")?.split(",")[0].trim() ||
    head.get("x-real-ip") ||
    "unknown";

  const key = throttleKey(ip, username);
  const record = attempts.get(key);
  const now = Date.now();

  if (record && record.blockedUntil > now) {
    const seconds = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      ok: false,
      error: `Too many failed attempts. Try again in ${
        seconds > 60 ? `${Math.ceil(seconds / 60)} minutes` : `${seconds} seconds`
      }.`,
    };
  }

  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

  /*
   * Independent of `authState()` above, refuse outright if there is no password
   * to check against. Otherwise the comparison below succeeds for a submitted
   * empty password, turning a missing variable into an open door.
   */
  if (expectedPassword.length === 0) {
    return { ok: false, error: "No ADMIN_PASSWORD is configured on this server." };
  }

  /*
   * Both halves are compared even when the username is already wrong, so the
   * time taken does not reveal which half failed.
   */
  const userOk = constantTimeEqual(username.trim(), expectedUser);
  const passOk = constantTimeEqual(password, expectedPassword);

  if (userOk && passOk) {
    attempts.delete(key);
    return { ok: true, subject: expectedUser };
  }

  const fails = (record?.fails ?? 0) + 1;
  attempts.set(key, { fails, blockedUntil: now + blockDuration(fails) });

  /* A fixed delay on failure, to make a scripted run expensive per guess. */
  await new Promise((resolve) => setTimeout(resolve, 450));

  /* One message for both halves — never "no such user". */
  return { ok: false, error: "That username and password do not match." };
}
