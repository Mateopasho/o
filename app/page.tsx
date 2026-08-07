import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { Cylinder } from "@/components/cylinder";
import { ProductCarousel } from "@/components/product-carousel";
import {
  SectionLabel, MonoLabel, PrimaryButton, SecondaryButton, QuoteButton,
  RuleLink, AvailabilityTag, InfoNote, TableFrame, Th,
} from "@/components/ui";
import { DualCell } from "@/lib/format";
import { site, equipmentPartners, industriesIndex } from "@/lib/data/site";
import { featuredCategories } from "@/lib/data/categories";
import { heroBackdrop } from "@/lib/data/images";
import { featuredProducts, productBySlug } from "@/lib/data/products";

const DOWNLOAD_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#816412" strokeWidth="2" aria-hidden="true">
    <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
  </svg>
);

const WHY_US = [
  { n: "01", title: "Published impurity limits", body: "Maximum ppm for H₂O, O₂, N₂, CO, CO₂ and total hydrocarbons on every grade — not just a purity percentage." },
  { n: "02", title: "CGA connection on every SKU", body: "Outlet number and full thread specification, so you know the regulator fits before the cylinder arrives." },
  { n: "03", title: "Current SDS, versioned", body: "English and French, compressed and refrigerated-liquid phases, each with a version number and revision date." },
  { n: "04", title: "Scheduled routes, emergency fills", body: "Fixed route days across the GTA with same-day service when a line goes down, plus depot pickup." },
];

const TESTIMONIALS = [
  { body: "Placeholder testimonial copy from a fabrication customer about spec transparency and route reliability.", role: "Shop Manager · Metal fabrication" },
  { body: "Placeholder testimonial copy from a laboratory customer about certificate of analysis turnaround.", role: "Lab Director · Analytical services" },
  { body: "Placeholder testimonial copy from a food processor about FCC-grade documentation and audits.", role: "QA Lead · Food processing" },
];

