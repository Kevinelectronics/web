import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  FaBluesky,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaThreads,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
  HiArrowLongRight,
  HiCheck,
  HiOutlineBolt,
  HiOutlineCalendarDays,
  HiOutlineGlobeAlt,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { avatarPhoto } from "@/content/site";
import Container from "./Container";

// Sections only the AI content automation landing uses: the hero visual and the
// two systems (LinkedIn radar, publish everywhere). All motion is CSS (`au-*`
// rules in globals.css) and stops under prefers-reduced-motion.

export const radarRepo = "https://github.com/Kevinelectronics/Linkedin-RADAR";

const card =
  "rounded-2xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(15,26,51,0.55)] dark:bg-paper";

type Platform = { name: string; Icon: IconType; color: string };

const platforms: Platform[] = [
  { name: "LinkedIn", Icon: FaLinkedin, color: "#0a66c2" },
  { name: "Instagram", Icon: FaInstagram, color: "#e1306c" },
  { name: "X", Icon: FaXTwitter, color: "#111111" },
  { name: "TikTok", Icon: FaTiktok, color: "#111111" },
  { name: "YouTube", Icon: FaYoutube, color: "#ff0000" },
  { name: "Facebook", Icon: FaFacebook, color: "#1877f2" },
  { name: "Threads", Icon: FaThreads, color: "#111111" },
  { name: "Bluesky", Icon: FaBluesky, color: "#1185fe" },
];

function Avatar({ size }: { size: number }) {
  return avatarPhoto ? (
    <Image
      src={avatarPhoto}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span className="shrink-0 rounded-full bg-accent-soft" style={{ width: size, height: size }} />
  );
}

