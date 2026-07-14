import { useTranslations } from "next-intl";
import Container from "./Container";

type Metric = { value: string; label: string };

export default function Metrics() {
  const t = useTranslations("metrics");
  const items = t.raw("items") as Metric[];

  return (
    <section className="border-t border-line py-14">
      <Container>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="font-display text-3xl font-medium text-accent sm:text-4xl">
                {item.value}
              </p>
              <p className="mt-1 text-sm leading-snug text-ink-soft">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
