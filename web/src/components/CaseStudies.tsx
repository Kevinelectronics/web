import { useTranslations } from "next-intl";
import Container from "./Container";

type CaseStudy = {
  company: string;
  problem: string;
  solution: string;
  contentType: string;
};

export default function CaseStudies() {
  const t = useTranslations("caseStudies");
  const items = t.raw("items") as CaseStudy[];

  if (items.length === 0) return null;

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.company}
              className="rounded-2xl border border-line p-6"
            >
              <h3 className="font-display text-lg font-medium text-ink">
                {item.company}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {item.problem}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {item.solution}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-accent">
                {item.contentType}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
