import type { Product } from "@/lib/types";
import { dv, pkg, P2015, P2265, T300, T150, T80, T40, NEVER_STANDARD, REQUAL_STEEL, STORAGE_STANDARD } from "./_helpers";

/**
 * Welding shielding mixes.
 *
 * ISO 14175:2008 designations, verified:
 *   I1  = argon 100 %
 *   M12 = Ar + 1–5 % CO₂
 *   M13 = Ar + 1.5–3 % O₂
 *   M20 = Ar + 5–15 % CO₂
 *   M21 = Ar + 15–25 % CO₂
 *
 * Shielding mixes ship as UN1956 (compressed gas, n.o.s.) and take CGA 580 —
 * the standard inert connection — not CGA 660, which serves corrosive and
 * halocarbon gases.
 */

const MIX_SPECIES = [
  { key: "h2o", label: "H₂O", formula: "H2O" },
  { key: "o2", label: "O₂", formula: "O2" },
  { key: "n2", label: "N₂", formula: "N2" },
];

const mixSafety = (name: string) => ({
  oxygenDisplacementWarning: true,
  callout: {
    title: "Asphyxiation hazard",
    body: `${name} displaces oxygen and can cause rapid suffocation without warning. It is heavier than air and collects in pits, trenches and low-lying enclosed spaces. Weld in ventilated areas and monitor oxygen levels before entering a confined space.`,
  },
  storage: STORAGE_STANDARD,
  segregation:
    "No mandatory segregation as a non-flammable mixture, but keep clear of flammable gas and oxidizer storage in line with CGA P-1 practice.",
  leakDetection:
    "Odourless. Use a soap solution on fittings and an oxygen-deficiency monitor in enclosed areas.",
  ppe: ["Welding helmet with correct shade", "Leather gloves", "Flame-resistant clothing", "O₂ monitor in confined space"],
  never: [...NEVER_STANDARD, "Weld in an unventilated enclosed space"],
  requalification: REQUAL_STEEL,
});

const mixCompat = (note: string) => ({
  cga: "580",
  cgaThread: '.965"-14 NGO-RH-INT',
  cgaNote: note,
  recommendedEquipment: [
    "Flowmeter regulator, 0–60 CFH — read the argon scale",
    "Gas-cooled or water-cooled torch to suit duty cycle",
    "Cylinder cart with chain restraint",
  ],
  compatibleMaterials: "Carbon steel, stainless steel, brass, copper, aluminum, PTFE",
  incompatible: "No known material incompatibilities under normal service",
});

const mixDocs = (v: string, d: string) => [
  { title: "Safety Data Sheet", phase: "Compressed", language: "EN" as const, version: v, revised: d },
  { title: "Fiche de données de sécurité", phase: "Comprimé", language: "FR" as const, version: v, revised: d },
];

/* -------------------------------------------------------------------------- */

