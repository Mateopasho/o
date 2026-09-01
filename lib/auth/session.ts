/**
 * Admin session token.
 *
 * A signed, stateless cookie: `base64url(payload).base64url(HMAC-SHA256)`. No
 * session table, which is what lets it work unchanged on a serverless host
 * where there is nowhere to keep one and no instance affinity between requests.
 *
 * Deliberately runtime-agnostic — Web Crypto and `btoa`/`atob` only, no
 * `node:crypto` and no `Buffer` — because the same verification runs in the Edge
 * middleware and in Node server actions. Anything Node-only here would silently
 * split the two into different rules.
 *
 * The token carries no privileges of its own: it says who signed in and when it
 * expires, and every check re-derives everything else from the environment.
 */

export const SESSION_COOKIE = "orion_admin";

/** Twelve hours. Long enough for a working day, short enough to matter. */
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

export interface SessionPayload {
  /** Who signed in. */
  sub: string;
  /** Issued at, seconds since epoch. */
  iat: number;
  /** Expires at, seconds since epoch. */
  exp: number;
}

/* ------------------------------------------------------------- base64url -- */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToB64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/* ------------------------------------------------------------------- hmac -- */

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/* ------------------------------------------------------------------ token -- */

export async function createSessionToken(
  subject: string,
  secret: string,
  ttlSeconds = SESSION_TTL_SECONDS,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { sub: subject, iat: now, exp: now + ttlSeconds };

  const body = bytesToB64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body));
  return `${body}.${bytesToB64Url(new Uint8Array(signature))}`;
}

/**
 * Verify and decode. Returns null for anything wrong — bad signature, expired,
 * malformed, wrong secret — with no distinction between them, because telling a
 * caller *why* their forged token failed is free help.
 *
 * Signature comparison goes through `crypto.subtle.verify`, which is constant
 * time; comparing HMACs with `===` would leak the digest a byte at a time.
 */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null;

  const dot = token.indexOf(".");
  if (dot < 1 || dot === token.length - 1) return null;

  const body = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      b64UrlToBytes(signature),
      encoder.encode(body),
    );
    if (!valid) return null;

    const payload = JSON.parse(decoder.decode(b64UrlToBytes(body))) as SessionPayload;
    if (typeof payload?.sub !== "string" || typeof payload?.exp !== "number") return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

/* ----------------------------------------------------------------- config -- */

/**
 * Is sign-in possible at all?
 *
 * A non-empty `ADMIN_PASSWORD` is the *only* thing that makes it possible, and
 * this is the single place that decides so. An earlier version let
 * `ADMIN_SESSION_SECRET` alone mark the portal "configured", which meant a
 * deployment with the secret set and the password missing — an entirely ordinary
 * way to misconfigure two variables — treated the expected password as the empty
 * string and let `password=` straight in. Signing keys and credentials are
 * different things and must never stand in for one another.
 */
export function hasPassword(): boolean {
  return (process.env.ADMIN_PASSWORD ?? "").length > 0;
}

/**
 * The HMAC key, or null when there is no way to sign in.
 *
 * Returning null without a password is deliberate: no password means no
 * legitimate session can ever be issued, so being able to *verify* one is worse
 * than useless — it is a way for a forged or stale cookie to be honoured.
 *
 * `ADMIN_SESSION_SECRET` is what you should set. Failing that the key is derived
 * from the password, so the portal is protected the moment one variable is set
 * rather than two — and changing the password then invalidates every existing
 * session, which is what you want from a password change anyway. HMAC hashes its
 * own key material, so a short password still yields a full-length key; it is
 * the guessability of the password that matters, which is why `isWeakPassword`
 * exists below.
 */
export function sessionSecret(): string | null {
  if (!hasPassword()) return null;

  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit && explicit.length >= 16) return explicit;

  return `orion-admin-derived-key:${process.env.ADMIN_PASSWORD}`;
}

/** True when a password is set but short enough to be worth complaining about. */
export function isWeakPassword(): boolean {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return password.length > 0 && password.length < 12;
}

/** Whether this process is running on a deployed host rather than a laptop. */
export function isDeployed(): boolean {
  return Boolean(process.env.VERCEL);
}
