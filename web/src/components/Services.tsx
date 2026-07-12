import { useTranslations } from "next-intl";
import Container from "./Container";

export default function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section className="border-t border-neutral-100 py-20 dark:border-neutral-900">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {t("title")}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
          {t("subtitle")}
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {items.map((item, index) => (
            <div key={item.title}>
              <span className="text-sm text-neutral-400 dark:text-neutral-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-medium text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
