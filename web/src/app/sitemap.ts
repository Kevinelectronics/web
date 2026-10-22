import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/content/site";
import { getArticles } from "@/lib/strapi";
import { serviceIds, serviceSlugs } from "@/content/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push(
      { url: `${siteUrl}/${locale}`, changeFrequency: "monthly", priority: 1 },
      {
        url: `${siteUrl}/${locale}/articles`,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    );

    for (const id of serviceIds) {
      entries.push({
        url: `${siteUrl}/${locale}/${serviceSlugs[id][locale]}`,
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: {
          languages: {
            es: `${siteUrl}/es/${serviceSlugs[id].es}`,
            en: `${siteUrl}/en/${serviceSlugs[id].en}`,
          },
        },
      });
    }

    const articles = await getArticles(locale);
    for (const article of articles) {
      // Articles syndicated from elsewhere (Medium, ...) declare that source
      // as their canonical URL — listing them here too would tell Google to
      // index a page that itself says "the real one is over there".
      if (article.sourceUrl) continue;

      entries.push({
        url: `${siteUrl}/${locale}/articles/${article.slug}`,
        lastModified: article.publishedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
