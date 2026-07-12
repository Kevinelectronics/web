import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { getArticles } from "@/lib/strapi";

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
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {t("title")}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
          {t("subtitle")}
        </h1>

        <div className="mt-10">
          {articles.length === 0 ? (
            <p className="text-neutral-500 dark:text-neutral-400">
              {t("empty")}
            </p>
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
