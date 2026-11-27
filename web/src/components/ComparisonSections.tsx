import type { ReactNode } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  HiArrowRight,
  HiCheck,
  HiOutlineArrowPath,
  HiOutlineArrowsRightLeft,
  HiOutlineListBullet,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
  HiXMark,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import Container from "./Container";

// Sections only the SaaS comparison pages landing uses. The rest of that page
// reuses the shared service sections.

const card =
  "rounded-2xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(15,26,51,0.55)] dark:bg-paper";

/** Decorative hero mock: a "you vs competitor" table that ranks and gets cited. */
export function ComparisonAnimation() {
  const t = useTranslations("services.comparisons.mock");
  const rows = t.raw("rows") as { label: string; you: boolean; them: boolean }[];

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[440px] pb-10 pt-6">
      <span className="dv-chip absolute -right-1 top-0 z-10 flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm sm:-right-6 dark:bg-paper">
        <HiOutlineMagnifyingGlass className="h-3.5 w-3.5 text-accent" />
        {t("query")}
      </span>

      <div className={`${card} overflow-hidden`}>
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line bg-accent-soft/50 px-4 py-3 text-[11px] font-semibold text-ink">
          <span className="text-ink-soft">{t("criteria")}</span>
          <span className="w-16 text-center text-accent">{t("you")}</span>
          <span className="w-16 text-center">{t("them")}</span>
        </div>
        {rows.map((row, index) => (
          <div
            key={row.label}
            className="cp-row grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line px-4 py-2.5 last:border-b-0"
            style={{ animationDelay: `${0.3 + index * 0.25}s` }}
          >
            <span className="text-[12px] font-medium leading-snug text-ink">{row.label}</span>
            {[row.you, row.them].map((ok, i) => (
              <span key={i} className="flex w-16 justify-center">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    ok
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-500 dark:bg-rose-400/15 dark:text-rose-300"
                  }`}
                >
                  {ok ? <HiCheck className="h-3 w-3" /> : <HiXMark className="h-3 w-3" />}
                </span>
              </span>
            ))}
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 bg-ink px-4 py-3">
          <p className="text-[11px] font-medium leading-snug text-paper">{t("verdict")}</p>
          <span className="dv-cta shrink-0 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
            {t("cta")}
          </span>
        </div>
      </div>

      <div className={`dv-export absolute -bottom-3 -left-2 flex items-center gap-2.5 px-3 py-2 sm:-left-8 ${card}`}>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft font-display text-xs font-semibold text-accent">
          #1
        </span>
        <p className="text-[11px] font-medium text-ink">{t("rank")}</p>
      </div>

      <span className="dv-chip-late absolute -right-2 bottom-1 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 sm:-right-6 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
        <HiOutlineSparkles className="h-3.5 w-3.5" />
        {t("cited")}
      </span>
    </div>
  );
}

type ProcessStep = { title: string; caption: string };

/**
 * Animated 4-stage strip under "the problem": search → your page ranks →
 * the tested verdict → the trial. Each stage lights up in turn on a 12s loop
 * (`cp-*` rules in globals.css); with reduced motion every stage shows its
 * final state.
 */
export function ComparisonProcess() {
  const t = useTranslations("services.comparisons.process");
  const steps = t.raw("steps") as ProcessStep[];
  const results = t.raw("results") as string[];
  const rows = t.raw("rows") as string[];

  const stage = (index: number, body: ReactNode) => (
    <li key={steps[index].title} className="relative flex flex-col">
      <div
        className="cp-stage flex h-44 flex-col justify-center rounded-2xl border border-line bg-white p-3 dark:bg-paper"
        style={{ animationDelay: `${index * 3}s` }}
      >
        {body}
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ink">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
          {index + 1}
        </span>
        {steps[index].title}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{steps[index].caption}</p>
      {index < 3 && (
        <span
          aria-hidden
          className="cp-arrow absolute -right-[18px] top-[88px] z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper text-accent lg:flex"
          style={{ animationDelay: `${index * 3 + 2.4}s` }}
        >
          <HiArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </li>
  );

  return (
    <div className="mt-14 rounded-3xl border border-line bg-accent-soft/40 p-6 sm:p-8">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">{t("eyebrow")}</p>
      <h3 className="mt-2 max-w-2xl font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
        {t("title")}
      </h3>

      <ol aria-label={t("title")} className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {stage(
          0,
          <div aria-hidden>
            <div className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 shadow-sm">
              <HiOutlineMagnifyingGlass className="h-4 w-4 shrink-0 text-ink-soft" />
              <span className="cp-type overflow-hidden whitespace-nowrap font-mono text-[12px] text-ink">
                {t("query")}
              </span>
              <span className="cp-caret h-4 w-px shrink-0 bg-accent" />
            </div>
            <p className="mt-3 text-center text-[11px] text-ink-soft">{t("searchHint")}</p>
          </div>,
        )}

        {stage(
          1,
          <ul aria-hidden className="space-y-1.5">
            <li className="cp-win flex items-center gap-2 rounded-lg border border-accent bg-accent-soft px-2.5 py-1.5">
              <span className="rounded bg-accent px-1.5 text-[10px] font-semibold text-white">#1</span>
              <span className="truncate text-[11px] font-medium text-ink">{t("you")}</span>
            </li>
            {results.map((result) => (
              <li
                key={result}
                className="cp-lose flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-line" />
                <span className="truncate text-[11px] text-ink-soft">{result}</span>
              </li>
            ))}
          </ul>,
        )}

        {stage(
          2,
          <div aria-hidden className="space-y-1.5">
            {rows.map((row, index) => (
              <div
                key={row}
                className="flex items-center justify-between gap-2 rounded-lg border border-line px-2.5 py-1.5"
              >
                <span className="truncate text-[11px] text-ink">{row}</span>
                <span
                  className="cp-tick flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300"
                  style={{ animationDelay: `${6.3 + index * 0.35}s` }}
                >
                  <HiCheck className="h-2.5 w-2.5" />
                </span>
              </div>
            ))}
            <p className="cp-verdict rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium text-paper">
              {t("verdict")}
            </p>
          </div>,
        )}

        {stage(
          3,
          <div aria-hidden className="relative flex flex-col items-center">
            <span className="cp-button rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white">
              {t("cta")}
            </span>
            <span className="cp-toast mt-4 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
              <HiCheck className="h-3 w-3" />
              {t("toast")}
            </span>
          </div>,
        )}
      </ol>
    </div>
  );
}

type Format = { title: string; query: string; intent: string; description: string; includes: string[] };

// Matched to `formats.items` by position.
const formatIcons: IconType[] = [HiOutlineArrowsRightLeft, HiOutlineArrowPath, HiOutlineListBullet];

export function ComparisonFormats() {
  const t = useTranslations("services.comparisons.formats");
  const items = t.raw("items") as Format[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">{t("eyebrow")}</p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">{t("subtitle")}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = formatIcons[index];
            return (
              <div key={item.title} className="flex flex-col rounded-2xl border border-line bg-paper p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1 font-mono text-xs text-ink dark:bg-ink/5">
                  <HiOutlineMagnifyingGlass aria-hidden className="h-3.5 w-3.5 text-ink-soft" />
                  {item.query}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-accent">{item.intent}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.description}</p>
                <ul className="mt-5 space-y-2">
                  {item.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                        <HiCheck size={10} />
                      </span>
                      <span className="text-sm text-ink-soft">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-8 flex items-start gap-2 rounded-2xl border border-line bg-accent-soft p-5 text-sm leading-relaxed text-ink">
          <HiOutlineSparkles aria-hidden className="mt-0.5 h-4 w-4 flex-none text-accent" />
          {t("geoNote")}
        </p>
      </Container>
    </section>
  );
}

/** Published comparison pieces, one per format. Slugs and covers come from Strapi. */
export const comparisonExamples = [
  {
    slug: { en: "7-best-ocr-tools-with-ai-in-2026-compared", es: "7-mejores-herramientas-de-ocr-con-ia-2026" },
    cover:
      "https://res.cloudinary.com/f8d8xtx1/image/upload/v1785837601/7_best_ocr_tools_with_ai_in_2026_compared_cover_6c7921706c.png",
  },
  {
    slug: { en: "eodhd-vs-alpha-vantage-stock-api-comparison-2026", es: "eodhd-vs-alpha-vantage-comparativa-de-apis-2026" },
    cover:
      "https://res.cloudinary.com/f8d8xtx1/image/upload/v1784648785/eodhd_vs_alpha_vantage_stock_api_comparison_2026_cover_3823251505.png",
  },
  {
    slug: { en: "openai-api-alternatives", es: "alternativas-api-openai" },
    cover: "https://res.cloudinary.com/f8d8xtx1/image/upload/v1795686226/cover_bf761e6001.jpg",
  },
] as const;

type Example = { format: string; title: string; description: string; highlights: string[] };

export function ComparisonExamples() {
  const t = useTranslations("services.comparisons.examples");
  const items = t.raw("items") as Example[];
  const locale = useLocale() as Locale;

  return (
    <section id="examples" className="scroll-mt-16 border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">{t("eyebrow")}</p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">{t("subtitle")}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => {
            const example = comparisonExamples[index];
            return (
              <Link
                key={item.title}
                href={`/articles/${example.slug[locale]}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-colors hover:border-accent"
              >
                <div className="relative aspect-video bg-accent-soft">
                  <Image
                    src={example.cover}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 360px, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-paper">
                    {item.format}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.description}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {item.highlights.map((line) => (
                      <li key={line} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                          <HiCheck size={10} />
                        </span>
                        <span className="text-sm text-ink-soft">{line}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    {t("cta")}
                    <HiArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
