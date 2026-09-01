import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Formula } from "@/lib/format";
import { productImage } from "@/lib/data/images";
import { GhsRow } from "./ghs";

/**
 * Catalogue product card.
 *
 * Design system 05: "Whole card is one link. No price, no cart button, no stock
 * count." The visual is placeholder photography keyed to container type — see
 * lib/data/images.ts for why that overrides the system's SVG-only rule.
 */
export function ProductCard({ product }: { product: Product }) {
  const image = productImage(product, 600);

  return (
    <Link
      href={`/gases/${product.categorySlug}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line text-ink transition-colors duration-150 hover:border-ink hover:text-ink"
    >
      <div className="relative h-[170px] border-b border-line bg-surface">
        <Image
          src={image.src}
          alt={image.alt}
          width={600}
          height={340}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="size-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-gold-ribbon px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gold-link">
          {product.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[11px] p-[18px]">
        <div className="flex items-start justify-between gap-[10px]">
          <span className="text-[19px] ">
            {product.name}{" "}
            {product.formula && (
              <span className="font-mono text-sm font-normal text-muted">
                <Formula value={product.formula} />
              </span>
            )}
          </span>
          <GhsRow types={product.pictograms} size={24} />
        </div>

        <span className="text-sm leading-[1.5] text-muted" style={{ textWrap: "pretty" }}>
          {product.tagline}
        </span>

        <div className="mt-auto flex flex-wrap gap-x-[14px] gap-y-1 border-t border-line pt-[11px] font-mono text-[11.5px] text-muted">
          <span>
            {product.packages.length} size{product.packages.length === 1 ? "" : "s"}
          </span>
          <span>
            {product.grades.length} grade{product.grades.length === 1 ? "" : "s"}
          </span>
          <span>{product.unNumber}</span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Home-page carousel card.
 *
 * Sizing is owned by the carousel track, not the card: the track derives a width
 * that fits a whole number of cards per view. The card just fills its slot.
 */
export function FeaturedCard({ product }: { product: Product }) {
  const sizes = product.packages.slice(0, 3).map((p) => p.size);

  return (
    <div className="flex h-full w-full flex-col gap-[13px] rounded-card border border-line bg-white p-4 transition-colors duration-200 hover:border-line md:p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.12em] text-muted">
          {product.packages[0]?.sku.replace(/-[A-Z0-9]+$/, "") ?? product.slug}
        </span>
        {product.featuredBadge && (
          <span className="rounded-full bg-gold-ribbon px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-gold-link">
            {product.featuredBadge}
          </span>
        )}
      </div>

      <h3 className="mt-1 text-[18px] tracking-[-0.012em] md:text-[21px]">
        {product.name}{" "}
        {product.formula && (
          <span className="font-mono text-[13px] font-normal text-muted md:text-[15px]">
            <Formula value={product.formula} />
          </span>
        )}
      </h3>

      <span className="text-[13.5px] leading-[1.55] text-muted md:text-[14.5px]" style={{ textWrap: "pretty" }}>
        {product.tagline}
      </span>

      <div className="hidden flex-wrap gap-[6px] md:flex">
        {sizes.map((size) => (
          <span
            key={size}
            className="rounded-full border border-line bg-surface px-[9px] py-[5px] font-mono text-[11px] text-muted"
          >
            {size}
          </span>
        ))}
      </div>

      <div className="mt-auto flex gap-4 border-t border-line pt-[14px]">
        <Link href={`/quote?product=${product.slug}`} className="text-sm text-gold-link">
          Request a quote
        </Link>
        <Link
          href={`/gases/${product.categorySlug}/${product.slug}`}
          className="hidden text-sm text-muted hover:text-gold-link md:inline"
        >
          Full spec →
        </Link>
      </div>
    </div>
  );
}

/** Compact related-product tile used at the foot of a product page. */
export function RelatedTile({ product }: { product: Product }) {
  return (
    <Link
      href={`/gases/${product.categorySlug}/${product.slug}`}
      className="flex flex-col gap-[9px] rounded-card border border-line p-5 text-ink transition-colors duration-150 hover:border-ink hover:text-ink"
    >
      <span className="text-[17px] ">
        {product.name}{" "}
        {product.formula && (
          <span className="font-mono text-[13px] font-normal text-muted">
            <Formula value={product.formula} />
          </span>
        )}
      </span>
      <span className="text-[13.5px] leading-[1.5] text-muted">{product.tagline}</span>
      <span className="mt-1.5 font-mono text-[11.5px] text-muted">
        {product.unNumber} · CGA {product.compatibility.cga}
      </span>
    </Link>
  );
}
