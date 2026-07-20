import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import Offerings from "@/components/Offerings";
import Videos from "@/components/Videos";
import Process from "@/components/Process";
import WhyMe from "@/components/WhyMe";
import CompanyLogos from "@/components/CompanyLogos";
import CaseStudyMain from "@/components/CaseStudyMain";
import CaseStudies from "@/components/CaseStudies";
import ContentPackages from "@/components/ContentPackages";
import Talk from "@/components/Talk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Metrics />
      <CompanyLogos />
      <Offerings />
      <Videos />
      <CaseStudyMain />
      <CaseStudies />
      <ContentPackages />
      <Process />
      <WhyMe />
      <Talk />
    </>
  );
}
