"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  ApplicationGroup, ContainerType, DocumentRow, DualValue, FaqEntry, GhsPictogram,
  Grade, PackageConfig, Product, ProductStatus, PropertyRow, SignalWord,
} from "@/lib/types";
import { maxPurity } from "@/lib/types";
import { GhsIcon } from "@/components/ghs";
import { categories } from "@/lib/data/categories";
import { processFilters } from "@/lib/data/categories";
import { industriesIndex, site } from "@/lib/data/site";
import { cgaOutlets } from "@/lib/data/reference";
import { productImage } from "@/lib/data/images";
import {
  AddButton, AddTile, Area, Derived, EditorSection, Lbl, Pick, RowDelete, Text, ToggleChip,
} from "./fields";
import {
  AVAILABILITY_OPTIONS, CONTAINER_OPTIONS, LANGUAGE_OPTIONS, PHASE_OPTIONS,
  PICTOGRAM_OPTIONS, PPE_SUGGESTIONS, SHAPE_OPTIONS, SIGNAL_OPTIONS, TDG_OPTIONS,
} from "./editor-options";
import { deleteProductAction, saveProductAction } from "@/app/admin/actions";
import { ConfirmDialog } from "./confirm-dialog";

/**
 * A02 — product editor.
 *
 * Not a form. The artboard's own banner is the specification: "You're editing
 * the live page layout. Every field sits exactly where it will appear to
 * customers." So the identity block is the product page's masthead with inputs
 * in it, the key-facts strip is the same six cells, and each section below sits
 * in the order it renders publicly.
 *
 * Three things the artboard is emphatic about and this keeps:
 *  · **There is no price field.** Not here, not in the package table, nowhere.
 *  · Derived values are shown, never typed — thread spec, max purity and the
 *    configuration count have no input box because they are computed.
 *  · Ticking oxygen displacement adds the standard asphyxiation wording. It is
 *    a checkbox, not a text field, because the wording must not vary.
 *
 * The whole draft is submitted on Save; the store works out the diff.
 */

/* ------------------------------------------------------------- utilities -- */

const toLines = (s: string) => s.split("\n").map((t) => t.trim()).filter(Boolean);
const fromLines = (a: string[]) => a.join("\n");
const toParas = (s: string) => s.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
const fromParas = (a: string[]) => a.join("\n\n");

const EMPTY_DUAL: DualValue = { metric: "", metricUnit: "", imperial: "", imperialUnit: "" };

/** Replace one element of an array immutably. */
function replaceAt<T>(list: T[], index: number, next: T): T[] {
  return list.map((item, i) => (i === index ? next : item));
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Look up a CGA outlet in the verified reference.
 *
 * Three outcomes, and they mean different things. A listed outlet with a thread
 * spec fills the field in. A listed outlet with no published thread — CGA 295,
 * for one — is a dash by design, not a gap in the record. An outlet the
 * reference does not carry at all is worth flagging, because it usually means a
 * typo in the number.
 */
function threadFor(cga: string): { thread: string | null; listed: boolean } {
  const row = cgaOutlets.find((r) => r.cga === cga);
  return { thread: row?.thread ?? null, listed: Boolean(row) };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "grades", label: "Grades" },
  { id: "packages", label: "Packages" },
  { id: "properties", label: "Properties" },
  { id: "applications", label: "Applications" },
  { id: "equipment", label: "Equipment" },
  { id: "safety", label: "Safety" },
  { id: "documents", label: "Documents" },
  { id: "faq", label: "FAQ" },
];

const STATUS_TONE: Record<ProductStatus, string> = {
  ACTIVE: "bg-[#E4F1EA] text-[#1E7A4B]",
  DRAFT: "bg-gold-ribbon text-gold-ink",
  ARCHIVED: "bg-surface text-muted",
};

const clock = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

/* ------------------------------------------------------------------ shell -- */

