import type { Product } from "@/lib/types";

/**
 * Argon — the reference record. Every figure below is a published reference
 * value for argon, cross-checked against the design document (which carried
 * accurate argon data throughout).
 *
 *   UN1006 · CAS 7440-37-1 · TDG 2.2 · CGA 580
 *   Standards: CGA G-11.1 (Commodity Specification for Argon), ISO 14175-I1.
 */
export const argon: Product = {
  slug: "argon",
  name: "Argon",
  formula: "Ar",
  tagline: "Inert shielding gas for TIG, MIG and heat treatment",
  categorySlug: "industrial-pure",
  badge: "Industrial",
  status: "ACTIVE",
  synonyms: "Argon gas · Ar · Compressed argon",
  overview: [
    "Argon is a monatomic, chemically inert gas that makes up just under one percent of the atmosphere. It is the default shielding gas wherever a weld pool must be kept entirely away from oxygen and nitrogen, and the default plasma gas wherever a stable, non-reactive arc is needed.",
    "The four grades below differ only in impurity limits, not in composition. Welding grade is specified against ISO 14175-I1 and suits every GTAW and GMAW application on carbon steel, stainless and aluminum. The High Purity and UHP grades tighten moisture, oxygen and hydrocarbon limits for ICP spectrometry, gas chromatography and glovebox service, where a few ppm of water shifts a baseline.",
    "Argon is supplied as a compressed gas in high-pressure steel cylinders and as a refrigerated liquid in dewars and microbulk vessels. Liquid service is the economical route above roughly six size-300 cylinders a week.",
  ],

  unNumber: "UN1006",
  cas: "7440-37-1",
  tdgClass: "2.2",
  properShippingName: "Argon, compressed",
  erapRequired: false,
  pictograms: ["compressed-gas"],
  signalWord: "Warning",
  hazardStatements: [
    "H280 · Contains gas under pressure; may explode if heated",
  ],
  hazardSummary: "Inert · Asphyxiant",
  documents: [
    { title: "Safety Data Sheet", phase: "Compressed", language: "EN", version: "4.2", revised: "2025-11-04" },
    { title: "Fiche de données de sécurité", phase: "Comprimé", language: "FR", version: "4.2", revised: "2025-11-04" },
    { title: "Safety Data Sheet", phase: "Refrigerated liquid", language: "EN", version: "2.0", revised: "2025-09-18" },
    { title: "Technical Data Sheet", phase: null, language: "EN", version: "1.4", revised: "2025-06-30" },
  ],

  properties: [
    { label: "Molecular weight", value: { value: "39.948", unit: "g/mol" } },
    { label: "Gas density @ 15 °C", value: { value: "1.669", unit: "kg/m³" } },
    {
      label: "Boiling point",
      value: { metric: "−185.9", metricUnit: "°C", imperial: "−302.6", imperialUnit: "°F" },
    },
    { label: "Liquid density at bp", value: { value: "1.394", unit: "kg/L" } },
    { label: "Triple point", value: { value: "−189.3", unit: "°C" } },
    { label: "Specific gravity (air = 1)", value: { value: "1.38" } },
    { label: "Critical temperature", value: { value: "−122.3", unit: "°C" } },
    { label: "Critical pressure", value: { value: "4,898", unit: "kPa" } },
    { label: "Expansion ratio", value: { value: "1 : 842" } },
    { label: "Water solubility", value: { value: "0.062", unit: "L/L" } },
    { label: "Appearance & odour", value: "Colourless, odourless" },
    { label: "Exposure limit", value: "Simple asphyxiant (ACGIH)" },
  ],

  impuritySpecies: [
    { key: "h2o", label: "H₂O", formula: "H2O" },
    { key: "o2", label: "O₂", formula: "O2" },
    { key: "n2", label: "N₂", formula: "N2" },
    { key: "thc", label: "THC as CH₄", formula: "THC as CH4" },
  ],
  grades: [
    {
      name: "Industrial",
      minPurity: "99.5",
      impurities: {},
      conformsTo: "CGA G-11.1",
      certificateOfAnalysis: "On request",
    },
    {
      name: "Welding",
      minPurity: "99.997",
      impurities: { h2o: "10.5", o2: "5.0", n2: "20.0" },
      conformsTo: "ISO 14175-I1",
      certificateOfAnalysis: "On request",
    },
    {
      name: "High Purity 4.8",
      minPurity: "99.998",
      impurities: { h2o: "5.0", o2: "3.0", n2: "10.0", thc: "1.0" },
      conformsTo: "CGA G-11.1 Type I",
      certificateOfAnalysis: "Per-batch",
    },
    {
      name: "UHP 5.0",
      minPurity: "99.999",
      impurities: { h2o: "3.0", o2: "2.0", n2: "5.0", thc: "0.5" },
      conformsTo: "CGA G-11.1 Grade E",
      certificateOfAnalysis: "Per-batch",
    },
  ],

  packages: [
    {
      size: "300 Large", sku: "AR-300L", container: "High-pressure steel", spec: "TC-3AAM2265",
      contents: { metric: "9.51", metricUnit: "m³", imperial: "336", imperialUnit: "ft³" },
      fillPressure: { metric: "15,616", metricUnit: "kPa", imperial: "2,265", imperialUnit: "psig" },
      cga: "580",
      tare: { metric: "58.0", metricUnit: "kg", imperial: "128", imperialUnit: "lb" },
      availability: "Stocked", shape: "cylinder-300",
    },
    {
      size: "150 Medium", sku: "AR-150M", container: "High-pressure steel", spec: "TC-3AA2015",
      contents: { metric: "4.28", metricUnit: "m³", imperial: "151", imperialUnit: "ft³" },
      fillPressure: { metric: "13,893", metricUnit: "kPa", imperial: "2,015", imperialUnit: "psig" },
      cga: "580",
      tare: { metric: "30.4", metricUnit: "kg", imperial: "67", imperialUnit: "lb" },
      availability: "Stocked", shape: "cylinder-150",
    },
    {
      size: "80", sku: "AR-080", container: "High-pressure steel", spec: "TC-3AA2015",
      contents: { metric: "2.24", metricUnit: "m³", imperial: "79.0", imperialUnit: "ft³" },
      fillPressure: { metric: "13,893", metricUnit: "kPa", imperial: "2,015", imperialUnit: "psig" },
      cga: "580",
      tare: { metric: "17.7", metricUnit: "kg", imperial: "39", imperialUnit: "lb" },
      availability: "Stocked", shape: "cylinder-80",
    },
    {
      size: "40", sku: "AR-040", container: "High-pressure steel", spec: "TC-3AA2015",
      contents: { metric: "1.13", metricUnit: "m³", imperial: "40.0", imperialUnit: "ft³" },
      fillPressure: { metric: "13,893", metricUnit: "kPa", imperial: "2,015", imperialUnit: "psig" },
      cga: "580",
      tare: { metric: "10.9", metricUnit: "kg", imperial: "24", imperialUnit: "lb" },
      availability: "Stocked", shape: "cylinder-40",
    },
    {
      size: "20", sku: "AR-020", container: "High-pressure steel", spec: "TC-3AA2015",
      contents: { metric: "0.57", metricUnit: "m³", imperial: "20.0", imperialUnit: "ft³" },
      fillPressure: { metric: "13,893", metricUnit: "kPa", imperial: "2,015", imperialUnit: "psig" },
      cga: "580",
      tare: { metric: "5.9", metricUnit: "kg", imperial: "13", imperialUnit: "lb" },
      availability: "Stocked", shape: "cylinder-20",
    },
    {
      size: "80 aluminum", sku: "AR-080AL", container: "Aluminum", spec: "TC-3AL2015",
      contents: { metric: "2.24", metricUnit: "m³", imperial: "79.0", imperialUnit: "ft³" },
      fillPressure: { metric: "13,893", metricUnit: "kPa", imperial: "2,015", imperialUnit: "psig" },
      cga: "580",
      tare: { metric: "13.6", metricUnit: "kg", imperial: "30", imperialUnit: "lb" },
      availability: "Available to order", shape: "cylinder-80",
    },
    {
      size: "240 L liquid", sku: "AR-240LC", container: "Cryogenic dewar", spec: "TC-4L230",
      contents: { metric: "240", metricUnit: "L", imperial: "335", imperialUnit: "kg" },
      fillPressure: { metric: "1,586", metricUnit: "kPa", imperial: "230", imperialUnit: "psig" },
      cga: "295",
      tare: { metric: "104", metricUnit: "kg", imperial: "229", imperialUnit: "lb" },
      availability: "Available to order", shape: "dewar",
    },
    {
      size: "BP-14 bulk pack", sku: "AR-BP14", container: "Manifolded pallet", spec: "14 × TC-3AAM2265",
      contents: { metric: "133", metricUnit: "m³", imperial: "4,704", imperialUnit: "ft³" },
      fillPressure: { metric: "15,616", metricUnit: "kPa", imperial: "2,265", imperialUnit: "psig" },
      cga: "580",
      tare: { metric: "1,043", metricUnit: "kg", imperial: "2,300", imperialUnit: "lb" },
      availability: "Ask us", shape: "bulk-pack",
    },
    {
      size: "Microbulk", sku: "AR-MB", container: "Microbulk / bulk", spec: "Site vessel",
      contents: { metric: "1,500–11,000", metricUnit: "L", imperial: "396–2,905", imperialUnit: "gal" },
      fillPressure: { metric: "1,586", metricUnit: "kPa", imperial: "230", imperialUnit: "psig" },
      cga: "295",
      tare: null,
      availability: "Ask us", shape: "dewar",
    },
  ],

  applications: [
    {
      heading: "Welding & metal fabrication",
      items: [
        "GTAW shielding on stainless, aluminum and titanium",
        "Spray-transfer GMAW on aluminum alloys",
        "Plasma cutting and gouging",
        "Root purging of pipe welds",
      ],
    },
    {
      heading: "Heat treatment & metallurgy",
      items: [
        "Bright annealing atmospheres",
        "Vacuum furnace backfill and quench",
        "Sintering and powder metallurgy",
      ],
    },
    {
      heading: "Laboratory & analytical",
      items: [
        "ICP-OES and ICP-MS plasma gas",
        "GC carrier and make-up gas",
        "Glovebox and sample blanketing",
      ],
    },
  ],
  processes: [
    "GTAW / TIG",
    "GMAW / MIG",
    "Plasma cutting",
    "Heat treatment",
    "Purging & blanketing",
    "Chromatography",
  ],
  industries: [
    "Metal fabrication",
    "Manufacturing",
    "Aerospace",
    "Laboratory & analytical",
    "Automotive",
  ],

  safety: {
    oxygenDisplacementWarning: true,
    callout: {
      title: "Asphyxiation hazard",
      body: "Argon displaces oxygen and can cause rapid suffocation without warning. It is heavier than air and collects in pits, trenches and low-lying enclosed spaces. Store and use only in well-ventilated areas and monitor oxygen levels before entering a confined space.",
    },
    storage:
      "Store upright, valve-protection cap fitted, secured by chain or strap. Keep below 52 °C, away from heat sources and direct sunlight. Segregate full and empty cylinders.",
    segregation:
      "No mandatory segregation as an inert gas, but keep clear of flammable gas and oxidizer storage in line with CGA P-1 practice.",
    leakDetection:
      "Odourless and undetectable by smell. Use a soap solution on fittings and an oxygen-deficiency monitor in enclosed areas.",
    ppe: ["Safety glasses", "Leather gloves", "Safety footwear", "O₂ monitor in confined space"],
    never: [
      "Drop, roll or drag a cylinder",
      "Lift by the valve or cap",
      "Use to blow dust off clothing or skin",
      "Identify contents by cylinder colour",
    ],
    requalification:
      "High-pressure steel cylinders requalify at 10-year intervals under CSA B339/B340.",
  },

  compatibility: {
    cga: "580",
    cgaThread: '.965"-14 NGO-RH-INT',
    cgaNote: "Standard inert-gas connection. Cryogenic dewars use CGA 295.",
    recommendedEquipment: [
      "Two-stage regulator, 0–100 psig delivery",
      "Flowmeter regulator, 0–60 CFH for TIG",
      "Cylinder cart with chain restraint",
    ],
    compatibleMaterials:
      "Carbon steel, stainless steel, brass, copper, aluminum, PTFE",
    incompatible: "No known material incompatibilities under normal service",
  },
  relatedSlugs: ["ar-co2-75-25", "ar-o2-98-2", "helium", "nitrogen"],

  featuredRank: 1,
  featuredBadge: "Most ordered",

  faq: [
    {
      question: "Which grade do I need for TIG welding stainless?",
      answer:
        "Welding grade, specified against ISO 14175-I1, is correct for TIG on stainless. Its 10.5 ppm moisture and 5 ppm oxygen limits are well inside what a clean weld needs. Stepping up to High Purity 4.8 buys nothing on a weld pool — spend it on gas coverage and joint prep instead.",
    },
    {
      question: "Can I use my own cylinders?",
      answer:
        "Yes. Customer-owned cylinders are filled provided the requalification stamp is current under CSA B339/B340, the valve is the correct CGA 580 outlet, and the cylinder passes visual inspection at the depot. We can arrange requalification on your behalf.",
    },
    {
      question: "How long does a size 300 last at 20 CFH?",
      answer:
        "A size 300 holds 336 ft³. At a continuous 20 CFH that is about 16.8 hours of arc-on time. Most shops see two to three shifts from one cylinder because arc-on time is rarely more than a third of the working day.",
    },
    {
      question: "Do you supply a certificate of analysis?",
      answer:
        "Per-batch certificates ship with High Purity 4.8 and UHP 5.0. For Industrial and Welding grades a certificate is available on request against the fill batch.",
    },
  ],
  metaDescription:
    "Argon (UN1006, CAS 7440-37-1) in four grades from Industrial 99.5 % to UHP 5.0. Nine cylinder and bulk configurations, CGA 580, full impurity limits and physical properties published.",
};