export const arCo2_7525: Product = {
  slug: "ar-co2-75-25",
  name: "75/25 Ar-CO₂",
  formula: null,
  tagline: "ISO 14175 M21 shielding mix for short-arc and spray transfer",
  categorySlug: "welding-mixes",
  badge: "Welding mix",
  status: "ACTIVE",
  synonyms: "75/25 · C25 · M21-ArC-25 · Argon-carbon dioxide 75/25",
  overview: [
    "The default GMAW shielding mix for carbon steel in North America, and the right first answer for most fabrication shops. Twenty-five percent carbon dioxide gives deep, broad penetration and a forgiving arc that tolerates mill scale and imperfect fit-up.",
    "Designated M21-ArC-25 under ISO 14175. The trade-off against a lower-CO₂ mix is spatter: 75/25 runs hotter and dirtier than 92/8, so it suits structural work and heavier plate rather than thin sheet or cosmetic welds.",
    "Runs short-circuit transfer across the full range and spray transfer at higher voltages. Set flow at 25–35 CFH for most nozzle sizes and increase it only for draughty conditions — more gas does not mean better coverage.",
  ],
  unNumber: "UN1956",
  cas: null,
  tdgClass: "2.2",
  properShippingName: "Compressed gas, n.o.s. (argon, carbon dioxide)",
  erapRequired: false,
  pictograms: ["compressed-gas"],
  signalWord: "Warning",
  hazardStatements: ["H280 · Contains gas under pressure; may explode if heated"],
  hazardSummary: "Non-flammable · Asphyxiant",
  documents: mixDocs("3.2", "2025-11-18"),
  properties: [
    { label: "Nominal composition", value: "75 % Ar · 25 % CO₂" },
    { label: "ISO 14175 designation", value: "M21-ArC-25" },
    { label: "Mean molecular weight", value: { value: "40.96", unit: "g/mol" } },
    { label: "Gas density @ 15 °C", value: { value: "1.712", unit: "kg/m³" } },
    { label: "Specific gravity (air = 1)", value: { value: "1.414" } },
    { label: "Typical flow rate", value: { value: "25 – 35", unit: "CFH" } },
    { label: "Appearance & odour", value: "Colourless, odourless" },
    { label: "Exposure limit", value: "CO₂ 5,000 ppm TWA (ACGIH)" },
  ],
  impuritySpecies: MIX_SPECIES,
  grades: [
    { name: "Welding", minPurity: "99.8", impurities: { h2o: "32.0", o2: "20.0", n2: "50.0" }, conformsTo: "ISO 14175-M21-ArC-25", certificateOfAnalysis: "On request" },
  ],
  packages: [
    pkg({ size: "300 Large", sku: "MX-7525-300L", container: "High-pressure steel", spec: "TC-3AAM2265", contents: dv("9.51", "m³", "336", "ft³"), fill: P2265, cga: "580", tare: T300, shape: "cylinder-300" }),
    pkg({ size: "150 Medium", sku: "MX-7525-150M", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("4.28", "m³", "151", "ft³"), fill: P2015, cga: "580", tare: T150, shape: "cylinder-150" }),
    pkg({ size: "80", sku: "MX-7525-080", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("2.24", "m³", "79.0", "ft³"), fill: P2015, cga: "580", tare: T80, shape: "cylinder-80" }),
    pkg({ size: "40", sku: "MX-7525-040", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("1.13", "m³", "40.0", "ft³"), fill: P2015, cga: "580", tare: T40, shape: "cylinder-40" }),
    pkg({ size: "20", sku: "MX-7525-020", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("0.57", "m³", "20.0", "ft³"), fill: P2015, cga: "580", tare: dv("5.9", "kg", "13", "lb"), shape: "cylinder-20" }),
    pkg({ size: "BP-14 bulk pack", sku: "MX-7525-BP14", container: "Manifolded pallet", spec: "14 × TC-3AAM2265", contents: dv("133", "m³", "4,704", "ft³"), fill: P2265, cga: "580", tare: dv("1,043", "kg", "2,300", "lb"), availability: "Ask us", shape: "bulk-pack" }),
  ],
  applications: [
    { heading: "Short-circuit GMAW", items: ["Structural carbon steel 3 mm and up", "Out-of-position fillet welds", "Work with mill scale or light surface rust", "General repair and maintenance welding"] },
    { heading: "Spray transfer GMAW", items: ["Heavy plate in flat and horizontal positions", "High deposition-rate production welding"] },
    { heading: "Flux-cored", items: ["Gas-shielded FCAW on structural steel", "Robotic and hard-automation cells"] },
  ],
  processes: ["GMAW / MIG", "FCAW"],
  industries: ["Metal fabrication", "Construction", "Automotive", "Manufacturing"],
  safety: mixSafety("This mixture"),
  compatibility: mixCompat("Standard inert-mix connection. Ar-CO₂ mixes take CGA 580 — not CGA 660."),
  relatedSlugs: ["ar-co2-92-8", "argon", "carbon-dioxide", "ar-o2-98-2"],
  featuredRank: 2,
  featuredBadge: "Welding",
  faq: [
    { question: "When should I switch from 75/25 to 92/8?", answer: "When spatter or appearance starts costing you cleanup time, or when you move to thinner material. 92/8 gives a cooler, narrower arc with far less spatter and a tidier bead — better for sheet metal and visible welds. 75/25 stays the better choice for heavy plate and dirty steel." },
    { question: "Can I use 75/25 for TIG?", answer: "No. Carbon dioxide in any proportion will destroy a tungsten electrode almost immediately and contaminate the weld. TIG on steel and stainless needs pure argon, ISO 14175-I1." },
    { question: "What flow rate should I set?", answer: "25–35 CFH covers most work with a standard nozzle. Higher flow does not improve coverage — past roughly 40 CFH the gas stream becomes turbulent and actually draws air into the weld zone." },
  ],
  metaDescription: "75/25 Ar-CO₂ (UN1956), ISO 14175-M21-ArC-25 shielding mix. Six configurations, CGA 580, composition and flow-rate guidance published.",
};

