import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { getArticles } from "@/lib/strapi";

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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("articles");
  const articles = await getArticles(locale);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("title")}
        </p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("subtitle")}
        </h1>

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
