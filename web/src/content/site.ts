/**
 * Site-wide, non-translated content.
 * Replace these placeholders with your real data — no other file needs to change.
 */

export const socials = {
  linkedin: "https://www.linkedin.com/in/tu-usuario",
  medium: "https://medium.com/@tu-usuario",
  youtube: "https://www.youtube.com/@tu-usuario",
  github: "https://github.com/tu-usuario",
};

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

export const contactEmail = "tu-email@ejemplo.com";

export const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
