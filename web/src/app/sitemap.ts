import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/content/site";
import { getArticles } from "@/lib/strapi";

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