export const arCo2_928: Product = {
  slug: "ar-co2-92-8",
  name: "92/8 Ar-CO₂",
  formula: null,
  tagline: "ISO 14175 M20 mix for thin sheet and low-spatter work",
  categorySlug: "welding-mixes",
  badge: "Welding mix",
  status: "ACTIVE",
  synonyms: "92/8 · C8 · M20-ArC-8",
  overview: [
    "A low-carbon-dioxide shielding mix for GMAW where bead appearance and spatter matter more than penetration. Eight percent CO₂ narrows the arc cone and drops spatter substantially against 75/25, at the cost of a shallower penetration profile.",
    "Designated M20-ArC-8 under ISO 14175. Standard choice for automotive sheet, thin-gauge fabrication and any weld that will be seen. Supports both short-circuit and spray transfer, with a lower spray-transition current than 75/25.",
  ],
  unNumber: "UN1956",
  cas: null,
  tdgClass: "2.2",
  properShippingName: "Compressed gas, n.o.s. (argon, carbon dioxide)",
  erapRequired: false,
  pictograms: ["compressed-gas"],
  signalWord: "Warning",
  hazardStatements: ["H280 · Contains gas under pressure; may explode if heated"],
  hazardSummary: "Non-flammable · Asphyxiant",
  documents: mixDocs("2.9", "2025-11-18"),
  properties: [
    { label: "Nominal composition", value: "92 % Ar · 8 % CO₂" },
    { label: "ISO 14175 designation", value: "M20-ArC-8" },
    { label: "Mean molecular weight", value: { value: "40.27", unit: "g/mol" } },
    { label: "Gas density @ 15 °C", value: { value: "1.683", unit: "kg/m³" } },
    { label: "Specific gravity (air = 1)", value: { value: "1.391" } },
    { label: "Typical flow rate", value: { value: "20 – 30", unit: "CFH" } },
    { label: "Appearance & odour", value: "Colourless, odourless" },
  ],
  impuritySpecies: MIX_SPECIES,
  grades: [
    { name: "Welding", minPurity: "99.8", impurities: { h2o: "32.0", o2: "20.0", n2: "50.0" }, conformsTo: "ISO 14175-M20-ArC-8", certificateOfAnalysis: "On request" },
  ],
  packages: [
    pkg({ size: "300 Large", sku: "MX-9208-300L", container: "High-pressure steel", spec: "TC-3AAM2265", contents: dv("9.51", "m³", "336", "ft³"), fill: P2265, cga: "580", tare: T300, shape: "cylinder-300" }),
    pkg({ size: "150 Medium", sku: "MX-9208-150M", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("4.28", "m³", "151", "ft³"), fill: P2015, cga: "580", tare: T150, shape: "cylinder-150" }),
    pkg({ size: "80", sku: "MX-9208-080", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("2.24", "m³", "79.0", "ft³"), fill: P2015, cga: "580", tare: T80, shape: "cylinder-80" }),
    pkg({ size: "40", sku: "MX-9208-040", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("1.13", "m³", "40.0", "ft³"), fill: P2015, cga: "580", tare: T40, shape: "cylinder-40" }),
  ],
  applications: [
    { heading: "Sheet & light-gauge GMAW", items: ["Automotive body and exhaust work", "HVAC ductwork and light enclosures", "Cosmetic and visible welds", "Thin-gauge tube and tubing frames"] },
    { heading: "Spray transfer", items: ["Lower spray-transition current than 75/25", "Robotic welding where spatter fouls nozzles"] },
  ],
  processes: ["GMAW / MIG"],
  industries: ["Automotive", "Metal fabrication", "HVAC & mechanical", "Manufacturing"],
  safety: mixSafety("This mixture"),
  compatibility: mixCompat("Standard inert-mix connection. Ar-CO₂ mixes take CGA 580 — not CGA 660."),
  relatedSlugs: ["ar-co2-75-25", "ar-o2-98-2", "argon", "carbon-dioxide"],
  featuredRank: null,
  featuredBadge: null,
  faq: [
    { question: "Will 92/8 penetrate heavy plate?", answer: "Not as well as 75/25. The lower CO₂ content narrows the arc and reduces penetration depth. On material above roughly 6 mm where strength matters more than appearance, 75/25 is the better mix." },
  ],
  metaDescription: "92/8 Ar-CO₂ (UN1956), ISO 14175-M20-ArC-8 low-spatter shielding mix. Four configurations, CGA 580, composition published.",
};

