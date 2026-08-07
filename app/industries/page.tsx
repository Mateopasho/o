import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { StickyJumpNav } from "@/components/sticky-jump-nav";
import { Formula } from "@/lib/format";
import { industriesIndex } from "@/lib/data/site";
import { productBySlug } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Industries served",
  description:
    "Ten sectors across Southern Ontario, each with a matched gas grade, cylinder programme and compliance record — from metal fabrication to laboratory and food processing.",
};

/** Screen 04 — one section per sector, each linking to the matched products. */
const SECTORS: {
  slug: string;
  name: string;
  body: string;
  matches: { label: string; note: string; productSlug?: string }[];
}[] = [
  {
    slug: "metal-fabrication",
    name: "Metal fabrication",
    body: "Shielding gas, cutting gas and filler metal on one order, on a fixed route day. Most fabrication accounts run a size-300 shielding cylinder per welding station on exchange, with oxy-fuel bottles on a separate exchange cycle so a cutting torch never waits on a welding delivery.",
    matches: [
      { label: "75/25 Ar-CO₂", note: "ISO 14175 M21", productSlug: "ar-co2-75-25" },
      { label: "Argon — Welding", note: "ISO 14175 I1", productSlug: "argon" },
      { label: "Oxygen", note: "Cutting service", productSlug: "oxygen" },
      { label: "Acetylene", note: "Oxy-fuel", productSlug: "acetylene" },
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    body: "Nitrogen for purging, blanketing and laser cutting, plus compressed air where a plant compressor cannot be trusted for instrument service. High-volume sites move to microbulk nitrogen with telemetry so top-ups happen before anyone notices.",
    matches: [
      { label: "Nitrogen", note: "Purge & blanket", productSlug: "nitrogen" },
      { label: "Compressed air", note: "Instrument grade", productSlug: "compressed-air" },
      { label: "Hydrogen", note: "Reducing atmosphere", productSlug: "hydrogen" },
      { label: "Liquid nitrogen", note: "Microbulk", productSlug: "liquid-nitrogen" },
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    body: "Site work needs fuel gas that survives the back of a truck and a cylinder programme that tolerates an unpredictable schedule. Propane for heat and cutting, acetylene where pierce speed matters, on rental rather than lease so a finished job stops costing money.",
    matches: [
      { label: "Propane", note: "Heat & cutting", productSlug: "propane" },
      { label: "Acetylene", note: "Oxy-fuel", productSlug: "acetylene" },
      { label: "Oxygen", note: "Cutting service", productSlug: "oxygen" },
      { label: "Propylene", note: "Production cutting", productSlug: "propylene" },
    ],
  },
  {
    slug: "food-beverage",
    name: "Food & beverage",
    body: "FCC-grade documentation with per-batch certificates, because a food-safety audit asks for the paperwork rather than the molecule. Beverage CO₂ to the ISBT guidelines, MAP blends to your package specification, and dry ice made to order against a ship date.",
    matches: [
      { label: "CO₂ — Beverage/FCC", note: "ISBT guidelines", productSlug: "carbon-dioxide" },
      { label: "Nitrogen — FCC", note: "21 CFR 184.1540", productSlug: "food-grade-nitrogen" },
      { label: "Dry ice", note: "Pellets & blocks", productSlug: "dry-ice" },
      { label: "Liquid nitrogen", note: "Cryogenic freezing", productSlug: "liquid-nitrogen" },
    ],
  },
  {
    slug: "laboratory",
    name: "Laboratory & analytical",
    body: "Carrier-gas purity where a few ppm of moisture moves a baseline, with per-batch certificates of analysis on every UHP and Research fill. Aluminium cylinders on request for trace work, and a standing route day so a run is never held up by a cylinder change.",
    matches: [
      { label: "Helium — UHP 5.5", note: "99.9995 %", productSlug: "helium" },
      { label: "Argon — UHP 5.0", note: "ICP plasma", productSlug: "argon" },
      { label: "Zero air", note: "FID support", productSlug: "compressed-air" },
      { label: "Hydrogen — Research 6.0", note: "FID fuel", productSlug: "hydrogen" },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    body: "USP medical oxygen and nitrous oxide filled under their monographs with per-batch documentation and full lot traceability. Pin-index yoke cylinders for anaesthesia, bulk liquid oxygen for facilities, and waste-gas scavenging guidance for clinical N₂O.",
    matches: [
      { label: "Oxygen — USP", note: "Medical grade", productSlug: "oxygen" },
      { label: "Nitrous oxide — USP", note: "Anaesthesia", productSlug: "nitrous-oxide" },
      { label: "Medical air", note: "CSA Z180.1", productSlug: "compressed-air" },
      { label: "Liquid oxygen", note: "Bulk supply", productSlug: "liquid-oxygen" },
    ],
  },
  {
    slug: "aerospace",
    name: "Aerospace",
    body: "Certified purity with documentation that satisfies an AS9100 audit trail. Helium for leak testing to 10⁻⁹ mbar·L/s, argon 6.0 for titanium and superalloy welding, and nitrogen for purge and pressure test on assembled systems.",
    matches: [
      { label: "Helium — UHP", note: "Leak testing", productSlug: "helium" },
      { label: "Argon — UHP 5.0", note: "Titanium GTAW", productSlug: "argon" },
      { label: "Nitrogen — UHP", note: "Purge & test", productSlug: "nitrogen" },
      { label: "98/2 Ar-O₂", note: "Stainless spray", productSlug: "ar-o2-98-2" },
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    body: "Body and exhaust work wants a low-spatter mix that leaves a bead worth showing; production lines want consistency across every station. 92/8 for sheet, 75/25 for structural and chassis, CO₂ where cost per weld dominates.",
    matches: [
      { label: "92/8 Ar-CO₂", note: "Sheet & exhaust", productSlug: "ar-co2-92-8" },
      { label: "75/25 Ar-CO₂", note: "Chassis & structural", productSlug: "ar-co2-75-25" },
      { label: "Carbon dioxide", note: "Short-arc GMAW", productSlug: "carbon-dioxide" },
      { label: "Nitrogen", note: "A/C pressure test", productSlug: "nitrogen" },
    ],
  },
  {
    slug: "hvac",
    name: "HVAC & mechanical",
    body: "Nitrogen for pressure testing and brazing purge, acetylene or propane for the braze itself. Dry nitrogen matters here: moisture left in a refrigeration circuit freezes at the expansion valve and takes the callback with it.",
    matches: [
      { label: "Nitrogen", note: "Purge & pressure test", productSlug: "nitrogen" },
      { label: "Acetylene", note: "Brazing", productSlug: "acetylene" },
      { label: "Oxygen", note: "Oxy-acetylene braze", productSlug: "oxygen" },
      { label: "Propane", note: "Soft soldering", productSlug: "propane" },
    ],
  },
  {
    slug: "materials-handling",
    name: "Materials handling",
    body: "Forklift propane on exchange, delivered to a cage on your yard so a driver never queues. HD-5 grade for engine fuel, and a monthly cylinder balance report so a fleet of thirty cylinders stays a fleet of thirty cylinders.",
    matches: [
      { label: "Propane — HD-5", note: "Engine fuel", productSlug: "propane" },
      { label: "Propane 33 lb", note: "Forklift exchange", productSlug: "propane" },
      { label: "Propane 20 lb", note: "Sweepers", productSlug: "propane" },
      { label: "Propane bulk", note: "Yard tank", productSlug: "propane" },
    ],
  },
];

export default function IndustriesPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <PageHero
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Industries" }]}
          title="Ten sectors we supply across Southern Ontario"
          lede="Each sector has a matched grade, a typical cylinder programme and its own compliance requirements. Jump to yours."
          grid
        />

        {/* The grid carries the content column so the sidebar and the body
            share one left edge with the header above them. */}
        <div className="gutter grid lg:grid-cols-[240px_1fr]">
          <StickyJumpNav
            label="Sectors"
            items={SECTORS.map((s) => ({ id: s.slug, label: s.name }))}
          />

          <div className="py-10 md:py-12 lg:pl-10">
            {SECTORS.map((sector, i) => (
              <section
                key={sector.slug}
                id={sector.slug}
                className={`scroll-mt-[130px] ${
                  i < SECTORS.length - 1 ? "mb-9 border-b border-n-100 pb-9" : ""
                }`}
              >
                <div className="mb-3.5 flex items-baseline gap-4">
                  <span className="font-mono text-xs text-gold-800">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl font-semibold tracking-[-0.018em] md:text-[30px]">
                    {sector.name}
                  </h2>
                </div>

                <p
                  className="mb-6 max-w-[720px] text-[15.5px] leading-[1.7] text-n-800 md:text-[16.5px]"
                  style={{ textWrap: "pretty" }}
                >
                  {sector.body}
                </p>

                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {sector.matches.map((match) => {
                    const product = match.productSlug ? productBySlug(match.productSlug) : undefined;
                    const inner = (
                      <>
                        <span className="text-[15.5px] font-semibold">
                          <Formula value={match.label} />
                        </span>
                        <span className="font-mono text-[11.5px] text-n-600">{match.note}</span>
                      </>
                    );
                    return (
                      <li key={`${sector.slug}-${match.label}-${match.note}`}>
                        {product ? (
                          <Link
                            href={`/gases/${product.categorySlug}/${product.slug}`}
                            className="flex h-full flex-col gap-[7px] rounded-[4px] border border-n-100 p-[18px] text-n-900 transition-colors duration-150 hover:border-gold-600 hover:text-n-900"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <div className="flex h-full flex-col gap-[7px] rounded-[4px] border border-n-100 p-[18px]">
                            {inner}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
