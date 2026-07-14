import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/lib/strapi";
import { strapiImageUrl } from "@/lib/strapi";

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
      className="group flex gap-6 border-b border-line py-8 first:pt-0"
    >
      {article.coverImage && (
        <div className="relative hidden aspect-video w-56 shrink-0 overflow-hidden rounded-lg bg-accent-soft sm:block">
          <Image
            src={strapiImageUrl(article.coverImage.url)}
            alt={article.coverImage.alternativeText ?? article.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0">
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
        {article.tags && article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-strong"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <span className="mt-3 inline-block text-sm font-medium text-accent">
          {t("readMore")} →
        </span>
      </div>
    </Link>
  );
}
