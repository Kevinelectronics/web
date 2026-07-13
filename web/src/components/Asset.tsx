import { useTranslations } from "next-intl";
import Container from "./Container";

export default function Asset() {
  const t = useTranslations("asset");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <section className="border-t border-line py-20">
      <Container className="max-w-3xl">
        <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <div className="mt-6 space-y-3 text-lg leading-relaxed text-ink-soft">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 text-base font-medium text-ink">{t("closing")}</p>
      </Container>
    </section>
  );
}
