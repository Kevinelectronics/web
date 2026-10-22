import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  HiCheck,
  HiChevronRight,
  HiMagnifyingGlass,
  HiOutlineHandThumbUp,
  HiPlay,
  HiUserPlus,
} from "react-icons/hi2";

type Step = { title: string; subtitle: string; result: string };

// One soft tint per step, with a dark-mode counterpart.
const TINTS = [
  "bg-accent-soft",
  "bg-amber-100/70 dark:bg-amber-400/10",
  "bg-sky-100/70 dark:bg-sky-400/10",
  "bg-emerald-100/70 dark:bg-emerald-400/10",
];

const card =
  "rounded-xl border border-line bg-white p-3 shadow-[0_10px_30px_-18px_rgba(15,26,51,0.45)] dark:bg-paper";

export default function Journey() {
  const t = useTranslations("journey");
  const steps = t.raw("steps") as Step[];
  const persona = t("persona");
  const initial = persona.charAt(0);

  const mocks: ReactNode[] = [
    // 1 — Google search with the article ranking first
    <div key="search" className="space-y-2">
      <div className={`${card} flex items-center gap-2 rounded-full px-3 py-2`}>
        <HiMagnifyingGlass aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink-soft" />
        <span className="truncate text-xs text-ink-soft">{t("mock.query")}</span>
      </div>
      <div className={card}>
        <p className="truncate text-[11px] text-emerald-700 dark:text-emerald-400">
          tu-saas.com › blog
        </p>
        <p className="mt-0.5 text-sm font-medium leading-snug text-accent">
          {t("mock.resultTitle")}
        </p>
        <span className="journey-pop mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">
          <HiCheck aria-hidden className="h-3 w-3" />
          {t("mock.rank")}
        </span>
      </div>
    </div>,

    // 2 — YouTube demo + LinkedIn engagement
    <div key="video" className="space-y-2">
      <div className={`${card} flex items-center gap-3`}>
        <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-ink text-paper">
          <HiPlay aria-hidden className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-ink">{t("mock.videoTitle")}</p>
          <p className="truncate text-[11px] text-ink-soft">{t("mock.videoMeta")}</p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
            <div className="journey-progress h-full w-2/3 rounded-full bg-red-500" />
          </div>
        </div>
      </div>
      <div className={`${card} flex items-center gap-2`}>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#0a66c2] text-[10px] font-bold text-white">
          in
        </span>
        <HiOutlineHandThumbUp aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink-soft" />
        <span className="text-[11px] leading-tight text-ink-soft">{t("mock.linkedin")}</span>
      </div>
    </div>,

    // 3 — Code that actually runs
    <div
      key="code"
      className="rounded-xl bg-[#0f1a33] p-3 font-mono text-[11px] leading-relaxed text-[#c9d4f5] shadow-[0_10px_30px_-18px_rgba(15,26,51,0.6)] ring-1 ring-white/10"
    >
      <p>
        <span className="text-[#7b97ff]">$</span> pip install tu-sdk
      </p>
      <p className="mt-1">
        <span className="text-[#c792ea]">r</span> = client.get(url)
      </p>
      <p>
        print(r.status)<span className="journey-caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-[#c9d4f5]" />
      </p>
      <p className="mt-2 text-emerald-400">✓ 200 OK · 0.8s</p>
    </div>,

    // 4 — Sign-up notification
    <div key="signup" className="space-y-2">
      <div className={`${card} orbit-float flex items-center gap-3`}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          <HiUserPlus aria-hidden className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{t("mock.signup")}</p>
          <p className="truncate text-[11px] text-ink-soft">{t("mock.signupMeta")}</p>
        </div>
      </div>
      <div className={`${card} flex items-center gap-2`}>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-white">
          {initial}
        </span>
        <span className="truncate text-[11px] text-ink-soft">{t("mock.fromContent")}</span>
      </div>
    </div>,
  ];

  return (
    <section className="border-t border-line py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{t("subtitle")}</p>
        </div>

        <ol className="mt-14 grid gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="journey-step relative flex flex-col">
              {/* Number + connector to the next step (desktop row only) */}
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
              <p className="mt-1 text-center text-sm text-ink-soft">{step.subtitle}</p>

              <div className={`mt-5 flex min-h-[176px] flex-1 flex-col justify-center rounded-2xl p-4 ${TINTS[index]}`}>
                {mocks[index]}
              </div>

              <p className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-center text-sm font-medium text-ink">
                <HiCheck aria-hidden className="h-4 w-4 shrink-0 text-accent" />
                {step.result}
              </p>

              {/* Vertical connector between stacked steps (mobile only) */}
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
