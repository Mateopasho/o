/**
 * Orion Gases — product model.
 *
 * The field groups below mirror the admin editor tabs A–J one-to-one, exactly
 * as specified in "Toronto Gas Design System v1.0", section 08 Field map. When
 * the admin panel and Prisma are added, these interfaces become the generated
 * Prisma types with no shape change to the public site.
 *
 *   A Identity        → name, slug, tagline, formula, category, gallery
 *   B Regulatory      → UN, CAS, TDG, GHS, signal word, shipping name, SDS
 *   C Properties      → physical & chemical properties
 *   D Grades          → grades + impurity limits
 *   E Packages        → one row per SKU
 *   F Applications    → grouped application blocks, process tags
 *   G Safety          → handling, storage, PPE, hazard callout
 *   H Compatibility   → materials, related products, equipment
 *   I Commercial      → regions, delivery modes, minimum
 *   J SEO             → FAQ entries, meta
 *
 * There is deliberately no price field anywhere in this model. Per the design
 * system: "There is no cart primitive in this system and none should ever be
 * added." Every commercial action resolves to quote, call, email or SDS.
 */

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export type TdgClass = "2.1" | "2.2" | "2.3" | "5.1" | "2.2 / 5.1" | "9";

export type GhsPictogram =
  | "compressed-gas"
  | "flammable"
  | "oxidizer"
  | "acute-toxicity"
  | "warning"
  | "corrosive";

export type SignalWord = "Danger" | "Warning" | null;

export type ContainerType =
  | "High-pressure steel"
  | "Aluminum"
  | "Cryogenic dewar"
  | "Manifolded pallet"
  | "Microbulk / bulk"
  | "Acetylene cylinder"
  | "Insulated container"
  | "Forklift cylinder";

export type Availability = "Stocked" | "Available to order" | "Ask us";

/** Illustration variant — drives which line-drawn SVG renders for a package. */
export type CylinderShape =
  | "cylinder-300"
  | "cylinder-150"
  | "cylinder-80"
  | "cylinder-40"
  | "cylinder-20"
  | "dewar"
  | "bulk-pack"
  | "block";

/* -------------------------------------------------------------------------- */
/* Shared value objects                                                        */
/* -------------------------------------------------------------------------- */

/**
 * A measurement carried in both unit systems.
 *
 * Design system 06: "dual-unit cells stack metric over imperial and take a
 * 64px row. A value and its unit never split across lines." Both halves are
 * stored so the METRIC / IMPERIAL / BOTH toggle is a pure render concern and
 * never a rounding one.
 */
export interface DualValue {
  metric: string;
  metricUnit: string;
  imperial: string;
  imperialUnit: string;
}

/** A single-system measurement. `unit` may be omitted for dimensionless values. */
export interface SingleValue {
  value: string;
  unit?: string;
}

/* -------------------------------------------------------------------------- */
/* C — Physical & chemical properties                                          */
/* -------------------------------------------------------------------------- */

export interface PropertyRow {
  label: string;
  /** A dash renders when this is null. Never the string "N/A". */
  value: SingleValue | DualValue | string | null;
}

/* -------------------------------------------------------------------------- */
/* D — Grades & purity                                                         */
/* -------------------------------------------------------------------------- */

export interface Grade {
  /** Column heading, e.g. "UHP 5.0". */
  name: string;
  /** Minimum purity as a percentage string, e.g. "99.999". */
  minPurity: string;
  /**
   * Impurity limits in maximum ppm, keyed by species. A species absent from
   * this record renders as a dash — the grade does not specify it.
   */
  impurities: Record<string, string>;
  conformsTo: string | null;
  certificateOfAnalysis: string | null;
}

/** Ordered impurity species. Keys map into `Grade.impurities`. */
export interface ImpuritySpecies {
  key: string;
  /** Rendered label; may contain subscript markup via `formula`. */
  label: string;
  formula?: string;
}

/* -------------------------------------------------------------------------- */
/* E — Cylinder & package configurations                                       */
/* -------------------------------------------------------------------------- */

export interface PackageConfig {
  /** Display size, e.g. "300 Large". */
  size: string;
  sku: string;
  container: ContainerType;
  /** TC/DOT specification marking, e.g. "TC-3AAM2265". */
  spec: string;
  contents: DualValue;
  fillPressure: DualValue;
  /** CGA valve outlet number. */
  cga: string;
  tare: DualValue | null;
  availability: Availability;
  shape: CylinderShape;
}

/* -------------------------------------------------------------------------- */
/* F — Applications                                                            */
/* -------------------------------------------------------------------------- */

export interface ApplicationGroup {
  heading: string;
  items: string[];
}

