import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { Link } from "@/i18n/navigation";
import { getArticlesFeaturedFirst, getTags } from "@/lib/strapi";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { tag } = await searchParams;
  const t = await getTranslations({ locale, namespace: "articles" });

  // Tag-filtered views are faceted navigation over the same articles, not
  // unique content of their own — give them their own title/description for
  // clarity when shared, but keep them out of the index so they don't
  // compete with (or dilute) the main articles list in search results.
  if (tag) {
    const tags = await getTags(locale);
    const tagName = tags.find((tagItem) => tagItem.slug === tag)?.name ?? tag;

    return {
      title: `${tagName} — ${t("title")}`,
      description: t("tagMetaDescription", { tag: tagName }),
      alternates: { canonical: `/${locale}/articles?tag=${tag}` },
      robots: { index: false, follow: true },
    };
  }

  // Most articles currently only exist in the "en" locale (see
  // getArticles/getTags) — noindex the list for a locale with nothing to
  // show yet rather than let a near-empty page sit in the index.
  const articles = await getArticlesFeaturedFirst(locale);

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/articles`,
      languages: {
        es: "/es/articles",
        en: "/en/articles",
        "x-default": "/es/articles",
      },
    },
    ...(articles.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  const { tag: activeTag } = await searchParams;
  const t = await getTranslations("articles");
  const [articles, tags] = await Promise.all([
    getArticlesFeaturedFirst(locale, activeTag),
    getTags(locale),
  ]);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("title")}
        </p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("subtitle")}
        </h1>

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/articles"
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                !activeTag
                  ? "bg-accent text-white"
                  : "bg-accent-soft text-accent-strong hover:bg-accent/20"
              }`}
            >
              {t("allTags")}
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/articles?tag=${tag.slug}`}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTag === tag.slug
                    ? "bg-accent text-white"
                    : "bg-accent-soft text-accent-strong hover:bg-accent/20"
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          {articles.length === 0 ? (
            <div className="text-ink-soft">
              <p>{t("empty")}</p>
              <p className="mt-4">
                {t("emptyOtherLocaleHint")}{" "}
                <Link
                  href="/articles"
                  locale={locale === "es" ? "en" : "es"}
                  className="font-medium text-accent hover:underline"
                >
                  {t("emptyOtherLocaleCta")} →
                </Link>
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
