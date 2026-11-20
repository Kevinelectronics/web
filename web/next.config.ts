import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const cmsOrigin = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

// 'unsafe-inline' scripts stay allowed: Next's hydration payload and the GA
// snippet are inline, and nonces would force every page to render dynamically
// (losing the static/ISR cache). The origin allow-list still blocks loading
// or exfiltrating to arbitrary hosts.
const contentSecurityPolicy = [
  "default-src 'self'",
  // youtube.com/iframe_api is injected by GA4 enhanced measurement (video tracking).
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.youtube.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.google-analytics.com https://*.googletagmanager.com https://i.ytimg.com https://vercel.live https://vercel.com",
  "font-src 'self' data:",
  "media-src 'self' https://res.cloudinary.com",
  `connect-src 'self' ${cmsOrigin} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://vercel.live wss://ws-us3.pusher.com`,
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://vercel.live",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Skipped locally, where the CMS runs on plain http://localhost:1337.
  ...(cmsOrigin.startsWith("https://") ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
      // Exact hosts only: a wildcard like *.onrender.com would let any app
      // on Render feed images through our optimizer (quota + attack surface).
      {
        protocol: "https",
        hostname: "kevin-personal-website-cms.onrender.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/f8d8xtx1/**",
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
