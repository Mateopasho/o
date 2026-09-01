import type { Metadata } from "next";
import { Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Reveal } from "@/components/reveal";

/**
 * Typography — premium reformat.
 *
 * One grotesk at a single weight. Schibsted Grotesk replaces Archivo, loaded at
 * 400 and 500 only: the premium document uses font-weight:400 for every single
 * element including 76px headings, so there is deliberately no bold to reach
 * for. Hierarchy comes from size and letter-spacing instead.
 *
 * IBM Plex Mono still carries every figure that sits in a column — it is
 * natively tabular, so specification numbers align without a feature override.
 */
const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oriongases.ca"),
  title: {
    default: "Orion Gases — industrial, welding and specialty gas, spec published",
    template: "%s · Orion Gases",
  },
  description:
    "Industrial, welding, specialty and food-grade gases across Southern Ontario and the GTA, with the complete technical record published — grades, purity limits, cylinder sizes, fill pressures and CGA connections.",
  openGraph: {
    type: "website",
    siteName: "Orion Gases",
    locale: "en_CA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${grotesk.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-white focus:px-4 focus:py-3 focus:text-ink focus:shadow-lg"
        >
          Skip to content
        </a>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
