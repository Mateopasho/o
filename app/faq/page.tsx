import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { StickyJumpNav } from "@/components/sticky-jump-nav";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Ordering and accounts, cylinders and returns, delivery, grades and purity, safety and compliance — answered by the Orion Gases order desk.",
};

/** Screen 10 — grouped by topic, marked up with FAQPage schema. */
const GROUPS = [
  {
    id: "ordering",
    title: "Ordering & accounts",
    entries: [
      {
        q: "Do I need an account to get a quote?",
        a: "No. Anyone can request a quote from any product page or the contact form. An account is only needed once you place a first order, so we can set up delivery, billing and cylinder tracking.",
      },
      {
        q: "Why aren't prices shown on the website?",
        a: "Because a published price would be wrong for almost everyone who read it. Industrial gas pricing depends on volume, cylinder programme, delivery frequency and location, and a size-300 argon on a weekly route costs materially less per cubic metre than the same cylinder collected once. Publishing one number would mean publishing a number nobody actually pays. What we do publish is everything technical — grade, purity limits, fill pressure, tare weight, CGA connection — so you can compare suppliers on substance before anyone talks money.",
      },
      {
        q: "What's your minimum order?",
        a: "There is no minimum order. A single cylinder collected from the depot is a perfectly ordinary transaction. Delivery to site outside a scheduled route day may carry a call-out charge, which is quoted up front.",
      },
      {
        q: "How quickly do you respond to a quote request?",
        a: "Within one business day, and usually the same morning if the request arrives before noon. Requests that need a grade match or a custom blend take longer because someone in the fill plant looks at them rather than the order desk alone.",
      },
    ],
  },
  {
    id: "cylinders",
    title: "Cylinders & returns",
    entries: [
      {
        q: "Can I use cylinders I already own?",
        a: "Yes. Customer-owned cylinders are filled provided the requalification stamp is current under CSA B339/B340, the valve carries the correct CGA outlet for the gas, and the cylinder passes visual inspection at the depot. We can arrange requalification on your behalf.",
      },
      {
        q: "How often does a cylinder need requalification?",
        a: "High-pressure steel and aluminium cylinders requalify every ten years by hydrostatic test and visual inspection. Cryogenic dewars requalify every five years with pressure-relief verification. Acetylene cylinders requalify every ten years by visual inspection of the shell and porous mass. The date is stamped on the shoulder.",
      },
      {
        q: "What happens if a cylinder goes missing?",
        a: "We send a monthly cylinder balance report so a discrepancy surfaces while it is still findable — most turn out to be behind a door or on a truck. Cylinders unaccounted for after the agreed period are invoiced at replacement value.",
      },
      {
        q: "Do I have to return empties on my route day?",
        a: "It is the easiest way to avoid demurrage, but not the only one. Empties are also accepted at the depot Monday to Friday until 16:30. Fit the valve cap before it travels.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    entries: [
      {
        q: "Which areas do you deliver to?",
        a: `Same-day delivery anywhere in Toronto. Beyond the city — ${site.citiesServed.filter((c) => c !== "Toronto").join(", ")} and the wider Golden Horseshoe — tell us the postal code and the order desk will confirm a delivery day when you ask.`,
      },
      {
        q: "How late can I change a standing order?",
        a: "By 15:00 the previous business day. After that the truck is loaded and a change becomes an on-demand call-out.",
      },
      {
        q: "Can you deliver outside business hours?",
        a: "For emergency fills, yes. Contact the order desk and we will arrange it — an after-hours call-out is quoted separately.",
      },
    ],
  },
  {
    id: "grades",
    title: "Grades & purity",
    entries: [
      {
        q: "What do grade numbers like 4.8 and 5.0 mean?",
        a: "They count nines. Grade 4.8 is 99.998 % pure — four nines followed by an eight. Grade 5.0 is 99.999 %, and 6.0 is 99.9999 %. The convention describes minimum purity only; the impurity table tells you which specific contaminants are controlled and to what limit, which is usually the figure that matters.",
      },
      {
        q: "Is food-grade gas chemically different from industrial?",
        a: "Usually not. The molecule is the same; the fill process, the documentation and the per-batch certificate of analysis against FCC or ISBT specifications are what differ. If your process is audited, the certification is the product. Beverage CO₂ is the exception worth noting — its limits on sulfur compounds and aldehydes exist because those impurities carry taste.",
      },
      {
        q: "Do you supply a certificate of analysis?",
        a: "Per-batch certificates ship with every UHP, Research, medical and food grade. For industrial and welding grades a certificate against the fill batch is available on request.",
      },
      {
        q: "Can you blend a custom mixture?",
        a: "Yes. Tell us the components, the target ratio and the tolerance you need. Certified calibration standards and non-standard shielding blends are both routine work.",
      },
    ],
  },
  {
    id: "safety",
    title: "Safety & compliance",
    entries: [
      {
        q: "Where do I find the current SDS?",
        a: "In the SDS library on the safety page, in English and French, with a version number and revision date on every sheet. Each product page also lists its own documents.",
      },
      {
        q: "Do you provide WHMIS or TDG training?",
        a: "Yes — on-site cylinder handling sessions, WHMIS 2015 refreshers and confined-space oxygen monitoring briefings. Ask the order desk to schedule one.",
      },
      {
        q: "Why can I not identify a gas by cylinder colour?",
        a: "Because colour is a supplier convention in Canada, not a legal standard. It varies between suppliers and between fills. Read the label and confirm the CGA outlet number before connecting a regulator — the connection is the engineered safeguard, the colour is not.",
      },
      {
        q: "What number do I call in an emergency?",
        a: `${site.emergency.label} on ${site.emergency.phone}, twenty-four hours, or ${site.emergency.cellular} from a cellular phone in Canada.`,
      },
    ],
  },
];

export default function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) =>
      g.entries.map((e) => ({
        "@type": "Question",
        name: e.q,
        acceptedAnswer: { "@type": "Answer", text: e.a },
      })),
    ),
  };

  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <div className="gutter py-11 md:py-14">
          <h1 className="mb-8 text-[32px] tracking-[-0.025em] md:text-[60px] md:tracking-[-0.032em]" style={{ textWrap: "pretty" }}>
            Frequently asked questions
          </h1>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
            <StickyJumpNav
              label="Topics"
              items={GROUPS.map((g) => ({ id: g.id, label: g.title }))}
            />

            <div>
              {GROUPS.map((group, gi) => (
                <section key={group.id} id={group.id} className={`scroll-mt-[130px] ${gi > 0 ? "mt-10" : ""}`}>
                  <h2 className="mb-2 text-[21px] tracking-[-0.015em] md:text-2xl">
                    {group.title}
                  </h2>
                  <div className="border-t border-line">
                    {group.entries.map((entry, i) => (
                      <details
                        key={entry.q}
                        open={gi === 0 && i === 0}
                        className="border-b border-line py-[22px]"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5">
                          <span className="text-[16.5px] md:text-[17.5px]">{entry.q}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6E6B64" strokeWidth="2.5" aria-hidden="true" className="shrink-0">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </summary>
                        <p className="mt-3 max-w-[760px] text-[15px] leading-[1.7] text-ink-2 md:text-[15.5px]" style={{ textWrap: "pretty" }}>
                          {entry.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}

              <div className="mt-10 flex flex-col items-start gap-3 rounded-card border border-line bg-surface px-8 py-8">
                <h2 className="text-[19px] ">Still not answered?</h2>
                <p className="max-w-[52ch] text-[15px] leading-[1.65] text-muted">
                  The order desk answers technical questions without a quote attached. Ask, and
                  someone who fills cylinders will reply.
                </p>
                <div className="mt-1 flex flex-wrap gap-4">
                  <Link href="/quote" className="text-[15px] text-gold-link">Send a question →</Link>
                  <a href={site.orderDesk.phoneHref} className="text-[15px] text-gold-link">
                    {site.orderDesk.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
