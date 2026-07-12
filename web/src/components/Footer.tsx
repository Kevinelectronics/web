import { useTranslations } from "next-intl";
import Container from "./Container";
import SocialLinks from "./SocialLinks";
import { contactEmail } from "@/content/site";

export default function Footer() {
  const t = useTranslations("footer");
  const social = useTranslations("social");
  const hero = useTranslations("hero");
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="mt-auto border-t border-neutral-100 py-12 dark:border-neutral-900"
    >
      <Container className="flex flex-col items-center gap-6 text-center">
        <a
          href={`mailto:${contactEmail}`}
          className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
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

        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          © {year} {hero("name")}. {t("rights")}
        </p>
      </Container>
    </footer>
  );
}
