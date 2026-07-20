import { useTranslations } from "next-intl";
import Container from "./Container";
import { socials, featuredVideoId } from "@/content/site";

export default function Videos() {
  const t = useTranslations("videos");

  return (
    <section className="border-t border-line py-20">
      <Container className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          {t("body")}
        </p>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${featuredVideoId}`}
            title={t("title")}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <a
          href={socials.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
        >
          {t("cta")} →
        </a>
      </Container>
    </section>
  );
}
