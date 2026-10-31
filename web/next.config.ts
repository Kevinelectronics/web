import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Next's default list of bots that get metadata rendered in <head> leaves
  // out Googlebot (it assumes JS rendering). With streamed metadata, routes
  // with a loading.tsx (articles) emit canonical/hreflang in <body>, which
  // Google ignores — it then picks its own canonical. Default list + Googlebot.
  htmlLimitedBots:
    /Googlebot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i,
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
