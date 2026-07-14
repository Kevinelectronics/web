import { HiCheck } from "react-icons/hi2";
import { useTranslations } from "next-intl";
import Container from "./Container";

type Category = { title: string; benefit: string; items: string[] };

export default function Offerings() {
  const t = useTranslations("offerings");
  const pitch = useTranslations("pitch");
  const categories = t.raw("categories") as Category[];

  return (
    <section id="services" className="scroll-mt-16 border-t border-line py-20">
      <Container>
        <p className="max-w-2xl font-display text-xl leading-snug text-ink">
          {pitch("headline")}
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
          {pitch("body")}
        </p>

        <p className="mt-12 text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="font-display text-lg font-medium text-ink">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {category.benefit}
              </p>
              <ul className="mt-4 space-y-2.5">
                {category.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                      <HiCheck size={10} />
                    </span>
                    <span className="text-sm text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
