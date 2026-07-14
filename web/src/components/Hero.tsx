import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "./Container";
import SocialLinks from "./SocialLinks";
import PhotoCard from "./PhotoCard";

export default function Hero() {
  const t = useTranslations("hero");
  const social = useTranslations("social");
  const name = t("name");
  const authority = t.raw("authority") as string[];

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-5xl">
        <div className="grid items-center gap-14 sm:grid-cols-[1.15fr_0.85fr] sm:gap-10">
          <div className="order-2 sm:order-1">
            <p className="text-sm font-medium tracking-wide text-accent">
              {t("greeting")} {name}
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {t("headline")}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
              {t("tagline")}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {authority.map((line) => (
                <li
                  key={line}
                  className="text-sm font-medium text-ink-soft before:mr-1.5 before:text-accent before:content-['✓']"
                >
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/#case-studies"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
              >
                {t("cta")}
              </Link>
              <Link
                href="/#contact"
                className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <div className="mt-10">
              <SocialLinks
                labels={{
                  linkedin: social("linkedin"),
                  medium: social("medium"),
                  youtube: social("youtube"),
                  github: social("github"),
                }}
              />
            </div>
          </div>

          <div className="order-1 sm:order-2">
            <PhotoCard name={name} />
          </div>
        </div>
      </Container>
    </section>
  );
}
