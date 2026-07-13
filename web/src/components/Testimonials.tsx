import { useTranslations } from "next-intl";
import Container from "./Container";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  statValue: string;
  statLabel: string;
};

/**
 * DRAFT COPY — the EODHD quote below was written by Kevin as a proposed
 * testimonial (see messages/{es,en}.json -> testimonials.items[0].quote),
 * not a verbatim statement from Nick. Do not treat it as final/approved
 * until Nick has reviewed and confirmed the wording.
 */
export default function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Testimonial[];

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

        <div className="mt-10 space-y-6">
          {items.map((item) => (
            <div
              key={item.name}
              className="grid gap-6 rounded-2xl border border-line bg-white p-8 sm:grid-cols-[1.5fr_1fr] sm:items-center sm:gap-10"
            >
              <div>
                <p className="font-display text-xl italic leading-snug text-ink">
                  “{item.quote}”
                </p>
                <p className="mt-4 text-sm font-medium text-ink">
                  {item.name}{" "}
                  <span className="font-normal text-ink-soft">
                    — {item.role}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-accent-soft p-6 text-center sm:text-left">
                <p className="font-display text-3xl font-medium text-accent">
                  {item.statValue}
                </p>
                <p className="mt-1 text-sm leading-snug text-ink-soft">
                  {item.statLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
