import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The six category photographs specified in the design document are hosted
    // on Unsplash. Every other visual in the system is a line-drawn inline SVG,
    // per the design system's "line-drawn SVG in place of photography" rule.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },

  /**
   * The design document's "Resources" knowledge hub (screen 09) was removed from
   * scope. These redirects exist so any inbound link — a bookmark, a search
   * result, an old email — lands somewhere useful instead of a 404.
   *
   * 308 (permanent) rather than 307, so search engines drop the old URLs and
   * transfer any accumulated ranking signal to the FAQ.
   */
  async redirects() {
    return [
      { source: "/resources", destination: "/faq", permanent: true },
      { source: "/resources/:slug*", destination: "/faq", permanent: true },
    ];
  },
};

export default nextConfig;
