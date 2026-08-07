import type { Product } from "@/lib/types";
import { dv, pkg, P2015, NEVER_STANDARD, REQUAL_STEEL, STORAGE_STANDARD } from "./_helpers";

/**
 * Cutting & fuel gases.
 *   Acetylene UN1001 · CAS 74-86-2  · TDG 2.1 · CGA 510
 *   Propane   UN1978 · CAS 74-98-6  · TDG 2.1 · CGA 510 (vapour) / 555 (liquid)
 *   Propylene UN1077 · CAS 115-07-1 · TDG 2.1 · CGA 510
 *
 * Acetylene's 15 psig / 103 kPa ceiling is a hard safety limit, not a
 * recommendation: above it acetylene decomposes explosively without any oxidiser
 * present. It carries H230 for exactly this reason.
 */

const FUEL_PPE = ["Welding goggles or helmet", "Leather gloves and sleeves", "Flame-resistant clothing", "Safety footwear"];

const fuelDocs = (v: string, d: string, phase: string, phaseFr: string) => [
  { title: "Safety Data Sheet", phase, language: "EN" as const, version: v, revised: d },
  { title: "Fiche de données de sécurité", phase: phaseFr, language: "FR" as const, version: v, revised: d },
];

export const acetylene: Product = {
  slug: "acetylene",
  name: "Acetylene",
  formula: "C2H2",
  tagline: "Dissolved fuel gas for oxy-fuel cutting and brazing",
  categorySlug: "cutting-fuel",
  badge: "Fuel gas",
  status: "ACTIVE",
  synonyms: "Acetylene · C₂H₂ · Ethyne · Dissolved acetylene",
  overview: [
    "Acetylene burns hotter in oxygen than any other commercial fuel gas — around 3,100 °C in a neutral flame — which is why it remains the standard for oxy-fuel cutting, brazing and flame heating despite being the most demanding fuel gas to handle.",
    "It cannot be compressed as a free gas. An acetylene cylinder is filled with a monolithic porous mass saturated with acetone, and the acetylene dissolves into the acetone. That is why an acetylene cylinder must always stand upright: laid on its side, liquid acetone is drawn into the regulator and torch.",
    "Withdrawal rate is limited to about one tenth of cylinder capacity per hour. Draw faster and acetone comes over with the gas, degrading the flame and depleting the cylinder's solvent charge permanently. For heavy continuous cutting, manifold several cylinders rather than pushing one.",
  ],
  unNumber: "UN1001",
  cas: "74-86-2",
  tdgClass: "2.1",
  properShippingName: "Acetylene, dissolved",
  erapRequired: true,
  pictograms: ["flammable", "compressed-gas"],
  signalWord: "Danger",
  hazardStatements: [
    "H220 · Extremely flammable gas",
    "H230 · May react explosively even in the absence of air",
    "H280 · Contains gas under pressure; may explode if heated",
  ],
  hazardSummary: "Extremely flammable",
  documents: fuelDocs("3.1", "2026-02-11", "Dissolved", "Dissous"),
  properties: [
    { label: "Molecular weight", value: { value: "26.038", unit: "g/mol" } },
    { label: "Gas density @ 15 °C", value: { value: "1.097", unit: "kg/m³" } },
    { label: "Sublimation point", value: dv("−84.0", "°C", "−119.2", "°F") },
    { label: "Specific gravity (air = 1)", value: { value: "0.907" } },
    { label: "Critical temperature", value: { value: "35.2", unit: "°C" } },
    { label: "Critical pressure", value: { value: "6,139", unit: "kPa" } },
    { label: "Flammable range in air", value: { value: "2.5 – 100", unit: "%" } },
    { label: "Autoignition temperature", value: { value: "305", unit: "°C" } },
    { label: "Maximum delivery pressure", value: { value: "103 kPa · 15", unit: "psig" } },
    { label: "Maximum withdrawal rate", value: "1/10 of cylinder capacity per hour" },
    { label: "Neutral flame temperature in O₂", value: { value: "3,100", unit: "°C" } },
    { label: "Appearance & odour", value: "Colourless; garlic-like odour from impurities" },
  ],
  impuritySpecies: [
    { key: "ph3", label: "PH₃", formula: "PH3" },
    { key: "h2s", label: "H₂S", formula: "H2S" },
  ],
  grades: [
    { name: "Welding", minPurity: "98.0", impurities: { ph3: "500.0", h2s: "500.0" }, conformsTo: "CGA G-1.1 Grade B", certificateOfAnalysis: "On request" },
  ],
  packages: [
    pkg({ size: "WS", sku: "AC-WS", container: "Acetylene cylinder", spec: "TC-8AL", contents: dv("8.5", "m³", "300", "ft³"), fill: dv("1,724", "kPa", "250", "psig"), cga: "510", tare: dv("104", "kg", "229", "lb"), shape: "cylinder-300" }),
    pkg({ size: "#4", sku: "AC-004", container: "Acetylene cylinder", spec: "TC-8AL", contents: dv("4.2", "m³", "148", "ft³"), fill: dv("1,724", "kPa", "250", "psig"), cga: "510", tare: dv("62", "kg", "137", "lb"), shape: "cylinder-150" }),
    pkg({ size: "#3", sku: "AC-003", container: "Acetylene cylinder", spec: "TC-8AL", contents: dv("2.8", "m³", "100", "ft³"), fill: dv("1,724", "kPa", "250", "psig"), cga: "510", tare: dv("43", "kg", "95", "lb"), shape: "cylinder-80" }),
    pkg({ size: "B", sku: "AC-B", container: "Acetylene cylinder", spec: "TC-8AL", contents: dv("1.1", "m³", "40.0", "ft³"), fill: dv("1,724", "kPa", "250", "psig"), cga: "510", tare: dv("19", "kg", "42", "lb"), shape: "cylinder-40" }),
    pkg({ size: "MC", sku: "AC-MC", container: "Acetylene cylinder", spec: "TC-8AL", contents: dv("0.28", "m³", "10.0", "ft³"), fill: dv("1,724", "kPa", "250", "psig"), cga: "520", tare: dv("6.8", "kg", "15", "lb"), shape: "cylinder-20" }),
  ],
  applications: [
    { heading: "Cutting & heating", items: ["Oxy-acetylene cutting to 300 mm plate", "Flame heating and straightening", "Scarfing and gouging", "Rivet and bolt cutting"] },
    { heading: "Joining", items: ["Brazing and silver soldering", "Oxy-acetylene welding of thin steel", "Hardfacing and surfacing"] },
    { heading: "Analytical", items: ["Atomic absorption spectroscopy fuel", "Flame photometry"] },
  ],
  processes: ["Oxy-fuel cutting", "Brazing", "Flame heating"],
  industries: ["Metal fabrication", "Construction", "HVAC & mechanical", "Materials handling"],
  safety: {
    oxygenDisplacementWarning: false,
    callout: {
      title: "Never exceed 15 psig — acetylene decomposes explosively",
      body: "Above 103 kPa (15 psig) acetylene can decompose explosively with no oxidiser present at all. Set the regulator below 15 psig and never adjust it higher to compensate for a long hose. Always use the cylinder upright, fit flashback arrestors at both the regulator and the torch, and never draw more than one tenth of the cylinder's capacity per hour.",
    },
    storage: "Store and use upright only — never on its side. Secure by chain or strap in a ventilated area away from heat and at least 6.1 m from oxygen or behind a rated barrier. Keep below 52 °C.",
    segregation: "Separate from oxygen and other oxidizers by 6.1 m (20 ft) or a non-combustible barrier with a 30-minute rating, per CGA P-1.",
    leakDetection: "Distinctive garlic-like odour, but never rely on smell. Use a soap solution on all fittings; never a flame.",
    ppe: FUEL_PPE,
    never: [
      "Use a cylinder on its side, or within 30 minutes of laying it down",
      "Exceed 15 psig delivery pressure",
      "Use copper or high-copper alloys in the gas path",
      ...NEVER_STANDARD,
    ],
    requalification: "Acetylene cylinders requalify at 10-year intervals by visual inspection of shell and porous mass under CSA B339/B340.",
  },
  compatibility: {
    cga: "510",
    cgaThread: '.825"-14 NGO-LH-INT',
    cgaNote: "Left-hand thread marks fuel-gas service. MC-size cylinders use CGA 520.",
    recommendedEquipment: [
      "Single-stage fuel-gas regulator, 0–15 psig delivery",
      "Flashback arrestors at both regulator and torch",
      "Grade T twin hose rated for acetylene",
    ],
    compatibleMaterials: "Carbon steel, stainless steel, brass under 65 % copper",
    incompatible: "Copper and high-copper alloys — forms explosive copper acetylide; silver; mercury; oxidizers; chlorine",
  },
  relatedSlugs: ["oxygen", "propane", "propylene", "ar-co2-75-25"],
  featuredRank: 5,
  featuredBadge: "Cutting",
  faq: [
    { question: "Why must an acetylene cylinder stay upright?", answer: "The acetylene is dissolved in acetone held in a porous mass. Lying down, liquid acetone reaches the valve and is drawn into the regulator and torch — the flame deteriorates and the cylinder permanently loses solvent. If a cylinder has been on its side, stand it upright for at least 30 minutes before use." },
    { question: "What happens above 15 psig?", answer: "Acetylene becomes unstable and can decompose explosively without any oxygen present. This is why acetylene carries hazard statement H230 and why fuel-gas regulators for it are built with a 15 psig maximum outlet." },
    { question: "Why can't I use copper fittings?", answer: "Acetylene reacts with copper to form copper acetylide, a shock-sensitive explosive compound. Keep brass below 65 % copper and use steel or stainless elsewhere in the gas path." },
    { question: "Should I use acetylene or propane for cutting?", answer: "Acetylene for anything needing a fast pierce, precise heat or brazing — its flame is hotter and more concentrated. Propane for high-volume straight cutting and heavy preheat, where its lower cost and higher total heat output win and pierce time matters less." },
  ],
  metaDescription: "Acetylene (UN1001, CAS 74-86-2) dissolved fuel gas. Five cylinder sizes, CGA 510, 15 psig limit, withdrawal-rate and copper-incompatibility guidance published.",
};

