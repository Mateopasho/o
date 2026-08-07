import type { GhsPictogram } from "@/lib/types";

/**
 * GHS pictograms as inline SVG.
 *
 * Design system 04: "GHS pictograms render as inline SVG from the ghsPictograms
 * multi-select. Diamonds are 48px on product pages, 28px on listing cards, 20px
 * in admin tables. Every one carries a title and aria-label."
 *
 * The red diamond border is the regulated GHS red, not a palette colour — it is
 * prescribed by GHS itself and must not be tinted toward the brand.
 */

const LABELS: Record<GhsPictogram, string> = {
  "compressed-gas": "Compressed gas",
  flammable: "Flammable",
  oxidizer: "Oxidizer",
  "acute-toxicity": "Acute toxicity",
  warning: "Warning",
  corrosive: "Corrosive",
};

const RED = "#D02020";
const INK = "#15191d";

export function GhsIcon({
  type,
  size = 48,
  className,
}: {
  type: GhsPictogram;
  size?: number;
  className?: string;
}) {
  const label = LABELS[type];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
      className={className}
    >
      <title>{label}</title>
      <rect
        x="32"
        y="4"
        width="39.6"
        height="39.6"
        transform="rotate(45 32 4)"
        fill="#FFFFFF"
        stroke={RED}
        strokeWidth="4"
      />
      {type === "compressed-gas" && (
        <>
          <rect x="26.5" y="20" width="11" height="24" rx="5.5" fill="none" stroke={INK} strokeWidth="2.4" />
          <rect x="29.5" y="15" width="5" height="6" fill={INK} />
        </>
      )}
      {type === "flammable" && (
        <>
          <path
            d="M32 16c4 7-3 9 1 15 2.5 3.8 8-1 5-8 5 4 7 10 4 15-3 5-11 6-15 2-5-5-2-14 5-24z"
            fill={INK}
          />
          <rect x="20" y="43" width="24" height="2.6" fill={INK} />
        </>
      )}
      {type === "oxidizer" && (
        <>
          <circle cx="32" cy="34" r="9" fill="none" stroke={INK} strokeWidth="2.6" />
          <path d="M32 12c3 6-2 8 1 12 2 2.6 6-.6 4-5.6 3.6 3 5 7.6 3 11" fill={INK} />
          <rect x="20" y="44" width="24" height="2.6" fill={INK} />
        </>
      )}
      {type === "acute-toxicity" && (
        <>
          <circle cx="32" cy="26" r="8" fill="none" stroke={INK} strokeWidth="2.4" />
          <circle cx="29" cy="24" r="1.8" fill={INK} />
          <circle cx="35" cy="24" r="1.8" fill={INK} />
          <path d="M28 31h8M30 33.5h4" stroke={INK} strokeWidth="1.8" />
          <path d="M22 38l20 8M42 38l-20 8" stroke={INK} strokeWidth="2.4" />
        </>
      )}
      {type === "warning" && (
        <>
          <path d="M32 18l12 22H20z" fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <rect x="30.8" y="25" width="2.4" height="8" fill={INK} />
          <rect x="30.8" y="35" width="2.4" height="2.4" fill={INK} />
        </>
      )}
      {type === "corrosive" && (
        <>
          <path d="M18 20l4 12M22 32c-2 3 0 6 3 6" fill="none" stroke={INK} strokeWidth="2.2" />
          <path d="M40 20l4 12M44 32c-2 3 0 6 3 6" fill="none" stroke={INK} strokeWidth="2.2" />
          <rect x="14" y="42" width="16" height="3" fill={INK} />
          <rect x="36" y="42" width="16" height="3" fill={INK} />
          <path d="M20 45c1 3 3 5 5 6M46 45c-1 3-3 5-5 6" fill="none" stroke={INK} strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export function GhsRow({
  types,
  size = 24,
}: {
  types: GhsPictogram[];
  size?: number;
}) {
  if (types.length === 0) return null;
  return (
    <div className="flex gap-[5px]">
      {types.map((t) => (
        <GhsIcon key={t} type={t} size={size} />
      ))}
    </div>
  );
}

/** TDG class chip. Flammable and oxidiser classes carry a gold tint. */
export function TdgChip({ tdgClass, label }: { tdgClass: string; label?: string }) {
  const flammable = tdgClass.startsWith("2.1");
  const oxidizer = tdgClass.includes("5.1");
  const toxic = tdgClass.startsWith("2.3");

  const tone = flammable
    ? "bg-gold-200 text-gold-800"
    : oxidizer
      ? "bg-gold-100 text-gold-800"
      : toxic
        ? "bg-n-800 text-white"
        : "bg-n-100 text-n-900";

  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-[3px] px-[10px] py-[4px] text-[12.5px] font-medium ${tone}`}
    >
      {label ?? tdgClass}
    </span>
  );
}
