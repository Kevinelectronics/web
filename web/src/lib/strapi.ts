import { strapiUrl } from "@/content/site";

export type StrapiImage = {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type Article = {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: StrapiImage | null;
  sourceUrl?: string | null;
  tags?: Tag[];
  featured?: boolean;
  publishedAt: string;
  locale: string;
};

type StrapiListResponse<T> = {
  data: T[];
};

async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${strapiUrl}/api${path}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed (${res.status}): ${path}`);
  }

  return res.json() as Promise<T>;
}

export function strapiImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${strapiUrl}${url}`;
}

export async function getArticles(
  locale: string,
  tagSlug?: string,
): Promise<Article[]> {
  try {
    const tagFilter = tagSlug
      ? `&filters[tags][slug][$eq]=${encodeURIComponent(tagSlug)}`
      : "";
    // Strapi defaults to 25 results per page — without an explicit limit,
    // any locale with more than 25 published articles silently loses the
    // rest from the listing page and the sitemap.
    const json = await strapiFetch<StrapiListResponse<Article>>(
      `/articles?locale=${locale}&sort=publishedAt:desc&populate=coverImage,tags&status=published&pagination[limit]=200${tagFilter}`,
    );
    return json.data;
  } catch {
    return [];
  }
}

export async function getFeaturedArticles(
  locale: string,
  limit = 3,
  tagSlug?: string,
): Promise<Article[]> {
  try {
    const tagFilter = tagSlug
      ? `&filters[tags][slug][$eq]=${encodeURIComponent(tagSlug)}`
      : "";
    const json = await strapiFetch<StrapiListResponse<Article>>(
      `/articles?locale=${locale}&filters[featured][$eq]=true&sort=publishedAt:desc&populate=coverImage,tags&status=published&pagination[limit]=${limit}${tagFilter}`,
    );
    return json.data;
  } catch {
    return [];
  }
}

// Featured articles (max 5) first, then the rest — used on the articles
// listing page. Fetches both lists and dedupes client-side rather than
// filtering "not featured" server-side, so it doesn't depend on how
// existing rows resolve the `featured` field (false vs. null) before a
// migration backfills it.
export async function getArticlesFeaturedFirst(
  locale: string,
  tagSlug?: string,
): Promise<Article[]> {
  const [featured, all] = await Promise.all([
    getFeaturedArticles(locale, 5, tagSlug),
    getArticles(locale, tagSlug),
  ]);
  const featuredIds = new Set(featured.map((a) => a.id));
  return [...featured, ...all.filter((a) => !featuredIds.has(a.id))];
}

export async function getArticleBySlug(
  slug: string,
  locale: string,
): Promise<Article | null> {
  try {
    const json = await strapiFetch<StrapiListResponse<Article>>(
      `/articles?locale=${locale}&filters[slug][$eq]=${encodeURIComponent(slug)}&populate=coverImage,tags&status=published`,
    );
    return json.data[0] ?? null;
  } catch {
    return null;
  }
}

// Other published articles for the "related articles" internal-linking
// module on article detail pages. Tries every one of the article's tags
// (not just the first) to widen the shared-topic pool, then — since a
// locale can have thin or inconsistent tagging, especially while ES
// content is still being built out — fills any remaining slots with the
// most recent other articles so every page links to at least `limit`
// others instead of sitting as an island until tag coverage catches up.
export async function getRelatedArticles(
  locale: string,
  tags: Tag[] | undefined,
  excludeId: number,
  limit = 3,
): Promise<Article[]> {
  const byTag = new Map<number, Article>();
  for (const tag of tags ?? []) {
    if (byTag.size >= limit) break;
    const articles = await getArticles(locale, tag.slug);
    for (const article of articles) {
      if (article.id !== excludeId) byTag.set(article.id, article);
    }
  }

  const related = [...byTag.values()].slice(0, limit);

  if (related.length < limit) {
    const recent = await getArticles(locale);
    for (const article of recent) {
      if (related.length >= limit) break;
      if (article.id === excludeId) continue;
      if (related.some((a) => a.id === article.id)) continue;
      related.push(article);
    }
  }

  return related;
}

// Tags aren't locale-specific (a topic like "Langchain" is reused across
// languages) — only list ones actually used by a published article in the
// current locale, so the filter pills don't show empty sections.
export async function getTags(locale: string): Promise<Tag[]> {
  try {
    const json = await strapiFetch<StrapiListResponse<Tag>>(
      `/tags?sort=name:asc&filters[articles][locale][$eq]=${locale}&filters[articles][publishedAt][$notNull]=true`,
    );
    return json.data;
  } catch {
    return [];
  }
}
