import Image from "next/image";
import { useTranslations } from "next-intl";
import Container from "./Container";
import { companies } from "@/content/site";

export default function CompanyLogos() {
  const t = useTranslations("companies");

  if (companies.length === 0) return null;

  return (
    <section className="border-t border-neutral-100 py-16 dark:border-neutral-900">
      <Container>
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          {t("title")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {companies.map((company) => {
            const content = company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain opacity-60 grayscale transition-opacity hover:opacity-100"
              />
            ) : (
              <span className="text-lg font-medium tracking-tight text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-600 dark:hover:text-neutral-300">
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
