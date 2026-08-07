/**
 * Reference tables for the Cylinder & Equipment Guide.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ACCURACY NOTE — deviations from the source design document              │
 * │                                                                         │
 * │ The design's CGA table carried six entries that do not match the        │
 * │ published CGA V-1 assignments. Because this page tells a buyer whether  │
 * │ a regulator will physically fit a valve, a wrong thread spec is a       │
 * │ safety defect, not a cosmetic one. The verified values are used here    │
 * │ and each correction is recorded inline.                                 │
 * │                                                                         │
 * │ Sources:                                                                │
 * │  · Air Products, "USA Industrial & Specialty Gas Cylinder CGA Valve    │
 * │    Fitting Specs" — CGA number → thread specification.                 │
 * │  · Matheson, "CGA Valve Outlet & Connection Chart" — gas → CGA number. │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export interface CgaRow {
  cga: string;
  /** Verified thread specification. Null renders as a dash, never "N/A". */
  thread: string | null;
  /** Seal / nipple form, where the source specifies one. */
  seal?: string;
  service: string;
  /** Present when this row was corrected against the design document. */
  correction?: string;
}

export const cgaOutlets: CgaRow[] = [
  {
    cga: "320",
    thread: '.825"-14 NGO-RH-EXT',
    seal: "Flat nipple",
    service: "Carbon dioxide",
  },
  {
    cga: "326",
    thread: '.825"-14 NGO-RH-EXT',
    seal: "Small round nipple",
    service: "Nitrous oxide",
  },
  {
    cga: "330",
    thread: '.825"-14 NGO-LH-EXT',
    seal: "Flat nipple",
    service: "Corrosive gases — HCl, H₂S, methyl bromide",
  },
  {
    cga: "346",
    thread: '.825"-14 NGO-RH-EXT',
    seal: "Large round nipple",
    service: "Breathing air",
  },
  {
    cga: "350",
    thread: '.825"-14 NGO-LH-EXT',
    seal: "Round nipple",
    service: "Hydrogen, methane, carbon monoxide — flammable",
  },
  {
    cga: "510",
    thread: '.825"-14 NGO-LH-INT',
    service: "Acetylene, propane, propylene, fuel gases",
    correction:
      'Design document showed .885"-14 NGO-LH-INT. CGA 510 is .825"-14 NGO-LH-INT.',
  },
  {
    cga: "540",
    thread: '.825"-14 NGO-RH-EXT',
    service: "Oxygen",
    correction:
      'Design document showed .903"-14 NGO-RH-EXT. CGA 540 is .825"-14 NGO-RH-EXT.',
  },
  {
    cga: "555",
    thread: '.903"-14 NGO-LH-EXT',
    service: "Liquefied fuel gas withdrawal",
  },
  {
    cga: "580",
    thread: '.965"-14 NGO-RH-INT',
    service:
      "Argon, nitrogen, helium and inert shielding mixes — including Ar-CO₂",
    correction:
      "Argon-CO₂ shielding mixes were mapped to CGA 660 in the design document. Ar-CO₂ mixes take CGA 580.",
  },
  {
    cga: "590",
    thread: '.965"-14 NGO-LH-INT',
    service: "Industrial air, sulfur hexafluoride",
    correction:
      'Design document showed .965"-14 NGO-RH-EXT. CGA 590 is .965"-14 NGO-LH-INT.',
  },
  {
    cga: "660",
    thread: '1.030"-14 NGO-RH-EXT',
    seal: "Face washer",
    service: "Chlorine, sulfur dioxide, halocarbon refrigerants",
    correction:
      "Design document listed CGA 660 as Argon-CO₂ shielding mixes. CGA 660 serves corrosive and halocarbon service.",
  },
  {
    cga: "677",
    thread: '1.030"-14 NGO-LH-EXT',
    seal: "Round nipple",
    service: "Inert gas at 6,000 psig — argon, nitrogen",
    correction:
      'Design document listed CGA 677 as cryogenic inert liquid withdrawal with a RH-EXT thread. CGA 677 is a 6,000 psig compressed-gas connection, LH-EXT. Cryogenic inert liquid withdrawal uses CGA 295.',
  },
  {
    cga: "695",
    thread: '1.045"-14 NGO-LH-INT',
    service: "Hydrogen at 3,500 psig",
    correction:
      'Design document listed CGA 695 as bulk inert gas transfer with a 1.125"-14 RH-EXT thread. CGA 695 is a 3,500 psig hydrogen connection.',
  },
  {
    cga: "295",
    // Not present in either verified source table; rendered as a dash rather
    // than guessed. Design system 06: a dash means not specified.
    thread: null,
    service: "Inert cryogenic liquid withdrawal — dewars",
  },
];

