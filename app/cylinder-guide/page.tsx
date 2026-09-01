import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { StickyJumpNav } from "@/components/sticky-jump-nav";
import { Cylinder } from "@/components/cylinder";
import { TableFrame, Th, HazardCallout } from "@/components/ui";
import {
  cgaOutlets, cylinderSizes, tcDotMarkings,
  regulatorSelection, requalification, colourConventions,
} from "@/lib/data/reference";

export const metadata: Metadata = {
  title: "Cylinder & equipment guide",
  description:
    "Cylinder size chart, TC/DOT specification markings, CGA valve outlet connections with verified thread specifications, regulator selection and requalification intervals.",
};

const SECTIONS = [
  { id: "size-chart", label: "Cylinder size chart" },
  { id: "tc-dot", label: "TC/DOT markings" },
  { id: "cga-outlets", label: "CGA outlet chart" },
  { id: "regulator-selection", label: "Regulator selection" },
  { id: "requalification", label: "Requalification" },
  { id: "colour", label: "Colour conventions" },
];

const LINEUP = [
  { shape: "cylinder-300" as const, label: "300", height: 184 },
  { shape: "cylinder-150" as const, label: "150", height: 138 },
  { shape: "cylinder-80" as const, label: "80", height: 112 },
  { shape: "cylinder-40" as const, label: "40", height: 86 },
  { shape: "cylinder-20" as const, label: "20", height: 64 },
  { shape: "dewar" as const, label: "240 L", height: 120 },
];

