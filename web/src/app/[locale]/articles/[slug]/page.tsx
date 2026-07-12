import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import { Link } from "@/i18n/navigation";
import { getArticleBySlug, strapiImageUrl } from "@/lib/strapi";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("articles");
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const date = new Date(article.publishedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Link
          href="/articles"
          className="text-sm text-ink-soft hover:text-accent"
        >
          ← {t("back")}
        </Link>

        <time className="mt-6 block text-xs uppercase tracking-wide text-ink-soft/70">
          {date}
        </time>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          {article.title}
        </h1>

        {article.coverImage && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={strapiImageUrl(article.coverImage.url)}
              alt={article.coverImage.alternativeText ?? article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose mt-10 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </Container>
    </article>
  );
}
