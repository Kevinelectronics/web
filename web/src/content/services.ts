import type { Locale } from "@/i18n/routing";

/**
 * Service landing pages. Each one lives at /<locale>/<slug> with a slug
 * localized per language (it's the keyword the page targets). Copy lives in
 * messages/<locale>.json under `services.<id>`.
 */
export const serviceIds = ["copywriting", "technical", "youtube", "linkedin"] as const;
export type ServiceId = (typeof serviceIds)[number];

export const serviceSlugs: Record<ServiceId, Record<Locale, string>> = {
  copywriting: { es: "copywriter-saas-b2b", en: "b2b-saas-copywriter" },
  technical: { es: "redactor-tecnico-saas", en: "saas-technical-writer" },
  youtube: { es: "creacion-contenido-youtube-saas", en: "youtube-content-creation-saas" },
  linkedin: { es: "contenido-linkedin-b2b", en: "linkedin-ghostwriter" },
};

/** Finds which service (and in which locale) a URL slug belongs to. */
export function findServiceBySlug(
  slug: string,
): { id: ServiceId; locale: Locale } | null {
  for (const id of serviceIds) {
    for (const [locale, localizedSlug] of Object.entries(serviceSlugs[id])) {
      if (localizedSlug === slug) return { id, locale: locale as Locale };
    }
  }
  return null;
}

export function servicePath(id: ServiceId, locale: Locale): string {
  return `/${serviceSlugs[id][locale]}`;
}