export const arO2_982: Product = {
  slug: "ar-o2-98-2",
  name: "98/2 Ar-O₂",
  formula: null,
  tagline: "ISO 14175 M13 mix for spray transfer on stainless",
  categorySlug: "welding-mixes",
  badge: "Welding mix",
  status: "ACTIVE",
  synonyms: "98/2 · M13-ArO-2 · Argon-oxygen 98/2",
  overview: [
    "Two percent oxygen stabilises the arc and improves wetting on stainless steel without introducing the carbon pickup that a CO₂ mix would. That makes it the standard spray-transfer mix for austenitic stainless where corrosion resistance must be preserved.",
    "Designated M13-ArO-2 under ISO 14175. The small oxygen addition lowers surface tension in the weld pool, which flattens the bead profile and reduces undercut at the toes. Not suitable for short-circuit transfer.",
  ],
  unNumber: "UN1956",
  cas: null,
  tdgClass: "2.2",
  properShippingName: "Compressed gas, n.o.s. (argon, oxygen)",
  erapRequired: false,
  pictograms: ["compressed-gas"],
  signalWord: "Warning",
  hazardStatements: ["H280 · Contains gas under pressure; may explode if heated"],
  hazardSummary: "Non-flammable · Asphyxiant",
  documents: mixDocs("2.5", "2025-10-30"),
  properties: [
    { label: "Nominal composition", value: "98 % Ar · 2 % O₂" },
    { label: "ISO 14175 designation", value: "M13-ArO-2" },
    { label: "Mean molecular weight", value: { value: "39.79", unit: "g/mol" } },
    { label: "Gas density @ 15 °C", value: { value: "1.663", unit: "kg/m³" } },
    { label: "Specific gravity (air = 1)", value: { value: "1.374" } },
    { label: "Typical flow rate", value: { value: "25 – 35", unit: "CFH" } },
    { label: "Appearance & odour", value: "Colourless, odourless" },
  ],
  impuritySpecies: MIX_SPECIES,
  grades: [
    { name: "Welding", minPurity: "99.8", impurities: { h2o: "20.0", n2: "40.0" }, conformsTo: "ISO 14175-M13-ArO-2", certificateOfAnalysis: "On request" },
  ],
  packages: [
    pkg({ size: "300 Large", sku: "MX-9802-300L", container: "High-pressure steel", spec: "TC-3AAM2265", contents: dv("9.51", "m³", "336", "ft³"), fill: P2265, cga: "580", tare: T300, shape: "cylinder-300" }),
    pkg({ size: "150 Medium", sku: "MX-9802-150M", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("4.28", "m³", "151", "ft³"), fill: P2015, cga: "580", tare: T150, shape: "cylinder-150" }),
    pkg({ size: "80", sku: "MX-9802-080", container: "High-pressure steel", spec: "TC-3AA2015", contents: dv("2.24", "m³", "79.0", "ft³"), fill: P2015, cga: "580", tare: T80, availability: "Available to order", shape: "cylinder-80" }),
  ],
  applications: [
    { heading: "Stainless GMAW", items: ["Spray transfer on 304 and 316 austenitic stainless", "Food and pharmaceutical equipment fabrication", "Architectural stainless where finish matters"] },
    { heading: "Carbon steel", items: ["Spray transfer where CO₂ pickup is unacceptable", "High-deposition production on clean plate"] },
  ],
  processes: ["GMAW / MIG"],
  industries: ["Metal fabrication", "Food & beverage", "Manufacturing", "Aerospace"],
  safety: mixSafety("This mixture"),
  compatibility: mixCompat("Standard inert-mix connection. Oxygen content below 23.5 % keeps this on CGA 580."),
  relatedSlugs: ["ar-co2-75-25", "argon", "ar-co2-92-8", "helium"],
  featuredRank: null,
  featuredBadge: null,
  faq: [
    { question: "Why oxygen rather than CO₂ for stainless?", answer: "Carbon dioxide dissociates in the arc and puts carbon into the weld metal, which forms chromium carbides and reduces corrosion resistance. Two percent oxygen gives the same arc-stabilising and wetting benefit with no carbon pickup." },
    { question: "Can I run 98/2 in short-circuit transfer?", answer: "It is not recommended. The mix is formulated for spray transfer; in short-circuit mode the arc becomes erratic and spatter increases. Use 75/25 or 92/8 for short-arc work." },
  ],
  metaDescription: "98/2 Ar-O₂ (UN1956), ISO 14175-M13-ArO-2 spray-transfer mix for stainless. Three configurations, CGA 580, composition published.",
};
