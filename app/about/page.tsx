import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { SectionRule, Eyebrow, MonoLabel } from "@/components/ui";
import { site, timeline } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About Orion Gases",
  description:
    "Family-owned gas supply in Toronto since 1978. One fill plant, fourteen delivery vehicles, and a catalogue that publishes the full technical record.",
};

/** Screen 11 — story, facility, timeline, credentials. */
export default function AboutPage() {
  const stats = [
    { v: String(site.stats.yearsInOperation), l: "years in operation" },
    { v: String(site.stats.deliveryVehicles), l: "delivery vehicles" },
    { v: String(site.stats.fillPlants), l: "fill plant, Toronto" },
    { v: site.stats.canadianOwned, l: "Canadian owned" },
  ];

  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <section className="gutter relative overflow-hidden py-11 md:pb-12 md:pt-14">
          <div
            className="absolute inset-0 [background-image:repeating-linear-gradient(to_right,rgba(245,198,77,0.22)_0_1px,transparent_1px_72px)]"
            aria-hidden="true"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>Family-owned since {site.established}</Eyebrow>
              <h1
                className="mb-[18px] text-[32px] tracking-[-0.025em] md:text-[60px] md:tracking-[-0.032em]"
                style={{ textWrap: "pretty" }}
              >
                Three generations filling cylinders in Toronto
              </h1>
              <div className="flex max-w-[500px] flex-col gap-4">
                <p className="text-[16px] leading-[1.65] text-muted md:text-[18px]" style={{ textWrap: "pretty" }}>
                  Orion started in {site.established} with two trucks and a welding-gas route
                  through Etobicoke. The fill plant came later, the high-purity line later
                  still, and the cryogenic business after that — each one added because a
                  customer asked for something we could not yet supply.
                </p>
                <p className="text-[15px] leading-[1.65] text-muted md:text-[16.5px]" style={{ textWrap: "pretty" }}>
                  Publishing the full technical record was the same kind of decision. Buyers kept
                  phoning to ask for a purity limit or a CGA number that we already knew, and
                  every one of those calls was a small tax on someone trying to do their job.
                  So we put the whole spec on the page instead.
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px border border-line bg-surface-2">
              {stats.map((stat) => (
                <div key={stat.l} className="flex flex-col gap-2 bg-surface p-6 md:p-[26px]">
                  <dt className="font-mono text-[26px] md:text-[32px]">{stat.v}</dt>
                  <dd className="text-sm leading-[1.4] text-muted">{stat.l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ----------------------------------------------------- Timeline --- */}
        <section className="gutter py-11 md:py-12">
          <h2 className="mb-7 text-2xl tracking-[-0.018em] md:text-[32px] md:tracking-[-0.022em]">Timeline</h2>

          <ol className="grid border-t-2 border-line md:grid-cols-3 lg:grid-cols-5">
            {timeline.map((item, i) => (
              <li key={item.year} className="relative pr-6 pt-6">
                <span
                  aria-hidden="true"
                  className={`absolute -top-[7px] left-0 size-3 rounded-full ${
                    i === 0 ? "bg-gold" : i === timeline.length - 1 ? "bg-gold" : "bg-line-2"
                  }`}
                />
                <span className="mb-2 block font-mono text-[20px] ">{item.year}</span>
                <span className="block text-[14.5px] leading-[1.55] text-muted" style={{ textWrap: "pretty" }}>
                  {item.body}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------- Credentials --- */}
        <section className="gutter pb-16">
          <div className="flex flex-col gap-4 rounded-card border border-line bg-surface px-8 py-[26px] md:flex-row md:items-center md:gap-10">
            <MonoLabel className="shrink-0">Credentials</MonoLabel>
            <ul className="flex flex-wrap gap-4 text-[14.5px] text-ink-2 md:gap-10">
              {site.credentials.map((c) => (
                <li key={c}>{c}</li>
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
