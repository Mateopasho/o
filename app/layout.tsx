import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Reveal } from "@/components/reveal";

/**
 * Typography.
 *
 * The design system document names IBM Plex Sans, but every screen in the design
 * document loads Archivo for interface and prose. The screens are authoritative
 * for a 1:1 build, so Archivo is used with IBM Plex Mono for all tabular figures
 * — Plex Mono is natively tabular, so specification numbers align in a column
 * without a font-feature override.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
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
    <html lang="en-CA" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-[3px] focus:bg-white focus:px-4 focus:py-3 focus:text-n-900 focus:shadow-lg"
        >
          Skip to content
        </a>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
