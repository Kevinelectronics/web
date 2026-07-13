import { HiCheck } from "react-icons/hi2";
import { useTranslations } from "next-intl";
import Container from "./Container";

export default function Offerings() {
  const t = useTranslations("offerings");
  const items = t.raw("items") as string[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>

        <ul className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                <HiCheck size={13} />
              </span>
              <span className="text-ink-soft">{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