export default function HomePage() {
  const argon = productBySlug("argon");
  const samplePackages = argon?.packages.slice(0, 3) ?? [];

  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* ---------------------------------------------------------- Hero --- */}
        <section className="relative overflow-hidden bg-white">
          {/*
            Placeholder hero photography.

            Masked by POSITION, not dimmed uniformly. Opacity and scrim multiply,
            and dimming both at once is what made two earlier passes invisible
            (0.035 × 0.05 is ~0.2 % of an image — nothing).

            So the photo runs at a properly visible 55 % and the scrim decides
            where it is allowed to show:

              · Left 30 % — `from-white` at full alpha. The headline column sits
                on pure white, so text contrast is mathematically identical to
                having no image at all.
              · Right of that — `to-white/10` lets 90 % through, giving ~50 %
                effective opacity. A real, legible photograph, in the half of
                the hero that holds no text at all.

            Mobile cannot use that trick: copy spans the full width, so there is
            no empty side to give the photo. It gets a flat `white/85` scrim
            instead — ~8 % effective, still readable as tone, and enough to keep
            the 11.5px gold-800 label above AA (it fails at white/82).

            Greyscale keeps the photo from competing with gold-400, the accent
            the palette reserves for hazard.

            Decorative only — empty alt and aria-hidden, so screen readers and
            the accessibility tree skip it entirely.
          */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Image
              src={heroBackdrop.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-55 grayscale"
            />
            {/*
              Mobile: copy spans the full width, so there is nowhere to hide the
              photo horizontally — a flat scrim keeps it as visible tone while
              still clearing AA under the text.
            */}
            <div className="absolute inset-0 bg-white/85 md:hidden" />
            {/* Desktop: white under the copy, photo clear to the right of it. */}
            <div className="absolute inset-0 hidden md:block md:bg-linear-to-r md:from-white md:from-48% md:via-white/70 md:via-64% md:to-white/10" />
          </div>

          <div className="og-rule absolute left-0 top-0 h-full w-[3px] bg-gold-400 md:w-1" aria-hidden="true" />

          <div className="gutter relative flex min-h-[480px] items-center md:min-h-[600px]">
            <div className="max-w-[600px] py-12 md:py-[88px]">
              <div className="og-fade-up [animation-delay:60ms]">
                <SectionLabel tone="gold">{site.region}</SectionLabel>
              </div>

              <h1
                className="og-fade-up mb-[26px] text-[34px] font-semibold leading-[1.08] tracking-[-0.026em] [animation-delay:140ms] md:text-[52px] md:leading-[1.02] md:tracking-[-0.028em] xl:text-[68px]"
                style={{ textWrap: "pretty" }}
              >
                Every spec.
                <br />
                On the page.
                <br />
                <span className="text-gold-800">Before you call.</span>
              </h1>

              <p
                className="og-fade-up mb-9 max-w-[480px] text-[15.5px] leading-[1.6] text-n-700 [animation-delay:220ms] md:text-[19px]"
                style={{ textWrap: "pretty" }}
              >
                Industrial, welding, specialty and food-grade gases with the complete
                technical record published — grades, purity limits, cylinder sizes,
                fill pressures and CGA connections.
              </p>

              <div className="og-fade-up mb-12 flex flex-col gap-[14px] [animation-delay:300ms] sm:flex-row sm:items-center">
                <PrimaryButton href="/gases" size="lg">Browse the catalogue</PrimaryButton>
                <SecondaryButton href="/safety#sds" size="lg">
                  {DOWNLOAD_ICON}
                  SDS library
                </SecondaryButton>
              </div>

              <dl className="og-fade-up flex flex-wrap gap-8 border-t border-n-100 pt-[30px] [animation-delay:380ms] md:gap-11">
                {[
                  { v: site.stats.publishedProducts, l: <>products with<br />published specs</> },
                  { v: site.stats.categories, l: <>gas categories<br />in the catalogue</> },
                  { v: site.stats.emergencyWindow, l: <>emergency<br />delivery window</> },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <dt className="font-mono text-[21px] font-medium md:text-[26px]">{stat.v}</dt>
                    <dd className="text-[13px] leading-[1.4] text-n-600">{stat.l}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {/*
              The line-drawn cylinder size lineup that used to sit here has been
              removed at the client's request — the photograph now carries the
              right-hand side of the hero on its own. The lineup still exists on
              the Cylinder Guide, where relative scale is the actual information
              and a photograph cannot substitute for it.
            */}
          </div>
        </section>

        {/* ------------------------------------------------------- Search --- */}
        {/* Background spans the viewport; the content inside it is still the
            1280px column, so it lines up with every other section. */}
        <section className="bg-gold-400 py-4 text-n-900 md:py-[26px]">
          <div className="gutter flex flex-col gap-[10px] md:flex-row md:items-center md:gap-6">
          <div className="flex shrink-0 flex-col gap-[3px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-n-900 md:text-[11px]">
              Find your gas
            </span>
            <span className="hidden text-sm text-gold-800 md:block">Name · formula · CAS · UN · SKU</span>
          </div>

          <form action="/gases" className="flex flex-1 items-center gap-3 rounded-[3px] bg-white px-[18px]" role="search">
            <label htmlFor="hero-search" className="sr-only">Search the gas catalogue</label>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5c626b" strokeWidth="2" aria-hidden="true" className="shrink-0">
              <circle cx="11" cy="11" r="7" />
              <path d="M16 16l5 5" />
            </svg>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder='Try "UN1006", "argon 5.0", "CGA 580" or "MAP packaging"'
              className="h-[46px] w-full bg-transparent text-[14px] text-n-900 outline-none md:h-[52px] md:text-[15.5px]"
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
                className="inline-flex h-8 shrink-0 items-center rounded-[3px] border border-white/55 px-3 text-[12.5px] text-gold-800 md:h-[34px] md:px-[13px] md:text-[13px]"
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
              <SectionLabel>The catalogue</SectionLabel>
              <h2
                className="max-w-[620px] text-2xl font-semibold tracking-[-0.022em] md:text-[40px]"
                style={{ textWrap: "pretty" }}
              >
                Nine categories, every grade documented
              </h2>
            </div>
            <RuleLink href="/gases" className="whitespace-nowrap">
              View all {site.stats.publishedProducts} products →
            </RuleLink>
          </div>

          <div className="grid gap-px border border-n-100 bg-n-100 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/gases?category=${category.slug}`}
                className="flex min-h-[196px] flex-col bg-white p-[14px] text-n-900 transition-colors duration-150 hover:bg-n-25 hover:text-n-900 md:p-7"
              >
                <div className="mb-5 hidden items-start justify-between md:flex">
                  <span className="font-mono text-[11px] tracking-[0.12em] text-n-600">{category.ordinal}</span>
                  <Cylinder shape="cylinder-150" height={58} strokeWidth={3} bodyStroke="#d7dbe0" bands={false} />
                </div>

                {category.image && (
                  <Image
                    src={category.image.src}
                    alt={category.image.alt}
                    width={900}
                    height={600}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="mb-[9px] block h-[74px] w-full rounded-[2px] object-cover md:mb-[18px] md:h-32"
                  />
                )}

                <div className="mt-auto flex flex-col gap-2">
                  <span className="text-[15px] font-semibold leading-[1.3] tracking-[-0.01em] md:text-[21px]">
                    <span className="md:hidden">{category.shortName}</span>
                    <span className="hidden md:inline">{category.name}</span>
                  </span>
                  <span className="hidden text-[14.5px] leading-[1.5] text-n-600 md:block" style={{ textWrap: "pretty" }}>
                    {category.blurb}
                  </span>
                  <span className="font-mono text-[11px] text-gold-800 md:mt-1 md:text-xs">
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
          className="mt-12 border-y border-n-100 bg-n-25 py-8 md:mt-[84px] md:py-[76px]"
        >
          <div className="gutter grid gap-8 lg:grid-cols-[420px_1fr] lg:gap-24">
            <div>
              <SectionLabel>Why buyers choose us</SectionLabel>
              <h2
                className="mb-[18px] text-2xl font-semibold leading-[1.12] tracking-[-0.024em] md:text-[38px]"
                style={{ textWrap: "pretty" }}
              >
                The spec sheet is
                <br className="hidden md:block" /> the sales pitch
              </h2>
              <p className="mb-7 max-w-[40ch] text-[14.5px] leading-[1.7] text-n-700 md:text-[16.5px]" style={{ textWrap: "pretty" }}>
                Most suppliers make you phone for a purity limit. We publish the impurity
                table, the CGA connection and the tare weight for every SKU we fill.
              </p>
              <RuleLink href="/gases/industrial-pure/argon">See a sample product record →</RuleLink>
            </div>

            <dl className="grid md:grid-cols-2 md:gap-x-[72px]">
              {WHY_US.map((item, i) => (
                <div
                  key={item.n}
                  className={`grid grid-cols-[26px_1fr] items-start gap-3 border-t border-n-100 py-4 md:grid-cols-[34px_1fr] md:gap-[18px] md:py-[26px] ${
                    i < 2 ? "md:border-t-0 md:border-b" : "md:border-t-0"
                  }`}
                >
                  <dt className="pt-[3px] font-mono text-[11px] tracking-[0.1em] text-gold-800 md:pt-[5px] md:text-[11.5px]">
                    {item.n}
                  </dt>
                  <dd className="flex flex-col gap-[7px]">
                    <span className="text-[15.5px] font-semibold tracking-[-0.008em] md:text-[17.5px]">
                      {item.title}
                    </span>
                    <span className="max-w-[46ch] text-sm leading-[1.65] text-n-600 md:text-[15px]" style={{ textWrap: "pretty" }}>
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
          <div className="overflow-hidden rounded-[4px] border border-n-100 bg-n-25">
            <div className="flex flex-col gap-4 px-5 pb-6 pt-8 md:flex-row md:items-end md:justify-between md:px-9 md:pt-8">
              <div>
                <SectionLabel>Sample record</SectionLabel>
                <h2 className="mb-2 text-[26px] font-semibold tracking-[-0.018em] md:text-[30px]">
                  Argon <span className="font-mono text-xl font-normal text-n-600">Ar</span>
                </h2>
                <p className="text-[15.5px] text-n-700">
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
                    <tr className="bg-n-25 text-n-900">
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
                      <tr key={pack.sku} data-zebra className={`border-b border-n-100 ${i % 2 === 1 ? "bg-n-25" : ""}`}>
                        <td className="px-[18px] py-3 font-semibold">{pack.size}</td>
                        <td className="px-[18px] py-3 text-n-800">{pack.container}</td>
                        <td className="px-[18px] py-3 text-right font-mono font-medium">
                          <DualCell value={pack.contents} />
                        </td>
                        <td className="px-[18px] py-3 text-right font-mono font-medium">
                          <DualCell value={pack.fillPressure} />
                        </td>
                        <td className="px-[18px] py-3 font-mono font-medium">{pack.cga}</td>
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
              <SectionLabel>Industries served</SectionLabel>
              <h2
                className="mb-3 max-w-[620px] text-2xl font-semibold leading-[1.12] tracking-[-0.024em] md:text-[38px]"
                style={{ textWrap: "pretty" }}
              >
                Ten sectors, each with a matched grade
              </h2>
              <p className="max-w-[56ch] text-[15px] leading-[1.7] text-n-600 md:text-[16.5px]" style={{ textWrap: "pretty" }}>
                Every sector page lists the grades, cylinder sizes and connections that shop
                actually orders — and the compliance record behind them.
              </p>
            </div>
            <RuleLink href="/industries" className="whitespace-nowrap">All industries →</RuleLink>
          </div>

          <ul className="grid overflow-hidden rounded-[4px] border border-n-100 bg-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {industriesIndex.map((industry, i) => (
              <li key={industry.slug} className={i > 0 ? "border-t border-n-100 sm:border-l" : ""}>
                <Link
                  href={`/industries#${industry.slug}`}
                  className="flex h-full flex-col gap-2 px-[26px] py-6 text-n-900 transition-colors duration-150 hover:bg-n-25 hover:text-n-900"
                >
                  <span className="text-base font-semibold tracking-[-0.006em]">{industry.name}</span>
                  <span className="font-mono text-[11.5px] tracking-[0.04em] text-gold-800">{industry.gases}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------ Delivery --- */}
        <section data-reveal className="gutter mt-12 bg-white py-8 md:mt-[84px] md:py-[72px]">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-[72px]">
            <div>
              <SectionLabel tone="gold">Delivery &amp; service area</SectionLabel>
              <h2 className="mb-[18px] text-2xl font-semibold tracking-[-0.022em] md:text-[38px]" style={{ textWrap: "pretty" }}>
                Fixed route days across the GTA
              </h2>
              <p className="mb-7 max-w-[460px] text-[15px] leading-[1.65] text-n-700 md:text-[17px]" style={{ textWrap: "pretty" }}>
                {site.citiesServed.join(", ")}. Emergency and same-day fills outside route days.
              </p>
              <dl className="grid grid-cols-2 gap-[22px] border-t border-n-100 pt-[26px]">
                {[
                  { l: "Scheduled", v: "Weekly or biweekly route" },
                  { l: "Emergency", v: "Same-day, 24h window" },
                  { l: "Depot pickup", v: `Mon–Fri until ${site.depot.pickupUntil}` },
                  { l: "Bulk", v: "Microbulk & tank installs" },
                ].map((item) => (
                  <div key={item.l} className="flex flex-col gap-1.5">
                    <dt><MonoLabel>{item.l}</MonoLabel></dt>
                    <dd className="text-[15px] text-n-800">{item.v}</dd>
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
              <li key={i} className="flex flex-col gap-[18px] rounded-[4px] border border-n-100 p-[30px]">
                <svg width="22" height="18" viewBox="0 0 24 20" aria-hidden="true">
                  <path d="M0 20V11C0 4 4 0 10 0v4C6.5 4 5 6 5 9h5v11zm14 0v-9c0-7 4-11 10-11v4c-3.5 0-5 2-5 5h5v11z" fill="#eaedf1" />
                </svg>
                <blockquote className="text-[16.5px] leading-[1.6] text-n-900" style={{ textWrap: "pretty" }}>
                  {t.body}
                </blockquote>
                <footer className="mt-auto flex flex-col gap-[3px] border-t border-n-100 pt-[18px]">
                  <span className="text-[14.5px] font-semibold">Name Placeholder</span>
                  <span className="text-[13.5px] text-n-600">{t.role}</span>
                </footer>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 rounded-[4px] border border-n-100 bg-n-25 px-8 py-[26px] md:flex-row md:items-center md:gap-10">
            <MonoLabel className="shrink-0">Credentials</MonoLabel>
            <ul className="flex flex-wrap gap-4 text-[14.5px] text-n-800 md:gap-10">
              {site.credentials.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------- CTA --- */}
        <section
          data-reveal
          className="mx-[18px] mt-12 flex flex-col gap-8 rounded-[4px] bg-gold-400 px-8 py-10 text-n-900 md:mx-14 md:mt-[84px] md:flex-row md:items-center md:justify-between md:px-12 md:py-[52px]"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-[26px] font-semibold tracking-[-0.02em] md:text-[34px]" style={{ textWrap: "pretty" }}>
              Need a spec we haven&rsquo;t published?
            </h2>
            <p className="max-w-[520px] text-[15px] leading-[1.55] text-gold-800 md:text-[17px]" style={{ textWrap: "pretty" }}>
              Tell us the application and we&rsquo;ll match the grade, the cylinder and the
              connection. One business day, no account required.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="inline-flex h-[52px] items-center justify-center rounded-[3px] bg-white px-[26px] text-base font-semibold text-gold-800"
            >
              Request a Quote
            </Link>
            <a
              href={site.orderDesk.phoneHref}
              className="inline-flex h-[52px] items-center justify-center rounded-[3px] border border-white/40 px-6 text-base font-medium text-n-900"
            >
              {site.orderDesk.phone}
            </a>
          </div>
        </section>

        {/* --------------------------------------------------- Equipment --- */}
        <section data-reveal className="gutter pt-12 md:pt-[84px]">
          <div className="grid items-center gap-8 lg:grid-cols-[360px_1fr] lg:gap-[72px]">
            <div>
              <SectionLabel tone="gold">Equipment partners</SectionLabel>
              <h2 className="mb-3.5 text-2xl font-semibold leading-[1.16] tracking-[-0.02em] md:text-[30px]" style={{ textWrap: "pretty" }}>
                The hardware our gas runs on
              </h2>
              <p className="mb-6 max-w-[38ch] text-[15px] leading-[1.7] text-n-600 md:text-base" style={{ textWrap: "pretty" }}>
                Authorised distributor for regulators, torches, filler metals and safety
                equipment — quoted on the same order as the gas.
              </p>
              <RuleLink href="/quote">Browse equipment →</RuleLink>
            </div>

            <ul className="grid grid-cols-2 overflow-hidden rounded-[4px] border border-n-100 bg-white md:grid-cols-3">
              {equipmentPartners.map((partner, i) => (
                <li
                  key={partner.name}
                  className={`flex h-[100px] flex-col items-center justify-center gap-2 px-[18px] text-center transition-colors duration-150 hover:bg-n-25 md:h-[118px] ${
                    i % 2 === 1 ? "border-l border-n-100" : ""
                  } ${i >= 2 ? "border-t border-n-100" : ""} md:[&:nth-child(3n+1)]:border-l-0 md:[&:nth-child(n+4)]:border-t`}
                >
                  <span className="text-sm font-bold uppercase tracking-[0.06em] text-n-400 transition-colors duration-150 hover:text-n-900 md:text-base">
                    {partner.name}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-n-300">
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
      className="relative h-[300px] overflow-hidden rounded-[4px] border border-n-100 bg-n-25 md:h-[460px]"
    >
      <div className="og-grid-static absolute inset-0 [background-size:44px_44px]" aria-hidden="true" />
      <div className="absolute left-[16%] top-[22%] h-[58%] w-[72%] rounded-full border border-gold-300 bg-[rgba(129,100,18,0.09)]" />
      <div className="absolute left-[27%] top-[36%] h-[36%] w-[42%] rounded-full border border-gold-300 bg-[rgba(245,198,77,0.08)]" />

      <div className="absolute left-[44%] top-[51%] flex items-center gap-[9px]">
        <span className="size-[11px] rounded-full bg-gold-400" />
        <span className="font-mono text-[11px] font-medium text-n-900 md:text-[12.5px]">Depot — Toronto</span>
      </div>

      {pins.map((pin) => (
        <div key={pin.name} className="absolute flex items-center gap-[7px]" style={{ left: pin.left, top: pin.top }}>
          <span className="size-[6px] rounded-full bg-gold-600" />
          <span className="font-mono text-[10px] text-n-800 md:text-[11.5px]">{pin.name}</span>
        </div>
      ))}

      <div className="absolute bottom-5 left-5 flex gap-5 rounded-[3px] border border-n-100 bg-white px-3.5 py-2.5">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] text-n-800 md:text-[11px]">
          <span className="size-[11px] border border-gold-300 bg-[rgba(245,198,77,0.12)]" />
          Same-day zone
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[10px] text-n-800 md:text-[11px]">
          <span className="size-[11px] border border-gold-300 bg-[rgba(129,100,18,0.12)]" />
          Scheduled routes
        </span>
      </div>
    </div>
  );
}
