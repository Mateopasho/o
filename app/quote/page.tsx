import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, MobileTabBar } from "@/components/site-footer";
import { MonoLabel } from "@/components/ui";
import { Cylinder } from "@/components/cylinder";
import { productBySlug, findSku } from "@/lib/data/products";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Request a quote for any Orion Gases product. We reply within one business day, no account needed. No price is published or shown on this site.",
};

/** Screen 12 — master quote form, pre-filled from a SKU row. */
export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const skuParam = one(sp.sku);
  const productParam = one(sp.product);

  const hit = skuParam ? findSku(skuParam) : null;
  const product = hit?.product ?? (productParam ? productBySlug(productParam) : undefined);
  const pack = hit?.pack;

  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-white">
        <div className="gutter grid lg:grid-cols-[1fr_380px]">
          {/* ------------------------------------------------------ Form --- */}
          <div className="py-11 md:py-12 lg:pr-12">
            <h1 className="mb-3 text-[32px] font-semibold tracking-[-0.025em] md:text-[42px]">
              Request a quote
            </h1>
            <p className="mb-8 max-w-[520px] text-[16px] leading-[1.6] text-n-700 md:text-[17px]" style={{ textWrap: "pretty" }}>
              We reply within one business day. No account needed to ask, and no price is
              published or shown on this site.
            </p>

            {/* Pre-filled item card, when arriving from a SKU row. */}
            {product && (
              <div className="mb-8 flex flex-col gap-4 rounded-[3px] bg-gold-100 px-5 py-4 sm:flex-row sm:items-center">
                <Cylinder
                  shape={pack?.shape ?? product.packages[0]?.shape ?? "cylinder-150"}
                  height={56}
                  strokeWidth={3}
                  bodyStroke="#816412"
                  bands={false}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[15.5px] font-semibold text-gold-800">
                    {product.name}
                    {pack ? ` — ${pack.size}` : ""}
                  </span>
                  <span className="font-mono text-[13px] text-gold-800">
                    {pack
                      ? `SKU ${pack.sku} · CGA ${pack.cga} · ${pack.contents.imperial} ${pack.contents.imperialUnit}`
                      : `${product.unNumber} · ${product.packages.length} configurations`}
                  </span>
                </div>
                <Link
                  href={`/gases/${product.categorySlug}/${product.slug}#packages`}
                  className="text-[13.5px] text-gold-800 underline sm:ml-auto"
                >
                  Change item
                </Link>
              </div>
            )}

            {/*
              Posts to a placeholder endpoint. Wiring this to the order desk
              (email or CRM) is a server-action change only — the field names
              below are the contract.
            */}
            <form action="/api/quote" method="post" className="max-w-[720px]">
              {product && <input type="hidden" name="product" value={product.slug} />}
              {pack && <input type="hidden" name="sku" value={pack.sku} />}

              <div className="mb-[26px] grid gap-5 sm:grid-cols-2">
                <Field id="name" name="name" label="Full name" required autoComplete="name" />
                <Field id="company" name="company" label="Company" required autoComplete="organization" />
                <Field id="email" name="email" label="Email" type="email" required autoComplete="email" hint="Enter a complete email address" />
                <Field id="phone" name="phone" label="Phone" type="tel" autoComplete="tel" />
                <Field
                  id="postal"
                  name="postalCode"
                  label="Delivery postal code"
                  autoComplete="postal-code"
                  hint="Confirms you're inside the service area"
                />
                <Field id="volume" name="monthlyVolume" label="Estimated monthly volume" />

                <div className="flex flex-col gap-[7px] sm:col-span-2">
                  <label htmlFor="detail" className="text-[13.5px] font-medium">
                    Application or additional detail
                  </label>
                  <textarea
                    id="detail"
                    name="detail"
                    rows={4}
                    className="min-h-[110px] rounded-[3px] border border-n-200 px-3.5 py-3 text-[15px] outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              <fieldset className="mb-7 flex flex-col gap-3">
                <legend className="mb-1 text-[13.5px] font-medium">Delivery preference</legend>
                <div className="flex flex-wrap gap-x-7 gap-y-3">
                  {["Scheduled delivery", "On-demand", "Depot pickup", "Bulk installation"].map((option) => (
                    <label key={option} className="flex min-h-11 items-center gap-2.5 text-[14.5px]">
                      <input
                        type="checkbox"
                        name="delivery"
                        value={option}
                        className="size-[18px] rounded-[2px] border border-n-200 accent-[var(--color-gold-600)]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                className="inline-flex h-[52px] items-center rounded-[3px] bg-linear-[180deg,var(--color-gold-300)_0%,var(--color-gold-400)_100%] px-[30px] text-base font-medium text-n-900 transition-colors duration-150 hover:bg-gold-300"
              >
                Send request
              </button>

              <p className="mt-4 text-[12.5px] leading-[1.6] text-n-600">
                Protected by an invisible challenge. We use your details only to prepare and
                follow up on this quote.
              </p>
            </form>
          </div>

          {/* ------------------------------------------------- Contact rail --- */}
          <aside className="flex flex-col gap-7 border-t border-n-100 bg-n-25 py-11 md:px-8 lg:border-l lg:border-t-0 lg:py-12">
            <div className="flex flex-col gap-2">
              <MonoLabel>Order desk</MonoLabel>
              <a href={site.orderDesk.phoneHref} className="font-mono text-[22px] font-medium text-n-900">
                {site.orderDesk.phone}
              </a>
              <span className="text-sm text-n-600">{site.orderDesk.hours}</span>
            </div>

            <div className="flex flex-col gap-2">
              <MonoLabel>Email</MonoLabel>
              <a href={`mailto:${site.orderDesk.email}`} className="text-[15.5px] text-gold-800">
                {site.orderDesk.email}
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <MonoLabel>Depot &amp; fill plant</MonoLabel>
              <span className="text-[15px] leading-[1.6] text-n-800">
                {site.depot.address.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
                <span className="block">Pickup until {site.depot.pickupUntil}</span>
              </span>
            </div>

            <div className="flex h-[190px] items-center justify-center rounded-[3px] border border-n-100 bg-n-100 font-mono text-[11px] uppercase tracking-[0.12em] text-n-600">
              Embedded map
            </div>

            <div className="flex flex-col gap-2 rounded-[3px] border border-gold-300 border-l-[3px] border-l-gold-400 bg-gold-100 px-5 py-[18px]">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold-800">
                Emergency
              </span>
              <a href={site.emergency.phoneHref} className="font-mono text-[17px] font-medium text-n-900">
                {site.emergency.phone}
              </a>
              <span className="text-[13px] text-n-800">
                {site.emergency.label}, 24 hours · or {site.emergency.cellular} from a cell
              </span>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
      <MobileTabBar />
    </>
  );
}

/**
 * Labels are always visible above the field.
 * Design system 05: "Never placeholder-as-label."
 */
function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={id} className="text-[13.5px] font-medium">
        {label}
        {required && <span className="text-gold-800"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="h-[46px] rounded-[3px] border border-n-200 px-3.5 text-[15px] outline-none focus:border-gold-600"
      />
      {hint && (
        <span id={`${id}-hint`} className="text-[12.5px] text-n-600">
          {hint}
        </span>
      )}
    </div>
  );
}
