import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import Container from "./Container";
import { Link } from "@/i18n/navigation";
import { getFeaturedArticles, strapiImageUrl } from "@/lib/strapi";

export default async function FeaturedArticles() {
  const locale = await getLocale();
  const t = await getTranslations("featuredArticles");
  const articles = await getFeaturedArticles(locale);

  if (articles.length === 0) return null;

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line"
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-accent-soft">
                {article.coverImage && (
                  <Image
                    src={strapiImageUrl(article.coverImage.url)}
                    alt={article.coverImage.alternativeText ?? article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-medium text-ink transition-colors group-hover:text-accent">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/articles"
          className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
        >
          {t("viewAll")} →
        </Link>
      </Container>
    </section>
  );
}