export function ProductEditor({
  initial,
  storeWritable,
  storeReason,
  lastSavedAt,
  origin,
  linkable,
}: {
  initial: Product;
  storeWritable: boolean;
  storeReason?: string;
  lastSavedAt: string | null;
  /**
   * Where the record came from. It decides what Delete means: a code-defined
   * product is withdrawn and restorable, a portal-authored one is destroyed.
   */
  origin: "static" | "new";
  /** Every other product, for the related-products picker. */
  linkable: { slug: string; name: string }[];
}) {
  const [draft, setDraft] = useState<Product>(initial);
  const [savedAt, setSavedAt] = useState<string | null>(lastSavedAt);
  const [error, setError] = useState<string | null>(null);
  const [sessionLost, setSessionLost] = useState(false);
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState(SECTIONS[0].id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  /* The last state written to the store. Dirty is measured against this. */
  const savedJson = useRef(JSON.stringify(initial));
  const dirty = JSON.stringify(draft) !== savedJson.current;

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  /* Leaving with unsaved edits is almost always a mistake on a form this size. */
  useEffect(() => {
    /* Deleting is a deliberate departure — do not warn about losing the edits. */
    if (!dirty || deleting) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, deleting]);

  /* Scroll-spy for the section strip. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-140px 0px -70% 0px" },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const save = () => {
    setError(null);
    startTransition(async () => {
      const snapshot = JSON.stringify(draft);
      try {
        const result = await saveProductAction(draft);
        if (result.ok && result.savedAt) {
          savedJson.current = snapshot;
          setSavedAt(result.savedAt);
        } else {
          setError(result.error ?? "Save failed.");
        }
      } catch {
        /*
         * The action never reached the server. Overwhelmingly this is an expired
         * session — the middleware answers an unauthenticated action POST with a
         * bare 401, which surfaces here as a rejected call rather than a result.
         * Your edits are still in the form; signing in again in another tab and
         * pressing Save is enough to recover them.
         */
        setSessionLost(true);
        setError("Your session has expired. Sign in again, then press Save — nothing has been lost.");
      }
    });
  };

  const remove = () => {
    setDeleteError(null);
    setDeleting(true);
    startTransition(async () => {
      try {
        const result = await deleteProductAction(draft.slug);
        if (result.ok) {
          /* Clear the dirty baseline so the unload guard cannot re-arm. */
          savedJson.current = JSON.stringify(draft);
          router.push(
            `/admin/products?removed=${encodeURIComponent(draft.name)}&kind=${result.kind ?? "withdrawn"}`,
          );
          return;
        }
        setDeleting(false);
        setDeleteError(result.error ?? "Delete failed.");
      } catch {
        setDeleting(false);
        setDeleteError("Your session has expired. Sign in again and try once more.");
      }
    });
  };

  const saveLabel = pending
    ? "Saving…"
    : error
      ? "Not saved"
      : dirty
        ? "Unsaved changes"
        : savedAt
          ? `Saved ${clock(savedAt)}`
          : "No changes yet";

  const hero = productImage(draft, 900);

  return (
    <>
      {/* -------------------------------------------------------- top bar -- */}
      <div className="sticky top-0 z-40 flex flex-col gap-3 border-b border-line bg-paper px-5 py-3 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/admin/products"
            className="inline-flex shrink-0 items-center gap-2 text-[14px] text-muted hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            Products
          </Link>
          <span className="hidden h-[22px] w-px shrink-0 bg-line md:block" />
          <span className="truncate text-[17px]">{draft.name || "Untitled product"}</span>
          <span
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] ${STATUS_TONE[draft.status]}`}
          >
            {draft.status.toLowerCase()}
          </span>
          <span
            className={`hidden shrink-0 text-[12.5px] lg:block ${error ? "text-danger" : dirty ? "text-gold-link" : "text-faint"}`}
          >
            {saveLabel}
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          {/*
            Destructive, so it sits outside the toggle → Preview → Save rhythm
            and carries no fill of its own. Reachable, not inviting.
          */}
          <button
            type="button"
            onClick={() => {
              setDeleteError(null);
              setConfirmDelete(true);
            }}
            disabled={!storeWritable || pending}
            title={storeWritable ? `Delete ${draft.name}` : storeReason}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3 text-[13.5px] text-muted transition-colors duration-150 hover:bg-surface hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 7h14M10 7V5h4v2M9 11v6M15 11v6M6 7l1 13h10l1-13" />
            </svg>
            Delete
          </button>

          <span className="hidden h-[22px] w-px shrink-0 bg-line md:block" />

          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13.5px] text-ink-2">
            Live on site
            <input
              type="checkbox"
              className="sr-only"
              checked={draft.status === "ACTIVE"}
              onChange={(e) => set("status", e.target.checked ? "ACTIVE" : "DRAFT")}
            />
            <span
              aria-hidden="true"
              className={`relative inline-block h-6 w-[42px] rounded-full transition-colors duration-150 ${
                draft.status === "ACTIVE" ? "bg-gold" : "bg-line-2"
              }`}
            >
              <span
                className={`absolute top-[3px] size-[18px] rounded-full bg-paper transition-[left] duration-150 ${
                  draft.status === "ACTIVE" ? "left-[21px]" : "left-[3px]"
                }`}
              />
            </span>
          </label>

          <Link
            href={`/gases/${draft.categorySlug}/${draft.slug}`}
            target="_blank"
            className="inline-flex h-10 shrink-0 items-center rounded-full border border-line px-4 text-[14px] text-ink hover:text-ink"
          >
            Preview
          </Link>

          <button
            type="button"
            onClick={save}
            disabled={!storeWritable || pending || !dirty}
            title={storeWritable ? undefined : storeReason}
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-gold px-5 text-[14px] text-ink transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------- banners -- */}
      <div className="flex items-start gap-3 border-b border-line bg-gold-ribbon px-5 py-3 md:px-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A4A15" strokeWidth="2" aria-hidden="true" className="mt-0.5 shrink-0">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
        <p className="text-[13.5px] leading-[1.55] text-gold-ink" style={{ textWrap: "pretty" }}>
          You&rsquo;re editing the live page layout. Every field sits exactly where it will
          appear to customers. Empty sections are hidden on the public site.
        </p>
      </div>

      {!storeWritable && (
        <div className="border-b border-line bg-surface px-5 py-3 md:px-8">
          <p className="max-w-[90ch] text-[13.5px] leading-[1.55] text-ink-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-danger">
              Save disabled
            </span>{" "}
            — {storeReason}
          </p>
        </div>
      )}

      {error && (
        <div className="flex flex-wrap items-center gap-4 border-b border-line bg-surface px-5 py-3 md:px-8">
          <p className="text-[13.5px] text-danger">{error}</p>
          {sessionLost && (
            <Link
              href="/admin/login"
              target="_blank"
              className="inline-flex h-9 shrink-0 items-center rounded-full border border-line px-3.5 text-[13px] text-ink hover:text-ink"
            >
              Sign in again
            </Link>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- page canvas -- */}
      <div className="px-5 pt-6 md:px-14">
        <p className="font-mono text-[11.5px] text-faint-2">
          Home <span className="text-line-2">›</span> Gases{" "}
          <span className="text-line-2">›</span>{" "}
          <span className="text-muted">
            {categories.find((c) => c.slug === draft.categorySlug)?.shortName ?? draft.categorySlug}
          </span>{" "}
          <span className="text-line-2">›</span> <span className="text-muted">{draft.name}</span>
        </p>
      </div>

      <IdentityBlock draft={draft} set={set} hero={hero} />
      <KeyFacts draft={draft} set={set} />

      {/* --------------------------------------------------- section nav -- */}
      <nav
        aria-label="Page sections"
        className="scroll-x z-30 flex items-center gap-6 border-y border-line bg-surface px-5 md:sticky md:top-[64px] md:px-14"
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "true" : undefined}
            className={`inline-flex h-14 shrink-0 items-center border-b-2 text-[14px] transition-colors duration-150 ${
              active === s.id
                ? "border-gold text-gold-link hover:text-gold-link"
                : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            {s.label}
          </a>
        ))}
      </nav>

      <OverviewSection draft={draft} set={set} />
      <GradesSection draft={draft} set={set} />
      <PackagesSection draft={draft} set={set} />
      <PropertiesSection draft={draft} set={set} />
      <ApplicationsSection draft={draft} set={set} />
      <EquipmentSection draft={draft} set={set} />
      <SafetySection draft={draft} set={set} />
      <DocumentsSection draft={draft} set={set} />
      <FaqSection draft={draft} set={set} />
      <RelatedSection draft={draft} set={set} linkable={linkable} />

      {/* ------------------------------------------------------ CTA band -- */}
      <div className="border-t border-line px-5 py-10 md:px-14">
        <div className="flex flex-col gap-4 rounded-card border border-line bg-surface px-7 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-[17px]">Quote this product</p>
            <p className="max-w-[70ch] text-[14px] leading-[1.6] text-muted">
              Standard CTA band. Regions, delivery options and the minimum-order note come
              from your site settings.
            </p>
          </div>
          <span className="inline-flex h-11 shrink-0 items-center rounded-full bg-gold px-5 text-[14.5px] text-ink">
            Request a Quote
          </span>
        </div>
        <p className="mt-6 max-w-[96ch] text-[13px] leading-[1.7] text-faint" style={{ textWrap: "pretty" }}>
          {site.disclaimer}
        </p>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        busy={deleting}
        error={deleteError}
        title={`Delete ${draft.name}?`}
        confirmLabel={origin === "new" ? "Delete permanently" : "Delete"}
        onCancel={() => {
          setConfirmDelete(false);
          setDeleteError(null);
        }}
        onConfirm={remove}
        body={
          /*
           * The two cases have genuinely different consequences, so they get
           * genuinely different warnings. Telling someone an action is
           * reversible when it is not is the worst thing a delete prompt can do.
           */
          origin === "new" ? (
            <>
              <p className="mb-2.5">
                This product was created in the portal, so there is no published version
                to fall back on. Deleting it removes the record and everything in it.
              </p>
              <p className="text-danger">This cannot be undone.</p>
            </>
          ) : (
            <>
              <p className="mb-2.5">
                It comes off the public site straight away — the product page, the
                catalogue, the SDS library and any comparison that includes it.
              </p>
              <p>
                The verified record stays in the codebase, so you can put it back from the{" "}
                <span className="text-ink">Removed</span> tab on the product list, edits
                and all.
              </p>
            </>
          )
        }
      />

      {/* Mobile save state — the top bar hides it below lg. */}
      <div className="sticky bottom-0 z-30 flex items-center justify-between border-t border-line bg-paper px-5 py-3 lg:hidden">
        <span className={`text-[12.5px] ${error ? "text-danger" : dirty ? "text-gold-link" : "text-faint"}`}>
          {saveLabel}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={!storeWritable || pending || !dirty}
          className="inline-flex h-10 items-center rounded-full bg-gold px-5 text-[14px] text-ink disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </>
  );
}

