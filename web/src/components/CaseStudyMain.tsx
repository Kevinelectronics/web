import { useTranslations } from "next-intl";
import Container from "./Container";

export default function CaseStudyMain() {
  const t = useTranslations("caseStudyMain");

  return (
    <section
      id="case-studies"
      className="scroll-mt-16 border-t border-line py-20"
    >
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>

        <div className="mt-10 grid gap-8 rounded-2xl border border-line bg-white p-8 sm:grid-cols-[1.5fr_1fr] sm:items-start sm:gap-10">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {t("problemLabel")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {t("problem")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {t("solutionLabel")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {t("solution")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {t("contentTypeLabel")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {t("contentType")}
              </p>
            </div>

            <blockquote className="border-l-2 border-accent pl-4 font-display text-lg italic leading-snug text-ink">
              “{t("quote")}”
            </blockquote>
            <p className="text-sm font-medium text-ink">
              {t("name")}{" "}
              <span className="font-normal text-ink-soft">
                — {t("role")}
              </span>
            </p>
          </div>

          <div className="rounded-xl bg-accent-soft p-6 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              {t("resultLabel")}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-accent-strong sm:text-4xl">
              {t("statValue")}
            </p>
            <p className="mt-1 text-sm leading-snug text-ink-soft">
              {t("statLabel")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
