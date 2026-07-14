import Image from "next/image";
import { useTranslations } from "next-intl";
import Container from "./Container";
import ContactForm from "./ContactForm";
import { avatarPhoto, contactEmail } from "@/content/site";

export default function Talk() {
  const t = useTranslations("talk");

  return (
    <section id="contact" className="scroll-mt-16 border-t border-line bg-accent py-20 text-white">
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
        <p className="mt-6 text-sm text-white/70">
          <a href={`mailto:${contactEmail}`} className="underline hover:text-white">
            {contactEmail}
          </a>
        </p>
      </Container>
      <Container className="mt-10 max-w-lg text-left">
        <ContactForm />
      </Container>
    </section>
  );
}
