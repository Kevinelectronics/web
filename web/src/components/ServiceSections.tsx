import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  HiArrowRight,
  HiCheck,
  HiOutlineBugAnt,
  HiOutlineCodeBracket,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import type { IconType } from "react-icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { serviceIds, servicePath, type ServiceId } from "@/content/services";
import Container from "./Container";
import { LinkedInAnimation, YouTubeAnimation } from "./ServiceAnimations";

type Stat = { value: string; label: string };
type Problem = { title: string; description: string };

export const serviceIcons: Record<ServiceId, IconType> = {
  copywriting: HiOutlinePencilSquare,
  technical: HiOutlineCodeBracket,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
};

/** Brand colour for the channel services; the rest use the site accent. */
export const serviceIconColors: Record<ServiceId, string> = {
  copywriting: "text-accent",
  technical: "text-accent",
  youtube: "text-[#ff0000]",
  linkedin: "text-[#0a66c2] dark:text-[#5aa9f5]",
};

const heroVisuals: Partial<Record<ServiceId, () => ReactNode>> = {
  linkedin: () => <LinkedInAnimation />,
  youtube: () => <YouTubeAnimation />,
};

export function ServiceHero({ id }: { id: ServiceId }) {
  const t = useTranslations(`services.${id}`);
  const common = useTranslations("services.common");
  const stats = t.raw("stats") as Stat[];
  const Icon = serviceIcons[id];
  const visual = heroVisuals[id]?.();
  // With a visual the hero splits into text (left) + animation (right).
  const split = Boolean(visual);
  const align = split ? "text-center lg:text-left" : "text-center";
  const justify = split ? "justify-center lg:justify-start" : "justify-center";
  const center = split ? "mx-auto lg:mx-0" : "mx-auto";

  const text = (
    <div className={align}>
      <nav aria-label="Breadcrumb" className="text-xs text-ink-soft">
        <Link href="/" className="hover:text-accent">
          {common("home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/#services" className="hover:text-accent">
          {common("servicesLabel")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{t("name")}</span>
      </nav>

      <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink">
        <Icon aria-hidden className={`h-4 w-4 ${serviceIconColors[id]}`} />
        {t("eyebrow")}
      </p>
      <h1 className={`${center} mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl`}>
        {t("h1")}
      </h1>
      <p className={`${center} mt-6 max-w-2xl text-base leading-relaxed text-ink-soft`}>
        {t("intro")}
      </p>

      <div className={`mt-8 flex flex-wrap items-center gap-4 ${justify}`}>
        <a
          href="#contact"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          {common("ctaPrimary")}
        </a>
        <Link
          href="/#case-studies"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {common("ctaSecondary")}
        </Link>
      </div>

      <dl className={`${center} mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-line pt-8`}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="whitespace-nowrap font-display text-xl font-medium text-ink sm:text-3xl">
              {stat.value}
            </dd>
            <dd className="mt-1 text-xs leading-snug text-ink-soft sm:text-sm">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
      />
      {split ? (
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          {text}
          <div className="px-4 sm:px-8">{visual}</div>
        </div>
      ) : (
        <Container>{text}</Container>
      )}
    </section>
  );
}

export function ServiceProblem({ id }: { id: ServiceId }) {
  const t = useTranslations(`services.${id}`);
  const common = useTranslations("services.common");
  const problems = t.raw("problems") as Problem[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {common("problemEyebrow")}
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("problemTitle")}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {problems.map((problem, index) => (
            <div key={problem.title} className="rounded-2xl border border-line bg-paper p-6">
              <span className="font-display text-sm font-medium text-accent">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-base font-medium text-ink">{problem.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ServiceIncluded({ id }: { id: ServiceId }) {
  const t = useTranslations(`services.${id}`);
  const common = useTranslations("services.common");
  const included = t.raw("included") as string[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {common("includedEyebrow")}
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("includedTitle")}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {included.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                <HiCheck size={14} />
              </span>
              <span className="text-sm font-medium leading-relaxed text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function OtherServices({ current }: { current: ServiceId }) {
  const common = useTranslations("services.common");
  const t = useTranslations("services");
  const locale = useLocale() as Locale;

  return (
    <section className="border-t border-line py-20">
      <Container>
        <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
          {common("otherServices")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {serviceIds
            .filter((id) => id !== current)
            .map((id) => {
              const Icon = serviceIcons[id];
              return (
                <Link
                  key={id}
                  href={servicePath(id, locale)}
                  className="group rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-accent"
                >
                  <Icon aria-hidden className={`h-5 w-5 ${serviceIconColors[id]}`} />
                  <p className="mt-3 text-base font-medium text-ink">{t(`${id}.name`)}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm text-accent">
                    {common("viewService")}
                    <HiArrowRight
                      aria-hidden
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </p>
                </Link>
              );
            })}
        </div>
      </Container>
    </section>
  );
}

/** Shared on every service page: testing the product doubles as outside QA. */
export function ServiceFeedback() {
  const t = useTranslations("services.common.feedback");
  const items = t.raw("items") as string[];

  return (
    <section className="-mt-6 pb-20">
      <Container>
        <div className="grid gap-8 rounded-3xl border border-line bg-accent-soft p-8 sm:grid-cols-[1.1fr_1fr] sm:p-10">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-accent">
              <HiOutlineBugAnt aria-hidden className="h-4 w-4" />
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink">
              {t("title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t("description")}</p>
          </div>
          <ul className="flex flex-col justify-center gap-3">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-4 text-sm font-medium text-ink"
              >
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent text-white">
                  <HiCheck size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
