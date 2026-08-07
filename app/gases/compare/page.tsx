import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { Breadcrumb, PrimaryButton, TableFrame, Th } from "@/components/ui";
import { Formula, PropertyValue } from "@/lib/format";
import { products, productBySlug } from "@/lib/data/products";
import { maxPurity, cgaOutlets } from "@/lib/types";

export const metadata: Metadata = {
  title: "Compare products",
  description: "Compare up to three Orion Gases products side by side on purity, connection, physical properties and package options.",
};

/** Design system 7.4 — comparison mode, maximum of three products. */
const MAX = 3;

/** Rows are drawn from the properties every gas publishes, so columns align. */
const SHARED_ROWS = [
  "Molecular weight",
  "Gas density @ 15 °C",
  "Boiling point",
  "Specific gravity (air = 1)",
  "Critical temperature",
  "Expansion ratio",
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.p) ? sp.p : sp.p ? sp.p.split(",") : [];
  const selected = raw
    .flatMap((s) => s.split(","))
    .map((slug) => productBySlug(slug.trim()))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, MAX);

  const removeHref = (slug: string) => {
    const rest = selected.filter((p) => p.slug !== slug).map((p) => p.slug);
    return rest.length ? `/gases/compare?p=${rest.join(",")}` : "/gases/compare";
  };

  const addHref = (slug: string) =>
    `/gases/compare?p=${[...selected.map((p) => p.slug), slug].join(",")}`;

  const addable = products.filter((p) => !selected.some((s) => s.slug === p.slug));

  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <div className="gutter py-11 md:py-12">
          <Breadcrumb
            trail={[{ label: "Home", href: "/" }, { label: "Gases", href: "/gases" }, { label: "Compare" }]}
          />

          <div className="mb-8 mt-[18px] flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="text-[28px] font-semibold tracking-[-0.022em] md:text-[36px]">
              {selected.length > 0 ? `Comparing ${selected.length} product${selected.length === 1 ? "" : "s"}` : "Compare products"}
            </h1>
            <p className="text-[14.5px] text-n-600">
              Maximum of {MAX}
              {selected.length > 0 && (
                <>
                  {" · "}
                  <Link href="/gases/compare" className="text-gold-800 underline">Clear</Link>
                </>
              )}
            </p>
          </div>

          {selected.length === 0 ? (
            <div className="flex flex-col items-start gap-4 rounded-[4px] border border-n-100 bg-n-25 px-8 py-12">
              <p className="text-[17px] font-medium">Pick up to three products to compare.</p>
              <p className="max-w-[52ch] text-[15px] leading-[1.65] text-n-600">
                Comparison lines up purity, CGA connection, physical properties and package
                count so you can settle a specification without opening three tabs.
              </p>
              <Link href="/gases" className="text-[15px] font-medium text-gold-800">
                Browse the catalogue →
              </Link>
            </div>
          ) : (
            <>
              <TableFrame className="mb-8">
                <table className="w-full min-w-[720px] text-[14.5px]">
                  <caption className="sr-only">Product comparison</caption>
                  <thead>
                    <tr className="bg-n-25 text-n-900">
                      <Th className="w-[220px]">Property</Th>
                      {selected.map((product) => (
                        <th key={product.slug} scope="col" className="px-5 py-4 text-right align-top">
                          <span className="block text-[17px] font-semibold">
                            {product.name}{" "}
                            {product.formula && (
                              <span className="font-mono text-[13px] font-normal text-n-600">
                                <Formula value={product.formula} />
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block font-mono text-[11.5px] font-normal text-n-600">
                            {product.unNumber}
                          </span>
                          <Link
                            href={removeHref(product.slug)}
                            className="mt-1.5 inline-block text-[12.5px] font-normal text-gold-800 underline"
                          >
                            Remove
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <Row label="TDG class" zebra>
                      {selected.map((p) => (
                        <Cell key={p.slug}>{p.tdgClass}</Cell>
                      ))}
                    </Row>
                    <Row label="Highest purity">
                      {selected.map((p) => {
                        const purity = maxPurity(p);
                        return (
                          <Cell key={p.slug}>
                            {purity && purity !== "—" ? (
                              <>
                                {purity} <span className="font-normal text-n-400">%</span>
                              </>
                            ) : (
                              <span className="text-n-600">—</span>
                            )}
                          </Cell>
                        );
                      })}
                    </Row>
                    <Row label="CGA outlet" zebra>
                      {selected.map((p) => (
                        <Cell key={p.slug}>{cgaOutlets(p).join(" · ")}</Cell>
                      ))}
                    </Row>

                    {SHARED_ROWS.map((label, i) => (
                      <Row key={label} label={label} zebra={i % 2 === 1}>
                        {selected.map((p) => {
                          const row = p.properties.find((r) => r.label === label);
                          return (
                            <Cell key={p.slug}>
                              {row ? <PropertyValue value={row.value} /> : <span className="text-n-600">—</span>}
                            </Cell>
                          );
                        })}
                      </Row>
                    ))}

                    <Row label="Package options">
                      {selected.map((p) => (
                        <Cell key={p.slug}>{p.packages.length}</Cell>
                      ))}
                    </Row>
                    <Row label="Hazard" zebra>
                      {selected.map((p) => (
                        <td key={p.slug} className="px-5 py-3.5 text-right text-[14px] text-n-800">
                          {p.hazardSummary}
                        </td>
                      ))}
                    </Row>
                    <Row label="">
                      {selected.map((p) => (
                        <td key={p.slug} className="px-5 py-4 text-right">
                          <PrimaryButton href={`/quote?product=${p.slug}`} size="sm">
                            Request a quote
                          </PrimaryButton>
                        </td>
                      ))}
                    </Row>
                  </tbody>
                </table>
              </TableFrame>

              {selected.length < MAX && (
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-n-600">
                    Add a product
                  </span>
                  <ul className="flex flex-wrap gap-2">
                    {addable.slice(0, 12).map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={addHref(product.slug)}
                          className="inline-flex h-9 items-center rounded-[3px] border border-n-100 px-3.5 text-[13.5px] text-n-800 hover:border-gold-600 hover:text-gold-800"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}

function Row({
  label,
  children,
  zebra = false,
}: {
  label: string;
  children: React.ReactNode;
  zebra?: boolean;
}) {
  return (
    <tr data-zebra className={`border-b border-n-100 last:border-0 ${zebra ? "bg-n-25" : ""}`}>
      <th scope="row" className="px-5 py-3.5 text-left font-semibold">
        {label}
      </th>
      {children}
    </tr>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-3.5 text-right font-mono font-medium">{children}</td>;
}
