/**
 * Global site settings.
 *
 * The CANUTEC emergency number is a global setting that appears on every safety
 * surface, per design system section 7.6.
 */

export const site = {
  name: "Orion Gases",
  established: 1978,
  locality: "Toronto",
  region: "Southern Ontario & the GTA",

  orderDesk: {
    phone: "416 555 0100",
    phoneHref: "tel:+14165550100",
    hours: "Mon–Fri 07:00–17:00",
    hoursShort: "07:00–17:00",
    email: "orders@oriongases.ca",
  },

  depot: {
    pickupUntil: "16:30",
    address: ["Placeholder address", "Toronto, ON"],
  },

  /** Global setting — renders on every safety surface. */
  emergency: {
    label: "CANUTEC",
    phone: "1-888-226-8832",
    phoneHref: "tel:+18882268832",
    spelled: "1-888-CANUTEC",
    cellular: "*666",
    note: "or *666 from a cellular phone in Canada",
  },

  stats: {
    publishedProducts: 53,
    categories: 9,
    emergencyWindow: "24h",
    yearsInOperation: 48,
    deliveryVehicles: 14,
    fillPlants: 1,
    canadianOwned: "100 %",
    accounts: "400+",
  },

  /**
   * Standing technical disclaimer. Appears in the footer and at the foot of
   * every product page.
   */
  disclaimer:
    "Technical data is provided for reference and is typical of product supplied. It does not constitute a specification or a guarantee of performance. Always consult the current Safety Data Sheet and the cylinder label before use. In an emergency, contact CANUTEC at 1-888-CANUTEC (1-888-226-8832) or *666 from a cellular phone in Canada.",

  credentials: [
    "TDG certified fleet",
    "WHMIS 2015 compliant",
    "CSA B339/B340 requalification",
    "CGA member",
    "Family-owned, Canadian",
  ],

  citiesServed: [
    "Toronto",
    "Mississauga",
    "Brampton",
    "Vaughan",
    "Markham",
    "Scarborough",
    "Oakville",
    "Burlington",
    "Hamilton",
    "Barrie",
  ],
} as const;

export const nav = [
  { label: "Gases", href: "/gases" },
  { label: "Industries", href: "/industries" },
  { label: "Safety & Compliance", href: "/safety" },
  { label: "Cylinder Guide", href: "/cylinder-guide" },
  { label: "Delivery", href: "/delivery" },
  // The design document's "Resources" knowledge hub was removed from scope.
  // Any inbound /resources URL is redirected in next.config.ts.
  { label: "FAQ", href: "/faq" },
] as const;

export const footerColumns = [
  {
    heading: "Gases",
    links: [
      { label: "Industrial & Pure", href: "/gases?category=industrial-pure" },
      { label: "Welding Mixes", href: "/gases?category=welding-mixes" },
      {
        label: "Specialty & High-Purity",
        href: "/gases?category=specialty-high-purity",
      },
      { label: "Food & Beverage", href: "/gases?category=food-beverage" },
      { label: "Cutting & Fuel", href: "/gases?category=cutting-fuel" },
      { label: "Cryogenic Liquids", href: "/gases?category=cryogenic-liquids" },
      { label: "Propane", href: "/gases?category=propane" },
      { label: "Dry Ice", href: "/gases?category=dry-ice" },
    ],
  },
  {
    heading: "Reference",
    links: [
      { label: "Cylinder size chart", href: "/cylinder-guide#size-chart" },
      { label: "CGA outlet chart", href: "/cylinder-guide#cga-outlets" },
      { label: "TC/DOT markings", href: "/cylinder-guide#tc-dot" },
      {
        label: "Regulator selection",
        href: "/cylinder-guide#regulator-selection",
      },
      { label: "Requalification", href: "/cylinder-guide#requalification" },
      { label: "SDS library", href: "/safety#sds" },
      // The design document specifies a /faq screen but links it from nowhere.
      // Added here so the page is reachable and crawlable.
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Industries served", href: "/industries" },
      { label: "Delivery & service area", href: "/delivery" },
      { label: "Cylinder programs", href: "/cylinder-programs" },
      { label: "Contact", href: "/quote" },
    ],
  },
] as const;

