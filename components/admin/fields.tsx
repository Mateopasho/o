"use client";

import type { ReactNode } from "react";

/**
 * Editor field primitives.
 *
 * The A02 artboard marks every editable field with a dashed hairline on a tinted
 * ground. That is the whole affordance of this screen: the page reads as the
 * public product page, and the dashes are the only thing saying "this part is
 * yours to change". Derived values — thread spec, max purity, configuration
 * count — deliberately have no dash and no box.
 *
 * Skin is the premium system (line #E4E1DA, surface #F6F5F1, gold focus) over
 * the artboard's structure, per the brief: premium chrome, original layout and
 * logic.
 */

const FIELD =
  "w-full rounded-inner border border-dashed border-line-2 bg-surface text-ink outline-none " +
  "transition-colors duration-150 placeholder:text-faint-2 " +
  "focus:border-solid focus:border-gold focus:bg-paper";

export function Lbl({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted ${className}`}
    >
      {children}
    </span>
  );
}

export function Text({
  value,
  onChange,
  placeholder,
  mono = false,
  align = "left",
  className = "",
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  align?: "left" | "right";
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      aria-label={ariaLabel ?? placeholder}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${FIELD} h-9 px-2.5 text-[14.5px] ${mono ? "font-mono text-[13.5px]" : ""} ${
        align === "right" ? "text-right" : ""
      } ${className}`}
    />
  );
}

export function Area({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      aria-label={ariaLabel ?? placeholder}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${FIELD} resize-y px-3.5 py-2.5 text-[15px] leading-[1.65] ${className}`}
    />
  );
}

export function Pick<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as T)}
      className={`${FIELD} h-9 px-2 text-[14px] ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** A computed value. No box, no dash — it is not yours to type into. */
export function Derived({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className="flex h-9 items-center font-mono text-[15px] text-faint"
    >
      {children}
    </span>
  );
}

/** Gold-outlined "Add a …" control, exactly as the artboard shows it. */
export function AddButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-gold px-4 text-[14px] text-gold-link transition-colors duration-150 hover:bg-gold-wash disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {children}
    </button>
  );
}

/** Dashed "+" tile — the artboard's add-another affordance inside a grid. */
export function AddTile({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-inner border border-dashed border-line-2 text-[14px] text-muted transition-colors duration-150 hover:border-gold hover:text-gold-link ${className}`}
    >
      {children}
    </button>
  );
}

export function RowDelete({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-8 items-center justify-center rounded-full text-faint transition-colors duration-150 hover:bg-surface hover:text-danger"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M5 7h14M10 7V5h4v2M9 11v6M15 11v6M6 7l1 13h10l1-13" />
      </svg>
    </button>
  );
}

/** Toggle chip used for processes, industries, PPE and GHS pictograms. */
export function ToggleChip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex h-[34px] items-center gap-2 rounded-full border px-3.5 text-[13.5px] transition-colors duration-150 ${
        on
          ? "border-gold bg-gold-ribbon text-gold-ink"
          : "border-dashed border-line-2 text-muted hover:border-line-2 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * One editable section of the product page.
 *
 * `empty` drives the "hidden on the public site" note the banner promises —
 * the editor is the only place that can tell you a section will not render.
 */
export function EditorSection({
  id,
  title,
  blurb,
  action,
  empty,
  children,
}: {
  id: string;
  title: string;
  blurb?: string;
  action?: ReactNode;
  empty?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-[124px] border-t border-line px-5 py-10 md:px-14">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h2 className="mb-1.5 text-[24px] tracking-[-0.018em] md:text-[28px]">{title}</h2>
          {blurb && (
            <p className="max-w-[78ch] text-[15px] leading-[1.6] text-muted" style={{ textWrap: "pretty" }}>
              {blurb}
            </p>
          )}
          {empty && (
            <p className="mt-2 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
              <span className="size-[6px] rounded-full bg-faint-2" />
              Empty — hidden on the public page
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * Below `lg` the editor's tables become stacked cards.
 *
 * A package row is ten fields wide; a grades matrix is as wide as you have
 * grades. Neither fits a phone, and the honest options are horizontal scrolling
 * — which hides half the record and makes editing a hunt — or one record per
 * card with its labels shown. This is the card.
 *
 * The rule that keeps the two layouts honest: each section builds its fields
 * **once**, as a keyed object, and both the table and the card render the same
 * nodes. A field cannot exist in one and not the other, and an edit made on a
 * phone runs the identical state update it would on a desktop.
 */
export function RecordCard({
  title,
  subtitle,
  onDelete,
  deleteLabel,
  children,
}: {
  title: string;
  subtitle?: string;
  onDelete?: () => void;
  deleteLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-card border border-line p-4">
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-line pb-2.5">
        <div className="min-w-0">
          <p className="truncate text-[15px] text-ink">{title}</p>
          {subtitle && <p className="truncate font-mono text-[11.5px] text-faint">{subtitle}</p>}
        </div>
        {onDelete && <RowDelete onClick={onDelete} label={deleteLabel ?? `Remove ${title}`} />}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

/** One labelled field inside a RecordCard. */
export function CardField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Lbl>{label}</Lbl>
      {children}
      {hint && <span className="text-[11.5px] leading-[1.4] text-faint">{hint}</span>}
    </div>
  );
}

/** Two fields side by side inside a card, for values that belong together. */
export function CardPair({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}
