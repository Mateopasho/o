import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { Breadcrumb, MonoLabel, TableFrame, Th, HazardCallout } from "@/components/ui";
import { TdgChip } from "@/components/ghs";
import { getSdsLibrary } from "@/lib/catalogue";
import { segregation } from "@/lib/data/reference";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Safety & compliance",
  description:
    "WHMIS 2015, TDG basics, cylinder handling and storage, segregation distances per CGA P-1, and the full searchable Safety Data Sheet library in English and French.",
};

const TOPICS = [
  {
    n: "01",
    title: "WHMIS 2015",
    body: "Pictograms, signal words, hazard and precautionary statements, and what a compliant workplace label must carry.",
    cta: "Safety questions answered →",
    href: "/faq#safety",
  },
  {
    n: "02",
    title: "TDG basics",
    body: "Classes 2.1, 2.2, 2.3 and 5.1, proper shipping names, placarding thresholds and when an ERAP applies.",
    cta: "See the SDS library →",
    href: "#sds",
  },
  {
    n: "03",
    title: "Training we offer",
    body: "On-site cylinder handling sessions, WHMIS refreshers and confined-space oxygen monitoring briefings.",
    cta: "Book a session →",
    href: "/quote",
  },
];

export default async function SafetyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = ((Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "").trim().toLowerCase();
  const lang = (Array.isArray(sp.lang) ? sp.lang[0] : sp.lang) ?? "all";

  let library = await getSdsLibrary();
  if (lang === "EN" || lang === "FR") library = library.filter((r) => r.language === lang);
  if (q) {
    library = library.filter((r) =>
      `${r.product} ${r.unNumber} ${r.tdgClass} ${r.phase}`.toLowerCase().includes(q),
    );
  }

  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        {/* Emergency panel is a global setting — it appears on every safety surface. */}
        <section className="gutter py-10 md:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_400px] lg:gap-14">
            <div>
              <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Safety & Compliance" }]} />
              <h1 className="mb-4 mt-[18px] text-[32px] tracking-[-0.025em] md:text-[60px] md:tracking-[-0.032em]">
                Safety &amp; compliance
              </h1>
              <p className="max-w-[560px] text-[16px] leading-[1.6] text-muted md:text-[18px]" style={{ textWrap: "pretty" }}>
                WHMIS 2015, TDG basics, cylinder handling and storage, segregation, leak
                response and the full Safety Data Sheet library.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 rounded-card border border-line border-l-4 border-l-gold px-7 py-[26px]">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-link">
                Emergency — 24 hours
              </span>
              <a href={site.emergency.phoneHref} className="font-mono text-2xl text-ink md:text-[34px] md:tracking-[-0.024em]">
                {site.emergency.phone}
              </a>
              <span className="text-sm text-muted">
                {site.emergency.label} · or {site.emergency.cellular} from a cellular phone in Canada
              </span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- Topics --- */}
        <section className="gutter md:px-14">
          <ul className="mb-12 grid gap-6 md:grid-cols-3">
            {TOPICS.map((topic) => (
              <li key={topic.n} className="flex flex-col gap-3 rounded-card border border-line p-[26px]">
                <MonoLabel>{topic.n}</MonoLabel>
                <h2 className="text-[20px] ">{topic.title}</h2>
                <p className="text-[15px] leading-[1.6] text-muted" style={{ textWrap: "pretty" }}>
                  {topic.body}
                </p>
                <Link href={topic.href} className="mt-auto pt-3.5 text-[14.5px] text-gold-link">
                  {topic.cta}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------- Storage & segregation --- */}
        <section id="segregation" className="gutter scroll-mt-[130px]">
          <h2 className="mb-2 text-2xl tracking-[-0.018em] md:text-[32px] md:tracking-[-0.022em]">
            Storage &amp; segregation
          </h2>
          <p className="mb-[22px] text-[15.5px] text-muted">
            Minimum separation between stored classes, per CGA P-1 practice.
          </p>

          <TableFrame className="mb-6">
            <table className="w-full min-w-[720px] text-[14.5px]">
              <caption className="sr-only">Minimum separation distances between stored gas classes</caption>
              <thead>
                <tr className="bg-surface text-ink">
                  <Th>Store</Th>
                  <Th>Away from</Th>
                  <Th align="right">Minimum separation</Th>
                  <Th>Alternative</Th>
                </tr>
              </thead>
              <tbody>
                {segregation.map((row, i) => (
                  <tr key={row.store} data-zebra className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}>
                    <th scope="row" className="px-5 py-3.5 text-left ">{row.store}</th>
                    <td className="px-5 py-3.5 text-ink-2">{row.awayFrom}</td>
                    <td className="px-5 py-3.5 text-right font-mono ">
                      {typeof row.separation === "string" ? (
                        <span className={row.separation === "—" ? "text-muted" : "font-sans font-normal text-ink-2"}>
                          {row.separation}
                        </span>
                      ) : (
                        <>
                          <span className="block">
                            {row.separation.m} <span className="font-normal text-faint">m</span>
                          </span>
                          <span className="block text-muted">
                            {row.separation.ft} <span className="font-normal text-faint">ft</span>
                          </span>
                        </>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink-2">
                      {row.alternative ?? <span className="text-muted">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>

          <div className="mb-12">
            <HazardCallout
              title="Oxygen is not a substitute for compressed air"
              body="Oxygen does not burn, but it makes everything else burn far more readily. Never use oxygen to blow down equipment, pressurise a line, or cool a work area — and never lubricate any part of an oxygen system. Oil in a high-pressure oxygen stream can ignite spontaneously."
            />
          </div>
        </section>

        {/* ------------------------------------------------- SDS library --- */}
        <section id="sds" className="gutter scroll-mt-[130px] pb-16">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-2 text-2xl tracking-[-0.018em] md:text-[32px] md:tracking-[-0.022em]">
                Safety Data Sheet library
              </h2>
              <p className="text-[15.5px] text-muted">
                Every SDS in the catalogue, current version. English and French.
              </p>
            </div>

            <form action="/safety" className="flex gap-2.5">
              <input type="hidden" name="anchor" value="sds" />
              <div className="flex h-11 w-full items-center gap-2.5 rounded-full border border-line px-3.5 md:w-[300px]">
                <label htmlFor="sds-search" className="sr-only">Search by product or UN number</label>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6E6B64" strokeWidth="2" aria-hidden="true" className="shrink-0">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M16 16l5 5" />
                </svg>
                <input
                  id="sds-search"
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder="Search by product or UN number"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <label htmlFor="sds-lang" className="sr-only">Language</label>
              <select
                id="sds-lang"
                name="lang"
                defaultValue={lang}
                className="h-11 rounded-full border border-line bg-white px-3.5 text-sm"
              >
                <option value="all">All</option>
                <option value="EN">EN</option>
                <option value="FR">FR</option>
              </select>
              <button type="submit" className="h-11 rounded-full border border-line px-3.5 text-sm ">
                Search
              </button>
            </form>
          </div>

          {library.length > 0 ? (
            <TableFrame>
              <table className="w-full min-w-[780px] text-[14.5px]">
                <caption className="sr-only">Safety Data Sheet library</caption>
                <thead>
                  <tr className="bg-surface text-ink">
                    <Th>Product</Th>
                    <Th>UN</Th>
                    <Th>TDG class</Th>
                    <Th>Phase</Th>
                    <Th>Language</Th>
                    <Th>Version</Th>
                    <Th>Revised</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {library.map((row, i) => (
                    <tr
                      key={`${row.slug}-${row.language}-${row.phase}`}
                      data-zebra
                      className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}
                    >
                      <th scope="row" className="px-5 py-[13px] text-left ">{row.product}</th>
                      <td className="px-5 py-[13px] font-mono">{row.unNumber}</td>
                      <td className="px-5 py-[13px]"><TdgChip tdgClass={row.tdgClass} /></td>
                      <td className="px-5 py-[13px] text-ink-2">{row.phase}</td>
                      <td className="px-5 py-[13px] font-mono">{row.language}</td>
                      <td className="px-5 py-[13px] font-mono">{row.version}</td>
                      <td className="px-5 py-[13px] font-mono">{row.revised}</td>
                      <td className="px-5 py-[13px] text-right">
                        <span className="text-gold-link">Download</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableFrame>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-card border border-line bg-surface px-8 py-12">
              <p className="text-[17px] ">No Safety Data Sheet matches that search.</p>
              <Link href="/quote" className="text-[15px] text-gold-link">
                Ask the order desk →
              </Link>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
