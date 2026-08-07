import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { TableFrame, Th } from "@/components/ui";
import { cylinderPrograms } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Cylinder programs",
  description:
    "How cylinder ownership, exchange, rental, lease, demurrage and returns work at Orion Gases. Policy explained in full; rates are quoted per account.",
};

const POLICIES = [
  {
    title: "Demurrage, explained",
    body: "A daily charge that starts once a rented cylinder has been on site past its free period. It exists to keep cylinders circulating rather than accumulating in a corner of your yard. Return empties on your route day and it never applies.",
  },
  {
    title: "Returns",
    body: "Empties are collected on your scheduled route or accepted at the depot. Valve caps must be fitted; damaged or contaminated cylinders are assessed individually before they re-enter the fill line.",
  },
  {
    title: "Lost cylinder policy",
    body: "Cylinders unaccounted for after the agreed period are invoiced at replacement value. We send a monthly balance report so nothing goes missing quietly — most discrepancies turn out to be a cylinder behind a door.",
  },
];

/** Screen 08 — ownership models, demurrage policy, returns. Policy only, no rates. */
export default function CylinderProgramsPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <PageHero
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Cylinder Programs" }]}
          title="Cylinder programs"
          lede="How ownership, exchange, demurrage and returns work. Rates are quoted per account — nothing is published here."
        />

        <div className="gutter pb-16">
          <TableFrame className="mb-11">
            <table className="w-full min-w-[760px] text-[14.5px]">
              <caption className="sr-only">Cylinder ownership models compared</caption>
              <thead>
                <tr className="bg-n-25 text-n-900">
                  <Th className="w-[220px]">Model</Th>
                  <Th>Who owns the cylinder</Th>
                  <Th>Requalification</Th>
                  <Th>Best for</Th>
                </tr>
              </thead>
              <tbody>
                {cylinderPrograms.map((row, i) => (
                  <tr key={row.model} data-zebra className={`border-b border-n-100 last:border-0 ${i % 2 === 1 ? "bg-n-25" : ""}`}>
                    <th scope="row" className="px-5 py-[15px] text-left font-semibold">{row.model}</th>
                    <td className="px-5 py-[15px] text-n-800">{row.owner}</td>
                    <td className="px-5 py-[15px] text-n-800">{row.requalification}</td>
                    <td className="px-5 py-[15px] text-n-800">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>

          <ul className="grid gap-6 md:grid-cols-3">
            {POLICIES.map((policy) => (
              <li key={policy.title} className="flex flex-col gap-2.5 rounded-[4px] border border-n-100 p-[26px]">
                <h2 className="text-[19px] font-semibold">{policy.title}</h2>
                <p className="text-[15px] leading-[1.65] text-n-700" style={{ textWrap: "pretty" }}>
                  {policy.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
