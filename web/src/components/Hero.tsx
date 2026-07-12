import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "./Container";
import SocialLinks from "./SocialLinks";

export default function Hero() {
  const t = useTranslations("hero");
  const social = useTranslations("social");

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("greeting")}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-100">
          {t("name")}
        </h1>
        <p className="mt-3 text-lg text-neutral-700 dark:text-neutral-300">
          {t("role")}
        </p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t("tagline")}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/articles"
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            {t("cta")}
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600"
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
      </Container>
    </section>
  );
}