/* -------------------------------------------------------------------------- */
/* G — Handling, storage & safety                                              */
/* -------------------------------------------------------------------------- */

export interface SafetyBlock {
  /**
   * Renders the persistent, non-dismissible asphyxiation callout in the safety
   * section. Design system 04: "Renders whenever oxygenDisplacementWarning is
   * true. Persistent, never dismissible."
   */
  oxygenDisplacementWarning: boolean;
  /** Callout heading + body. Only used when a callout is warranted. */
  callout: { title: string; body: string } | null;
  storage: string;
  segregation: string;
  leakDetection: string;
  ppe: string[];
  never: string[];
  requalification: string;
}

/* -------------------------------------------------------------------------- */
/* H — Equipment & compatibility                                               */
/* -------------------------------------------------------------------------- */

export interface Compatibility {
  /** Primary CGA outlet for the product's cylinder packages. */
  cga: string;
  /** Verified thread specification for that outlet. */
  cgaThread: string;
  cgaNote: string;
  recommendedEquipment: string[];
  compatibleMaterials: string;
  incompatible: string;
}

/* -------------------------------------------------------------------------- */
/* B — Documents                                                               */
/* -------------------------------------------------------------------------- */

export interface DocumentRow {
  title: string;
  /** "Compressed", "Refrigerated liquid", "Dissolved", or null for a TDS. */
  phase: string | null;
  language: "EN" | "FR";
  version: string;
  revised: string;
}

/* -------------------------------------------------------------------------- */
/* J — FAQ                                                                     */
/* -------------------------------------------------------------------------- */

export interface FaqEntry {
  question: string;
  answer: string;
}

/* -------------------------------------------------------------------------- */
/* Category                                                                    */
/* -------------------------------------------------------------------------- */

export interface Category {
  slug: string;
  /** Full name, e.g. "Industrial & Pure Gases". */
  name: string;
  /** Short name used in filters and breadcrumbs, e.g. "Industrial & Pure". */
  shortName: string;
  blurb: string;
  /**
   * Product count shown on the home page category card. Held as data because
   * the design specifies these six figures literally (12 / 9 / 14 / 6 / 5 / 7
   * = 53) and they represent the full published catalogue, of which this build
   * carries a fully-specified subset.
   */
  publishedCount: number;
  /** Ordinal shown as a mono label on the card, e.g. "01". */
  ordinal: string;
  /** One of the six design-specified photographs, or null for a filter view. */
  image: { src: string; alt: string } | null;
  /** Filter views (Propane, Dry Ice, Laser Gases) have no card of their own. */
  featured: boolean;
}

/* -------------------------------------------------------------------------- */
/* Product                                                                     */
/* -------------------------------------------------------------------------- */

export interface Product {
  /* A — Identity */
  slug: string;
  name: string;
  /** Plain string; digits are parsed into <sub> at render. e.g. "CO2". */
  formula: string | null;
  tagline: string;
  categorySlug: string;
  /** Badge shown on the catalogue card, e.g. "Industrial", "Food grade". */
  badge: string;
  status: ProductStatus;
  synonyms: string;
  overview: string[];

  /* B — Regulatory */
  unNumber: string;
  cas: string | null;
  tdgClass: TdgClass;
  properShippingName: string;
  erapRequired: boolean;
  pictograms: GhsPictogram[];
  signalWord: SignalWord;
  hazardStatements: string[];
  /** Short hazard descriptor for the key-facts strip, e.g. "Inert · Asphyxiant". */
  hazardSummary: string;
  documents: DocumentRow[];

  /* C — Properties */
  properties: PropertyRow[];

  /* D — Grades */
  grades: Grade[];
  impuritySpecies: ImpuritySpecies[];

  /* E — Packages */
  packages: PackageConfig[];

  /* F — Applications */
  applications: ApplicationGroup[];
  processes: string[];
  industries: string[];

  /* G — Safety */
  safety: SafetyBlock;

  /* H — Compatibility */
  compatibility: Compatibility;
  relatedSlugs: string[];

  /* I — Commercial */
  featuredRank: number | null;
  featuredBadge: string | null;

  /* J — SEO */
  faq: FaqEntry[];
  metaDescription: string;
}

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                             */
/* -------------------------------------------------------------------------- */

/** Highest minimum purity across a product's grades, as a string. */
export function maxPurity(product: Product): string | null {
  if (product.grades.length === 0) return null;
  return product.grades.reduce((best, g) =>
    parseFloat(g.minPurity) > parseFloat(best.minPurity) ? g : best,
  ).minPurity;
}

/** Distinct CGA outlets across a product's packages, in first-seen order. */
export function cgaOutlets(product: Product): string[] {
  return [...new Set(product.packages.map((p) => p.cga))];
}
