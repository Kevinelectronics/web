import { HiCheck } from "react-icons/hi2";
import { useTranslations } from "next-intl";
import Container from "./Container";
import { Link } from "@/i18n/navigation";

type Package = { name: string; description: string; features: string[] };

export default function ContentPackages() {
  const t = useTranslations("contentPackages");
  const items = t.raw("items") as Package[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          {t("subtitle")}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {items.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                index === 1
                  ? "border-accent bg-accent-soft/40"
                  : "border-line"
              }`}
            >
              <h3 className="font-display text-xl font-medium text-ink">
                {pkg.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {pkg.description}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                      <HiCheck size={10} />
                    </span>
                    <span className="text-sm text-ink-soft">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-accent-strong"
              >
                {t("cta")}
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