type Setter = <K extends keyof Product>(key: K, value: Product[K]) => void;
interface SectionProps {
  draft: Product;
  set: Setter;
}

/* --------------------------------------------------------------- identity -- */

function IdentityBlock({
  draft,
  set,
  hero,
}: SectionProps & { hero: { src: string; alt: string } }) {
  const setPictogram = (p: GhsPictogram) => set("pictograms", toggle(draft.pictograms, p));

  return (
    <div className="grid gap-10 px-5 py-7 md:px-14 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-14">
      <div>
        <div className="relative h-[300px] overflow-hidden rounded-card border border-line bg-surface md:h-[380px]">
          <Image src={hero.src} alt={hero.alt} fill sizes="400px" className="object-cover" />
        </div>
        {/*
          Product photography is derived from the category and container type
          rather than uploaded per product — see lib/data/images.ts. Saying so
          is better than a dropzone that cannot accept a file.
        */}
        <p className="mt-3 text-[12.5px] leading-[1.5] text-muted">
          Photography is matched automatically from the category and container type. Per-product
          uploads need a connected file store.
        </p>
      </div>

      <div>
        <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
          <Pick
            value={draft.categorySlug}
            ariaLabel="Category"
            options={categories.map((c) => ({ value: c.slug, label: c.shortName }))}
            onChange={(v) => set("categorySlug", v)}
            className="!h-[34px] w-auto min-w-[190px]"
          />
          <Pick
            value={draft.tdgClass}
            ariaLabel="TDG class"
            options={TDG_OPTIONS}
            onChange={(v) => set("tdgClass", v)}
            className="!h-[34px] w-auto min-w-[230px]"
          />
          <Text
            value={draft.badge}
            onChange={(v) => set("badge", v)}
            placeholder="Card badge"
            className="!h-[34px] w-[150px]"
          />
        </div>

        <div className="mb-3 flex gap-3">
          <input
            type="text"
            value={draft.name}
            aria-label="Product name"
            placeholder="Product name"
            onChange={(e) => set("name", e.target.value)}
            className="h-[68px] min-w-0 flex-1 rounded-inner border border-dashed border-line-2 bg-surface px-4 text-[40px] tracking-[-0.025em] text-ink outline-none placeholder:text-faint-2 focus:border-solid focus:border-gold focus:bg-paper md:text-[52px]"
          />
          <input
            type="text"
            value={draft.formula ?? ""}
            aria-label="Formula"
            placeholder="Formula"
            onChange={(e) => set("formula", e.target.value || null)}
            className="h-[68px] w-[140px] shrink-0 rounded-inner border border-dashed border-line-2 bg-surface px-3.5 font-mono text-[22px] text-muted outline-none placeholder:text-faint-2 focus:border-solid focus:border-gold focus:bg-paper md:w-[160px] md:text-[26px]"
          />
        </div>

        <input
          type="text"
          value={draft.tagline}
          aria-label="Tagline"
          placeholder="One-line tagline — e.g. Inert shielding gas for TIG, MIG and heat treatment"
          onChange={(e) => set("tagline", e.target.value)}
          className="mb-6 h-[52px] w-full rounded-inner border border-dashed border-line-2 bg-surface px-4 text-[17px] text-ink-2 outline-none placeholder:text-faint-2 focus:border-solid focus:border-gold focus:bg-paper"
        />

        <div className="mb-6 flex flex-col gap-5 border-y border-line py-5 lg:flex-row lg:items-start lg:gap-6">
          <div className="flex flex-col gap-2">
            <Lbl>GHS pictograms</Lbl>
            <div className="flex flex-wrap items-center gap-2">
              {PICTOGRAM_OPTIONS.map((p) => {
                const on = draft.pictograms.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    aria-pressed={on}
                    title={p.label}
                    onClick={() => setPictogram(p.value)}
                    className={`inline-flex size-[46px] items-center justify-center rounded-inner border transition-colors duration-150 ${
                      on ? "border-gold bg-gold-wash" : "border-dashed border-line-2 opacity-40 hover:opacity-80"
                    }`}
                  >
                    <GhsIcon type={p.value} size={30} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:border-l lg:border-line lg:pl-6">
            <Lbl>Signal word</Lbl>
            <Pick
              value={(draft.signalWord ?? "") as "Danger" | "Warning" | ""}
              ariaLabel="Signal word"
              options={SIGNAL_OPTIONS}
              onChange={(v) => set("signalWord", (v === "" ? null : v) as SignalWord)}
              className="w-[170px]"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2 lg:border-l lg:border-line lg:pl-6">
            <Lbl>Hazard statements</Lbl>
            <Area
              value={fromLines(draft.hazardStatements)}
              onChange={(v) => set("hazardStatements", toLines(v))}
              rows={3}
              placeholder="One per line — H280 · Contains gas under pressure; may explode if heated"
            />
          </div>
        </div>

        {/* The CTA row is fixed chrome; it is shown so the masthead reads true. */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-[50px] items-center rounded-full bg-gold px-6 text-[15.5px] text-ink">
            Request a Quote
          </span>
          <span className="inline-flex h-[50px] items-center rounded-full border border-line px-5 text-[15.5px] text-ink-2">
            {site.orderDesk.phone}
          </span>
          <span className="inline-flex h-[50px] items-center rounded-full border border-line px-5 text-[15.5px] text-ink-2">
            Download SDS
          </span>
          <span className="text-[12.5px] leading-[1.4] text-faint">
            Added
            <br />
            automatically
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- key facts -- */

function KeyFacts({ draft, set }: SectionProps) {
  const purity = maxPurity(draft);

  return (
    <div className="px-5 pb-8 md:px-14">
      <div className="grid overflow-hidden rounded-card border border-line sm:grid-cols-2 lg:grid-cols-6">
        <Cell label="UN number">
          <Text value={draft.unNumber} onChange={(v) => set("unNumber", v)} placeholder="UN0000" mono />
        </Cell>
        <Cell label="CAS">
          <Text
            value={draft.cas ?? ""}
            onChange={(v) => set("cas", v || null)}
            placeholder="0000-00-0"
            mono
          />
        </Cell>
        <Cell label="TDG class">
          <Derived title="Set with the picker above">{draft.tdgClass}</Derived>
        </Cell>
        <Cell label="Max purity">
          <Derived title="Highest minimum purity across the grades below">
            {purity ? `${purity} %` : "From grades"}
          </Derived>
        </Cell>
        <Cell label="Configurations">
          <Derived title="Counted from the package table below">
            {draft.packages.length || "From packages"}
          </Derived>
        </Cell>
        <Cell label="Hazard" last>
          <Text
            value={draft.hazardSummary}
            onChange={(v) => set("hazardSummary", v)}
            placeholder="Inert · Asphyxiant"
          />
        </Cell>
      </div>
    </div>
  );
}

function Cell({
  label,
  last,
  children,
}: {
  label: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-2 border-b border-line px-4 py-3.5 lg:border-b-0 ${
        last ? "" : "lg:border-r"
      }`}
    >
      <Lbl>{label}</Lbl>
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- sections -- */

function OverviewSection({ draft, set }: SectionProps) {
  return (
    <EditorSection id="overview" title="Overview" empty={draft.overview.length === 0}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <Area
          value={fromParas(draft.overview)}
          onChange={(v) => set("overview", toParas(v))}
          rows={7}
          placeholder="Describe the product, where it sits in the range and the service it typically sees. Two or three paragraphs, separated by a blank line."
        />
        <div className="flex flex-col gap-4 self-start rounded-card border border-line bg-surface p-5">
          <div className="flex flex-col gap-1.5">
            <Lbl>Synonyms</Lbl>
            <Text
              value={draft.synonyms}
              onChange={(v) => set("synonyms", v)}
              placeholder="Comma separated — feeds search"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Lbl>Proper shipping name</Lbl>
            <Text
              value={draft.properShippingName}
              onChange={(v) => set("properShippingName", v)}
              placeholder="TDG shipping name"
            />
          </div>
          <label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-ink-2">
            <input
              type="checkbox"
              checked={draft.erapRequired}
              onChange={(e) => set("erapRequired", e.target.checked)}
              className="mt-0.5 size-4 accent-[#f5c64d]"
            />
            ERAP required
          </label>
        </div>
      </div>
    </EditorSection>
  );
}

function GradesSection({ draft, set }: SectionProps) {
  const { grades, impuritySpecies } = draft;

  const setGrade = (i: number, next: Grade) => set("grades", replaceAt(grades, i, next));

  const addGrade = () =>
    set("grades", [
      ...grades,
      { name: "", minPurity: "", impurities: {}, conformsTo: null, certificateOfAnalysis: null },
    ]);

  const addSpecies = () =>
    set("impuritySpecies", [
      ...impuritySpecies,
      { key: `sp${Date.now().toString(36)}`, label: "" },
    ]);

  return (
    <EditorSection
      id="grades"
      title="Grades & purity"
      blurb="Impurity limits are maximum values in ppm. Leave a cell blank and it renders as a dash."
      action={<AddButton onClick={addGrade}>Add a grade</AddButton>}
      empty={grades.length === 0}
    >
      {grades.length === 0 ? (
        <EmptyNote>No grades yet. The grades table is hidden on the public page.</EmptyNote>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full min-w-[640px] text-[14.5px]">
            <thead>
              <tr className="bg-surface">
                <th scope="col" className="w-[220px] px-4 py-3 text-left">
                  <Lbl>Grade</Lbl>
                </th>
                {grades.map((g, i) => (
                  <th key={i} scope="col" className="px-3 py-2.5">
                    <Text
                      value={g.name}
                      onChange={(v) => setGrade(i, { ...g, name: v })}
                      placeholder="Grade name"
                      align="right"
                      ariaLabel={`Grade ${i + 1} name`}
                    />
                  </th>
                ))}
                <th scope="col" className="w-12 px-2 py-2.5">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <th scope="row" className="px-4 py-2.5 text-left font-normal">
                  Minimum purity
                </th>
                {grades.map((g, i) => (
                  <td key={i} className="px-3 py-2.5">
                    <Text
                      value={g.minPurity}
                      onChange={(v) => setGrade(i, { ...g, minPurity: v })}
                      placeholder="99.999"
                      mono
                      align="right"
                      ariaLabel={`Minimum purity for grade ${i + 1}`}
                    />
                  </td>
                ))}
                <td className="px-2" />
              </tr>

              <tr className="border-t border-line bg-surface">
                <td colSpan={grades.length + 2} className="px-4 py-2">
                  <Lbl>Impurity limits — maximum ppm</Lbl>
                </td>
              </tr>

              {impuritySpecies.map((species, si) => (
                <tr key={species.key} className="border-t border-line">
                  <th scope="row" className="py-2.5 pl-8 pr-4 text-left font-normal">
                    <Text
                      value={species.label}
                      onChange={(v) =>
                        set(
                          "impuritySpecies",
                          replaceAt(impuritySpecies, si, { ...species, label: v }),
                        )
                      }
                      placeholder="Species"
                      ariaLabel={`Impurity species ${si + 1}`}
                    />
                  </th>
                  {grades.map((g, i) => (
                    <td key={i} className="px-3 py-2.5">
                      <Text
                        value={g.impurities[species.key] ?? ""}
                        onChange={(v) => {
                          const impurities = { ...g.impurities };
                          if (v.trim()) impurities[species.key] = v;
                          else delete impurities[species.key];
                          setGrade(i, { ...g, impurities });
                        }}
                        placeholder="—"
                        mono
                        align="right"
                        ariaLabel={`${species.label || "Species"} limit for grade ${i + 1}`}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2.5 text-right">
                    <RowDelete
                      label={`Remove ${species.label || "species"}`}
                      onClick={() =>
                        set(
                          "impuritySpecies",
                          impuritySpecies.filter((_, x) => x !== si),
                        )
                      }
                    />
                  </td>
                </tr>
              ))}

              <tr className="border-t border-line">
                <td colSpan={grades.length + 2} className="px-4 py-2.5">
                  <AddTile onClick={addSpecies} className="h-9 w-full">
                    + Add an impurity limit
                  </AddTile>
                </td>
              </tr>

              <tr className="border-t border-line">
                <th scope="row" className="px-4 py-2.5 text-left font-normal">
                  Conforms to
                </th>
                {grades.map((g, i) => (
                  <td key={i} className="px-3 py-2.5">
                    <Text
                      value={g.conformsTo ?? ""}
                      onChange={(v) => setGrade(i, { ...g, conformsTo: v || null })}
                      placeholder="ISO / CGA standard"
                      align="right"
                      ariaLabel={`Conforms to, grade ${i + 1}`}
                    />
                  </td>
                ))}
                <td className="px-2" />
              </tr>

              <tr className="border-t border-line">
                <th scope="row" className="px-4 py-2.5 text-left font-normal">
                  Certificate of analysis
                </th>
                {grades.map((g, i) => (
                  <td key={i} className="px-3 py-2.5">
                    <Text
                      value={g.certificateOfAnalysis ?? ""}
                      onChange={(v) => setGrade(i, { ...g, certificateOfAnalysis: v || null })}
                      placeholder="Per batch / on request"
                      align="right"
                      ariaLabel={`Certificate of analysis, grade ${i + 1}`}
                    />
                  </td>
                ))}
                <td className="px-2" />
              </tr>

              <tr className="border-t border-line bg-surface">
                <td className="px-4 py-2">
                  <Lbl>Remove a grade</Lbl>
                </td>
                {grades.map((g, i) => (
                  <td key={i} className="px-3 py-2 text-right">
                    <RowDelete
                      label={`Remove grade ${g.name || i + 1}`}
                      onClick={() => set("grades", grades.filter((_, x) => x !== i))}
                    />
                  </td>
                ))}
                <td className="px-2" />
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </EditorSection>
  );
}

function PackagesSection({ draft, set }: SectionProps) {
  const packages = draft.packages;
  const setPkg = (i: number, next: PackageConfig) => set("packages", replaceAt(packages, i, next));

  const addPackage = () =>
    set("packages", [
      ...packages,
      {
        size: "", sku: "", container: "High-pressure steel" as ContainerType, spec: "",
        contents: { ...EMPTY_DUAL }, fillPressure: { ...EMPTY_DUAL }, cga: "",
        tare: null, availability: "Stocked", shape: "cylinder-300",
      },
    ]);

  return (
    <EditorSection
      id="packages"
      title="Cylinder & package options"
      blurb="One row per SKU. Each row gets its own quote button on the public page. Never enter a price."
      action={<AddButton onClick={addPackage}>Add a size</AddButton>}
      empty={packages.length === 0}
    >
      {packages.length === 0 ? (
        <EmptyNote>No package configurations yet.</EmptyNote>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full min-w-[1100px] text-[14px]">
            <thead>
              <tr className="bg-surface text-left">
                {["Size / SKU", "Container / spec", "Contents", "Fill pressure", "CGA", "Tare", "Availability"].map((h) => (
                  <th key={h} scope="col" className="px-3 py-3 font-normal">
                    <Lbl>{h}</Lbl>
                  </th>
                ))}
                <th scope="col" className="w-12 px-2 py-3">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p, i) => {
                const thread = threadFor(p.cga);
                return (
                  <tr key={i} className="border-t border-line align-top">
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1.5">
                        <Text value={p.size} onChange={(v) => setPkg(i, { ...p, size: v })} placeholder="300 Large" ariaLabel="Size" />
                        <Text value={p.sku} onChange={(v) => setPkg(i, { ...p, sku: v })} placeholder="SKU" mono ariaLabel="SKU" />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1.5">
                        <Pick
                          value={p.container}
                          ariaLabel="Container type"
                          options={CONTAINER_OPTIONS}
                          onChange={(v) => setPkg(i, { ...p, container: v })}
                        />
                        <Text value={p.spec} onChange={(v) => setPkg(i, { ...p, spec: v })} placeholder="TC/DOT spec" mono ariaLabel="TC/DOT specification" />
                        <Pick
                          value={p.shape}
                          ariaLabel="Illustration"
                          options={SHAPE_OPTIONS}
                          onChange={(v) => setPkg(i, { ...p, shape: v })}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <DualEditor
                        value={p.contents}
                        onChange={(v) => setPkg(i, { ...p, contents: v })}
                        metricPlaceholder="m³"
                        imperialPlaceholder="ft³"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <DualEditor
                        value={p.fillPressure}
                        onChange={(v) => setPkg(i, { ...p, fillPressure: v })}
                        metricPlaceholder="kPa"
                        imperialPlaceholder="psig"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1.5">
                        <Text value={p.cga} onChange={(v) => setPkg(i, { ...p, cga: v })} placeholder="580" mono ariaLabel="CGA outlet" />
                        {/*
                          Thread specification is looked up from the verified CGA
                          reference, never typed. A mistyped thread is a
                          connection that should not mate — that value must have
                          exactly one source.
                        */}
                        <span className="text-[11.5px] leading-[1.4] text-faint">
                          {thread.thread ? (
                            <>
                              Thread auto-fills
                              <br />
                              <span className="font-mono text-[11px] text-muted">{thread.thread}</span>
                            </>
                          ) : !p.cga ? (
                            "Thread auto-fills"
                          ) : thread.listed ? (
                            "No thread spec published — renders as a dash"
                          ) : (
                            <span className="text-danger">Not in the CGA reference — check the number</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <DualEditor
                        value={p.tare ?? { ...EMPTY_DUAL }}
                        onChange={(v) =>
                          setPkg(i, {
                            ...p,
                            tare: v.metric || v.imperial ? v : null,
                          })
                        }
                        metricPlaceholder="kg"
                        imperialPlaceholder="lb"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <Pick
                        value={p.availability}
                        ariaLabel="Availability"
                        options={AVAILABILITY_OPTIONS}
                        onChange={(v) => setPkg(i, { ...p, availability: v })}
                      />
                    </td>
                    <td className="px-2 py-3 text-right">
                      <RowDelete
                        label={`Remove ${p.size || `row ${i + 1}`}`}
                        onClick={() => set("packages", packages.filter((_, x) => x !== i))}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </EditorSection>
  );
}

/** Metric value + unit over imperial value + unit. Both halves are stored. */
function DualEditor({
  value,
  onChange,
  metricPlaceholder,
  imperialPlaceholder,
}: {
  value: DualValue;
  onChange: (v: DualValue) => void;
  metricPlaceholder: string;
  imperialPlaceholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        <Text value={value.metric} onChange={(v) => onChange({ ...value, metric: v })} placeholder="0" mono align="right" ariaLabel="Metric value" />
        <Text value={value.metricUnit} onChange={(v) => onChange({ ...value, metricUnit: v })} placeholder={metricPlaceholder} mono className="!w-[68px]" ariaLabel="Metric unit" />
      </div>
      <div className="flex gap-1.5">
        <Text value={value.imperial} onChange={(v) => onChange({ ...value, imperial: v })} placeholder="0" mono align="right" ariaLabel="Imperial value" />
        <Text value={value.imperialUnit} onChange={(v) => onChange({ ...value, imperialUnit: v })} placeholder={imperialPlaceholder} mono className="!w-[68px]" ariaLabel="Imperial unit" />
      </div>
    </div>
  );
}

function PropertiesSection({ draft, set }: SectionProps) {
  const rows = draft.properties;
  const setRow = (i: number, next: PropertyRow) => set("properties", replaceAt(rows, i, next));

  return (
    <EditorSection
      id="properties"
      title="Physical & chemical properties"
      action={
        <AddButton
          onClick={() => set("properties", [...rows, { label: "", value: "" }])}
        >
          Add a property
        </AddButton>
      }
      empty={rows.length === 0}
    >
      <div className="grid gap-x-10 gap-y-3 lg:grid-cols-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-line pb-3">
            <Text
              value={row.label}
              onChange={(v) => setRow(i, { ...row, label: v })}
              placeholder="Property"
              className="!w-[46%]"
              ariaLabel={`Property ${i + 1} label`}
            />
            <div className="min-w-0 flex-1">
              <PropertyValueEditor value={row.value} onChange={(v) => setRow(i, { ...row, value: v })} />
            </div>
            <RowDelete
              label={`Remove ${row.label || `property ${i + 1}`}`}
              onClick={() => set("properties", rows.filter((_, x) => x !== i))}
            />
          </div>
        ))}
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-card border border-line bg-surface px-5 py-4 text-[14.5px] text-ink-2">
        <input
          type="checkbox"
          checked={draft.safety.oxygenDisplacementWarning}
          onChange={(e) =>
            set("safety", { ...draft.safety, oxygenDisplacementWarning: e.target.checked })
          }
          className="mt-0.5 size-4 shrink-0 accent-[#f5c64d]"
        />
        Displaces oxygen — adds the asphyxiation warning to the safety section below
      </label>
    </EditorSection>
  );
}

/**
 * Property values come in three shapes and the shape is meaningful: a dual
 * value drives the METRIC / IMPERIAL toggle, a single value carries a unit, a
 * string is prose. The editor renders whichever the record already holds rather
 * than flattening everything to text and losing the distinction.
 */
function PropertyValueEditor({
  value,
  onChange,
}: {
  value: PropertyRow["value"];
  onChange: (v: PropertyRow["value"]) => void;
}) {
  if (value && typeof value === "object" && "metric" in value) {
    return (
      <DualEditor value={value} onChange={onChange} metricPlaceholder="unit" imperialPlaceholder="unit" />
    );
  }
  if (value && typeof value === "object" && "value" in value) {
    return (
      <div className="flex gap-1.5">
        <Text value={value.value} onChange={(v) => onChange({ ...value, value: v })} placeholder="Value" mono align="right" ariaLabel="Value" />
        <Text value={value.unit ?? ""} onChange={(v) => onChange({ ...value, unit: v || undefined })} placeholder="unit" mono className="!w-[86px]" ariaLabel="Unit" />
      </div>
    );
  }
  return (
    <Text
      value={typeof value === "string" ? value : ""}
      onChange={(v) => onChange(v || null)}
      placeholder="— (blank renders as a dash)"
      ariaLabel="Value"
    />
  );
}

function ApplicationsSection({ draft, set }: SectionProps) {
  const groups = draft.applications;
  const setGroup = (i: number, next: ApplicationGroup) =>
    set("applications", replaceAt(groups, i, next));

  const industryNames = [
    ...new Set([...industriesIndex.map((i) => i.name), ...draft.industries]),
  ];
  const processNames = [...new Set([...processFilters, ...draft.processes])];

  return (
    <EditorSection
      id="applications"
      title="Applications & industries"
      action={
        <AddButton onClick={() => set("applications", [...groups, { heading: "", items: [] }])}>
          Add a group
        </AddButton>
      }
      empty={groups.length === 0}
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => (
          <div key={i} className="flex flex-col gap-2.5 rounded-card border border-line p-4">
            <div className="flex items-center gap-2">
              <Text
                value={group.heading}
                onChange={(v) => setGroup(i, { ...group, heading: v })}
                placeholder="Group heading"
                ariaLabel={`Application group ${i + 1} heading`}
              />
              <RowDelete
                label={`Remove ${group.heading || `group ${i + 1}`}`}
                onClick={() => set("applications", groups.filter((_, x) => x !== i))}
              />
            </div>
            <Area
              value={fromLines(group.items)}
              onChange={(v) => setGroup(i, { ...group, items: toLines(v) })}
              rows={5}
              placeholder="One bullet per line"
            />
          </div>
        ))}
        <AddTile
          onClick={() => set("applications", [...groups, { heading: "", items: [] }])}
          className="min-h-[140px]"
        >
          + Another group
        </AddTile>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <Lbl>Processes</Lbl>
          <div className="flex flex-wrap gap-2">
            {processNames.map((p) => (
              <ToggleChip
                key={p}
                on={draft.processes.includes(p)}
                onClick={() => set("processes", toggle(draft.processes, p))}
              >
                {p}
              </ToggleChip>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <Lbl>Industries</Lbl>
          <p className="-mt-1 text-[13px] text-muted">
            Each one links back from the Industries page.
          </p>
          <div className="flex flex-wrap gap-2">
            {industryNames.map((n) => (
              <ToggleChip
                key={n}
                on={draft.industries.includes(n)}
                onClick={() => set("industries", toggle(draft.industries, n))}
              >
                {n}
              </ToggleChip>
            ))}
          </div>
        </div>
      </div>
    </EditorSection>
  );
}

function EquipmentSection({ draft, set }: SectionProps) {
  const c = draft.compatibility;
  /* The connection shown here is the first package's outlet — one source. */
  const primaryCga = draft.packages[0]?.cga ?? c.cga;
  const { thread } = threadFor(primaryCga);

  return (
    <EditorSection id="equipment" title="Equipment & compatibility">
      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
        <div className="flex flex-col gap-2 self-start rounded-card border border-line bg-surface p-5">
          <Lbl>Connection</Lbl>
          <span className="font-mono text-[22px] text-ink">
            {primaryCga ? `CGA ${primaryCga}` : "—"}
          </span>
          <span className="font-mono text-[13px] text-muted">{thread ?? "—"}</span>
          <p className="mt-1 text-[12.5px] leading-[1.5] text-muted">
            Pulled from the package table — thread spec fills in from the CGA reference.
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            <Lbl>Connection note</Lbl>
            <Text
              value={c.cgaNote}
              onChange={(v) => set("compatibility", { ...c, cgaNote: v })}
              placeholder="Anything a fitter needs to know"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Lbl>Recommended equipment</Lbl>
            <Area
              value={fromLines(c.recommendedEquipment)}
              onChange={(v) => set("compatibility", { ...c, recommendedEquipment: toLines(v) })}
              rows={4}
              placeholder="One item per line"
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Lbl>Compatible materials</Lbl>
              <Area
                value={c.compatibleMaterials}
                onChange={(v) => set("compatibility", { ...c, compatibleMaterials: v })}
                rows={3}
                placeholder="Comma separated"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Lbl>Incompatible</Lbl>
              <Area
                value={c.incompatible}
                onChange={(v) => set("compatibility", { ...c, incompatible: v })}
                rows={3}
                placeholder="Comma separated"
              />
            </div>
          </div>
        </div>
      </div>
    </EditorSection>
  );
}

function SafetySection({ draft, set }: SectionProps) {
  const s = draft.safety;
  const setSafety = (patch: Partial<typeof s>) => set("safety", { ...s, ...patch });
  const ppeNames = [...new Set([...PPE_SUGGESTIONS, ...s.ppe])];

  return (
    <EditorSection id="safety" title="Handling, storage & safety">
      {s.oxygenDisplacementWarning && (
        <div className="mb-6 flex items-start gap-3.5 rounded-card border border-gold bg-gold-wash px-5 py-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A4A15" strokeWidth="2" aria-hidden="true" className="mt-0.5 shrink-0">
            <path d="M12 3l9 17H3z" />
            <path d="M12 9v5M12 17h.01" />
          </svg>
          <div>
            <p className="mb-1 text-[15.5px] text-gold-ink">Asphyxiation hazard</p>
            <p className="max-w-[80ch] text-[13.5px] leading-[1.55] text-gold-ink">
              Standard wording, added automatically when the oxygen-displacement box in
              Properties is ticked. Not editable per product.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Labelled label="Storage requirements">
          <Area value={s.storage} onChange={(v) => setSafety({ storage: v })} rows={3} placeholder="How and where it must be stored" />
        </Labelled>
        <Labelled label="Segregation">
          <Area value={s.segregation} onChange={(v) => setSafety({ segregation: v })} rows={3} placeholder="Which classes it must be kept away from" />
        </Labelled>
        <Labelled label="Leak detection">
          <Area value={s.leakDetection} onChange={(v) => setSafety({ leakDetection: v })} rows={3} placeholder="How a leak is found" />
        </Labelled>
        <Labelled label="Never">
          <Area value={fromLines(s.never)} onChange={(v) => setSafety({ never: toLines(v) })} rows={3} placeholder="One warning per line" />
        </Labelled>
        <Labelled label="Requalification">
          <Area value={s.requalification} onChange={(v) => setSafety({ requalification: v })} rows={2} placeholder="Interval and standard" />
        </Labelled>
        <Labelled label="Hazard callout">
          <div className="flex flex-col gap-1.5">
            <Text
              value={s.callout?.title ?? ""}
              onChange={(v) =>
                setSafety({ callout: v || s.callout?.body ? { title: v, body: s.callout?.body ?? "" } : null })
              }
              placeholder="Callout heading — leave blank for none"
            />
            <Area
              value={s.callout?.body ?? ""}
              onChange={(v) =>
                setSafety({ callout: v || s.callout?.title ? { title: s.callout?.title ?? "", body: v } : null })
              }
              rows={2}
              placeholder="Callout body"
            />
          </div>
        </Labelled>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <Lbl>PPE</Lbl>
        <div className="flex flex-wrap gap-2">
          {ppeNames.map((p) => (
            <ToggleChip key={p} on={s.ppe.includes(p)} onClick={() => setSafety({ ppe: toggle(s.ppe, p) })}>
              {p}
            </ToggleChip>
          ))}
        </div>
      </div>
    </EditorSection>
  );
}

function DocumentsSection({ draft, set }: SectionProps) {
  const docs = draft.documents;
  const setDoc = (i: number, next: DocumentRow) => set("documents", replaceAt(docs, i, next));

  return (
    <EditorSection
      id="documents"
      title="Documents & downloads"
      action={
        <AddButton
          onClick={() =>
            set("documents", [
              ...docs,
              { title: "", phase: null, language: "EN", version: "", revised: "" },
            ])
          }
        >
          Attach a document
        </AddButton>
      }
      empty={docs.length === 0}
    >
      {docs.length === 0 ? (
        <EmptyNote>No documents attached.</EmptyNote>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full min-w-[820px] text-[14px]">
            <thead>
              <tr className="bg-surface text-left">
                {["Document", "Phase", "Language", "Version", "Revised", "File"].map((h) => (
                  <th key={h} scope="col" className="px-3 py-3 font-normal">
                    <Lbl>{h}</Lbl>
                  </th>
                ))}
                <th scope="col" className="w-12 px-2 py-3">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="px-3 py-2.5">
                    <Text value={d.title} onChange={(v) => setDoc(i, { ...d, title: v })} placeholder="Safety Data Sheet" ariaLabel="Document title" />
                  </td>
                  <td className="px-3 py-2.5">
                    <Pick
                      value={d.phase ?? ""}
                      ariaLabel="Phase"
                      options={PHASE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                      onChange={(v) => setDoc(i, { ...d, phase: v || null })}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <Pick
                      value={d.language}
                      ariaLabel="Language"
                      options={LANGUAGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                      onChange={(v) => setDoc(i, { ...d, language: v })}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <Text value={d.version} onChange={(v) => setDoc(i, { ...d, version: v })} placeholder="1.0" mono ariaLabel="Version" />
                  </td>
                  <td className="px-3 py-2.5">
                    <Text value={d.revised} onChange={(v) => setDoc(i, { ...d, revised: v })} placeholder="YYYY-MM-DD" mono ariaLabel="Revised" />
                  </td>
                  <td className="px-3 py-2.5">
                    {/* No blob store is connected, so this cannot accept a file yet. */}
                    <button
                      type="button"
                      disabled
                      title="Uploading a PDF needs a connected file store."
                      className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-line-2 px-3 text-[13px] text-faint"
                    >
                      Upload PDF
                    </button>
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <RowDelete
                      label={`Remove ${d.title || `document ${i + 1}`}`}
                      onClick={() => set("documents", docs.filter((_, x) => x !== i))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </EditorSection>
  );
}

function FaqSection({ draft, set }: SectionProps) {
  const faq = draft.faq;
  const setEntry = (i: number, next: FaqEntry) => set("faq", replaceAt(faq, i, next));

  return (
    <EditorSection
      id="faq"
      title="Frequently asked"
      action={
        <AddButton onClick={() => set("faq", [...faq, { question: "", answer: "" }])}>
          Add a question
        </AddButton>
      }
      empty={faq.length === 0}
    >
      {faq.length === 0 ? (
        <EmptyNote>No questions yet.</EmptyNote>
      ) : (
        <div className="flex flex-col gap-4">
          {faq.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-line pb-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Text value={entry.question} onChange={(v) => setEntry(i, { ...entry, question: v })} placeholder="Question" ariaLabel={`Question ${i + 1}`} />
                <Area value={entry.answer} onChange={(v) => setEntry(i, { ...entry, answer: v })} rows={3} placeholder="Answer" ariaLabel={`Answer ${i + 1}`} />
              </div>
              <RowDelete label={`Remove question ${i + 1}`} onClick={() => set("faq", faq.filter((_, x) => x !== i))} />
            </div>
          ))}
        </div>
      )}
    </EditorSection>
  );
}

function RelatedSection({
  draft,
  set,
  linkable,
}: SectionProps & { linkable: { slug: string; name: string }[] }) {
  const [picking, setPicking] = useState("");
  const available = linkable.filter((p) => !draft.relatedSlugs.includes(p.slug));
  const nameFor = (slug: string) => linkable.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <EditorSection id="related" title="Related products" empty={draft.relatedSlugs.length === 0}>
      <div className="flex flex-wrap items-center gap-2.5">
        {draft.relatedSlugs.map((slug) => (
          <span
            key={slug}
            className="inline-flex h-[38px] items-center gap-2 rounded-full border border-line pl-4 pr-1.5 text-[14px] text-ink-2"
          >
            {nameFor(slug)}
            <RowDelete
              label={`Unlink ${nameFor(slug)}`}
              onClick={() => set("relatedSlugs", draft.relatedSlugs.filter((s) => s !== slug))}
            />
          </span>
        ))}

        {available.length > 0 && (
          <select
            value={picking}
            aria-label="Link a product"
            onChange={(e) => {
              if (!e.target.value) return;
              set("relatedSlugs", [...draft.relatedSlugs, e.target.value]);
              setPicking("");
            }}
            className="h-[38px] rounded-full border border-dashed border-line-2 bg-surface px-3.5 text-[14px] text-muted outline-none focus:border-solid focus:border-gold"
          >
            <option value="">+ Link a product</option>
            {available.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </EditorSection>
  );
}

/* ---------------------------------------------------------------- helpers -- */

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Lbl>{label}</Lbl>
      {children}
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-card border border-dashed border-line-2 px-5 py-6 text-[14.5px] text-muted">
      {children}
    </p>
  );
}
