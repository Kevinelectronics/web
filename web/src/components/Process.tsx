import { useTranslations } from "next-intl";
import Container from "./Container";

type Step = { title: string; description: string };

export default function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <section className="border-t border-line bg-accent-soft/50 py-20">
      <Container className="max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-6 font-display text-xl italic leading-snug text-ink">
          {t("intro")}
        </p>

        <ol className="mt-10 grid gap-8 sm:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-display text-2xl font-medium text-accent">
                0{index + 1}
              </span>
              <h3 className="mt-2 text-base font-medium text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-base leading-relaxed text-ink-soft">
          {t("closing")}
        </p>
      </Container>
    </section>
  );
}
