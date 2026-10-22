import { useTranslations } from "next-intl";
import { HiPlus } from "react-icons/hi2";
import Container from "./Container";

export type FaqItem = { question: string; answer: string };

/** Defaults to the homepage FAQs; service pages pass their own. */
export default function Faq(props: {
  eyebrow?: string;
  title?: string;
  items?: FaqItem[];
}) {
  const t = useTranslations("faq");
  const eyebrow = props.eyebrow ?? t("eyebrow");
  const title = props.title ?? t("title");
  const items = props.items ?? (t.raw("items") as FaqItem[]);

  // FAQPage schema mirrors exactly what's rendered below.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-16 border-t border-line py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {items.map((item, index) => (
            <details key={item.question} className="faq-item group" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-transform duration-300 group-open:rotate-45 group-open:bg-accent-soft">
                  <HiPlus size={16} aria-hidden />
                </span>
              </summary>
              <div className="faq-answer">
                <p className="pb-6 pr-12 text-sm leading-relaxed text-ink-soft">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
