import Image from "next/image";
import { useTranslations } from "next-intl";
import Container from "./Container";
import { companies, type Company } from "@/content/site";

function LogoCard({ company, hidden }: { company: Company; hidden?: boolean }) {
  const card = (
    <div className="flex h-20 w-44 items-center justify-center rounded-2xl border border-line bg-white px-6 py-4 transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(15,26,51,0.35)]">
      {company.logoUrl ? (
        <Image
          src={company.logoUrl}
          alt={hidden ? "" : company.name}
          width={160}
          height={64}
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
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={hidden ? undefined : company.name}
      tabIndex={hidden ? -1 : undefined}
      className="shrink-0"
    >
      {card}
    </a>
  ) : (
    <span className="shrink-0">{card}</span>
  );
}

export default function CompanyLogos() {
  const t = useTranslations("companies");

  if (companies.length === 0) return null;

  return (
    <section className="border-t border-line py-16">
      <Container>
        <p className="text-center text-sm text-ink-soft">{t("title")}</p>
      </Container>
      {/* The list is rendered twice and the track slides by -50% for a seamless loop. */}
      <div className="marquee mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex w-max gap-6 pr-6">
          {companies.map((company) => (
            <LogoCard key={company.name} company={company} />
          ))}
          <div aria-hidden className="contents">
            {companies.map((company) => (
              <LogoCard key={`dup-${company.name}`} company={company} hidden />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
