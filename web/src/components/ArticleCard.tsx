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
      className="group block border-b border-line py-8 first:pt-0"
    >
      <time className="text-xs uppercase tracking-wide text-ink-soft/70">
        {date}
      </time>
      <h3 className="mt-2 font-display text-xl font-medium text-ink transition-colors group-hover:text-accent">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {article.excerpt}
        </p>
      )}
      <span className="mt-3 inline-block text-sm font-medium text-accent">
        {t("readMore")} →
      </span>
    </Link>
  );
}
