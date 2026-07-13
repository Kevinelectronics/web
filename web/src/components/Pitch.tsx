import { useTranslations } from "next-intl";
import Container from "./Container";

export default function Pitch() {
  const t = useTranslations("pitch");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <section className="border-t border-line py-20 sm:py-28">
      <Container className="max-w-3xl">
        <h2 className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
          {t("headline")}
        </h2>

        <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink-soft">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-6 text-base leading-relaxed text-ink-soft">
          {t("body")}
        </p>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          {t("experience")}
        </p>

        <blockquote className="mt-10 border-l-2 border-accent pl-6 font-display text-xl italic leading-snug text-ink">
          {t("question")}
        </blockquote>

        <p className="mt-6 text-sm font-medium text-accent">
          {t("closing")}
        </p>
      </Container>
    </section>
  );
}
