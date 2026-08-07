import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { GhsIcon } from "@/components/ghs";
import { SectionTabs } from "@/components/section-tabs";
import { RelatedTile } from "@/components/product-card";
import {
  Breadcrumb, MonoLabel, PrimaryButton, SecondaryButton, QuoteButton,
  AvailabilityTag, HazardCallout, InfoNote, TableFrame, Th,
} from "@/components/ui";
import { DualCell, Formula, PropertyValue, type UnitMode } from "@/lib/format";
import { products, productBySlug, relatedProducts } from "@/lib/data/products";
import { categoryBySlug } from "@/lib/data/categories";
import { productImage, packageImage } from "@/lib/data/images";
import { site } from "@/lib/data/site";
import { maxPurity } from "@/lib/types";

/** Pre-render every published product. Drafts are absent, so they 404. */
export function generateStaticParams() {
  return products.map((p) => ({ category: p.categorySlug, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.unNumber}`,
    description: product.metaDescription,
  };
}

const PHONE_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#816412" strokeWidth="2" aria-hidden="true">
    <path d="M4 5c0 8 7 15 15 15l3-3-4-3-2 2c-3-1-6-4-7-7l2-2-3-4z" />
  </svg>
);

const DOWNLOAD_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#816412" strokeWidth="2" aria-hidden="true">
    <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
  </svg>
);

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category, slug } = await params;
  const sp = await searchParams;
  const product = productBySlug(slug);

  if (!product || product.categorySlug !== category) notFound();

  const cat = categoryBySlug(product.categorySlug);
  const related = relatedProducts(product);
  const purity = maxPurity(product);

  const unitsParam = Array.isArray(sp.units) ? sp.units[0] : sp.units;
  const units: UnitMode =
    unitsParam === "metric" || unitsParam === "imperial" ? unitsParam : "both";

  const primary = product.packages[0];
  const hero = productImage(product, 900);
  const basePath = `/gases/${product.categorySlug}/${product.slug}`;

  /* Sections with no data produce no tab at all. Design system 08: "A section
     with no data is removed from the DOM and from the sticky nav. Never render
     a heading over an empty table." */
  const has = {
    overview: product.overview.length > 0,
    grades: product.grades.length > 0,
    packages: product.packages.length > 0,
    properties: product.properties.length > 0,
    applications: product.applications.length > 0,
    equipment: Boolean(product.compatibility.cga),
    safety: true,
    documents: product.documents.length > 0,
    faq: product.faq.length > 0,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        {/* ------------------------------------- 1 Breadcrumb & 2 Hero --- */}
        <div className="gutter pt-[26px]">
          <Breadcrumb
            trail={[
              { label: "Home", href: "/" },
              { label: "Gases", href: "/gases" },
              { label: cat?.shortName ?? "", href: `/gases?category=${product.categorySlug}` },
              { label: product.name },
            ]}
          />
        </div>

        <section className="gutter grid gap-8 pb-10 pt-8 lg:grid-cols-[400px_1fr] lg:gap-14">
          <div>
            <div className="relative h-[236px] overflow-hidden rounded-[4px] border border-n-100 bg-n-25 md:h-[380px]">
              <Image
                src={hero.src}
                alt={hero.alt}
                width={900}
                height={760}
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="size-full object-cover"
              />
              {primary && (
                <span className="absolute left-3.5 top-3.5 rounded-[2px] bg-white/90 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-n-600 md:text-[10px]">
                  Size {primary.size} · {primary.spec}
                </span>
              )}
            </div>

            {/*
              One thumbnail per package configuration. Photography shows the
              container; the line-drawn overlay is dropped here because the
              photo already carries it.
            */}
            <ul className="mt-3 grid grid-cols-4 gap-2.5">
              {product.packages.slice(0, 4).map((pack, i) => {
                const thumb = packageImage(pack.container, pack.size, 200);
                return (
                  <li key={pack.sku}>
                    <span
                      className={`block overflow-hidden rounded-[3px] border ${
                        i === 0 ? "border-gold-600" : "border-n-100"
                      }`}
                    >
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={200}
                        height={200}
                        sizes="80px"
                        className="aspect-square w-full object-cover"
                      />
                    </span>
                    <span className="mt-1 block truncate font-mono text-[9.5px] text-n-600">
                      {pack.size}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="mb-3.5 flex flex-wrap items-center gap-2 md:gap-3">
              <span className="rounded-[2px] bg-gold-100 px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-gold-800">
                {cat?.shortName}
              </span>
              <span className="inline-flex items-center gap-[7px] rounded-[3px] bg-n-100 px-3 py-1.5 text-[12px] font-medium text-n-900 md:text-[13px]">
                <span className="size-[7px] rounded-full bg-n-600" />
                {product.tdgClass} {product.tdgClass.startsWith("2.1") ? "Flammable" : product.tdgClass.startsWith("2.3") ? "Toxic" : product.tdgClass === "9" ? "Misc." : "Non-flammable"}
              </span>
              {product.safety.oxygenDisplacementWarning && (
                <span className="inline-flex items-center gap-[7px] rounded-[3px] bg-n-100 px-3 py-1.5 text-[12px] font-medium text-n-900 md:text-[13px]">
                  <span className="size-[7px] rounded-full bg-n-600" />
                  Simple asphyxiant
                </span>
              )}
            </div>

            <h1 className="mb-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.025em] md:text-[52px]">
              {product.name}{" "}
              {product.formula && (
                <span className="font-mono text-xl font-normal text-n-600 md:text-[30px]">
                  <Formula value={product.formula} />
                </span>
              )}
            </h1>

            <p className="mb-[26px] max-w-[540px] text-[15.5px] leading-[1.55] text-n-800 md:text-[18px]" style={{ textWrap: "pretty" }}>
              {product.tagline}
            </p>

            {/* GHS signal word + hazard statements */}
            {product.signalWord && (
              <div className="mb-[26px] flex flex-col gap-3.5 border-y border-n-100 py-[18px] md:flex-row md:items-center md:gap-5">
                {product.pictograms[0] && <GhsIcon type={product.pictograms[0]} size={52} />}
                <div className="flex flex-col gap-1">
                  <MonoLabel>GHS signal word</MonoLabel>
                  <span className="text-base font-semibold">{product.signalWord}</span>
                </div>
                <div className="flex flex-col gap-1 md:border-l md:border-n-100 md:pl-5">
                  <MonoLabel>Hazard statements</MonoLabel>
                  <ul className="flex flex-col gap-1">
                    {product.hazardStatements.map((h) => (
                      <li key={h} className="text-[13.5px] text-n-800 md:text-[14.5px]">{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 4 CTA cluster — quote, call, SDS, compare. No price, no cart. */}
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap" data-print="hide">
              <PrimaryButton href={`/quote?product=${product.slug}`} size="lg">Request a Quote</PrimaryButton>
              <SecondaryButton href={site.orderDesk.phoneHref} size="lg">
                {PHONE_ICON}{site.orderDesk.phone}
              </SecondaryButton>
              <SecondaryButton href="/safety#sds" size="lg">
                {DOWNLOAD_ICON}Download SDS
              </SecondaryButton>
              <SecondaryButton href={`/gases/compare?p=${product.slug}`} size="lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c626b" strokeWidth="2" aria-hidden="true">
                  <path d="M4 6h7v12H4zM13 6h7v12h-7z" />
                </svg>
                Compare
              </SecondaryButton>
            </div>
          </div>
        </section>

        {/* ------------------------------------------ 3 Key facts strip --- */}
        <section className="gutter pb-9" aria-label="Key facts">
          <dl className="grid grid-cols-2 overflow-hidden rounded-[4px] border border-n-100 md:grid-cols-3 lg:grid-cols-6">
            <KeyFact label="UN number" value={product.unNumber} />
            <KeyFact label="CAS" value={product.cas ?? "—"} />
            <KeyFact label="TDG class" value={product.tdgClass} />
            <KeyFact label="Max purity" value={purity ?? "—"} unit={purity ? "%" : undefined} />
            <KeyFact label="Configurations" value={String(product.packages.length)} />
            <KeyFact label="Hazard" value={product.hazardSummary} mono={false} />
          </dl>
        </section>

        {/* ------------- 5 Section tabs — one panel per section --------- */}
        <SectionTabs
          panels={[
            ...(has.overview
              ? [{ id: "overview", label: "Overview", print: false, content: (
          <Section id="overview" title="Overview">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-14">
              <div className="flex max-w-[680px] flex-col gap-4">
                {product.overview.map((para, i) => (
                  <p key={i} className="text-[15.5px] leading-[1.7] text-n-800 md:text-[16.5px]" style={{ textWrap: "pretty" }}>
                    {para}
                  </p>
                ))}
              </div>
              <dl className="flex flex-col gap-[18px] self-start rounded-[4px] border border-n-100 bg-n-25 p-[22px]">
                <div className="flex flex-col gap-[5px]">
                  <dt><MonoLabel>Synonyms</MonoLabel></dt>
                  <dd className="text-[14.5px] leading-[1.5]">{product.synonyms}</dd>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <dt><MonoLabel>Proper shipping name</MonoLabel></dt>
                  <dd className="text-[14.5px] leading-[1.5]">{product.properShippingName}</dd>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <dt><MonoLabel>ERAP required</MonoLabel></dt>
                  <dd className="text-[14.5px] leading-[1.5]">{product.erapRequired ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </div>
          </Section>
              ) }]
              : []),
            ...(has.grades
              ? [{ id: "grades", label: "Grades", print: true, content: (
          <Section
            id="grades"
            title="Grades &amp; purity"
            sub="Impurity limits are maximum values in parts per million. A dash means the grade does not specify that impurity."
          >
            <TableFrame>
              <table className="w-full min-w-[640px] text-[14.5px]">
                <caption className="sr-only">{product.name} grades and impurity limits</caption>
                <thead>
                  <tr className="bg-n-25 text-n-900">
                    <Th className="w-[240px]">Grade</Th>
                    {product.grades.map((g) => (
                      <th key={g.name} scope="col" className="px-5 py-[15px] text-right text-[15px] font-semibold">
                        {g.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-n-100">
                    <th scope="row" className="px-5 py-3.5 text-left font-semibold">Minimum purity</th>
                    {product.grades.map((g) => (
                      <td key={g.name} className="px-5 py-3.5 text-right font-mono font-medium">
                        {g.minPurity === "—" ? (
                          <span className="text-n-600">—</span>
                        ) : (
                          <>
                            {g.minPurity} <span className="font-normal text-n-400">%</span>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>

                  {product.impuritySpecies.length > 0 && (
                    <>
                      <tr data-zebra className="border-b border-n-100 bg-n-25">
                        <td colSpan={product.grades.length + 1} className="px-5 py-[11px] font-mono text-[10.5px] uppercase tracking-[0.12em] text-n-600">
                          Impurity limits — maximum ppm
                        </td>
                      </tr>
                      {product.impuritySpecies.map((species, i) => (
                        <tr key={species.key} data-zebra className={`border-b border-n-100 ${i % 2 === 1 ? "bg-n-25" : ""}`}>
                          <th scope="row" className="py-[13px] pl-9 pr-5 text-left font-normal text-n-800">
                            {species.formula ? <Formula value={species.formula} /> : species.label}
                          </th>
                          {product.grades.map((g) => {
                            const v = g.impurities[species.key];
                            return (
                              <td key={g.name} className="px-5 py-[13px] text-right font-mono">
                                {v ? <span className="font-medium">{v}</span> : <span className="text-n-600">—</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  )}

                  <tr className="border-b border-n-100">
                    <th scope="row" className="px-5 py-3.5 text-left font-semibold">Conforms to</th>
                    {product.grades.map((g) => (
                      <td key={g.name} className="px-5 py-3.5 text-right text-sm text-n-800">
                        {g.conformsTo ?? <span className="text-n-600">—</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="px-5 py-3.5 text-left font-semibold">Certificate of analysis</th>
                    {product.grades.map((g) => (
                      <td key={g.name} className="px-5 py-3.5 text-right text-sm text-n-800">
                        {g.certificateOfAnalysis ?? <span className="text-n-600">—</span>}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </TableFrame>
          </Section>
              ) }]
              : []),
            ...(has.packages
              ? [{ id: "packages", label: "Packages", print: true, content: (
          <Section id="packages">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-semibold tracking-[-0.018em] md:text-[28px]">
                  Cylinder &amp; package options
                </h2>
                <p className="text-[15.5px] text-n-600">
                  {product.packages.length} configuration{product.packages.length === 1 ? "" : "s"}.
                  Every row quotes individually — no prices are published.
                </p>
              </div>

              {/* Unit toggle lives in the URL so a chosen view is shareable. */}
              <div className="inline-flex shrink-0 overflow-hidden rounded-[3px] border border-n-200" role="group" aria-label="Unit system">
                {(["both", "metric", "imperial"] as UnitMode[]).map((mode) => (
                  <Link
                    key={mode}
                    href={`${basePath}${mode === "both" ? "" : `?units=${mode}`}#packages`}
                    aria-current={units === mode ? "true" : undefined}
                    className={`inline-flex h-10 items-center px-3.5 font-mono text-xs uppercase tracking-[0.06em] ${
                      units === mode ? "bg-n-25 text-n-900" : "text-n-800"
                    }`}
                  >
                    {mode}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop: full table. Below md it becomes stacked cards. */}
            <TableFrame className="hidden md:block">
              <table className="w-full min-w-[860px] text-sm">
                <caption className="sr-only">{product.name} package configurations</caption>
                <thead>
                  <tr className="bg-n-25 text-n-900">
                    <Th>Size</Th>
                    <Th>Container / spec</Th>
                    <Th align="right">Contents</Th>
                    <Th align="right">Fill pressure</Th>
                    <Th>CGA</Th>
                    <Th align="right">Tare</Th>
                    <Th>Availability</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {product.packages.map((pack, i) => (
                    <tr key={pack.sku} data-zebra className={`border-b border-n-100 last:border-0 ${i % 2 === 1 ? "bg-n-25" : ""}`}>
                      <td className="px-[18px] py-[13px]">
                        <span className="block font-semibold">{pack.size}</span>
                        <span className="font-mono text-[11.5px] text-n-600">{pack.sku}</span>
                      </td>
                      <td className="px-[18px] py-[13px] text-n-800">
                        <span className="block">{pack.container}</span>
                        <span className="font-mono text-[11.5px] text-n-600">{pack.spec}</span>
                      </td>
                      <td className="px-[18px] py-[13px] text-right font-mono font-medium">
                        <DualCell value={pack.contents} mode={units} />
                      </td>
                      <td className="px-[18px] py-[13px] text-right font-mono font-medium">
                        {pack.fillPressure.metric === "—" ? (
                          <span className="text-n-600">—</span>
                        ) : (
                          <DualCell value={pack.fillPressure} mode={units} />
                        )}
                      </td>
                      <td className="px-[18px] py-[13px] font-mono font-medium">{pack.cga}</td>
                      <td className="px-[18px] py-[13px] text-right font-mono font-medium">
                        {pack.tare ? <DualCell value={pack.tare} mode={units} /> : <span className="text-n-600">—</span>}
                      </td>
                      <td className="px-[18px] py-[13px]"><AvailabilityTag value={pack.availability} /></td>
                      <td className="px-[18px] py-[13px] text-right" data-print="hide">
                        <QuoteButton href={`/quote?product=${product.slug}&sku=${pack.sku}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableFrame>

            {/* Mobile: one card per SKU. Design system 06 — no horizontal
                scroll for the flagship table. */}
            <ul className="flex flex-col gap-3 md:hidden">
              {product.packages.map((pack) => (
                <li key={pack.sku} className="rounded-[4px] border border-n-100 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <span className="block font-semibold">{pack.size}</span>
                      <span className="font-mono text-[11.5px] text-n-600">
                        {pack.container} · {pack.spec}
                      </span>
                    </div>
                    <AvailabilityTag value={pack.availability} />
                  </div>
                  <dl className="mb-3 grid grid-cols-2 gap-y-2 border-t border-n-100 pt-3 text-[13px]">
                    <dt className="text-n-600">Contents</dt>
                    <dd className="text-right font-mono font-medium"><DualCell value={pack.contents} mode={units} /></dd>
                    {pack.fillPressure.metric !== "—" && (
                      <>
                        <dt className="text-n-600">Fill pressure</dt>
                        <dd className="text-right font-mono font-medium"><DualCell value={pack.fillPressure} mode={units} /></dd>
                      </>
                    )}
                    <dt className="text-n-600">CGA</dt>
                    <dd className="text-right font-mono font-medium">{pack.cga}</dd>
                    {pack.tare && (
                      <>
                        <dt className="text-n-600">Tare weight</dt>
                        <dd className="text-right font-mono font-medium"><DualCell value={pack.tare} mode={units} /></dd>
                      </>
                    )}
                  </dl>
                  <Link
                    href={`/quote?product=${product.slug}&sku=${pack.sku}`}
                    className="flex h-11 items-center justify-center rounded-[3px] border border-gold-300 text-sm font-medium text-gold-800"
                  >
                    Request a quote for this size
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
              ) }]
              : []),
            ...(has.properties
              ? [{ id: "properties", label: "Properties", print: true, content: (
          <Section id="properties" title="Physical &amp; chemical properties">
            <dl className="grid gap-x-16 rounded-[4px] border border-n-100 px-5 py-2.5 md:grid-cols-2 md:px-8">
              {product.properties.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-baseline justify-between gap-5 py-[15px] ${
                    i < product.properties.length - 2 ? "border-b border-n-100" : "md:border-b-0"
                  }`}
                >
                  <dt className="text-[14.5px] text-n-800 md:text-[15px]">{row.label}</dt>
                  <dd className="text-right font-mono text-[14px] font-medium md:text-[14.5px]">
                    <PropertyValue value={row.value} mode={units} />
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
              ) }]
              : []),
            ...(has.applications
              ? [{ id: "applications", label: "Applications", print: false, content: (
          <Section id="applications" title="Applications &amp; industries">
            <div className="mb-7 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {product.applications.map((group) => (
                <div key={group.heading} className="flex flex-col gap-3">
                  <h3 className="text-[17px] font-semibold md:text-[18px]">{group.heading}</h3>
                  <ul className="flex flex-col gap-[9px]">
                    {group.items.map((item) => (
                      <li key={item} className="border-l-2 border-n-100 pl-4 text-[14.5px] leading-[1.55] text-n-800">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {product.processes.length > 0 && (
              <TagRow label="Processes" items={product.processes} />
            )}
            {product.industries.length > 0 && (
              <TagRow label="Industries" items={product.industries} tone="gold" />
            )}
          </Section>
              ) }]
              : []),
            ...(has.equipment
              ? [{ id: "equipment", label: "Equipment", print: false, content: (
          <Section id="equipment" title="Equipment &amp; compatibility">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-3.5 rounded-[4px] border border-n-100 p-6">
                <MonoLabel>Connection</MonoLabel>
                <span className="font-mono text-[26px] font-medium md:text-[30px]">
                  CGA {product.compatibility.cga}
                </span>
                <span className="font-mono text-[13.5px] text-n-800">{product.compatibility.cgaThread}</span>
                <span className="border-t border-n-100 pt-3 text-sm leading-[1.55] text-n-600" style={{ textWrap: "pretty" }}>
                  {product.compatibility.cgaNote}
                </span>
              </div>

              <div className="flex flex-col gap-3 rounded-[4px] border border-n-100 p-6">
                <MonoLabel>Recommended equipment</MonoLabel>
                <ul className="flex flex-col gap-2">
                  {product.compatibility.recommendedEquipment.map((item) => (
                    <li key={item} className="text-[14.5px] leading-[1.5] text-n-800">{item}</li>
                  ))}
                </ul>
                <Link href="/cylinder-guide#regulator-selection" className="mt-auto border-t border-n-100 pt-3 text-sm text-gold-800">
                  See regulator selection guide →
                </Link>
              </div>

              <div className="flex flex-col gap-4 rounded-[4px] border border-n-100 p-6">
                <div className="flex flex-col gap-1.5">
                  <MonoLabel>Compatible materials</MonoLabel>
                  <span className="text-[14.5px] leading-[1.5] text-n-800">{product.compatibility.compatibleMaterials}</span>
                </div>
                <div className="flex flex-col gap-1.5 border-t border-n-100 pt-3.5">
                  <MonoLabel>Incompatible</MonoLabel>
                  <span className="text-[14.5px] leading-[1.5] text-n-800">{product.compatibility.incompatible}</span>
                </div>
              </div>
            </div>
          </Section>
              ) }]
              : []),
            { id: "safety", label: "Safety", print: false, content: (
        <Section id="safety" title="Handling, storage &amp; safety">
          {product.safety.callout && (
            <div className="mb-7">
              <HazardCallout title={product.safety.callout.title} body={product.safety.callout.body} />
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            <div className="flex flex-col gap-[22px]">
              <SafetyBlock title="Storage requirements" body={product.safety.storage} />
              <SafetyBlock title="Segregation" body={product.safety.segregation} />
              <SafetyBlock title="Leak detection" body={product.safety.leakDetection} />
            </div>

            <div className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[17px] font-semibold">PPE required</h3>
                <ul className="flex flex-wrap gap-2">
                  {product.safety.ppe.map((item) => (
                    <li key={item} className="inline-flex h-9 items-center rounded-[3px] border border-n-100 bg-n-25 px-3.5 text-[13.5px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-[17px] font-semibold">Never</h3>
                <ul className="flex flex-col gap-2">
                  {product.safety.never.map((item) => (
                    <li key={item} className="border-l-2 border-gold-300 pl-4 text-[14.5px] leading-[1.55] text-n-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <SafetyBlock title="Requalification" body={product.safety.requalification} />
            </div>
          </div>
        </Section>
            ) },
            ...(has.documents
              ? [{ id: "documents", label: "Documents", print: true, content: (
          <Section id="documents" title="Documents &amp; downloads">
            <TableFrame>
              <table className="w-full min-w-[640px] text-[14.5px]">
                <caption className="sr-only">{product.name} safety and technical documents</caption>
                <thead>
                  <tr className="bg-n-25 text-n-900">
                    <Th>Document</Th>
                    <Th>Phase</Th>
                    <Th>Language</Th>
                    <Th>Version</Th>
                    <Th>Revised</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {product.documents.map((doc, i) => (
                    <tr key={`${doc.title}-${doc.language}-${doc.phase}`} data-zebra className={`border-b border-n-100 last:border-0 ${i % 2 === 1 ? "bg-n-25" : ""}`}>
                      <td className="px-5 py-3.5 font-semibold">{doc.title}</td>
                      <td className="px-5 py-3.5 text-n-800">{doc.phase ?? <span className="text-n-600">—</span>}</td>
                      <td className="px-5 py-3.5 font-mono">{doc.language}</td>
                      <td className="px-5 py-3.5 font-mono">{doc.version}</td>
                      <td className="px-5 py-3.5 font-mono">{doc.revised}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="font-medium text-gold-800">Download PDF</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableFrame>
            <InfoNote>
              Certificate of analysis:{" "}
              {product.grades.filter((g) => g.certificateOfAnalysis === "Per-batch").map((g) => g.name).join(" and ") || "on request"}{" "}
              per batch, on request for other grades.
            </InfoNote>
          </Section>
              ) }]
              : []),
            ...(has.faq
              ? [{ id: "faq", label: "FAQ", print: false, content: (
          <Section id="faq" title="Frequently asked">
            <div className="border-t border-n-100">
              {product.faq.map((entry, i) => (
                <details key={entry.question} open={i === 0} className="border-b border-n-100 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5">
                    <span className="text-[16px] font-semibold md:text-[17px]">{entry.question}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5c626b" strokeWidth="2.5" aria-hidden="true" className="shrink-0">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="mt-3 max-w-[760px] text-[15px] leading-[1.65] text-n-800" style={{ textWrap: "pretty" }}>
                    {entry.answer}
                  </p>
                </details>
              ))}
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          </Section>
              ) }]
              : []),
          ]}
        />

        {/* --------------------------------------- 15 Related products ---- */}
        {related.length > 0 && (
          <Section id="related" title="Related products" printOmit>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.slug} className="contents"><RelatedTile product={item} /></li>
              ))}
            </ul>
          </Section>
        )}

        {/* ------------------------------------------- 16 Quote band ------ */}
        <section className="gutter pb-16 pt-12" data-print="hide">
          <div className="flex flex-col gap-8 rounded-[4px] border border-n-100 bg-n-25 px-8 py-10 md:flex-row md:items-center md:justify-between md:px-12 md:py-11">
            <div className="flex flex-col gap-3.5">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] md:text-[30px]">
                Quote {product.name.toLowerCase()} for your site
              </h2>
              <p className="max-w-[520px] text-[15px] leading-[1.6] text-n-700 md:text-base" style={{ textWrap: "pretty" }}>
                Tell us the grade and size and we&rsquo;ll come back within one business day.
              </p>
              <dl className="mt-1.5 flex flex-col gap-4 border-t border-n-100 pt-4 sm:flex-row sm:gap-8">
                {[
                  { l: "Regions", v: "GTA · Golden Horseshoe" },
                  { l: "Delivery", v: "Scheduled · On-demand · Pickup" },
                  { l: "Minimum", v: "No minimum order" },
                ].map((item) => (
                  <div key={item.l} className="flex flex-col gap-1">
                    <dt><MonoLabel>{item.l}</MonoLabel></dt>
                    <dd className="text-sm text-n-800">{item.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <PrimaryButton href={`/quote?product=${product.slug}`} size="lg">Request a Quote</PrimaryButton>
              <SecondaryButton href={site.orderDesk.phoneHref} size="lg">{site.orderDesk.phone}</SecondaryButton>
            </div>
          </div>
          <p className="mt-6 text-[12.5px] leading-[1.65] text-n-600" style={{ textWrap: "pretty" }}>
            {site.disclaimer}
          </p>
        </section>
      </main>

      <SiteFooter />

      {/* Mobile sticky quote bar — replaces the desktop CTA cluster below 768px. */}
      <div
        data-print="hide"
        className="sticky bottom-0 z-50 flex items-center gap-2.5 border-t border-n-100 bg-white px-[18px] py-3 md:hidden"
      >
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-n-600">
            Size {primary?.size}
          </span>
          <span className="text-[13.5px] text-n-700">Quotes individually</span>
        </div>
        <Link
          href={`/quote?product=${product.slug}${primary ? `&sku=${primary.sku}` : ""}`}
          className="inline-flex h-12 items-center rounded-[3px] bg-linear-[180deg,var(--color-gold-300)_0%,var(--color-gold-400)_100%] px-[22px] text-[15px] font-medium text-n-900"
        >
          Request a quote
        </Link>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Section({
  id,
  title,
  sub,
  children,
  printOmit = false,
}: {
  id: string;
  title?: string;
  sub?: string;
  children: React.ReactNode;
  printOmit?: boolean;
}) {
  return (
    <section
      id={id}
      className="gutter scroll-mt-[140px] pt-10 md:pt-12"
      data-print-section={printOmit ? "omit" : undefined}
    >
      {title && (
        <h2
          className="mb-4 text-2xl font-semibold tracking-[-0.018em] md:text-[28px]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {sub && <p className="mb-[22px] text-[15.5px] text-n-600">{sub}</p>}
      {children}
    </section>
  );
}

function KeyFact({
  label,
  value,
  unit,
  mono = true,
}: {
  label: string;
  value: string;
  unit?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[7px] border-b border-r border-n-100 px-5 py-5 last:border-r-0 lg:border-b-0">
      <dt><MonoLabel className="text-[10px]">{label}</MonoLabel></dt>
      <dd className={mono ? "font-mono text-[17px] font-medium md:text-[21px]" : "text-[15px] font-medium leading-[1.3] md:text-base"}>
        {value}
        {unit && <span className="text-sm text-n-600"> {unit}</span>}
      </dd>
    </div>
  );
}

function SafetyBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[17px] font-semibold">{title}</h3>
      <p className="text-[14.5px] leading-[1.65] text-n-800 md:text-[15px]" style={{ textWrap: "pretty" }}>
        {body}
      </p>
    </div>
  );
}

function TagRow({
  label,
  items,
  tone = "neutral",
}: {
  label: string;
  items: string[];
  tone?: "neutral" | "gold";
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-n-100 pt-5 md:flex-row md:gap-6">
      <span className="w-[90px] shrink-0 md:pt-2.5"><MonoLabel>{label}</MonoLabel></span>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`inline-flex h-[34px] items-center rounded-[3px] border px-3.5 text-[13.5px] ${
              tone === "gold" ? "border-gold-300 text-gold-800" : "border-n-100 text-n-800"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
