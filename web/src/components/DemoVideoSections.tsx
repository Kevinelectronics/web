import { useTranslations } from "next-intl";
import { FaLinkedin, FaProductHunt } from "react-icons/fa";
import {
  HiCheck,
  HiOutlineBookOpen,
  HiOutlineComputerDesktop,
  HiOutlineEnvelope,
  HiOutlinePresentationChartLine,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import Container from "./Container";
import DemoReel, { type Chapter } from "./DemoReel";

// Sections only the demo video landing uses. The rest of that page reuses the
// shared service sections.

export const demoVideo = {
  src: "/videos/eodhd-mcp-demo.mp4",
  poster: "/videos/eodhd-mcp-demo-poster.jpg",
  duration: "PT26S",
  uploadDate: "2026-11-10",
};

export function DemoReelSection() {
  const t = useTranslations("services.demo.reel");

  return (
    <section className="pb-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-accent">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">{t("subtitle")}</p>
          </div>
          <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink-soft">
            {t("client")}
          </span>
        </div>

        <div className="mt-10">
          <DemoReel
            src={demoVideo.src}
            poster={demoVideo.poster}
            title={t("videoTitle")}
            chapters={t.raw("chapters") as Chapter[]}
          />
        </div>
      </Container>
    </section>
  );
}

type UseCase = { title: string; description: string };

// Matched to `useCases.items` by position.
const useCaseIcons: IconType[] = [
  FaProductHunt,
  HiOutlineComputerDesktop,
  FaLinkedin,
  HiOutlineEnvelope,
  HiOutlinePresentationChartLine,
  HiOutlineBookOpen,
];

export function DemoUseCases() {
  const t = useTranslations("services.demo.useCases");
  const items = t.raw("items") as UseCase[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">{t("eyebrow")}</p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = useCaseIcons[index];
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-accent"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform group-hover:-translate-y-0.5">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

type Package = { name: string; duration: string; description: string; features: string[] };

export function DemoPackages() {
  const t = useTranslations("services.demo.packages");
  const items = t.raw("items") as Package[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">{t("eyebrow")}</p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">{t("subtitle")}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {items.map((pkg, index) => {
            const featured = index === 1;
            return (
              <div
                key={pkg.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  featured ? "border-accent bg-accent-soft/40" : "border-line"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white">
                    {t("recommended")}
                  </span>
                )}
                <h3 className="font-display text-xl font-medium text-ink">{pkg.name}</h3>
                <p className="mt-1 font-mono text-sm text-accent">{pkg.duration}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{pkg.description}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                        <HiCheck size={10} />
                      </span>
                      <span className="text-sm text-ink-soft">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  data-package={pkg.name}
                  className={`mt-6 inline-block rounded-full px-5 py-2.5 text-center text-sm font-medium transition-colors ${
                    featured
                      ? "bg-accent text-white hover:bg-accent-strong"
                      : "border border-line text-ink hover:border-accent hover:text-accent"
                  }`}
                >
                  {t("cta")}
                </a>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