/* -------------------------------------------------------------------------- */

export interface CylinderSizeRow {
  size: string;
  heightWithCap: { mm: string; in: string };
  diameter: { mm: string; in: string };
  waterCapacity: string;
  tare: { kg: string; lb: string };
  spec: string;
}

export const cylinderSizes: CylinderSizeRow[] = [
  {
    size: "300 Large",
    heightWithCap: { mm: "1,470", in: "57.9" },
    diameter: { mm: "232", in: "9.1" },
    waterCapacity: "43.8",
    tare: { kg: "58.0", lb: "128" },
    spec: "TC-3AAM2265",
  },
  {
    size: "150 Medium",
    heightWithCap: { mm: "1,320", in: "52.0" },
    diameter: { mm: "178", in: "7.0" },
    waterCapacity: "21.9",
    tare: { kg: "30.4", lb: "67" },
    spec: "TC-3AA2015",
  },
  {
    size: "80",
    heightWithCap: { mm: "840", in: "33.1" },
    diameter: { mm: "178", in: "7.0" },
    waterCapacity: "11.6",
    tare: { kg: "17.7", lb: "39" },
    spec: "TC-3AA2015",
  },
  {
    size: "40",
    heightWithCap: { mm: "640", in: "25.2" },
    diameter: { mm: "140", in: "5.5" },
    waterCapacity: "5.9",
    tare: { kg: "10.9", lb: "24" },
    spec: "TC-3AA2015",
  },
  {
    size: "20",
    heightWithCap: { mm: "445", in: "17.5" },
    diameter: { mm: "127", in: "5.0" },
    waterCapacity: "2.9",
    tare: { kg: "5.9", lb: "13" },
    spec: "TC-3AA2015",
  },
];

/* -------------------------------------------------------------------------- */

export interface TcDotRow {
  marking: string;
  meaning: string;
  example: string;
}

/**
 * TC/DOT cylinder specification markings. TC is the Transport Canada
 * designation; DOT is the equivalent US marking. Values reflect CSA B339.
 */
export const tcDotMarkings: TcDotRow[] = [
  {
    marking: "TC / DOT",
    meaning:
      "Regulatory authority. Canadian cylinders carry TC; US cylinders carry DOT. Dual-marked cylinders show both.",
    example: "TC-3AAM2265",
  },
  {
    marking: "3A",
    meaning: "Seamless carbon-steel cylinder.",
    example: "TC-3A2015",
  },
  {
    marking: "3AA",
    meaning:
      "Seamless alloy-steel cylinder. The most common industrial high-pressure specification.",
    example: "TC-3AA2015",
  },
  {
    marking: "3AAM",
    meaning:
      "Seamless alloy-steel cylinder qualified for a higher service pressure.",
    example: "TC-3AAM2265",
  },
  {
    marking: "3AL",
    meaning: "Seamless aluminum-alloy cylinder. Used for high-purity service.",
    example: "TC-3AL2015",
  },
  {
    marking: "4L",
    meaning: "Insulated cylinder for refrigerated liquefied gas — a dewar.",
    example: "TC-4L230",
  },
  {
    marking: "8AL",
    meaning:
      "Acetylene cylinder with a monolithic porous mass and aluminum shell.",
    example: "TC-8AL",
  },
  {
    marking: "Service pressure",
    meaning:
      "The trailing figure is the marked service pressure in psig at 21 °C. A 3AA2015 is a 2,015 psig cylinder.",
    example: "2015 · 2265",
  },
  {
    marking: "+ (plus)",
    meaning:
      "Cylinder qualified for 10 % overfill above marked service pressure.",
    example: "TC-3AA2015 +",
  },
  {
    marking: "★ (star)",
    meaning: "Cylinder qualified for a 10-year requalification interval.",
    example: "TC-3AA2015 ★",
  },
];

/* -------------------------------------------------------------------------- */

export interface RegulatorRow {
  service: string;
  stages: string;
  deliveryRange: string;
  cga: string;
  note: string;
}

