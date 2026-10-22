import { useTranslations } from "next-intl";
import { HiArrowDown, HiCheck, HiChevronRight, HiOutlineUser } from "react-icons/hi2";
import type { ServiceId } from "@/content/services";

type Step = { title: string; pain: string; action: string; result: string };

// Same tints as the homepage Journey, so both read as one system.
const TINTS = [
  "bg-accent-soft",
  "bg-amber-100/70 dark:bg-amber-400/10",
  "bg-sky-100/70 dark:bg-sky-400/10",
  "bg-emerald-100/70 dark:bg-emerald-400/10",
];

/**
 * Service-specific 4-step journey told from the founder's side: the problem
 * they say out loud, what I do about it, and what they get.
 */
export default function FounderJourney({ id }: { id: ServiceId }) {
  const t = useTranslations(`services.${id}.founder`);
  const common = useTranslations("services.common");
  const steps = t.raw("steps") as Step[];

  return (
    <section className="border-t border-line py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            {common("founderEyebrow")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{t("subtitle")}</p>
        </div>

        <ol className="mt-14 grid gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="journey-step relative flex flex-col">
              <div className="relative flex justify-center">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white shadow-[0_0_0_6px_var(--paper)]">
                  {index + 1}
                </span>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[calc(50%+28px)] top-1/2 hidden w-[calc(100%-32px)] -translate-y-1/2 items-center lg:flex"
                  >
                    <span className="journey-dash h-0.5 flex-1" />
                    <HiChevronRight className="-ml-1 h-4 w-4 text-line" />
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-center font-display text-xl font-medium tracking-tight text-ink">
                {step.title}
              </h3>

              <div className={`mt-5 flex flex-1 flex-col rounded-2xl p-4 ${TINTS[index]}`}>
                {/* What the founder says */}
                <div className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-3 shadow-[0_10px_30px_-18px_rgba(15,26,51,0.45)] dark:bg-paper">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                    <HiOutlineUser aria-hidden className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm font-medium italic leading-snug text-ink">{step.pain}</p>
                </div>

                <HiArrowDown aria-hidden className="mx-auto my-2 h-4 w-4 text-ink-soft" />

                {/* What I do about it */}
                <div className="flex-1 rounded-xl border border-line bg-white/70 p-3 dark:bg-paper/70">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                    {common("founderAction")}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.action}</p>
                </div>
              </div>

              <p className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-center text-sm font-medium text-ink">
                <HiCheck aria-hidden className="h-4 w-4 shrink-0 text-accent" />
                {step.result}
              </p>

              {index < steps.length - 1 && (
                <span aria-hidden className="journey-dash-v mx-auto mt-4 h-8 w-0.5 sm:hidden" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
