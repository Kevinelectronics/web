import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/lib/strapi";

export default function ArticleCard({ article }: { article: Article }) {
  const t = useTranslations("articles");
  const locale = useLocale();
  const date = new Date(article.publishedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block border-b border-neutral-100 py-8 first:pt-0 dark:border-neutral-900"
    >
      <time className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
        {date}
      </time>
      <h3 className="mt-2 text-xl font-medium text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-neutral-100 dark:group-hover:text-neutral-400">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {article.excerpt}
        </p>
      )}
      <span className="mt-3 inline-block text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {t("readMore")} →
      </span>
    </Link>
  );
}
