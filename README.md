# Orion Gases — public website

A 1:1 build of the 12 public screens from *Orion Gases Project Recreation*, on the
stack the design system specifies: **Next.js 15 (App Router) · Tailwind CSS 4 · TypeScript**.

```bash
npm install
npm run dev      # http://localhost:3000 (falls back to 3001 if taken)
npm run build    # 34 routes, 19 products pre-rendered
npm run typecheck
```

The admin panel (screens A01–A02) is deliberately **not** built — that was the
agreed scope.

---

## The one rule that shapes everything

> "There is no cart primitive in this system and none should ever be added."
> — Toronto Gas Design System, §05

There is no price field anywhere in the model and no checkout path anywhere in the
UI. Every commercial action resolves to **quote, call, email or SDS download**.

---

## Screens

| # | Route | Screen |
|---|---|---|
| 01 | `/` | Home |
| 02 | `/gases` | Catalogue + filters |
| 03 | `/gases/[category]/[slug]` | Product — all 16 sections |
| — | `/gases/compare?p=a,b,c` | Comparison mode (max 3) |
| 04 | `/industries` | Ten sectors |
| 05 | `/safety` + `#sds` | Safety & SDS library |
| 06 | `/cylinder-guide` | Reference tables |
| 07 | `/delivery` | Service area |
| 08 | `/cylinder-programs` | Ownership & demurrage |
| ~~09~~ | ~~`/resources`~~ | Knowledge hub — **removed from scope**; `/resources/*` 308s to `/faq` |
| 10 | `/faq` | FAQ (FAQPage schema) |
| 11 | `/about` | Story & timeline |
| 12 | `/quote` | Quote form, pre-fills from a SKU |

---

## ⚠️ Corrections made to the source design

The design document's CGA outlet table contained six errors. Because that page
tells a buyer whether a regulator will physically fit a valve, a wrong thread spec
is a safety defect rather than a cosmetic one. **The verified values are used**, and
every deviation is recorded inline in [`lib/data/reference.ts`](lib/data/reference.ts).

| CGA | Design said | Verified |
|---|---|---|
| 510 | `.885"-14 NGO-LH-INT` | `.825"-14 NGO-LH-INT` |
| 540 | `.903"-14 NGO-RH-EXT` | `.825"-14 NGO-RH-EXT` |
| 590 | `.965"-14 NGO-RH-EXT` | `.965"-14 NGO-**LH-INT**` |
| 660 | Argon-CO₂ shielding mixes | Chlorine / SO₂ / halocarbons — **Ar-CO₂ mixes use CGA 580** |
| 677 | Cryogenic inert liquid withdrawal, RH-EXT | Inert gas at **6,000 psig**, LH-EXT |
| 695 | Bulk inert transfer, `1.125"` | **Hydrogen at 3,500 psig**, `1.045"-14 NGO-LH-INT` |

Sources: Air Products *USA Industrial & Specialty Gas Cylinder CGA Valve Fitting
Specs* (CGA number → thread spec) and Matheson *CGA Valve Outlet & Connection
Chart* (gas → CGA number). CGA 295 is shown with an em dash rather than a guessed
thread — §06 sanctions a dash for "not specified".

### Other deliberate deviations

- **Typography.** The system doc names IBM Plex Sans; every actual screen loads
  **Archivo**. The screens win for a 1:1 build. IBM Plex Mono carries all tabular
  figures (natively tabular — no font-feature override needed).
- **Cylinder valve accent.** §05 says "cyan"; every screen draws it gold-800.
  Followed the screens — cyan would have introduced an undocumented colour.
- **`/faq` was orphaned** in the design (no link anywhere). Added to the footer.
- **"Trusted by" customer wall removed** at the client's direction — naming
  accounts publicly hands competitors a target list. The data was deleted, not
  commented out, so it does not ship in the bundle.
- **Nine categories vs 53 products.** The six featured cards carry the exact counts
  the design specifies (12+9+14+6+5+7 = 53). Propane, Dry Ice and Laser Gases —
  the other three of nine — are modelled as filter views over the same products,
  which is the only way both design figures stay true at once. See
  [`lib/data/categories.ts`](lib/data/categories.ts).

---

## Data

