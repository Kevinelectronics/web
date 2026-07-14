import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "./Container";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const hero = useTranslations("hero");

  return (
    <header className="border-b border-line">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-base font-medium tracking-tight text-ink"
        >
          {hero("name")}
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className="text-sm text-ink-soft transition-colors hover:text-accent"
          >
            {t("home")}
          </Link>
          <Link
            href="/#services"
            className="text-sm text-ink-soft transition-colors hover:text-accent"
          >
            {t("services")}
          </Link>
          <Link
            href="/#case-studies"
            className="text-sm text-ink-soft transition-colors hover:text-accent"
          >
            {t("caseStudies")}
          </Link>
          <Link
            href="/articles"
            className="text-sm text-ink-soft transition-colors hover:text-accent"
          >
            {t("articles")}
          </Link>
          <Link
            href="/#about"
            className="text-sm text-ink-soft transition-colors hover:text-accent"
          >
            {t("about")}
          </Link>
          <Link
            href="/#contact"
            className="text-sm text-ink-soft transition-colors hover:text-accent"
          >
            {t("contact")}
          </Link>
          <LocaleSwitcher />
        </nav>
        <div className="sm:hidden">
          <LocaleSwitcher />
        </div>
      </Container>
    </header>
  );
}
