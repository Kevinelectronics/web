"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const localeFlags: Record<string, string> = {
  es: "🇪🇸",
  en: "🇬🇧",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-line p-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === locale}
          aria-label={loc}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 uppercase tracking-wide transition-colors ${
            loc === locale
              ? "bg-accent-soft font-medium text-accent-strong"
              : "text-ink-soft hover:text-accent"
          }`}
        >
          <span aria-hidden="true" className="text-base leading-none">
            {localeFlags[loc]}
          </span>
          {loc}
        </button>
      ))}
    </div>
  );
}
