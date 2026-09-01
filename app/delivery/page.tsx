import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { MonoLabel } from "@/components/ui";
import { site, deliveryModes } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Delivery & service area",
  description:
    "Same-day delivery anywhere in Toronto. Beyond the city we confirm a delivery day on request. Depot pickup Monday to Friday, plus microbulk installation.",
};

/** Screen 07 — coverage, route days, emergency service, depot pickup. */
export default function DeliveryPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <PageHero
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Delivery & Service Area" }]}
          title="Delivery & service area"
          lede="Same-day delivery anywhere in Toronto. Beyond the city, tell us where you are and we will confirm a delivery day. Depot pickup Monday to Friday."
        />

        <div className="gutter grid gap-10 pb-16 lg:grid-cols-2 lg:gap-12">
          <ServiceMapLarge />

          <div className="flex flex-col">
            {deliveryModes.map((mode, i) => (
              <section
                key={mode.ordinal}
                className={`border-b border-line ${i === 0 ? "pb-6" : "py-6"}`}
              >
                <div className="mb-2.5 flex items-baseline gap-3.5">
                  <span className="font-mono text-xs text-gold-link">{mode.ordinal}</span>
                  <h2 className="text-[20px] ">{mode.title}</h2>
                </div>
                <p className="text-[15.5px] leading-[1.65] text-muted" style={{ textWrap: "pretty" }}>
                  {mode.body}
                </p>
              </section>
            ))}

            <div className="pt-7">
              <MonoLabel className="mb-3.5 block">Also delivering to</MonoLabel>
              <ul className="flex flex-wrap gap-2">
                {site.citiesServed.map((city) => (
                  <li
                    key={city}
                    className="inline-flex h-[34px] items-center rounded-full border border-line px-[13px] text-[13.5px] text-ink-2"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}

function ServiceMapLarge() {
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
      aria-label="Schematic map of the service area. A same-day zone surrounds the Toronto depot; a wider scheduled-route zone covers Brampton, Vaughan, Markham, Mississauga, Scarborough, Oakville and Hamilton."
      className="relative h-[340px] overflow-hidden rounded-card border border-line bg-surface md:h-[460px]"
    >
      <div className="og-grid-static absolute inset-0 [background-size:44px_44px]" aria-hidden="true" />
      <div className="absolute left-[16%] top-[22%] h-[63%] w-[74%] rounded-full border border-line bg-[rgba(129,100,18,0.09)]" />
      <div className="absolute left-[27%] top-[36%] h-[36%] w-[43%] rounded-full border border-line bg-[rgba(245,198,77,0.08)]" />

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

      <div className="absolute bottom-5 left-5 flex flex-col gap-2 rounded-full border border-line bg-white px-3.5 py-2.5 sm:flex-row sm:gap-5">
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
