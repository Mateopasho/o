import type { Category } from "@/lib/types";

/**
 * The nine catalogue categories.
 *
 * The six `featured: true` categories are the ones the home page renders as
 * cards, with the exact product counts specified in the design document
 * (12 + 9 + 14 + 6 + 5 + 7 = 53, matching the "53 products with published
 * specs" statistic in the hero).
 *
 * Propane, Dry Ice and Laser Gases are the remaining three of the nine. They
 * appear in the footer and as filter views over the same 53 products — a
 * propane cylinder is a Cutting & Fuel product that also belongs to the Propane
 * programme. Modelling them as views rather than as additional primary
 * categories is what keeps both design figures true at once: nine categories,
 * fifty-three products.
 *
 * Photography: the six images below are the exact Unsplash assets referenced by
 * the design document, verified reachable. Everywhere else the system uses
 * line-drawn inline SVG, per the design system's explicit rule.
 */

const UNSPLASH = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const categories: Category[] = [
  {
    slug: "industrial-pure",
    name: "Industrial & Pure Gases",
    shortName: "Industrial & Pure",
    blurb: "Argon, oxygen, nitrogen, hydrogen, helium and compressed air.",
    publishedCount: 12,
    ordinal: "01",
    image: {
      src: UNSPLASH("1510467181625-c419e443bdfa", 900),
      alt: "High-pressure oxygen cylinder",
    },
    featured: true,
  },
  {
    slug: "welding-mixes",
    name: "Welding Shielding Mixes",
    shortName: "Welding Mixes",
    blurb: "ISO 14175 designated blends for GMAW, GTAW and pulsed transfer.",
    publishedCount: 9,
    ordinal: "02",
    image: {
      src: UNSPLASH("1703041555997-f51216e6a532", 900),
      alt: "Welding regulator and gauge",
    },
    featured: true,
  },
  {
    slug: "specialty-high-purity",
    name: "Specialty & High-Purity",
    shortName: "Specialty & High-Purity",
    blurb: "Research 6.0, UHP 5.0, calibration standards and carrier gases.",
    publishedCount: 14,
    ordinal: "03",
    image: {
      src: UNSPLASH("1744302570248-28dc28ea163a", 900),
      alt: "High-purity gas valve manifold",
    },
    featured: true,
  },
  {
    slug: "food-beverage",
    name: "Food & Beverage Gases",
    shortName: "Food & Beverage",
    blurb: "FCC-grade CO₂ and nitrogen, MAP blends and beverage dispense.",
    publishedCount: 6,
    ordinal: "04",
    image: {
      src: UNSPLASH("1620418583334-4edb19ffc86e", 900),
      alt: "Beverage bottling",
    },
    featured: true,
  },
  {
    slug: "cutting-fuel",
    name: "Cutting & Fuel Gases",
    shortName: "Cutting & Fuel",
    blurb: "Acetylene, propylene and oxy-fuel packages for cutting and brazing.",
    publishedCount: 5,
    ordinal: "05",
    image: {
      src: UNSPLASH("1664285831203-fc5687b44e2a", 900),
      alt: "Propane and fuel-gas cylinders",
    },
    featured: true,
  },
  {
    slug: "cryogenic-liquids",
    name: "Cryogenic Liquids",
    shortName: "Cryogenic Liquids",
    blurb: "Liquid nitrogen, argon and oxygen in dewars, microbulk and bulk.",
    publishedCount: 7,
    ordinal: "06",
    image: {
      src: UNSPLASH("1627881960266-52ffbc47aaa9", 900),
      alt: "Cryogenic dewar on a cylinder cart",
    },
    featured: true,
  },

  /* --- The remaining three of nine: filter views, no card of their own --- */
  {
    slug: "propane",
    name: "Propane",
    shortName: "Propane",
    blurb: "Forklift cylinders, construction heat and portable torch service.",
    publishedCount: 0,
    ordinal: "07",
    image: null,
    featured: false,
  },
  {
    slug: "dry-ice",
    name: "Dry Ice",
    shortName: "Dry Ice",
    blurb: "Pellets, nuggets and blocks for cold chain and blast cleaning.",
    publishedCount: 0,
    ordinal: "08",
    image: null,
    featured: false,
  },
  {
    slug: "laser-gases",
    name: "Laser Gases",
    shortName: "Laser Gases",
    blurb: "Assist and resonator gases for fibre and CO₂ cutting systems.",
    publishedCount: 0,
    ordinal: "09",
    image: null,
    featured: false,
  },
];

export const featuredCategories = categories.filter((c) => c.featured);

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Small-card thumbnail variant of the six design photographs. */
export function categoryImageSmall(category: Category): string | null {
  if (!category.image) return null;
  return category.image.src.replace("w=900", "w=600");
}

/* -------------------------------------------------------------------------- */

/**
 * Grade / purity tiers used as catalogue filters. Purity tier names follow the
 * N.N convention where the digits count nines: 4.8 = 99.998 %, 5.0 = 99.999 %,
 * 6.0 = 99.9999 %.
 */
export const gradeTiers = [
  "Industrial",
  "Welding",
  "Food / FCC",
  "High Purity 4.8",
  "UHP 5.0",
  "Research 6.0",
] as const;

export const containerTypes = [
  "High-pressure steel",
  "Aluminum",
  "Cryogenic dewar",
  "Manifolded pallet",
  "Microbulk / bulk",
] as const;

export const tdgClassFilters = [
  { value: "2.1", label: "2.1 Flammable" },
  { value: "2.2", label: "2.2 Non-flammable" },
  { value: "2.3", label: "2.3 Toxic" },
  { value: "5.1", label: "5.1 Oxidizer" },
] as const;

export const processFilters = [
  "GMAW / MIG",
  "GTAW / TIG",
  "Laser cutting",
  "MAP packaging",
  "Purging & blanketing",
] as const;
