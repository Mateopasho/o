import type {
  Availability, ContainerType, CylinderShape, GhsPictogram, ProductStatus, TdgClass,
} from "@/lib/types";

/**
 * Pickers for the editor.
 *
 * These lists are the type unions written out, not a subset. A picker that
 * cannot reach a value the model allows would quietly make some records
 * uneditable — and the union is where the constraint belongs, so this file
 * fails to compile the moment the two drift apart.
 */

type Opt<T extends string> = { value: T; label: string };

export const TDG_OPTIONS: Opt<TdgClass>[] = [
  { value: "2.1", label: "2.1 · Flammable gas" },
  { value: "2.2", label: "2.2 · Non-flammable, non-toxic gas" },
  { value: "2.3", label: "2.3 · Toxic gas" },
  { value: "2.2 / 5.1", label: "2.2 / 5.1 · Non-flammable oxidizer" },
  { value: "5.1", label: "5.1 · Oxidizing substance" },
  { value: "9", label: "9 · Miscellaneous" },
];

export const CONTAINER_OPTIONS: Opt<ContainerType>[] = [
  { value: "High-pressure steel", label: "High-pressure steel" },
  { value: "Aluminum", label: "Aluminum" },
  { value: "Cryogenic dewar", label: "Cryogenic dewar" },
  { value: "Manifolded pallet", label: "Manifolded pallet" },
  { value: "Microbulk / bulk", label: "Microbulk / bulk" },
  { value: "Acetylene cylinder", label: "Acetylene cylinder" },
  { value: "Insulated container", label: "Insulated container" },
  { value: "Forklift cylinder", label: "Forklift cylinder" },
];

export const AVAILABILITY_OPTIONS: Opt<Availability>[] = [
  { value: "Stocked", label: "Stocked" },
  { value: "Available to order", label: "Available to order" },
  { value: "Ask us", label: "Ask us" },
];

export const SHAPE_OPTIONS: Opt<CylinderShape>[] = [
  { value: "cylinder-300", label: "Cylinder · tall" },
  { value: "cylinder-150", label: "Cylinder · medium" },
  { value: "cylinder-80", label: "Cylinder · short" },
  { value: "cylinder-40", label: "Cylinder · small" },
  { value: "cylinder-20", label: "Cylinder · portable" },
  { value: "dewar", label: "Dewar" },
  { value: "bulk-pack", label: "Bulk pack" },
  { value: "block", label: "Block" },
];

/** null is a real value here — plenty of products carry no signal word. */
export const SIGNAL_OPTIONS: Opt<"Danger" | "Warning" | "">[] = [
  { value: "", label: "No signal word" },
  { value: "Danger", label: "Danger" },
  { value: "Warning", label: "Warning" },
];

export const PICTOGRAM_OPTIONS: Opt<GhsPictogram>[] = [
  { value: "compressed-gas", label: "Gas under pressure" },
  { value: "flammable", label: "Flammable" },
  { value: "oxidizer", label: "Oxidizer" },
  { value: "acute-toxicity", label: "Acute toxicity" },
  { value: "warning", label: "Warning" },
  { value: "corrosive", label: "Corrosive" },
];

export const STATUS_OPTIONS: Opt<ProductStatus>[] = [
  { value: "ACTIVE", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

export const PHASE_OPTIONS = [
  { value: "", label: "— none" },
  { value: "Compressed", label: "Compressed" },
  { value: "Refrigerated liquid", label: "Refrigerated liquid" },
  { value: "Dissolved", label: "Dissolved" },
  { value: "Solid", label: "Solid" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "EN", label: "EN" },
  { value: "FR", label: "FR" },
] as const;

/** Offered PPE. Free text is still allowed — a product may carry others. */
export const PPE_SUGGESTIONS = [
  "Safety glasses",
  "Face shield",
  "Cryogenic gloves",
  "Leather gloves",
  "Safety footwear",
  "Flame-resistant clothing",
  "Long sleeves",
  "Oxygen monitor",
  "Apron",
] as const;
