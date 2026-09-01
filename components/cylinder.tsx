import type { CylinderShape } from "@/lib/types";

/**
 * Line-drawn cylinder illustrations.
 *
 * Design system 05: "Line-drawn SVG in place of photography. Stroke #2a2e34 at
 * 2px, valve accent in cyan, cap colour driven by category. Scales without asset
 * management and prints cleanly."
 *
 * Valve accent: the premium artboards draw the valve cap in gold-link #7E6413
 * against a #3B3A36 body and #D8D4CB bands. The original design system text
 * called for cyan, but no artboard has ever drawn it that way and cyan sits
 * outside the documented palette, so the artboards win.
 *
 * Paths below are transcribed verbatim from the design document so proportions
 * match at every size.
 */

interface CylinderProps {
  shape: CylinderShape;
  /** Rendered height in px; width follows the shape's aspect ratio. */
  height?: number;
  /** Stroke weight scales up at small sizes so the drawing stays legible. */
  strokeWidth?: number;
  /** Body fill — #FFFFFF on a tinted panel, near-transparent on white. */
  fill?: string;
  bodyStroke?: string;
  /** Renders the label bands across the body. */
  bands?: boolean;
  className?: string;
}

const GOLD = "#7E6413";
const INK = "#3B3A36";
const BAND = "#D8D4CB";