export const propane: Product = {
  slug: "propane",
  name: "Propane",
  formula: "C3H8",
  tagline: "Cutting, heating and forklift fuel in vapour and liquid service",
  categorySlug: "cutting-fuel",
  badge: "Fuel gas",
  status: "ACTIVE",
  synonyms: "Propane · C₃H₈ · LPG · HD-5",
  overview: [
    "Propane delivers more total heat per cubic metre than acetylene but at a lower flame temperature, which makes it the economical choice for high-volume straight cutting, heavy preheat and general flame heating. Pierce time is longer, so it suits production cutting more than intricate work.",
    "Supplied as a liquefied gas under its own vapour pressure. Cylinder pressure therefore tracks ambient temperature rather than contents — a gauge tells you the temperature, not how full the cylinder is. Weigh a propane cylinder to know what is left.",
    "HD-5 grade is specified at not less than 90 % propane with propylene limited to 5 %, which is the standard for engine fuel including forklifts.",
  ],
  unNumber: "UN1978",
  cas: "74-98-6",
  tdgClass: "2.1",
  properShippingName: "Propane",
  erapRequired: false,
  pictograms: ["flammable", "compressed-gas"],
  signalWord: "Danger",
  hazardStatements: [
    "H220 · Extremely flammable gas",
    "H280 · Contains gas under pressure; may explode if heated",
  ],
  hazardSummary: "Extremely flammable",
  documents: fuelDocs("4.1", "2025-08-27", "Liquefied", "Liquéfié"),
  properties: [
    { label: "Molecular weight", value: { value: "44.096", unit: "g/mol" } },
    { label: "Gas density @ 15 °C", value: { value: "1.882", unit: "kg/m³" } },
    { label: "Boiling point", value: dv("−42.1", "°C", "−43.8", "°F") },
    { label: "Liquid density @ 25 °C", value: { value: "0.493", unit: "kg/L" } },
    { label: "Specific gravity (air = 1)", value: { value: "1.55" } },
    { label: "Critical temperature", value: { value: "96.7", unit: "°C" } },
    { label: "Critical pressure", value: { value: "4,248", unit: "kPa" } },
    { label: "Flammable range in air", value: { value: "2.1 – 9.5", unit: "%" } },
    { label: "Autoignition temperature", value: { value: "470", unit: "°C" } },
    { label: "Neutral flame temperature in O₂", value: { value: "2,828", unit: "°C" } },
    { label: "Vapour pressure @ 21 °C", value: dv("853", "kPa", "124", "psig") },
    { label: "Appearance & odour", value: "Colourless; ethyl mercaptan odourant added" },
  ],
  impuritySpecies: [
    { key: "c3h6", label: "Propylene", formula: "C3H6" },
    { key: "h2o", label: "H₂O", formula: "H2O" },
  ],
  grades: [
    { name: "Commercial", minPurity: "95.0", impurities: {}, conformsTo: "CAN/CGSB-3.14", certificateOfAnalysis: "On request" },
    { name: "HD-5 engine fuel", minPurity: "90.0", impurities: { c3h6: "50000.0" }, conformsTo: "CAN/CGSB-3.14 HD-5", certificateOfAnalysis: "On request" },
  ],
  packages: [
    pkg({ size: "20 lb", sku: "PR-020", container: "Forklift cylinder", spec: "TC-4BA240", contents: dv("9.1", "kg", "20", "lb"), fill: dv("853", "kPa", "124", "psig"), cga: "510", tare: dv("8.2", "kg", "18", "lb"), shape: "cylinder-40" }),
    pkg({ size: "33 lb forklift", sku: "PR-033FL", container: "Forklift cylinder", spec: "TC-4BA240", contents: dv("15.0", "kg", "33", "lb"), fill: dv("853", "kPa", "124", "psig"), cga: "555", tare: dv("13.6", "kg", "30", "lb"), shape: "cylinder-40" }),
    pkg({ size: "100 lb", sku: "PR-100", container: "Forklift cylinder", spec: "TC-4BA240", contents: dv("45.4", "kg", "100", "lb"), fill: dv("853", "kPa", "124", "psig"), cga: "510", tare: dv("32", "kg", "71", "lb"), shape: "cylinder-150" }),
    pkg({ size: "420 lb", sku: "PR-420", container: "Forklift cylinder", spec: "TC-4BA240", contents: dv("191", "kg", "420", "lb"), fill: dv("853", "kPa", "124", "psig"), cga: "555", tare: dv("136", "kg", "300", "lb"), availability: "Available to order", shape: "cylinder-300" }),
    pkg({ size: "Bulk tank", sku: "PR-BULK", container: "Microbulk / bulk", spec: "Site vessel", contents: dv("1,000–5,000", "L", "264–1,321", "gal"), fill: dv("853", "kPa", "124", "psig"), cga: "555", availability: "Ask us", shape: "dewar" }),
  ],
  applications: [
    { heading: "Cutting & heating", items: ["High-volume straight-line oxy-fuel cutting", "Heavy plate preheat", "Flame heating and paint stripping", "Roofing and asphalt work"] },
    { heading: "Materials handling", items: ["Forklift engine fuel — HD-5 grade", "Floor sweepers and burnishers"] },
    { heading: "Construction", items: ["Temporary space and salamander heaters", "Concrete curing and ground thawing"] },
  ],
  processes: ["Oxy-fuel cutting", "Flame heating"],
  industries: ["Construction", "Materials handling", "Metal fabrication", "HVAC & mechanical"],
  safety: {
    oxygenDisplacementWarning: false,
    callout: {
      title: "Heavier than air — vapour pools at floor level",
      body: "Propane vapour is one and a half times heavier than air. A leak sinks and collects in pits, trenches, basements and drains, where it can travel a considerable distance to an ignition source. Never store propane below grade, ventilate at floor level, and place gas detection low.",
    },
    storage: "Store upright, outdoors or in an approved ventilated enclosure, never below grade or in a basement. Secure against tipping and keep below 52 °C.",
    segregation: "Separate from oxidizers by 6.1 m (20 ft) or a rated barrier, per CGA P-1. Keep clear of building openings and drains.",
    leakDetection: "Ethyl mercaptan odourant gives a strong sulfurous smell. Confirm with a soap solution or an electronic detector at floor level.",
    ppe: FUEL_PPE,
    never: ["Store or use below grade", "Transport a cylinder lying down in an enclosed vehicle", ...NEVER_STANDARD],
    requalification: "Forklift and LP cylinders requalify at 10-year intervals by visual inspection under CSA B339/B340.",
  },
  compatibility: {
    cga: "510",
    cgaThread: '.825"-14 NGO-LH-INT',
    cgaNote: "Vapour withdrawal uses CGA 510. Liquid withdrawal for forklifts and bulk uses CGA 555.",
    recommendedEquipment: ["Single-stage fuel-gas regulator, 0–20 psig", "Flashback arrestors for oxy-fuel service", "Grade T hose rated for LPG"],
    compatibleMaterials: "Carbon steel, stainless steel, brass, copper",
    incompatible: "Natural rubber and most elastomers — use LPG-rated seals; oxidizers",
  },
  relatedSlugs: ["acetylene", "propylene", "oxygen"],
  featuredRank: null,
  featuredBadge: null,
  faq: [
    { question: "How do I tell how much propane is left?", answer: "Weigh it. Propane is a liquefied gas, so cylinder pressure reflects ambient temperature, not contents — a full and a quarter-full cylinder read the same pressure at the same temperature. Subtract the tare weight stamped on the collar from the total weight." },
    { question: "Can I use propane for brazing?", answer: "For large-area preheat, yes. For brazing proper, acetylene's hotter and more concentrated flame gives far better control and faster joint heating. Propane's lower flame temperature makes it slow to bring a small joint to brazing heat." },
    { question: "Why does my forklift cylinder have a different connection?", answer: "Forklift cylinders draw liquid rather than vapour, so they use CGA 555, a liquid-withdrawal connection, and must be mounted with the locating pin engaged so the pickup tube sits in the liquid." },
  ],
  metaDescription: "Propane (UN1978, CAS 74-98-6) in commercial and HD-5 engine-fuel grades. Five configurations, CGA 510 and 555, full flammability and vapour-pressure data published.",
};

