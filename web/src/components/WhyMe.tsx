import {
  HiOutlineCodeBracket,
  HiOutlineCog6Tooth,
  HiOutlineMegaphone,
} from "react-icons/hi2";
import { useTranslations } from "next-intl";
import Container from "./Container";

const icons = [HiOutlineCodeBracket, HiOutlineCog6Tooth, HiOutlineMegaphone];

export default function WhyMe() {
  const t = useTranslations("whyMe");
  const profiles = t.raw("profiles") as { title: string; description: string }[];

  return (
    <section className="border-t border-line py-20">
      <Container>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          {t("intro")}
        </p>

        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {profiles.map((profile, index) => {
            const Icon = icons[index] ?? HiOutlineCodeBracket;
            return (
              <div key={profile.title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-base font-medium text-ink">
                  {profile.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {profile.description}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink-soft">
          {t("closing")}
        </p>
      </Container>
    </section>
  );
}
