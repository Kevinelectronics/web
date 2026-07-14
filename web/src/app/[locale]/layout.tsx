import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { siteUrl, googleAnalyticsId, socials, contactEmail } from "@/content/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  const title = `${t("name")} — ${t("role")}`;
  const description = t("tagline");

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${t("name")}` },
    description,
    openGraph: {
      type: "website",
      siteName: t("name"),
      title,
      description,
      locale: locale === "es" ? "es_ES" : "en_US",
      images: [{ url: "/photo.jpg", width: 1024, height: 1024, alt: t("name") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/photo.jpg"],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "hero" });
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: t("name"),
        url: siteUrl,
        image: `${siteUrl}/photo.jpg`,
        jobTitle: t("role"),
        email: `mailto:${contactEmail}`,
        sameAs: [socials.linkedin, socials.medium, socials.youtube, socials.github],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: t("name"),
        url: siteUrl,
        image: `${siteUrl}/photo.jpg`,
        founder: { "@id": `${siteUrl}/#person` },
        areaServed: "Worldwide",
        sameAs: [socials.linkedin, socials.medium, socials.youtube, socials.github],
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NODE_ENV === "production" && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
