import { strapiUrl } from "@/content/site";

export type StrapiImage = {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
};

export type Article = {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: StrapiImage | null;
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

export async function getArticles(locale: string): Promise<Article[]> {
  try {
    const json = await strapiFetch<StrapiListResponse<Article>>(
      `/articles?locale=${locale}&sort=publishedAt:desc&populate=coverImage&status=published`,
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
      `/articles?locale=${locale}&filters[slug][$eq]=${encodeURIComponent(slug)}&populate=coverImage&status=published`,
    );
    return json.data[0] ?? null;
  } catch {
    return null;
  }
}
