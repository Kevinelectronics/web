import { useTranslations } from "next-intl";
import Container from "./Container";

export default function Process() {
  const t = useTranslations("process");

  return (
    <section className="border-t border-line bg-accent-soft/50 py-20">
      <Container className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>

        <p className="mt-6 font-display text-xl italic leading-snug text-ink">
          {t("intro")}
        </p>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          {t("body1")}
        </p>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          {t("body2")}
        </p>
      </Container>
    </section>
  );
}
