import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { EMPTY_SNAPSHOT, parseSnapshot, type CatalogueSnapshot } from "./snapshot";

/**
 * Where portal edits live.
 *
 * Three drivers, chosen from the environment at first use. Nothing to install
 * and nothing to configure to start:
 *
 *  · **file** — a JSON file at `.data/catalogue.json`. The local default, and
 *    correct for any long-lived host with a writable disk.
 *  · **kv** — Upstash / Vercel KV over its REST API. Plain `fetch`, no client
 *    library. This is the driver that makes the portal work on Vercel, whose
 *    filesystem is ephemeral and read-only: a file written during a request is
 *    gone at the next cold start and never existed for any other instance.
 *  · **readonly** — no writable store reachable. The site serves the verified
 *    baseline as normal and the portal *disables* Save with the reason shown.
 *
 * The readonly case is deliberate. A deploy that silently accepted edits and
 * lost them at the next cold start is the worst of the three outcomes, so the
 * absence of a store is surfaced rather than papered over.
 */

export type DriverKind = "file" | "kv" | "readonly";

export interface DriverInfo {
  kind: DriverKind;
  writable: boolean;
  /** Shown in the portal. Plain language, no env-var names for the happy path. */
  label: string;
  /** Present only when `writable` is false — what to do about it. */
  reason?: string;
}

const KV_KEY = "orion:catalogue:v1";
const FILE_PATH = path.join(process.cwd(), ".data", "catalogue.json");

function kvCredentials(): { url: string; token: string } | null {
  /* Vercel's KV integration and a bare Upstash database use different names. */
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

/**
 * `VERCEL` is set in every Vercel runtime and build. It is the signal that the
 * filesystem cannot be used for persistence, regardless of whether a write
 * happens to succeed — /tmp is writable there and still per-instance.
 */
const onServerless = Boolean(process.env.VERCEL);

export function driverInfo(): DriverInfo {
  if (kvCredentials()) {
    return { kind: "kv", writable: true, label: "Shared key-value store" };
  }
  if (onServerless) {
    return {
      kind: "readonly",
      writable: false,
      label: "Read-only",
      reason:
        "This deployment has no connected store, so an edit could not survive the next request. Add a KV database in the Vercel dashboard — it sets KV_REST_API_URL and KV_REST_API_TOKEN for you — and editing turns on with no code change.",
    };
  }
  return { kind: "file", writable: true, label: "Local file · .data/catalogue.json" };
}

/* ------------------------------------------------------------------ read -- */

async function readFile(): Promise<CatalogueSnapshot | null> {
  try {
    return parseSnapshot(await fs.readFile(FILE_PATH, "utf8"));
  } catch (error) {
    /* A missing file is the ordinary first-run state, not a problem. */
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    console.error("[store] could not read .data/catalogue.json:", error);
    return null;
  }
}

async function readKv(): Promise<CatalogueSnapshot | null> {
  const creds = kvCredentials();
  if (!creds) return null;
  try {
    const response = await fetch(`${creds.url}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${creds.token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("[store] KV read failed:", response.status, await response.text());
      return null;
    }
    const body = (await response.json()) as { result?: string | null };
    return parseSnapshot(body.result);
  } catch (error) {
    console.error("[store] KV read failed:", error);
    return null;
  }
}

/** Never throws. A store that cannot be read degrades to the baseline. */
export async function readSnapshot(): Promise<CatalogueSnapshot> {
  const { kind } = driverInfo();
  const snapshot = kind === "kv" ? await readKv() : kind === "file" ? await readFile() : null;
  return snapshot ?? EMPTY_SNAPSHOT;
}

/* ----------------------------------------------------------------- write -- */

async function writeFile(snapshot: CatalogueSnapshot): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  /*
   * Write-then-rename. A crash mid-write leaves the previous snapshot intact
   * rather than a truncated file that parses as "no edits at all".
   */
  const temp = `${FILE_PATH}.${process.pid}.tmp`;
  await fs.writeFile(temp, JSON.stringify(snapshot, null, 2), "utf8");
  await fs.rename(temp, FILE_PATH);
}

async function writeKv(snapshot: CatalogueSnapshot): Promise<void> {
  const creds = kvCredentials();
  if (!creds) throw new Error("No key-value store is configured.");
  const response = await fetch(`${creds.url}/set/${KV_KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${creds.token}` },
    body: JSON.stringify(snapshot),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Key-value store rejected the write (${response.status}).`);
  }
}

/** Throws on a read-only deployment, so a failed save is never reported as one. */
export async function writeSnapshot(snapshot: CatalogueSnapshot): Promise<void> {
  const info = driverInfo();
  if (!info.writable) throw new Error(info.reason ?? "This deployment is read-only.");
  if (info.kind === "kv") return writeKv(snapshot);
  return writeFile(snapshot);
}
