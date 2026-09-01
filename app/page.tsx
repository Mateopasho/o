import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { Cylinder } from "@/components/cylinder";
import { ProductCarousel } from "@/components/product-carousel";
import { CountUp } from "@/components/count-up";
import { HeroVideo, HeroVideoCredit } from "@/components/hero-video";
import {
  SectionRule, Eyebrow, MonoLabel, PrimaryButton, QuietLink, OutlineButton,
  QuoteButton, Chip, StatCell, AvailabilityTag, InfoNote, TableFrame, Th,
} from "@/components/ui";
import { DualCell } from "@/lib/format";
import { site, equipmentPartners, industriesIndex } from "@/lib/data/site";
import { featuredCategories } from "@/lib/data/categories";
import { heroBackdrop } from "@/lib/data/images";
import { getFeaturedProducts, getProductBySlug } from "@/lib/catalogue";

const DOWNLOAD_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E6413" strokeWidth="2" aria-hidden="true">
    <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
  </svg>
);

const WHY_US = [
  { n: "01", title: "Published impurity limits", body: "Maximum ppm for H₂O, O₂, N₂, CO, CO₂ and total hydrocarbons on every grade — not just a purity percentage." },
  { n: "02", title: "CGA connection on every SKU", body: "Outlet number and full thread specification, so you know the regulator fits before the cylinder arrives." },
  { n: "03", title: "Current SDS, versioned", body: "English and French, compressed and refrigerated-liquid phases, each with a version number and revision date." },
  { n: "04", title: "Same-day in Toronto", body: "Same-day delivery across the city. Beyond Toronto we confirm a delivery day on request, plus depot pickup any weekday." },
];

const TESTIMONIALS = [
  { body: "Placeholder testimonial copy from a fabrication customer about spec transparency and route reliability.", role: "Shop Manager · Metal fabrication" },
  { body: "Placeholder testimonial copy from a laboratory customer about certificate of analysis turnaround.", role: "Lab Director · Analytical services" },
  { body: "Placeholder testimonial copy from a food processor about FCC-grade documentation and audits.", role: "QA Lead · Food processing" },
];

