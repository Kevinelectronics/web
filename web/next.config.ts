import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Permanent (308) so Google consolidates signals on the canonical URL.
  // The next-intl proxy would otherwise answer these with a temporary 307.
  async redirects() {
    return [
      // One host only: www duplicates the whole site.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kevinmeneses.com" }],
        destination: "https://kevinmeneses.com/:path*",
        permanent: true,
      },
      // Pre-i18n article URLs (all Spanish) still indexed by Google.
      { source: "/articles", destination: "/es/articles", permanent: true },
      { source: "/articles/:slug", destination: "/es/articles/:slug", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "*.onrender.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