export function Cylinder({
  shape,
  height = 150,
  strokeWidth = 2,
  fill = "#FFFFFF",
  bodyStroke = INK,
  bands = true,
  className,
}: CylinderProps) {
  const sw = strokeWidth;
  const common = { fill: "none", strokeWidth: sw } as const;

  switch (shape) {
    case "cylinder-300": {
      const ratio = 72 / 200;
      return (
        <svg
          width={Math.round(height * ratio)}
          height={height}
          viewBox="0 0 72 200"
          aria-hidden="true"
          className={className}
        >
          <rect x="30" y="6" width="12" height="18" rx="2" {...common} stroke={GOLD} />
          <rect x="22" y="24" width="28" height="16" rx="2" {...common} stroke={bodyStroke} />
          <path
            d="M14 62c0-14 8-22 22-22s22 8 22 22v122a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8z"
            fill={fill}
            stroke={bodyStroke}
            strokeWidth={sw}
          />
          {bands && (
            <>
              <rect x="14" y="86" width="44" height="26" fill="none" stroke={BAND} strokeWidth={sw * 0.75} />
              <rect x="14" y="170" width="44" height="8" fill="none" stroke={BAND} strokeWidth={sw * 0.75} />
            </>
          )}
        </svg>
      );
    }

    case "cylinder-150":
    case "cylinder-80": {
      const ratio = 62 / 150;
      return (
        <svg
          width={Math.round(height * ratio)}
          height={height}
          viewBox="0 0 62 150"
          aria-hidden="true"
          className={className}
        >
          <rect x="25" y="4" width="12" height="14" rx="2" {...common} stroke={GOLD} />
          <rect x="18" y="18" width="26" height="14" rx="2" {...common} stroke={bodyStroke} />
          <path
            d="M10 52c0-13 7-20 21-20s21 7 21 20v84a7 7 0 0 1-7 7H17a7 7 0 0 1-7-7z"
            fill={fill}
            stroke={bodyStroke}
            strokeWidth={sw}
          />
          {bands && (
            <rect x="10" y="72" width="42" height="22" fill="none" stroke={BAND} strokeWidth={sw * 0.75} />
          )}
        </svg>
      );
    }

    case "cylinder-40": {
      const ratio = 52 / 110;
      return (
        <svg
          width={Math.round(height * ratio)}
          height={height}
          viewBox="0 0 52 110"
          aria-hidden="true"
          className={className}
        >
          <rect x="20" y="3" width="11" height="12" rx="2" {...common} stroke={GOLD} />
          <rect x="14" y="15" width="23" height="12" rx="2" {...common} stroke={bodyStroke} />
          <path
            d="M8 44c0-11 6-17 17.5-17S43 33 43 44v56a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z"
            fill={fill}
            stroke={bodyStroke}
            strokeWidth={sw}
          />
          {bands && (
            <rect x="8" y="60" width="35" height="18" fill="none" stroke={BAND} strokeWidth={sw * 0.75} />
          )}
        </svg>
      );
    }

    case "cylinder-20": {
      const ratio = 46 / 82;
      return (
        <svg
          width={Math.round(height * ratio)}
          height={height}
          viewBox="0 0 46 82"
          aria-hidden="true"
          className={className}
        >
          <rect x="17" y="2" width="10" height="10" rx="2" {...common} stroke={GOLD} />
          <rect x="12" y="12" width="20" height="10" rx="2" {...common} stroke={bodyStroke} />
          <path
            d="M7 36c0-9 5-14 15-14s15 5 15 14v38a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5z"
            fill={fill}
            stroke={bodyStroke}
            strokeWidth={sw}
          />
          {bands && (
            <rect x="7" y="48" width="30" height="15" fill="none" stroke={BAND} strokeWidth={sw * 0.75} />
          )}
        </svg>
      );
    }

    case "dewar": {
      const ratio = 96 / 140;
      return (
        <svg
          width={Math.round(height * ratio)}
          height={height}
          viewBox="0 0 96 140"
          aria-hidden="true"
          className={className}
        >
          <rect x="40" y="4" width="14" height="12" rx="2" {...common} stroke={GOLD} />
          <rect x="10" y="16" width="76" height="14" rx="3" {...common} stroke={bodyStroke} />
          <rect x="14" y="30" width="68" height="96" rx="6" fill={fill} stroke={bodyStroke} strokeWidth={sw} />
          {bands && (
            <rect x="14" y="52" width="68" height="30" fill="none" stroke={BAND} strokeWidth={sw * 0.75} />
          )}
          <circle cx="30" cy="132" r="6" {...common} stroke={bodyStroke} />
          <circle cx="66" cy="132" r="6" {...common} stroke={bodyStroke} />
        </svg>
      );
    }

    case "bulk-pack": {
      const ratio = 110 / 120;
      return (
        <svg
          width={Math.round(height * ratio)}
          height={height}
          viewBox="0 0 110 120"
          aria-hidden="true"
          className={className}
        >
          <rect x="6" y="100" width="98" height="14" rx="2" {...common} stroke={bodyStroke} />
          {[14, 38, 62, 86].map((x) => (
            <rect key={x} x={x} y="30" width="18" height="70" rx="6" fill={fill} stroke={bodyStroke} strokeWidth={sw} />
          ))}
          <path d="M23 30V18h64v12" fill="none" stroke={GOLD} strokeWidth={sw} />
        </svg>
      );
    }

    case "block": {
      const ratio = 100 / 80;
      return (
        <svg
          width={Math.round(height * ratio)}
          height={height}
          viewBox="0 0 100 80"
          aria-hidden="true"
          className={className}
        >
          {/* Insulated container holding solid CO₂ — no valve, so no gold accent. */}
          <path d="M12 24h76v44a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z" fill={fill} stroke={bodyStroke} strokeWidth={sw} />
          <path d="M8 14h84v10H8z" fill="none" stroke={bodyStroke} strokeWidth={sw} />
          {bands && (
            <>
              <rect x="24" y="38" width="52" height="18" fill="none" stroke={BAND} strokeWidth={sw * 0.75} />
              <path d="M36 30v-8M50 30v-8M64 30v-8" stroke={BAND} strokeWidth={sw * 0.75} fill="none" />
            </>
          )}
        </svg>
      );
    }
  }
}

/** The six-cylinder size lineup used in the hero and the size chart. */
export const SIZE_LINEUP: { shape: CylinderShape; label: string; height: number }[] = [
  { shape: "cylinder-300", label: "300", height: 236 },
  { shape: "cylinder-80", label: "80", height: 184 },
  { shape: "cylinder-40", label: "40", height: 134 },
  { shape: "cylinder-20", label: "20", height: 98 },
  { shape: "dewar", label: "240 L", height: 155 },
  { shape: "bulk-pack", label: "BP-14", height: 135 },
];