export default async function HomePage() {
  const [argon, featuredProducts] = await Promise.all([
    getProductBySlug("argon"),
    getFeaturedProducts(),
  ]);
  const samplePackages = argon?.packages.slice(0, 3) ?? [];

  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* ---------------------------------------------------------- Hero --- */}
        {/*
          Left column of copy, footage to the right of it.

          The previous centred version put type in the middle of a moving image
          and tried to protect it with a soft radial mask. That fails visually
          however well it is tuned: an oval of brightness floating in a
          photograph looks like a lens artefact, because nothing in the layout
          accounts for its shape. A left column and a directional gradient read
          as a decision instead.

          It also fixes the practical problem. The copy now always sits on a
          near-solid white wash, so contrast is effectively fixed rather than a
          function of whatever frame is on screen.
        */}
        <section className="relative isolate flex min-h-[560px] items-center overflow-hidden md:min-h-[660px] xl:min-h-[720px]">
          <HeroVideo />

          <div className="gutter relative w-full py-16 md:py-20">
            <div className="max-w-[600px] xl:max-w-[660px]">
              <div className="flex items-center gap-4">
                <span className="og-rule-x h-px w-10 origin-left bg-gold md:w-14" />
                <span className="og-lift font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold-ink [animation-delay:80ms] md:text-[11px]">
                  {site.region} · Est. {site.established}
                </span>
              </div>

              <h1 className="mt-7 text-[42px] leading-[1.03] tracking-[-0.032em] md:mt-8 md:text-[62px] md:leading-[1.0] xl:text-[76px] xl:tracking-[-0.036em]">
                {["Every spec.", "On the page."].map((line, i) => (
                  <span key={line} className="og-line-mask">
                    <span style={{ animationDelay: `${120 + i * 90}ms` }}>{line}</span>
                  </span>
                ))}
                <span className="og-line-mask">
                  <span style={{ animationDelay: "300ms" }} className="relative inline-block text-gold-link">
                    Before you call.
                    <span
                      aria-hidden="true"
                      className="og-underline absolute -bottom-1 left-0 h-[2px] w-full bg-gold [animation-delay:560ms] md:-bottom-1.5 md:h-[3px]"
                    />
                  </span>
                </span>
              </h1>

              <p
                className="og-lift mt-7 max-w-[46ch] text-[16.5px] leading-[1.6] text-muted [animation-delay:620ms] md:mt-8 md:text-[18px]"
                style={{ textWrap: "pretty" }}
              >
                Industrial, welding, specialty and food-grade gases across {site.region} —
                with the complete technical record published. Grades, purity limits,
                cylinder sizes, fill pressures and CGA connections.
              </p>

              <div className="og-lift mt-8 flex flex-col items-start gap-5 [animation-delay:700ms] sm:flex-row sm:items-center sm:gap-7 md:mt-10">
                <PrimaryButton href="/gases" size="lg">Browse the catalogue</PrimaryButton>
                <QuietLink href="/safety#sds">SDS library</QuietLink>
              </div>

              <ul className="og-lift mt-10 flex max-w-[520px] flex-wrap gap-x-7 gap-y-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted [animation-delay:780ms] md:mt-12">
                {site.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>

              <HeroVideoCredit />
            </div>
          </div>
        </section>

        {/* --------------------------------------- Hero object: the evidence --- */}
        {argon && (
          <section className="gutter-narrow pt-12 md:pt-16">
            <div className="og-lift overflow-hidden rounded-card border border-line bg-paper shadow-[var(--shadow-hero)] [animation-delay:860ms]">
              <div className="flex flex-col gap-3 border-b border-line bg-surface px-5 py-3.5 md:flex-row md:items-center md:justify-between md:px-6">
                <span className="flex items-center gap-2.5 font-mono text-[11.5px] text-faint">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  oriongases.ca/gases/industrial-pure/argon
                </span>
                {/*
                  Real links, not decoration. Each opens the argon record on the
                  matching panel via ?section= — the card behaves like the thing
                  it is depicting.
                */}
                <div className="scroll-x flex gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  {[
                    { label: "Grades", id: "grades" },
                    { label: "Packages", id: "packages" },
                    { label: "Properties", id: "properties" },
                    { label: "Safety", id: "safety" },
                    { label: "Documents", id: "documents" },
                  ].map((t, i) => (
                    <Link
                      key={t.id}
                      href={`/gases/industrial-pure/argon?section=${t.id}`}
                      className={`shrink-0 pb-0.5 transition-colors duration-150 hover:text-ink ${
                        i === 0 ? "border-b border-gold text-ink" : "text-faint"
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
                <div className="flex min-w-0 flex-col gap-7 border-line p-6 md:p-8 lg:border-r lg:py-9 lg:pl-10 lg:pr-9">
                  <div className="flex flex-col gap-3">
                    <MonoLabel>Product record</MonoLabel>
                    <div className="flex items-baseline gap-3">
                      <span className="text-[32px] leading-none tracking-[-0.028em] md:text-[38px]">Argon</span>
                      <span className="font-mono text-lg text-faint md:text-xl">Ar</span>
                    </div>
                    <span className="text-[15px] leading-[1.55] text-muted" style={{ textWrap: "pretty" }}>
                      {argon.tagline}.
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Chip tone="gold">UHP 5.0</Chip>
                    <Chip>TDG {argon.tdgClass}</Chip>
                    <Chip>{argon.unNumber}</Chip>
                  </div>

                  <dl className="flex flex-col border-t border-line">
                    {[
                      { k: "CAS", v: argon.cas ?? "—" },
                      { k: "CGA outlet", v: argon.compatibility.cga },
                      { k: "Fill pressure", v: "2,265 psig" },
                      { k: "Configurations", v: String(argon.packages.length) },
                    ].map((row, i, arr) => (
                      <div
                        key={row.k}
                        className={`og-row-in flex items-baseline justify-between gap-4 py-3.5 ${
                          i < arr.length - 1 ? "border-b border-line" : ""
                        }`}
                        style={{ animationDelay: `${1040 + i * 70}ms` }}
                      >
                        <dt className="text-sm text-muted">{row.k}</dt>
                        <dd className="font-mono text-[15px]">{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex min-w-0 flex-col gap-5 p-6 md:p-8 lg:py-9 lg:pl-9 lg:pr-10">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <MonoLabel>Impurity limits · maximum ppm</MonoLabel>
                    <MonoLabel className="tracking-[0.14em]">Published, not on request</MonoLabel>
                  </div>

                  <div className="scroll-x w-full rounded-inner border border-line">
                    <div className="min-w-[400px]">
                      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] border-b border-line bg-surface font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                        <span className="px-4 py-3">Grade</span>
                        {["H₂O", "O₂", "N₂", "THC"].map((h) => (
                          <span key={h} className="px-3 py-3 text-right">{h}</span>
                        ))}
                      </div>
                      {/*
                        Only grades that actually specify limits. Industrial argon
                        specifies none, so it would render four dashes — which
                        reads as missing data in the one place the page argues
                        nothing is missing.
                      */}
                      {argon.grades
                        .filter((g) => Object.keys(g.impurities).length > 0)
                        .map((g, i, arr) => (
                          <div
                            key={g.name}
                            className={`og-row-in grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] font-mono text-sm ${
                              i < arr.length - 1 ? "border-b border-line" : ""
                            } ${g.name === "UHP 5.0" ? "bg-gold-wash text-gold-ink" : ""}`}
                            style={{ animationDelay: `${1120 + i * 110}ms` }}
                          >
                            <span className="px-4 py-3.5">{g.name}</span>
                            {["h2o", "o2", "n2", "thc"].map((k) => (
                              <span key={k} className="px-3 py-3.5 text-right">
                                {g.impurities[k] ?? <span className="text-faint-2">—</span>}
                              </span>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="og-row-in mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-1 [animation-delay:1460ms]">
                    <PrimaryButton href="/quote?product=argon">Request a quote</PrimaryButton>
                    <QuietLink href="/gases/industrial-pure/argon" className="text-sm">
                      Open the full record
                    </QuietLink>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-line bg-surface px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint sm:flex-row sm:items-center sm:justify-between md:px-6">
                <span>One of {site.stats.publishedProducts} records · every product publishes this much</span>
                <span>SDS rev 4.2 · revised 2025-11-04</span>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------- Figures --- */}
        <section className="gutter-narrow pt-14 md:pt-20">
          <dl className="grid border-t border-line sm:grid-cols-3">
            <StatCell
              value={<CountUp value={site.stats.publishedProducts} />}
              label="products with published specs"
              className="border-b border-line py-7 pr-10 sm:border-b-0 md:py-9"
            />
            <StatCell
              value={<CountUp value={site.stats.categories} />}
              label="gas categories in the catalogue"
              className="border-b border-line py-7 sm:border-b-0 sm:border-l sm:border-line sm:px-10 md:py-9"
            />
            <StatCell
              value={<CountUp value={site.stats.emergencyWindow} />}
              label="delivery in Toronto"
              className="py-7 sm:border-l sm:border-line sm:pl-10 md:py-9"
            />
          </dl>
        </section>

        {/* ------------------------------------------------------- Search --- */}
        {/* Background spans the viewport; the content inside it is still the
            1280px column, so it lines up with every other section. */}
        <section className="bg-gold py-4 text-ink md:py-[26px]">
          <div className="gutter flex flex-col gap-[10px] md:flex-row md:items-center md:gap-6">
          <div className="flex shrink-0 flex-col gap-[3px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink md:text-[11px]">
              Find your gas
            </span>
            <span className="hidden text-sm text-gold-link md:block">Name · formula · CAS · UN · SKU</span>
          </div>

          <form action="/gases" className="flex flex-1 items-center gap-3 rounded-full bg-white px-[18px]" role="search">
            <label htmlFor="hero-search" className="sr-only">Search the gas catalogue</label>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E6B64" strokeWidth="2" aria-hidden="true" className="shrink-0">
              <circle cx="11" cy="11" r="7" />
              <path d="M16 16l5 5" />
            </svg>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder='Try "UN1006", "argon 5.0", "CGA 580" or "MAP packaging"'
              className="h-[46px] w-full bg-transparent text-[14px] text-ink outline-none md:h-[52px] md:text-[15.5px]"
            />
          </form>

          <div className="scroll-x flex shrink-0 gap-2">
            {[
              { label: "Argon", href: "/gases/industrial-pure/argon" },
              { label: "75/25 mix", href: "/gases/welding-mixes/ar-co2-75-25" },
              { label: "Food CO₂", href: "/gases/food-beverage/carbon-dioxide" },
            ].map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="inline-flex h-8 shrink-0 items-center rounded-full border border-white/55 px-3 text-[12.5px] text-gold-link md:h-[34px] md:px-[13px] md:text-[13px]"
              >
                {chip.label}
              </Link>
            ))}
          </div>
          </div>
        </section>

        {/*
          The design document placed a "Trusted by" customer logo wall here.
          Removed at the client's direction: naming accounts publicly hands
          competitors a target list. The scale claim it carried now lives in the
          delivery section, which conveys reach without identifying anyone.
        */}

        {/* --------------------------------------------------- Categories --- */}
        <section data-reveal className="gutter pt-12 md:pt-[84px]">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionRule>The catalogue</SectionRule>
              <h2
                className="max-w-[22ch] text-[30px] leading-[1.1] tracking-[-0.024em] md:text-[48px] md:leading-[1.08] md:tracking-[-0.028em]"
                style={{ textWrap: "pretty" }}
              >
                Nine categories, every grade documented
              </h2>
            </div>
            <QuietLink href="/gases" className="whitespace-nowrap">
              View all {site.stats.publishedProducts} products →
            </QuietLink>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/gases?category=${category.slug}`}
                className="flex flex-col rounded-card bg-surface p-4 text-ink transition-colors duration-180 hover:bg-surface-2 hover:text-ink md:p-5"
              >
                <div className="mb-5 hidden items-start justify-between md:flex">
                  <span className="font-mono text-[11px] tracking-[0.12em] text-muted">{category.ordinal}</span>
                  <Cylinder shape="cylinder-150" height={58} strokeWidth={3} bodyStroke="#D8D4CB" bands={false} />
                </div>

                {category.image && (
                  <Image
                    src={category.image.src}
                    alt={category.image.alt}
                    width={900}
                    height={600}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="block h-[140px] w-full rounded-inner object-cover md:h-[176px]"
                  />
                )}

                <div className="mt-auto flex flex-col gap-2">
                  <span className="text-[15px] leading-[1.3] tracking-[-0.01em] md:text-[21px]">
                    <span className="md:hidden">{category.shortName}</span>
                    <span className="hidden md:inline">{category.name}</span>
                  </span>
                  <span className="hidden text-[14.5px] leading-[1.5] text-muted md:block" style={{ textWrap: "pretty" }}>
                    {category.blurb}
                  </span>
                  <span className="font-mono text-[11px] text-gold-link md:mt-1 md:text-xs">
                    {category.publishedCount} products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ Top products --- */}
        <section data-reveal className="pt-12 md:pt-[84px]">
          <ProductCarousel products={featuredProducts} />
        </section>

        {/* --------------------------------------------------- Why buyers --- */}
        <section
          data-reveal
          className="mt-12 border-y border-line bg-surface py-8 md:mt-[84px] md:py-[76px]"
        >
          <div className="gutter grid gap-8 lg:grid-cols-[420px_1fr] lg:gap-24">
            <div>
              <SectionRule>Why buyers choose us</SectionRule>
              <h2
                className="mb-[18px] text-2xl leading-[1.12] tracking-[-0.024em] md:text-[44px] md:tracking-[-0.028em]"
                style={{ textWrap: "pretty" }}
              >
                The spec sheet is
                <br className="hidden md:block" /> the sales pitch
              </h2>
              <p className="mb-7 max-w-[40ch] text-[14.5px] leading-[1.7] text-muted md:text-[16.5px]" style={{ textWrap: "pretty" }}>
                Most suppliers make you phone for a purity limit. We publish the impurity
                table, the CGA connection and the tare weight for every SKU we fill.
              </p>
              <QuietLink href="/gases/industrial-pure/argon">See a sample product record →</QuietLink>
            </div>

            <dl className="grid md:grid-cols-2 md:gap-x-[72px]">
              {WHY_US.map((item, i) => (
                <div
                  key={item.n}
                  className={`grid grid-cols-[26px_1fr] items-start gap-3 border-t border-line py-4 md:grid-cols-[34px_1fr] md:gap-[18px] md:py-[26px] ${
                    i < 2 ? "md:border-t-0 md:border-b" : "md:border-t-0"
                  }`}
                >
                  <dt className="pt-[3px] font-mono text-[11px] tracking-[0.1em] text-gold-link md:pt-[5px] md:text-[11.5px]">
                    {item.n}
                  </dt>
                  <dd className="flex flex-col gap-[7px]">
                    <span className="text-[15.5px] tracking-[-0.008em] md:text-[17.5px]">
                      {item.title}
                    </span>
                    <span className="max-w-[46ch] text-sm leading-[1.65] text-muted md:text-[15px]" style={{ textWrap: "pretty" }}>
                      {item.body}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------ Sample record --- */}
        {argon && (
          <section data-reveal className="gutter mt-12 md:mt-[84px]">
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="flex flex-col gap-4 px-5 pb-6 pt-8 md:flex-row md:items-end md:justify-between md:px-9 md:pt-8">
              <div>
                <SectionRule>Sample record</SectionRule>
                <h2 className="mb-2 text-[26px] tracking-[-0.018em] md:text-[34px] md:tracking-[-0.024em]">
                  Argon <span className="font-mono text-xl font-normal text-muted">Ar</span>
                </h2>
                <p className="text-[15.5px] text-muted">
                  Four grades · {argon.packages.length} package configurations · {argon.unNumber} · CGA 580
                </p>
              </div>
              <PrimaryButton href="/gases/industrial-pure/argon" className="whitespace-nowrap">
                Open full spec sheet
              </PrimaryButton>
            </div>

            <div className="px-5 pb-9 md:px-9">
              <TableFrame className="bg-white">
                {/*
                  Explicit column widths. Without them a seven-column table with
                  short values stretches across the whole content column and the
                  data drifts apart until it stops reading as rows. Container
                  takes the slack because it holds the longest strings.
                */}
                <table className="w-full text-sm">
                  <caption className="sr-only">Sample of argon package configurations</caption>
                  <colgroup>
                    <col className="w-[13%]" />
                    <col className="w-auto" />
                    <col className="w-[14%]" />
                    <col className="w-[15%]" />
                    <col className="w-[7%]" />
                    <col className="w-[16%]" />
                    <col className="w-[11%]" />
                  </colgroup>
                  <thead>
                    <tr className="bg-surface text-ink">
                      <Th>Size</Th>
                      <Th>Container</Th>
                      <Th align="right">Contents</Th>
                      <Th align="right">Fill pressure</Th>
                      <Th>CGA</Th>
                      <Th>Availability</Th>
                      <Th />
                    </tr>
                  </thead>
                  <tbody>
                    {samplePackages.map((pack, i) => (
                      <tr key={pack.sku} data-zebra className={`border-b border-line ${i % 2 === 1 ? "bg-surface" : ""}`}>
                        <td className="px-[18px] py-3 ">{pack.size}</td>
                        <td className="px-[18px] py-3 text-ink-2">{pack.container}</td>
                        <td className="px-[18px] py-3 text-right font-mono ">
                          <DualCell value={pack.contents} />
                        </td>
                        <td className="px-[18px] py-3 text-right font-mono ">
                          <DualCell value={pack.fillPressure} />
                        </td>
                        <td className="px-[18px] py-3 font-mono ">{pack.cga}</td>
                        <td className="px-[18px] py-3"><AvailabilityTag value={pack.availability} /></td>
                        <td className="px-[18px] py-3 text-right">
                          <QuoteButton href={`/quote?product=argon&sku=${pack.sku}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableFrame>
              <InfoNote>
                {argon.packages.length - samplePackages.length} more configurations on the full
                product page. No prices are published — every size quotes individually.
              </InfoNote>
            </div>
          </div>
          </section>
        )}

        {/* ---------------------------------------------------- Industries --- */}
        <section data-reveal className="gutter pt-12 md:pt-[84px]">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionRule>Industries served</SectionRule>
              <h2
                className="mb-3 max-w-[620px] text-2xl leading-[1.12] tracking-[-0.024em] md:text-[44px] md:tracking-[-0.028em]"
                style={{ textWrap: "pretty" }}
              >
                Ten sectors, each with a matched grade
              </h2>
              <p className="max-w-[56ch] text-[15px] leading-[1.7] text-muted md:text-[16.5px]" style={{ textWrap: "pretty" }}>
                Every sector page lists the grades, cylinder sizes and connections that shop
                actually orders — and the compliance record behind them.
              </p>
            </div>
            <QuietLink href="/industries" className="whitespace-nowrap">All industries →</QuietLink>
          </div>

          <ul className="grid overflow-hidden rounded-card border border-line bg-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {industriesIndex.map((industry, i) => (
              <li key={industry.slug} className={i > 0 ? "border-t border-line sm:border-l" : ""}>
                <Link
                  href={`/industries#${industry.slug}`}
                  className="flex h-full flex-col gap-2 px-[26px] py-6 text-ink transition-colors duration-150 hover:bg-surface hover:text-ink"
                >
                  <span className="text-base tracking-[-0.006em]">{industry.name}</span>
                  <span className="font-mono text-[11.5px] tracking-[0.04em] text-gold-link">{industry.gases}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------ Delivery --- */}
        <section data-reveal className="gutter mt-12 bg-white py-8 md:mt-[84px] md:py-[72px]">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-[72px]">
            <div>
              <Eyebrow>Delivery &amp; service area</Eyebrow>
              <h2 className="mb-[18px] text-2xl tracking-[-0.022em] md:text-[44px] md:tracking-[-0.028em]" style={{ textWrap: "pretty" }}>
                Same-day delivery in Toronto
              </h2>
              <p className="mb-7 max-w-[460px] text-[15px] leading-[1.65] text-muted md:text-[17px]" style={{ textWrap: "pretty" }}>
                Same-day across Toronto. Beyond the city — {site.citiesServed.filter((c) => c !== "Toronto").join(", ")} — we confirm a delivery day on request.
              </p>
              <dl className="grid grid-cols-2 gap-[22px] border-t border-line pt-[26px]">
                {[
                  { l: "Beyond Toronto", v: "Day confirmed on request" },
                  { l: "Toronto", v: "Same-day delivery" },
                  { l: "Depot pickup", v: `Mon–Fri until ${site.depot.pickupUntil}` },
                  { l: "Bulk", v: "Microbulk & tank installs" },
                ].map((item) => (
                  <div key={item.l} className="flex flex-col gap-1.5">
                    <dt><MonoLabel>{item.l}</MonoLabel></dt>
                    <dd className="text-[15px] text-ink-2">{item.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ServiceMap />
          </div>
        </section>

        {/* -------------------------------------------------- Testimonials --- */}
        <section data-reveal className="gutter pt-12 md:pt-[84px]">
          <ul className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <li key={i} className="flex flex-col gap-[18px] rounded-card border border-line p-[30px]">
                <svg width="22" height="18" viewBox="0 0 24 20" aria-hidden="true">
                  <path d="M0 20V11C0 4 4 0 10 0v4C6.5 4 5 6 5 9h5v11zm14 0v-9c0-7 4-11 10-11v4c-3.5 0-5 2-5 5h5v11z" fill="#eaedf1" />
                </svg>
                <blockquote className="text-[16.5px] leading-[1.6] text-ink" style={{ textWrap: "pretty" }}>
                  {t.body}
                </blockquote>
                <footer className="mt-auto flex flex-col gap-[3px] border-t border-line pt-[18px]">
                  <span className="text-[14.5px] ">Name Placeholder</span>
                  <span className="text-[13.5px] text-muted">{t.role}</span>
                </footer>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 rounded-card border border-line bg-surface px-8 py-[26px] md:flex-row md:items-center md:gap-10">
            <MonoLabel className="shrink-0">Credentials</MonoLabel>
            <ul className="flex flex-wrap gap-4 text-[14.5px] text-ink-2 md:gap-10">
              {site.credentials.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------- CTA --- */}
        <section
          data-reveal
          className="mx-[18px] mt-12 flex flex-col gap-8 rounded-card bg-gold px-8 py-10 text-ink md:mx-14 md:mt-[84px] md:flex-row md:items-center md:justify-between md:px-12 md:py-[52px]"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-[26px] tracking-[-0.02em] md:text-[40px] md:tracking-[-0.028em]" style={{ textWrap: "pretty" }}>
              Need a spec we haven&rsquo;t published?
            </h2>
            <p className="max-w-[520px] text-[15px] leading-[1.55] text-gold-link md:text-[17px]" style={{ textWrap: "pretty" }}>
              Tell us the application and we&rsquo;ll match the grade, the cylinder and the
              connection. One business day, no account required.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-white px-[26px] text-base text-gold-link"
            >
              Request a Quote
            </Link>
            <a
              href={site.orderDesk.phoneHref}
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-white/40 px-6 text-base text-ink"
            >
              {site.orderDesk.phone}
            </a>
          </div>
        </section>

        {/* --------------------------------------------------- Equipment --- */}
        <section data-reveal className="gutter pt-12 md:pt-[84px]">
          <div className="grid items-center gap-8 lg:grid-cols-[360px_1fr] lg:gap-[72px]">
            <div>
              <Eyebrow>Equipment partners</Eyebrow>
              <h2 className="mb-3.5 text-2xl leading-[1.16] tracking-[-0.02em] md:text-[34px] md:tracking-[-0.024em]" style={{ textWrap: "pretty" }}>
                The hardware our gas runs on
              </h2>
              <p className="mb-6 max-w-[38ch] text-[15px] leading-[1.7] text-muted md:text-base" style={{ textWrap: "pretty" }}>
                Authorised distributor for regulators, torches, filler metals and safety
                equipment — quoted on the same order as the gas.
              </p>
              <QuietLink href="/quote">Browse equipment →</QuietLink>
            </div>

            <ul className="grid grid-cols-2 overflow-hidden rounded-card border border-line bg-white md:grid-cols-3">
              {equipmentPartners.map((partner, i) => (
                <li
                  key={partner.name}
                  className={`flex h-[100px] flex-col items-center justify-center gap-2 px-[18px] text-center transition-colors duration-150 hover:bg-surface md:h-[118px] ${
                    i % 2 === 1 ? "border-l border-line" : ""
                  } ${i >= 2 ? "border-t border-line" : ""} md:[&:nth-child(3n+1)]:border-l-0 md:[&:nth-child(n+4)]:border-t`}
                >
                  <span className="text-sm uppercase tracking-[0.06em] text-faint transition-colors duration-150 hover:text-ink md:text-base">
                    {partner.name}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint-2">
                    {partner.meta}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}

/**
 * Schematic service-area map. Deliberately a diagram rather than a tile map:
 * it shows the same-day zone and the route-day zone as concentric regions,
 * which is the information a buyer actually needs.
 */
function ServiceMap() {
  const pins = [
    { name: "Brampton", left: "24%", top: "33%" },
    { name: "Vaughan", left: "47%", top: "24%" },
    { name: "Markham", left: "61%", top: "30%" },
    { name: "Mississauga", left: "34%", top: "44%" },
    { name: "Scarborough", left: "68%", top: "62%" },
    { name: "Oakville", left: "20%", top: "64%" },
    { name: "Hamilton", left: "10%", top: "74%" },
  ];

  return (
    <div
      role="img"
      aria-label="Schematic map of the Orion Gases service area, showing a same-day zone around the Toronto depot and a wider scheduled-route zone covering Brampton, Vaughan, Markham, Mississauga, Scarborough, Oakville and Hamilton."
      className="relative h-[300px] overflow-hidden rounded-card border border-line bg-surface md:h-[460px]"
    >
      <div className="og-grid-static absolute inset-0 [background-size:44px_44px]" aria-hidden="true" />
      <div className="absolute left-[16%] top-[22%] h-[58%] w-[72%] rounded-full border border-line bg-[rgba(129,100,18,0.09)]" />
      <div className="absolute left-[27%] top-[36%] h-[36%] w-[42%] rounded-full border border-line bg-[rgba(245,198,77,0.08)]" />

      <div className="absolute left-[44%] top-[51%] flex items-center gap-[9px]">
        <span className="size-[11px] rounded-full bg-gold" />
        <span className="font-mono text-[11px] text-ink md:text-[12.5px]">Depot — Toronto</span>
      </div>

      {pins.map((pin) => (
        <div key={pin.name} className="absolute flex items-center gap-[7px]" style={{ left: pin.left, top: pin.top }}>
          <span className="size-[6px] rounded-full bg-gold" />
          <span className="font-mono text-[10px] text-ink-2 md:text-[11.5px]">{pin.name}</span>
        </div>
      ))}

      <div className="absolute bottom-5 left-5 flex gap-5 rounded-full border border-line bg-white px-3.5 py-2.5">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] text-ink-2 md:text-[11px]">
          <span className="size-[11px] border border-line bg-[rgba(245,198,77,0.12)]" />
          Same-day zone
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[10px] text-ink-2 md:text-[11px]">
          <span className="size-[11px] border border-line bg-[rgba(129,100,18,0.12)]" />
          Scheduled routes
        </span>
      </div>
    </div>
  );
}
