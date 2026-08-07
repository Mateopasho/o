import type {
  Availability,
  ContainerType,
  CylinderShape,
  DualValue,
  PackageConfig,
} from "@/lib/types";

/** Dual-unit value: metric first, imperial second. */
export const dv = (
  metric: string,
  metricUnit: string,
  imperial: string,
  imperialUnit: string,
): DualValue => ({ metric, metricUnit, imperial, imperialUnit });

/** Compact package-configuration builder. */
export function pkg(p: {
  size: string;
  sku: string;
  container: ContainerType;
  spec: string;
  contents: DualValue;
  fill: DualValue;
  cga: string;
  tare?: DualValue | null;
  availability?: Availability;
  shape: CylinderShape;
}): PackageConfig {
  return {
    size: p.size,
    sku: p.sku,
    container: p.container,
    spec: p.spec,
    contents: p.contents,
    fillPressure: p.fill,
    cga: p.cga,
    tare: p.tare ?? null,
    availability: p.availability ?? "Stocked",
    shape: p.shape,
  };
}

/* --- Common fill pressures -------------------------------------------- */
export const P2015 = dv("13,893", "kPa", "2,015", "psig");
export const P2265 = dv("15,616", "kPa", "2,265", "psig");
export const P230 = dv("1,586", "kPa", "230", "psig");

/* --- Common tare weights, by cylinder size ---------------------------- */
export const T300 = dv("58.0", "kg", "128", "lb");
export const T150 = dv("30.4", "kg", "67", "lb");
export const T80 = dv("17.7", "kg", "39", "lb");
export const T40 = dv("10.9", "kg", "24", "lb");
export const T20 = dv("5.9", "kg", "13", "lb");

/* --- Impurity species sets -------------------------------------------- */
export const SPECIES_STANDARD = [
  { key: "h2o", label: "H₂O", formula: "H2O" },
  { key: "o2", label: "O₂", formula: "O2" },
  { key: "n2", label: "N₂", formula: "N2" },
  { key: "thc", label: "THC as CH₄", formula: "THC as CH4" },
];

export const SPECIES_WITH_CO = [
  { key: "h2o", label: "H₂O", formula: "H2O" },
  { key: "o2", label: "O₂", formula: "O2" },
  { key: "n2", label: "N₂", formula: "N2" },
  { key: "co", label: "CO" },
  { key: "co2", label: "CO₂", formula: "CO2" },
  { key: "thc", label: "THC as CH₄", formula: "THC as CH4" },
];

/* --- Reusable safety fragments ---------------------------------------- */
export const NEVER_STANDARD = [
  "Drop, roll or drag a cylinder",
  "Lift by the valve or cap",
  "Use to blow dust off clothing or skin",
  "Identify contents by cylinder colour",
];

export const REQUAL_STEEL =
  "High-pressure steel cylinders requalify at 10-year intervals under CSA B339/B340.";

export const STORAGE_STANDARD =
  "Store upright, valve-protection cap fitted, secured by chain or strap. Keep below 52 °C, away from heat sources and direct sunlight. Segregate full and empty cylinders.";
