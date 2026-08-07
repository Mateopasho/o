import type { ReactNode } from "react";
import type { DualValue, SingleValue } from "@/lib/types";

/**
 * Render a chemical formula with real subscript elements.
 *
 * Design system 02: "Chemical formulae render with real subscript elements —
 * CO₂, not CO2. Store the plain string in the database and parse digits into
 * <sub> at render."
 */
export function Formula({ value }: { value: string | null }): ReactNode {
  if (!value) return null;
  const parts = value.split(/(\d+)/).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        /^\d+$/.test(part) ? <sub key={i}>{part}</sub> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

/** Unit display mode for measurement tables. */
export type UnitMode = "both" | "metric" | "imperial";

export function isDual(v: unknown): v is DualValue {
  return typeof v === "object" && v !== null && "metric" in v && "imperial" in v;
}

export function isSingle(v: unknown): v is SingleValue {
  return typeof v === "object" && v !== null && "value" in v;
}

/**
 * A numeric value with its unit suffix.
 *
 * Design system 02 and 06: numerics are mono and right-aligned, unit suffixes
 * render at 400 weight in n-400. A value and its unit never split across lines,
 * which is what the non-breaking space enforces.
 */
export function Numeric({
  value,
  unit,
  muted = false,
}: {
  value: string;
  unit?: string;
  muted?: boolean;
}) {
  return (
    <span className={muted ? "text-n-600" : undefined}>
      {value}
      {unit ? (
        <>
          {" "}
          <span className="font-normal text-n-400">{unit}</span>
        </>
      ) : null}
    </span>
  );
}

/**
 * A dual-unit cell. Metric over imperial, imperial muted.
 * Honours the METRIC / IMPERIAL / BOTH toggle without re-deriving any figure.
 */
export function DualCell({ value, mode = "both" }: { value: DualValue; mode?: UnitMode }) {
  if (mode === "metric") {
    return <Numeric value={value.metric} unit={value.metricUnit} />;
  }
  if (mode === "imperial") {
    return <Numeric value={value.imperial} unit={value.imperialUnit} />;
  }
  return (
    <>
      <span className="block">
        <Numeric value={value.metric} unit={value.metricUnit} />
      </span>
      <span className="block text-n-600">
        <Numeric value={value.imperial} unit={value.imperialUnit} muted />
      </span>
    </>
  );
}

/**
 * Renders any property value. A null value renders an em dash — never "N/A".
 * Design system 06: "a dash means not specified, never 'N/A'."
 */
export function PropertyValue({
  value,
  mode = "both",
}: {
  value: SingleValue | DualValue | string | null;
  mode?: UnitMode;
}) {
  if (value === null) return <span className="text-n-600">—</span>;
  if (typeof value === "string") {
    if (value === "—") return <span className="text-n-600">—</span>;
    return <span className="font-sans">{value}</span>;
  }
  if (isDual(value)) return <DualCell value={value} mode={mode} />;
  return <Numeric value={value.value} unit={value.unit} />;
}

/** Em dash for an unspecified table cell. */
export function Dash() {
  return <span className="text-n-600">—</span>;
}
