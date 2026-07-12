import Image from "next/image";
import { useTranslations } from "next-intl";
import Container from "./Container";
import { companies } from "@/content/site";

export default function CompanyLogos() {
  const t = useTranslations("companies");

  if (companies.length === 0) return null;

  return (
    <section className="border-t border-line py-16">
      <Container>
        <p className="text-center text-sm text-ink-soft">{t("title")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {companies.map((company) => {
            const content = company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain opacity-50 grayscale transition-opacity hover:opacity-90"
              />
            ) : (
              <span className="font-display text-lg font-medium tracking-tight text-ink-soft/70 transition-colors hover:text-accent">
                {company.name}
              </span>
            );

            return company.url ? (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              <span key={company.name}>{content}</span>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