/** Screen 06 — the reference page that earns search traffic. */
export default function CylinderGuidePage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <PageHero
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Cylinder & Equipment Guide" }]}
          title="Cylinder & equipment guide"
          lede="Sizes, TC/DOT markings, CGA valve outlets, regulator selection and requalification intervals — the reference tables our order desk uses."
        />

        <div className="gutter grid gap-0 pb-16 lg:grid-cols-[232px_1fr]">
          <StickyJumpNav label="On this page" items={SECTIONS} />

          <div className="lg:pl-10">
            {/* ------------------------------------------- Size chart --- */}
            <section id="size-chart" className="scroll-mt-[130px]">
              <h2 className="mb-5 text-[22px] tracking-[-0.018em] md:text-[30px] md:tracking-[-0.022em]">
                Cylinder size chart
              </h2>

              <div className="scroll-x mb-5 flex items-end gap-6 rounded-card border border-line bg-surface p-6 md:gap-8 md:p-8">
                {LINEUP.map((item) => (
                  <div key={item.label} className="flex shrink-0 flex-col items-center gap-3">
                    <Cylinder shape={item.shape} height={item.height} bands={false} />
                    <span className="font-mono text-xs text-muted">{item.label}</span>
                  </div>
                ))}
              </div>

              <TableFrame className="mb-11">
                <table className="w-full min-w-[780px] text-sm">
                  <caption className="sr-only">High-pressure cylinder dimensions and tare weights</caption>
                  <thead>
                    <tr className="bg-surface text-ink">
                      <Th>Size</Th>
                      <Th align="right">Height with cap</Th>
                      <Th align="right">Diameter</Th>
                      <Th align="right">Water capacity</Th>
                      <Th align="right">Tare weight</Th>
                      <Th>Typical spec</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {cylinderSizes.map((row, i) => (
                      <tr key={row.size} data-zebra className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}>
                        <th scope="row" className="px-[18px] py-[13px] text-left ">{row.size}</th>
                        <td className="px-[18px] py-[13px] text-right font-mono ">
                          <span className="block">{row.heightWithCap.mm} <span className="font-normal text-faint">mm</span></span>
                          <span className="block text-muted">{row.heightWithCap.in} <span className="font-normal text-faint">in</span></span>
                        </td>
                        <td className="px-[18px] py-[13px] text-right font-mono ">
                          <span className="block">{row.diameter.mm} <span className="font-normal text-faint">mm</span></span>
                          <span className="block text-muted">{row.diameter.in} <span className="font-normal text-faint">in</span></span>
                        </td>
                        <td className="px-[18px] py-[13px] text-right font-mono ">
                          {row.waterCapacity} <span className="font-normal text-faint">L</span>
                        </td>
                        <td className="px-[18px] py-[13px] text-right font-mono ">
                          <span className="block">{row.tare.kg} <span className="font-normal text-faint">kg</span></span>
                          <span className="block text-muted">{row.tare.lb} <span className="font-normal text-faint">lb</span></span>
                        </td>
                        <td className="px-[18px] py-[13px] font-mono text-ink-2">{row.spec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableFrame>
            </section>

            {/* ----------------------------------------- TC/DOT marks --- */}
            <section id="tc-dot" className="scroll-mt-[130px]">
              <h2 className="mb-2 text-[22px] tracking-[-0.018em] md:text-[30px] md:tracking-[-0.022em]">
                TC/DOT specification markings
              </h2>
              <p className="mb-5 text-[15.5px] text-muted">
                Stamped on the shoulder of every cylinder. TC is the Transport Canada
                designation; DOT is the US equivalent.
              </p>

              <TableFrame className="mb-11">
                <table className="w-full min-w-[720px] text-[14.5px]">
                  <caption className="sr-only">TC and DOT cylinder specification markings</caption>
                  <thead>
                    <tr className="bg-surface text-ink">
                      <Th>Marking</Th>
                      <Th>What it means</Th>
                      <Th>Example</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {tcDotMarkings.map((row, i) => (
                      <tr key={row.marking} data-zebra className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}>
                        <th scope="row" className="px-[18px] py-3 text-left font-mono ">{row.marking}</th>
                        <td className="px-[18px] py-3 text-ink-2" style={{ textWrap: "pretty" }}>{row.meaning}</td>
                        <td className="whitespace-nowrap px-[18px] py-3 font-mono text-ink-2">{row.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableFrame>
            </section>

            {/* -------------------------------------- CGA outlet chart --- */}
            <section id="cga-outlets" className="scroll-mt-[130px]">
              <h2 className="mb-2 text-[22px] tracking-[-0.018em] md:text-[30px] md:tracking-[-0.022em]">
                CGA valve outlet connections
              </h2>
              <p className="mb-5 max-w-[70ch] text-[15.5px] leading-[1.6] text-muted">
                Thread specifications per CGA V-1. Left-hand threads mark flammable service so a
                fuel-gas regulator cannot be fitted to an oxidiser cylinder. Confirm the outlet
                number on the valve before connecting anything.
              </p>

              <TableFrame className="mb-5">
                <table className="w-full min-w-[760px] text-[14.5px]">
                  <caption className="sr-only">CGA valve outlet connections with thread specifications</caption>
                  <thead>
                    <tr className="bg-surface text-ink">
                      <Th>CGA</Th>
                      <Th>Thread specification</Th>
                      <Th>Seal</Th>
                      <Th>Typical service</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {cgaOutlets.map((row, i) => (
                      <tr key={row.cga} data-zebra className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}>
                        <th scope="row" className="px-[18px] py-3 text-left font-mono ">{row.cga}</th>
                        <td className="whitespace-nowrap px-[18px] py-3 font-mono text-ink-2">
                          {row.thread ?? <span className="text-muted">—</span>}
                        </td>
                        <td className="px-[18px] py-3 text-ink-2">
                          {row.seal ?? <span className="text-muted">—</span>}
                        </td>
                        <td className="px-[18px] py-3 text-ink-2" style={{ textWrap: "pretty" }}>{row.service}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableFrame>

              <div className="mb-11">
                <HazardCallout
                  title="Never force a connection that does not thread freely"
                  body="The CGA system is designed so incompatible gases cannot share a connection. If a regulator does not thread on easily and seat squarely by hand, it is the wrong regulator — stop and check the outlet number. Never use an adapter, a bushing or thread tape to make a mismatched fitting work."
                />
              </div>
            </section>

            {/* --------------------------------- Regulator selection --- */}
            <section id="regulator-selection" className="scroll-mt-[130px]">
              <h2 className="mb-2 text-[22px] tracking-[-0.018em] md:text-[30px] md:tracking-[-0.022em]">
                Regulator selection
              </h2>
              <p className="mb-5 text-[15.5px] text-muted">
                Match the regulator to the service, the delivery range and the outlet.
              </p>

              <TableFrame className="mb-11">
                <table className="w-full min-w-[820px] text-[14.5px]">
                  <caption className="sr-only">Regulator selection by service</caption>
                  <thead>
                    <tr className="bg-surface text-ink">
                      <Th>Service</Th>
                      <Th>Type</Th>
                      <Th align="right">Delivery range</Th>
                      <Th>CGA</Th>
                      <Th>Note</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {regulatorSelection.map((row, i) => (
                      <tr key={row.service} data-zebra className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}>
                        <th scope="row" className="px-[18px] py-3 text-left ">{row.service}</th>
                        <td className="px-[18px] py-3 text-ink-2">{row.stages}</td>
                        <td className="whitespace-nowrap px-[18px] py-3 text-right font-mono ">{row.deliveryRange}</td>
                        <td className="px-[18px] py-3 font-mono ">{row.cga}</td>
                        <td className="px-[18px] py-3 text-ink-2" style={{ textWrap: "pretty" }}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableFrame>
            </section>

            {/* ------------------------------------- Requalification --- */}
            <section id="requalification" className="scroll-mt-[130px]">
              <h2 className="mb-2 text-[22px] tracking-[-0.018em] md:text-[30px] md:tracking-[-0.022em]">
                Requalification intervals
              </h2>
              <p className="mb-5 text-[15.5px] text-muted">
                Under CSA B339/B340. The requalification date is stamped on the cylinder shoulder.
              </p>

              <TableFrame className="mb-11">
                <table className="w-full min-w-[720px] text-[14.5px]">
                  <caption className="sr-only">Cylinder requalification intervals</caption>
                  <thead>
                    <tr className="bg-surface text-ink">
                      <Th>Container type</Th>
                      <Th>Interval</Th>
                      <Th>Method</Th>
                      <Th>Standard</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {requalification.map((row, i) => (
                      <tr key={row.containerType} data-zebra className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}>
                        <th scope="row" className="px-[18px] py-3 text-left ">{row.containerType}</th>
                        <td className="whitespace-nowrap px-[18px] py-3 font-mono ">{row.interval}</td>
                        <td className="px-[18px] py-3 text-ink-2">{row.method}</td>
                        <td className="whitespace-nowrap px-[18px] py-3 text-ink-2">{row.standard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableFrame>
            </section>

            {/* ---------------------------------- Colour conventions --- */}
            <section id="colour" className="scroll-mt-[130px]">
              <h2 className="mb-2 text-[22px] tracking-[-0.018em] md:text-[30px] md:tracking-[-0.022em]">
                Cylinder colour conventions
              </h2>
              <p className="mb-5 text-[15.5px] text-muted">
                Listed for orientation only. Read the label, every time.
              </p>

              <TableFrame className="mb-6">
                <table className="w-full text-[14.5px]">
                  <caption className="sr-only">Common cylinder colour conventions</caption>
                  <thead>
                    <tr className="bg-surface text-ink">
                      <Th>Gas</Th>
                      <Th>Common colour</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {colourConventions.map((row, i) => (
                      <tr key={row.gas} data-zebra className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}>
                        <th scope="row" className="px-[18px] py-3 text-left ">{row.gas}</th>
                        <td className="px-[18px] py-3 text-ink-2">{row.colour}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableFrame>

              <HazardCallout
                title="Cylinder colour is a supplier convention, not a legal standard in Canada"
                body="Colours vary between suppliers and between fills. Never identify a gas by the colour of its cylinder — always read the label and confirm the CGA outlet before connecting a regulator."
              />
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