export const regulatorSelection: RegulatorRow[] = [
  {
    service: "TIG / GTAW shielding",
    stages: "Flowmeter regulator",
    deliveryRange: "0–60 CFH",
    cga: "580",
    note: "Flow-calibrated for argon. Read the argon scale, not the CO₂ scale.",
  },
  {
    service: "MIG / GMAW shielding",
    stages: "Flowmeter regulator",
    deliveryRange: "0–60 CFH",
    cga: "580",
    note: "Ar-CO₂ mixes use the argon scale within 2 % across the range.",
  },
  {
    service: "Analytical & carrier gas",
    stages: "Two-stage",
    deliveryRange: "0–100 psig",
    cga: "580",
    note: "Two stages hold delivery pressure steady as the cylinder empties.",
  },
  {
    service: "Oxy-fuel cutting — oxygen",
    stages: "Two-stage",
    deliveryRange: "0–150 psig",
    cga: "540",
    note: "Oxygen service only. Never lubricate; oil and grease ignite in oxygen.",
  },
  {
    service: "Oxy-fuel cutting — acetylene",
    stages: "Single-stage",
    deliveryRange: "0–15 psig",
    cga: "510",
    note: "Never exceed 15 psig. Acetylene decomposes explosively above it.",
  },
  {
    service: "Beverage CO₂ dispense",
    stages: "Single-stage",
    deliveryRange: "0–60 psig",
    cga: "320",
    note: "Fit a siphon-tube cylinder only where liquid withdrawal is intended.",
  },
  {
    service: "Cryogenic liquid withdrawal",
    stages: "Dewar economiser",
    deliveryRange: "Vessel pressure",
    cga: "295",
    note: "Use transfer hose rated for cryogenic temperature and pressure.",
  },
];

/* -------------------------------------------------------------------------- */

export interface RequalificationRow {
  containerType: string;
  interval: string;
  method: string;
  standard: string;
}

export const requalification: RequalificationRow[] = [
  {
    containerType: "High-pressure steel (3A, 3AA, 3AAM)",
    interval: "10 years",
    method: "Hydrostatic test and visual inspection",
    standard: "CSA B339 / B340",
  },
  {
    containerType: "Aluminum (3AL)",
    interval: "10 years",
    method: "Hydrostatic test, visual and neck inspection",
    standard: "CSA B339 / B340",
  },
  {
    containerType: "Acetylene (8AL)",
    interval: "10 years",
    method: "Visual inspection of shell and porous mass",
    standard: "CSA B339 / B340",
  },
  {
    containerType: "Cryogenic dewar (4L)",
    interval: "5 years",
    method: "Visual inspection and pressure-relief verification",
    standard: "CSA B339 / B340",
  },
  {
    containerType: "Forklift and LP cylinders",
    interval: "10 years",
    method: "Visual inspection, requalification stamp",
    standard: "CSA B339 / B340",
  },
];

/* -------------------------------------------------------------------------- */

export interface SegregationRow {
  store: string;
  awayFrom: string;
  separation: { m: string; ft: string } | string;
  alternative: string | null;
}

/** Minimum separation between stored classes, per CGA P-1 practice. */
export const segregation: SegregationRow[] = [
  {
    store: "Flammable gases",
    awayFrom: "Oxidizers",
    separation: { m: "6.1", ft: "20" },
    alternative: "1.5 m non-combustible barrier, 30 min rating",
  },
  {
    store: "Oxygen",
    awayFrom: "Fuel gases, oil, grease",
    separation: { m: "6.1", ft: "20" },
    alternative: "Rated barrier wall",
  },
  {
    store: "Toxic gases",
    awayFrom: "All other classes",
    separation: "Separate ventilated enclosure",
    alternative: null,
  },
  {
    store: "Inert gases",
    awayFrom: "No mandatory separation",
    separation: "—",
    alternative: "Segregate full from empty",
  },
];

/* -------------------------------------------------------------------------- */

/** Cylinder colour conventions — deliberately framed as non-authoritative. */
export const colourConventions = [
  { gas: "Argon", colour: "Dark green (varies)" },
  { gas: "Oxygen", colour: "White or green (varies)" },
  { gas: "Nitrogen", colour: "Black or grey (varies)" },
  { gas: "Helium", colour: "Brown (varies)" },
  { gas: "Carbon dioxide", colour: "Grey or black (varies)" },
  { gas: "Acetylene", colour: "Maroon (varies)" },
  { gas: "Hydrogen", colour: "Red (varies)" },
  { gas: "Ar-CO₂ mixes", colour: "Two-tone, supplier-specific" },
];
