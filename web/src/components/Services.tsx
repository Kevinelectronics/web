import { useTranslations } from "next-intl";
import Container from "./Container";

export default function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("title")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("subtitle")}
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {items.map((item, index) => (
            <div key={item.title}>
              <span className="font-display text-sm text-accent/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-medium text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
