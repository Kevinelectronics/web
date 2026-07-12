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
export const profilePhoto: string | null = null;

export type Company = {
  name: string;
  /** Optional path under /public, e.g. "/logos/acme.svg". Leave empty for a text badge. */
  logoUrl?: string;
  url?: string;
};

export const companies: Company[] = [
  { name: "Empresa Uno" },
  { name: "Empresa Dos" },
  { name: "Empresa Tres" },
  { name: "Empresa Cuatro" },
  { name: "Empresa Cinco" },
];

// TODO: swap for a @kevinmeneses.com address once you set up email on the domain.
export const contactEmail = "kevinmenesesgonzalez@gmail.com";

export const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
