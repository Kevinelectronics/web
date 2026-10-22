import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/content/site";
import {
  findServiceBySlug,
  serviceIds,
  serviceSlugs,
  type ServiceId,
} from "@/content/services";
import {
  OtherServices,
  ServiceHero,
  ServiceFeedback,
  ServiceIncluded,
  ServiceProblem,
} from "@/components/ServiceSections";
import CompanyLogos from "@/components/CompanyLogos";
import FounderJourney from "@/components/FounderJourney";
import CaseStudyMain from "@/components/CaseStudyMain";
import FeaturedArticles from "@/components/FeaturedArticles";
import Videos from "@/components/Videos";
import ContentPackages from "@/components/ContentPackages";
import Faq, { type FaqItem } from "@/components/Faq";
import Talk from "@/components/Talk";

type Params = Promise<{ locale: string; service: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceIds.map((id) => ({ locale, service: serviceSlugs[id][locale] })),
  );
}

function resolve(locale: string, slug: string): ServiceId | null {
  const match = findServiceBySlug(slug);
  if (!match) return null;
  // The locale switcher keeps the path as-is, so /en/<es-slug> can happen:
  // send it to the same service under this locale's own slug.
  if (match.locale !== locale) {
    permanentRedirect(`/${locale}/${serviceSlugs[match.id][locale as Locale]}`);
  }
  return match.id;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, service } = await params;
  const id = resolve(locale, service);
  if (!id) return {};

  const t = await getTranslations({ locale, namespace: `services.${id}` });
  const hero = await getTranslations({ locale, namespace: "hero" });
  const title = t("seoTitle");
  const description = t("metaDescription");
  const path = `/${locale}/${serviceSlugs[id][locale as Locale]}`;
  // A page-level openGraph/twitter object replaces the layout's wholesale, so
  // the shared image and site fields have to be repeated here.
  const image = { url: "/photo.jpg", width: 1024, height: 1024, alt: hero("name") };

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      languages: {
        es: `/es/${serviceSlugs[id].es}`,
        en: `/en/${serviceSlugs[id].en}`,
        "x-default": `/es/${serviceSlugs[id].es}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: hero("name"),
      title,
      description,
      url: path,
      locale: locale === "es" ? "es_ES" : "en_US",
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const { locale, service } = await params;
  const id = resolve(locale, service);
  if (!id) notFound();

  const t = await getTranslations({ locale, namespace: `services.${id}` });
  const common = await getTranslations({ locale, namespace: "services.common" });
  const url = `${siteUrl}/${locale}/${serviceSlugs[id][locale as Locale]}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: t("name"),
        serviceType: t("eyebrow"),
        description: t("metaDescription"),
        url,
        provider: { "@id": `${siteUrl}/#person` },
        areaServed: "Worldwide",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: common("home"), item: `${siteUrl}/${locale}` },
          { "@type": "ListItem", position: 2, name: t("name"), item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceHero id={id} />
      {id === "youtube" && <Videos bare />}
      <CompanyLogos />
      <ServiceProblem id={id} />
      <FounderJourney id={id} />
      <ServiceIncluded id={id} />
      <ServiceFeedback />
      {id !== "youtube" && <FeaturedArticles />}
      <CaseStudyMain />
      <ContentPackages ctaHref="#contact" />
      <Faq
        eyebrow={common("faqEyebrow")}
        title={common("faqTitle")}
        items={t.raw("faq") as FaqItem[]}
      />
      <OtherServices current={id} />
      <Talk />
    </>
  );
}