/** Hero: one approved post in the middle, fanning out to every network. */
export function AutomationAnimation() {
  const t = useTranslations("services.automation.mock");
  const size = 380;
  const center = size / 2;
  const radius = 150;

  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[380px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 h-full w-full">
        <circle cx={center} cy={center} r={radius} fill="none" className="stroke-line" strokeWidth="1.5" />
        <circle cx={center} cy={center} r={radius * 0.62} fill="none" className="stroke-line" strokeWidth="1.5" />
        <g className="au-sweep" style={{ transformOrigin: `${center}px ${center}px` }}>
          <path
            d={`M${center} ${center} L${center} ${center - radius} A${radius} ${radius} 0 0 1 ${center + radius * 0.87} ${center - radius * 0.5} Z`}
            className="fill-accent/15"
          />
        </g>
        {platforms.map((p, i) => {
          const a = (i / platforms.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <line
              key={p.name}
              x1={center}
              y1={center}
              x2={center + Math.cos(a) * radius}
              y2={center + Math.sin(a) * radius}
              className="au-dash stroke-accent/50"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          );
        })}
      </svg>

      {platforms.map((p, i) => {
        const a = (i / platforms.length) * Math.PI * 2 - Math.PI / 2;
        const left = ((center + Math.cos(a) * radius) / size) * 100;
        const top = ((center + Math.sin(a) * radius) / size) * 100;
        return (
          <span
            key={p.name}
            className={`au-pop absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center ${card}`}
            style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${0.4 + i * 0.25}s` }}
          >
            <p.Icon className="h-5 w-5 dark:!text-ink" style={{ color: p.color }} />
          </span>
        );
      })}

      {/* The approved post */}
      <div className={`absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2 p-3 ${card}`}>
        <div className="flex items-center gap-2">
          <Avatar size={28} />
          <span className="h-2 flex-1 rounded-full bg-line" />
        </div>
        <span className="mt-3 block h-2 w-full rounded-full bg-line" />
        <span className="mt-1.5 block h-2 w-3/4 rounded-full bg-line" />
        <span className="mt-3 flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-white">
          <HiCheck className="h-3.5 w-3.5" />
          {t("approved")}
        </span>
      </div>

      {/* Opportunity toast */}
      <div className={`li-toast absolute -right-2 -top-4 flex items-center gap-2 px-3 py-2 sm:-right-8 ${card}`}>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a66c2] text-white">
          <HiOutlineUserGroup className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-medium text-ink">{t("opportunity")}</p>
          <p className="text-[11px] font-semibold text-[#0a66c2] dark:text-[#5aa9f5]">{t("opportunityDetail")}</p>
        </div>
      </div>
    </div>
  );
}

type Item = { title: string; description: string };

const radarStepIcons: IconType[] = [FaLinkedin, HiOutlineGlobeAlt, HiOutlineSparkles, HiCheck];
const radarTraitIcons: IconType[] = [HiOutlineMagnifyingGlass, HiOutlineShieldCheck, HiOutlineBolt];

export function RadarSystem() {
  const t = useTranslations("services.automation.radar");
  const steps = t.raw("steps") as Item[];
  const traits = t.raw("traits") as Item[];
  const tabs = t.raw("tabs") as { value: string; label: string }[];

  return (
    <section id="linkedin-radar" className="border-t border-line py-20">
      <Container>
        <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-accent">
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-xs text-white">01</span>
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-2xl font-medium tracking-tight text-ink sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">{t("subtitle")}</p>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.25fr_1fr]">
          <figure className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_-40px_rgba(15,26,51,0.6)]">
            <Image
              src="/systems/linkedin-radar.png"
              alt={t("imageAlt")}
              width={1203}
              height={887}
              className="h-auto w-full"
            />
            <figcaption className="grid grid-cols-4 divide-x divide-line border-t border-line bg-paper">
              {tabs.map((tab) => (
                <div key={tab.label} className="px-3 py-3 text-center">
                  <p className="font-display text-xl font-medium text-accent">{tab.value}</p>
                  <p className="text-[11px] leading-tight text-ink-soft">{tab.label}</p>
                </div>
              ))}
            </figcaption>
          </figure>

          <ol className="relative space-y-4 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-line">
            {steps.map((step, index) => {
              const Icon = radarStepIcons[index];
              const last = index === steps.length - 1;
              return (
                <li key={step.title} className="relative flex gap-4">
                  <span
                    className={`relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-xl ${
                      last ? "bg-accent text-white" : "border border-line bg-paper text-accent"
                    }`}
                  >
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <div className="rounded-2xl border border-line bg-paper p-4">
                    <h3 className="text-base font-medium text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {traits.map((trait, index) => {
            const Icon = radarTraitIcons[index];
            return (
              <div key={trait.title} className="rounded-2xl border border-line bg-accent-soft p-6">
                <Icon aria-hidden className="h-6 w-6 text-accent" />
                <h3 className="mt-3 text-base font-medium text-ink">{trait.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{trait.description}</p>
              </div>
            );
          })}
        </div>

        <a
          href={radarRepo}
          target="_blank"
          rel="noopener"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <FaGithub aria-hidden className="h-4 w-4" />
          {t("github")}
        </a>
      </Container>
    </section>
  );
}

export function PublishSystem() {
  const t = useTranslations("services.automation.publish");
  const steps = t.raw("steps") as Item[];
  const formats = t.raw("formats") as string[];
  const stepIcons: IconType[] = [HiCheck, HiOutlineCalendarDays, HiOutlineBolt];

  return (
    <section id="publish-everywhere" className="border-t border-line py-20">
      <Container>
        <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-accent">
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-xs text-white">02</span>
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-2xl font-medium tracking-tight text-ink sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">{t("subtitle")}</p>

        {/* One post -> every network */}
        <div className="mt-12 grid items-center gap-6 rounded-3xl border border-line bg-paper p-6 sm:p-10 lg:grid-cols-[1fr_auto_1.4fr]">
          <div className={`p-4 ${card}`}>
            <div className="flex items-center gap-3">
              <Avatar size={36} />
              <div className="min-w-0 flex-1">
                <span className="block h-2 w-24 rounded-full bg-line" />
                <span className="mt-1.5 block h-2 w-16 rounded-full bg-line" />
              </div>
            </div>
            <p className="mt-3 text-sm font-medium leading-snug text-ink">{t("postTitle")}</p>
            <div className="mt-3 h-20 rounded-xl bg-gradient-to-br from-accent to-[#0a66c2]" />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {formats.map((format) => (
                <span key={format} className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                  {format}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center" aria-hidden>
            <span className="au-nudge flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-[0_12px_30px_-10px_rgba(38,71,199,0.7)]">
              <HiArrowLongRight className="h-6 w-6 rotate-90 lg:rotate-0" />
            </span>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {platforms.map((p, i) => (
              <li
                key={p.name}
                className="au-pop flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-3 dark:bg-paper"
                style={{ animationDelay: `${0.3 + i * 0.2}s` }}
              >
                <p.Icon aria-hidden className="h-6 w-6 dark:!text-ink" style={{ color: p.color }} />
                <span className="text-xs font-medium text-ink">{p.name}</span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#1d7a4f] dark:text-[#6fd3a0]">
                  <HiCheck aria-hidden className="h-3 w-3" />
                  {t("published")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <div key={step.title} className="rounded-2xl border border-line bg-paper p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
