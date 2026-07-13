import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Pitch from "@/components/Pitch";
import Offerings from "@/components/Offerings";
import Process from "@/components/Process";
import WhyMe from "@/components/WhyMe";
import CompanyLogos from "@/components/CompanyLogos";
import Testimonials from "@/components/Testimonials";
import Asset from "@/components/Asset";
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
      <Pitch />
      <Offerings />
      <Process />
      <WhyMe />
      <CompanyLogos />
      <Testimonials />
      <Asset />
      <Talk />
    </>
  );
}
