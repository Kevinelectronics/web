import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { serviceIds, servicePath } from "@/content/services";
import Container from "./Container";
import SocialLinks from "./SocialLinks";
import { contactEmail } from "@/content/site";

export default function Footer() {
  const t = useTranslations("footer");
  const social = useTranslations("social");
  const hero = useTranslations("hero");
  const services = useTranslations("services");
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="mt-auto border-t border-line py-12">
      <Container className="flex flex-col items-center gap-6 text-center">
        <nav aria-label={services("common.servicesLabel")} className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {serviceIds.map((id) => (
            <Link
              key={id}
              href={servicePath(id, locale)}
              className="text-sm text-ink-soft transition-colors hover:text-accent"
            >
              {services(`${id}.name`)}
            </Link>
          ))}
        </nav>

        <a
          href={`mailto:${contactEmail}`}
          className="text-sm text-ink-soft transition-colors hover:text-accent"
        >
          {contactEmail}
        </a>

        <SocialLinks
          size="sm"
          labels={{
            linkedin: social("linkedin"),
            medium: social("medium"),
            youtube: social("youtube"),
            github: social("github"),
          }}
        />

        <p className="text-xs text-ink-soft/70">
          © {year} {hero("name")}. {t("rights")}{" "}
          <Link href="/privacy" className="underline-offset-4 transition-colors hover:text-accent hover:underline">
            {t("privacy")}
          </Link>
        </p>
      </Container>
    </footer>
  );
}
