import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import { Link } from "@/i18n/navigation";
import { getArticleBySlug, strapiImageUrl } from "@/lib/strapi";
import { siteUrl, socials } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    return {};
  }

  // Content imported from Medium published there first — point the
  // canonical tag back at the original so Google doesn't see two competing
  // copies of the same article (it would otherwise favor Medium's higher
  // domain authority anyway, but without a canonical both copies risk being
  // flagged as duplicate content instead of just one deferring to the other).
  const canonical = article.sourceUrl || `/${locale}/articles/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      images: article.coverImage
        ? [strapiImageUrl(article.coverImage.url)]
        : undefined,
    },
  };
}

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

  const articleUrl = `${siteUrl}/${locale}/articles/${slug}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("back"), item: `${siteUrl}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: t("title"),
        item: `${siteUrl}/${locale}/articles`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  // Only claim Article schema for content we're the canonical source for —
  // syndicated posts already point their canonical (and sitemap entry)
  // elsewhere, so asserting mainEntityOfPage here would contradict that.
  const articleJsonLd = article.sourceUrl
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        image: article.coverImage
          ? [strapiImageUrl(article.coverImage.url)]
          : undefined,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        author: {
          "@type": "Person",
          name: "Kevin Meneses",
          url: siteUrl,
          sameAs: [socials.linkedin, socials.medium, socials.youtube, socials.github],
        },
      };

  return (
    <article className="py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
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

        {article.sourceUrl && (
          <p className="mt-2 text-sm text-ink-soft">
            {t("originallyPublishedOn")}{" "}
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {new URL(article.sourceUrl).hostname.replace(/^www\./, "")}
            </a>
          </p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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
