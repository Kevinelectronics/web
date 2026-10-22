import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "./Container";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const t = useTranslations("nav");
  const hero = useTranslations("hero");

  const items = [
    { href: "/", label: t("home") },
    { href: "/#services", label: t("services") },
    { href: "/#case-studies", label: t("caseStudies") },
    { href: "/articles", label: t("articles") },
    { href: "/#about", label: t("about") },
    { href: "/#contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-base font-medium tracking-tight text-ink"
        >
          {hero("name")}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <LocaleSwitcher />
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitcher />
          <MobileMenu
            items={items}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
          />
        </div>
      </Container>
    </header>
  );
}
