import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import OutboundLinkParams from "@/components/OutboundLinkParams";
import { Link } from "@/i18n/navigation";
import {
  findArticleElsewhere,
  getArticleBySlug,
  getArticleTranslationSlug,
  getRelatedArticles,
  strapiImageUrl,
} from "@/lib/strapi";
import { routing } from "@/i18n/routing";
import { buildMetaDescription, extractFaqs } from "@/lib/seo";
import { siteUrl, socials } from "@/content/site";

/** hreflang map for an article: this locale plus every published translation. */
async function articleLanguages(
  documentId: string,
  locale: string,
  slug: string,
): Promise<Record<string, string> | undefined> {
  const languages: Record<string, string> = { [locale]: `/${locale}/articles/${slug}` };
  for (const other of routing.locales) {
    if (other === locale) continue;
    const translated = await getArticleTranslationSlug(documentId, other);
    if (translated) languages[other] = `/${other}/articles/${translated}`;
  }
  return Object.keys(languages).length > 1 ? languages : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    const elsewhere = await findArticleElsewhere(slug, locale, routing.locales);
    if (elsewhere) permanentRedirect(elsewhere);
    return {};
  }

  // Content imported from Medium published there first — point the
  // canonical tag back at the original so Google doesn't see two competing
  // copies of the same article (it would otherwise favor Medium's higher
  // domain authority anyway, but without a canonical both copies risk being
  // flagged as duplicate content instead of just one deferring to the other).
  const canonical = article.sourceUrl || `/${locale}/articles/${slug}`;
  const description = buildMetaDescription(article.excerpt, article.content);

  return {
    // `absolute` skips the root layout's `%s — Kevin Meneses` title
    // template — CMS-authored titles are already long listicle-style
    // headlines, and the extra suffix was pushing many of them past the
    // ~60-char budget search engines display before truncating.
    title: { absolute: article.title },
    description,
    alternates: {
      canonical,
      // hreflang only for local originals — syndicated copies already point
      // their canonical at Medium.
      languages: article.sourceUrl ? undefined : await articleLanguages(article.documentId, locale, slug),
    },
    openGraph: {
      type: "article",
      title: article.title,
      description,
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
    const elsewhere = await findArticleElsewhere(slug, locale, routing.locales);
    if (elsewhere) permanentRedirect(elsewhere);
    notFound();
  }

  const relatedArticles = await getRelatedArticles(locale, article.tags, article.id);
  const description = buildMetaDescription(article.excerpt, article.content);
  const faqs = extractFaqs(article.content);

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
        description,
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

  // FAQPage schema describes what's visibly rendered on this page, so it
  // applies regardless of canonical status — unlike Article/BreadcrumbList
  // above, it isn't a claim about which domain originated the content.
  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
          <OutboundLinkParams>
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
          </OutboundLinkParams>
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

        <OutboundLinkParams>
          <div className="prose mt-10 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </OutboundLinkParams>

        {relatedArticles.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <h2 className="font-display text-xl font-medium tracking-tight text-ink">
              {t("related")}
            </h2>
            <ul className="mt-6 space-y-4">
              {relatedArticles.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/articles/${related.slug}`}
                    className="text-accent hover:underline"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </article>
  );
}