19 fully-specified products with **verified** regulatory identifiers and physical
constants — UN number, CAS, TDG class, GHS pictograms and H-statements, proper
shipping name, grades with per-species impurity limits in ppm, package tables with
TC/DOT specs and CGA outlets, and full handling guidance.

ISO 14175 shielding-gas designations verified: `I1` = 100 % Ar, `M20` = Ar + 5–15 %
CO₂, `M21` = Ar + 15–25 % CO₂, `M13` = Ar + 1.5–3 % O₂.

```
lib/types.ts              Product model — mirrors admin tabs A–J exactly
lib/data/products/        argon · industrial · welding · fuel · specialty
lib/data/reference.ts     CGA, cylinder sizes, TC/DOT, regulators, requalification
lib/data/categories.ts    Nine categories
lib/data/site.ts          Global settings incl. CANUTEC emergency number
```

`lib/types.ts` field groups map 1:1 onto the admin editor tabs, so the Prisma
schema and admin panel drop in later without reshaping the public site.

### Images

Placeholder photography lives in [`lib/data/images.ts`](lib/data/images.ts), keyed
by **category** (product cards, product hero) and **container type** (per-size
thumbnails). Container type is the correct axis: a size 40 argon cylinder is the
same steel cylinder as a size 300, just shorter — so keying off size would produce
false variety, while keying off container correctly distinguishes a cylinder from a
dewar from a manifolded pallet.

All six assets are the ones the design document itself selected, so each subject is
known and verified reachable. Deliberately **not** done: inventing a distinct photo
per gas. Argon and nitrogen cylinders are visually identical, and a unique image per
SKU would imply precision the imagery doesn't have.

This overrides §05's *"line-drawn SVG in place of photography"* at the client's
request. The SVG illustrations are **retained** in the two places where relative
scale is the actual information — the home hero lineup and the cylinder-guide size
chart — because a photograph cannot show that a size 300 is twice the height of a
size 80.

### Layout: the content column

§03 specifies *"Content column — 1280px max · 72px gutters."* That cap is
implemented as the `gutter` utility in [`app/globals.css`](app/globals.css):
1440px max width, centred, with gutters stepping 18 → 56 → 72px. Without it the
layout kept spreading on wide displays and read as sprawling.

Backgrounds stay full-bleed — the utility goes on an inner wrapper, never on the
element carrying the background — so the gold search band, the tinted "why buyers"
band, the sticky product-section nav and the footer still span the viewport while
their contents sit on the column.

### Carousel

[`components/product-carousel.tsx`](components/product-carousel.tsx) sizes cards
from the track width so a whole number fit per view (4 at ≥1280px, 3 at ≥1024px,
2 at ≥640px) — no card is ever bisected at a desktop breakpoint. Mobile keeps an
85% card so the next one peeks, which is the swipe affordance. The prev/next arrows
(from the design document) advance exactly one card by measuring the rendered card
width plus the real gap, and disable at each end.

---

## Design-system behaviours implemented

- **Gold 400 marks hazard and nothing else** — never a button, never a link.
  Gold 800 carries every interactive affordance.
- **Empty sections vanish** from the DOM *and* the sticky nav. Never a heading over
  an empty table. Missing values render as an em dash, never "N/A".
- **Chemical formulae** stored as plain strings, parsed into real `<sub>` at render.
- **All filter state lives in the URL** — every filtered view is shareable and
  crawlable, and the catalogue stays a server component.
- **Unit toggle** (BOTH / METRIC / IMPERIAL) is also URL state; both unit systems
  are stored, so switching is never a rounding operation.
- **Flagship package table becomes stacked cards below 768px** — no horizontal
  scroll. Wide tables elsewhere scroll inside their own container; the body never
  scrolls horizontally.
- **Print** emits sections 2, 3, 7, 8, 9, 13 only; nav/CTAs hidden, zebra fill
  dropped for 1px rules.
- **44px minimum touch targets**, 3px signal-orange focus ring at 2px offset,
  `prefers-reduced-motion` neutralises all animation.
- **CANUTEC emergency number** renders on every safety surface as a global setting.

## Not wired up

The quote form posts to `/api/quote`, which does not exist yet — the field names
are the contract. SDS "Download PDF" links are placeholders (no PDFs supplied).