/*
 * The design document included a named customer list for a "Trusted by" logo
 * wall on the home page. It has been removed rather than commented out: naming
 * accounts publicly gives competitors a ready-made prospect list, and data left
 * in the module would still ship in the bundle. Reach is now communicated
 * through the service-area and delivery sections instead.
 */

export const equipmentPartners = [
  { name: "Caldera", meta: "Regulators & flowmeters" },
  { name: "Ironvale", meta: "Torches & consumables" },
  { name: "Sentry Kit", meta: "PPE & safety" },
  { name: "Weldrow", meta: "Filler metals" },
  { name: "Arcline", meta: "Plasma cutting" },
  { name: "Halden", meta: "Manifolds & panels" },
] as const;

export const industriesIndex = [
  { name: "Manufacturing", gases: "N₂ purge · compressed air", slug: "manufacturing" },
  { name: "Metal fabrication", gases: "Ar · 75/25 · oxy-fuel", slug: "metal-fabrication" },
  { name: "Construction", gases: "Acetylene · propane", slug: "construction" },
  { name: "Food & beverage", gases: "FCC CO₂ · MAP blends", slug: "food-beverage" },
  { name: "Laboratory & analytical", gases: "UHP 5.0 · carrier gases", slug: "laboratory" },
  { name: "Healthcare", gases: "USP O₂ · medical air", slug: "healthcare" },
  { name: "Aerospace", gases: "He · Ar 6.0", slug: "aerospace" },
  { name: "Automotive", gases: "75/25 · CO₂ · N₂", slug: "automotive" },
  { name: "HVAC & mechanical", gases: "Nitrogen · brazing gas", slug: "hvac" },
  { name: "Materials handling", gases: "Propane · forklift cylinders", slug: "materials-handling" },
] as const;

export const deliveryModes = [
  {
    ordinal: "01",
    title: "Scheduled delivery",
    body: "Weekly or biweekly route day assigned to your site. Standing order or call-ahead adjustment by 15:00 the previous business day.",
  },
  {
    ordinal: "02",
    title: "On-demand & emergency",
    body: "Same-day service inside the inner zone when a line goes down. 24-hour window across the wider service area.",
  },
  {
    ordinal: "03",
    title: "Depot pickup",
    body: "Monday to Friday until 16:30. Bring your own cylinders for exchange or collect a leased unit.",
  },
  {
    ordinal: "04",
    title: "Bulk & microbulk",
    body: "Tank installation, telemetry-monitored top-ups and scheduled bulk fills for high-volume sites.",
  },
] as const;

export const cylinderPrograms = [
  {
    model: "Exchange",
    owner: "Orion Gases",
    requalification: "We handle it",
    bestFor: "Variable or seasonal usage",
  },
  {
    model: "Rental",
    owner: "Orion Gases",
    requalification: "We handle it",
    bestFor: "Short projects, trial runs",
  },
  {
    model: "Lease",
    owner: "Orion Gases, long term",
    requalification: "We handle it",
    bestFor: "Steady multi-year demand",
  },
  {
    model: "Customer-owned",
    owner: "You",
    requalification: "Your responsibility — we can arrange",
    bestFor: "Existing fleets, specialty vessels",
  },
] as const;

export const timeline = [
  { year: "1978", body: "Founded as a two-truck welding gas supplier in Etobicoke." },
  { year: "1994", body: "First high-purity fill line commissioned for laboratory customers." },
  { year: "2007", body: "Cryogenic bulk and microbulk installations added." },
  { year: "2019", body: "Food-grade programme certified for beverage and MAP customers." },
  { year: "2026", body: "Full technical catalogue published online, spec-first." },
] as const;
