import Image from "next/image";
import { useTranslations } from "next-intl";
import Container from "./Container";
import { avatarPhoto, contactEmail } from "@/content/site";

export default function Talk() {
  const t = useTranslations("talk");

  return (
    <section className="border-t border-line bg-accent py-20 text-white">
      <Container className="max-w-2xl text-center">
        {avatarPhoto ? (
          <Image
            src={avatarPhoto}
            alt=""
            width={88}
            height={88}
            className="mx-auto mb-6 h-[88px] w-[88px] rounded-full border-2 border-white/40 object-cover"
          />
        ) : null}
        <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-white/85">
          {t("body")}
        </p>
        <p className="mt-3 text-base leading-relaxed text-white/85">
          {t("closing")}
        </p>
        <div className="mt-8">
          <a
            href={`mailto:${contactEmail}`}
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-accent-strong transition-colors hover:bg-accent-soft"
          >
            {t("cta")}
          </a>
        </div>
      </Container>
    </section>
  );
}
