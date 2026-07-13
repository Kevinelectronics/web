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
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {companies.map((company) => {
            const card = (
              <div className="flex h-20 w-40 items-center justify-center rounded-2xl border border-line bg-white p-4 transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(15,26,51,0.35)]">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    width={140}
                    height={56}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="font-display text-base font-medium tracking-tight text-ink-soft/70">
                    {company.name}
                  </span>
                )}
              </div>
            );

            return company.url ? (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={company.name}
              >
                {card}
              </a>
            ) : (
              <span key={company.name}>{card}</span>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
