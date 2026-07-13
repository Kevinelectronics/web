/**
 * Site-wide, non-translated content.
 * Replace these placeholders with your real data — no other file needs to change.
 */

export const socials = {
  linkedin: "https://www.linkedin.com/in/kevin-meneses-gonzalez/",
  medium: "https://medium.com/@kevinmenesesgonzalez",
  youtube: "https://www.youtube.com/@pythonia6131",
  github: "https://github.com/KevinElectronics",
};

/**
 * Path under /public. Drop your real photo at web/public/photo.jpg (or .png)
 * and update this path — until then the hero shows a monogram placeholder.
 */
export const profilePhoto: string | null = "/photo.jpg";

/**
 * Path under /public for a secondary, square/circle-cropped portrait used
 * as a small avatar (e.g. next to the closing CTA). Leave null to hide it.
 */
export const avatarPhoto: string | null = "/photo-avatar.jpg";

export type Company = {
  name: string;
  /** Optional path under /public, e.g. "/logos/acme.svg". Leave empty for a text badge. */
  logoUrl?: string;
  url?: string;
};

/**
 * Drop the matching image files into web/public/logos/ using these exact
 * filenames (any of .png/.svg/.webp — just update the extension below to
 * match what you drop in) and the logos will render automatically.
 */
export const companies: Company[] = [
  {
    name: "EODHD APIs",
    logoUrl: "/logos/eodhd.png",
    url: "https://eodhd.com",
  },
  {
    name: "ZenRows",
    logoUrl: "/logos/zenrows.png",
    url: "https://www.zenrows.com",
  },
  {
    name: "Decodo",
    logoUrl: "/logos/decodo.png",
    url: "https://decodo.com",
  },
  {
    name: "IronPDF",
    logoUrl: "/logos/ironpdf.png",
    url: "https://ironpdf.com",
  },
  {
    name: "Bluehost",
    logoUrl: "/logos/bluehost.png",
    url: "https://www.bluehost.com",
  },
];

// TODO: swap for a @kevinmeneses.com address once you set up email on the domain.
export const contactEmail = "kevinmenesesgonzalez@gmail.com";

export const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/** Canonical production origin, used to build absolute URLs for SEO metadata (sitemap, canonical, OG). */
export const siteUrl = "https://kevinmeneses.com";
