import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "./Container";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const hero = useTranslations("hero");

  return (
    <header className="border-b border-neutral-100 dark:border-neutral-900">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          {hero("name")}
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {t("home")}
          </Link>
          <Link
            href="/articles"
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {t("articles")}
          </Link>
          <LocaleSwitcher />
        </nav>
      </Container>
    </header>
  );
}
