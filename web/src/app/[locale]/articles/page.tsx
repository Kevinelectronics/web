import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { Link } from "@/i18n/navigation";
import { getArticles, getTags } from "@/lib/strapi";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });

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
    getArticles(locale, activeTag),
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
            <p className="text-ink-soft">{t("empty")}</p>
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
