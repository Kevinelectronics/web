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
    const json = await strapiFetch<StrapiListResponse<Article>>(
      `/articles?locale=${locale}&sort=publishedAt:desc&populate=coverImage,tags&status=published${tagFilter}`,
    );
    return json.data;
  } catch {
    return [];
  }
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