export const propylene: Product = {
  slug: "propylene",
  name: "Propylene",
  formula: "C3H6",
  tagline: "Higher-temperature alternative to propane for cutting",
  categorySlug: "cutting-fuel",
  badge: "Fuel gas",
  status: "ACTIVE",
  synonyms: "Propylene · C₃H₆ · Propene",
  overview: [
    "Propylene sits between propane and acetylene. Its neutral flame in oxygen reaches about 2,900 °C — hotter than propane, cooler than acetylene — with a higher total heat output than acetylene per cubic metre.",
    "That combination makes it a good compromise for shops that want faster pierce times than propane without acetylene's handling restrictions. It uses the same CGA 510 connection and the same fuel-gas regulators as propane.",
  ],
  unNumber: "UN1077",
  cas: "115-07-1",
  tdgClass: "2.1",
  properShippingName: "Propylene",
  erapRequired: false,
  pictograms: ["flammable", "compressed-gas"],
  signalWord: "Danger",
  hazardStatements: [
    "H220 · Extremely flammable gas",
    "H280 · Contains gas under pressure; may explode if heated",
  ],
  hazardSummary: "Extremely flammable",
  documents: fuelDocs("2.2", "2025-07-14", "Liquefied", "Liquéfié"),
  properties: [
    { label: "Molecular weight", value: { value: "42.081", unit: "g/mol" } },
    { label: "Gas density @ 15 °C", value: { value: "1.796", unit: "kg/m³" } },
    { label: "Boiling point", value: dv("−47.6", "°C", "−53.7", "°F") },
    { label: "Liquid density @ 25 °C", value: { value: "0.505", unit: "kg/L" } },
    { label: "Specific gravity (air = 1)", value: { value: "1.48" } },
    { label: "Critical temperature", value: { value: "91.6", unit: "°C" } },
    { label: "Critical pressure", value: { value: "4,600", unit: "kPa" } },
    { label: "Flammable range in air", value: { value: "2.0 – 11.1", unit: "%" } },
    { label: "Autoignition temperature", value: { value: "455", unit: "°C" } },
    { label: "Neutral flame temperature in O₂", value: { value: "2,900", unit: "°C" } },
    { label: "Appearance & odour", value: "Colourless; faint sweet petroleum odour" },
  ],
  impuritySpecies: [{ key: "h2o", label: "H₂O", formula: "H2O" }],
  grades: [
    { name: "Industrial", minPurity: "95.0", impurities: {}, conformsTo: "CGA G-13", certificateOfAnalysis: "On request" },
  ],
  packages: [
    pkg({ size: "100 lb", sku: "PY-100", container: "Forklift cylinder", spec: "TC-4BA240", contents: dv("45.4", "kg", "100", "lb"), fill: dv("1,000", "kPa", "145", "psig"), cga: "510", tare: dv("32", "kg", "71", "lb"), shape: "cylinder-150" }),
    pkg({ size: "45 lb", sku: "PY-045", container: "Forklift cylinder", spec: "TC-4BA240", contents: dv("20.4", "kg", "45", "lb"), fill: dv("1,000", "kPa", "145", "psig"), cga: "510", tare: dv("18", "kg", "40", "lb"), availability: "Available to order", shape: "cylinder-40" }),
  ],
  applications: [
    { heading: "Cutting & heating", items: ["Production oxy-fuel cutting", "Heavy preheat and stress relief", "Flame straightening"] },
    { heading: "Process", items: ["Polypropylene feedstock", "Chemical synthesis"] },
  ],
  processes: ["Oxy-fuel cutting", "Flame heating"],
  industries: ["Metal fabrication", "Construction", "Manufacturing"],
  safety: {
    oxygenDisplacementWarning: false,
    callout: {
      title: "Heavier than air — vapour pools at floor level",
      body: "Propylene vapour is roughly one and a half times heavier than air and collects in low-lying spaces where it can reach an ignition source some distance away. Ventilate at floor level and never store below grade.",
    },
    storage: "Store upright, outdoors or in an approved ventilated enclosure, never below grade. Secure against tipping and keep below 52 °C.",
    segregation: "Separate from oxidizers by 6.1 m (20 ft) or a rated barrier, per CGA P-1.",
    leakDetection: "Faint odour only — do not rely on smell. Use a soap solution or an electronic detector at floor level.",
    ppe: FUEL_PPE,
    never: ["Store or use below grade", ...NEVER_STANDARD],
    requalification: "LP cylinders requalify at 10-year intervals by visual inspection under CSA B339/B340.",
  },
  compatibility: {
    cga: "510",
    cgaThread: '.825"-14 NGO-LH-INT',
    cgaNote: "Same fuel-gas connection and regulators as propane.",
    recommendedEquipment: ["Single-stage fuel-gas regulator, 0–30 psig", "Flashback arrestors at regulator and torch", "Propylene-compatible cutting tips"],
    compatibleMaterials: "Carbon steel, stainless steel, brass",
    incompatible: "Natural rubber and most elastomers; oxidizers; copper in the presence of moisture",
  },
  relatedSlugs: ["propane", "acetylene", "oxygen"],
  featuredRank: null,
  featuredBadge: null,
  faq: [
    { question: "Do I need different cutting tips for propylene?", answer: "Yes. Propylene needs tips designed for its burn velocity and gas ratio — an acetylene tip will not perform correctly and may sustain internal burning. Propane tips are usually suitable; confirm with the tip manufacturer's chart." },
  ],
  metaDescription: "Propylene (UN1077, CAS 115-07-1) fuel gas for production cutting and preheat. CGA 510, two configurations, full flammability data published.",
};
