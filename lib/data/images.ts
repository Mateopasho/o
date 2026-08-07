import type { ContainerType, Product } from "@/lib/types";

/**
 * Placeholder product photography.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ THESE ARE PLACEHOLDERS, KEYED TO CONTAINER TYPE — NOT PER-SKU PHOTOS.  │
 * │                                                                         │
 * │ Two things to know before swapping them for real assets:               │
 * │                                                                         │
 * │ 1. The design system specifies line-drawn SVG "in place of             │
 * │    photography" for product visuals. Photography here is a deliberate   │
 * │    client override. The SVG illustrations are retained where relative   │
 * │    scale is the actual information — the home hero lineup and the       │
 * │    cylinder-guide size chart — because a photograph cannot show that a  │
 * │    size 300 is twice the height of a size 80.                          │
 * │                                                                         │
 * │ 2. Every image below is one of the six assets the design document       │
 * │    itself selected, so the subject of each is known and verified. They  │
 * │    are mapped by container type and category, which is the axis they    │
 * │    genuinely depict. No attempt is made to fake a distinct photograph   │
 * │    per gas: a cylinder of argon and a cylinder of nitrogen are visually │
 * │    identical, and inventing per-SKU photos would imply a precision the  │
 * │    imagery does not have.                                              │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

const U = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

interface Placeholder {
  id: string;
  alt: string;
}

/** The six verified assets, by subject. */
const ASSETS = {
  steelCylinder: { id: "1510467181625-c419e443bdfa", alt: "High-pressure steel gas cylinder" },
  regulator: { id: "1703041555997-f51216e6a532", alt: "Welding regulator and flowmeter on a cylinder" },
  manifold: { id: "1744302570248-28dc28ea163a", alt: "High-purity gas valve manifold" },
  beverage: { id: "1620418583334-4edb19ffc86e", alt: "Beverage bottling line" },
  fuelCylinders: { id: "1664285831203-fc5687b44e2a", alt: "Fuel-gas cylinders on a pallet" },
  dewar: { id: "1627881960266-52ffbc47aaa9", alt: "Cryogenic dewar on a cylinder cart" },
} as const satisfies Record<string, Placeholder>;

/* -------------------------------------------------------------------------- */
/* Product-level imagery, by category                                          */
/* -------------------------------------------------------------------------- */

const BY_CATEGORY: Record<string, Placeholder> = {
  "industrial-pure": ASSETS.steelCylinder,
  "welding-mixes": ASSETS.regulator,
  "specialty-high-purity": ASSETS.manifold,
  "food-beverage": ASSETS.beverage,
  "cutting-fuel": ASSETS.fuelCylinders,
  "cryogenic-liquids": ASSETS.dewar,
  propane: ASSETS.fuelCylinders,
  "dry-ice": ASSETS.dewar,
  "laser-gases": ASSETS.manifold,
};

export interface ImageRef {
  src: string;
  alt: string;
}

/** Hero / card image for a product. */
export function productImage(product: Product, width = 900): ImageRef {
  const asset = BY_CATEGORY[product.categorySlug] ?? ASSETS.steelCylinder;
  return {
    src: U(asset.id, width),
    // The product name carries the meaning; the asset describes the container.
    alt: `${product.name} — ${asset.alt.toLowerCase()}`,
  };
}

/* -------------------------------------------------------------------------- */
/* Size-level imagery, by container shape                                      */
/* -------------------------------------------------------------------------- */

/**
 * Keyed off container type, not cylinder size. Size does not change what a
 * package looks like — a size 40 argon cylinder is the same steel cylinder as a
 * size 300, just shorter. Container type is what actually changes the subject.
 */
const BY_CONTAINER: Record<ContainerType, Placeholder> = {
  "High-pressure steel": ASSETS.steelCylinder,
  Aluminum: ASSETS.steelCylinder,
  "Cryogenic dewar": ASSETS.dewar,
  "Microbulk / bulk": ASSETS.dewar,
  "Manifolded pallet": ASSETS.fuelCylinders,
  "Acetylene cylinder": ASSETS.fuelCylinders,
  "Forklift cylinder": ASSETS.fuelCylinders,
  "Insulated container": ASSETS.dewar,
};

/* -------------------------------------------------------------------------- */
/* Hero backdrop                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Placeholder photograph behind the home hero.
 *
 * Rendered at very low opacity and desaturated, under a white scrim. It is
 * decorative only: it carries no information, so it is `aria-hidden` with an
 * empty alt, and every legibility decision is made in the hero itself rather
 * than here. See app/page.tsx for the contrast reasoning.
 */
export const heroBackdrop: ImageRef = {
  src: U(ASSETS.steelCylinder.id, 1920),
  alt: "",
};

/** Thumbnail for one package configuration. */
export function packageImage(
  container: ContainerType,
  size: string,
  width = 300,
): ImageRef {
  const asset = BY_CONTAINER[container] ?? ASSETS.steelCylinder;
  return { src: U(asset.id, width), alt: `Size ${size} — ${asset.alt.toLowerCase()}` };
}
