"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1">
          {index > 0 && (
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
          )}
          <button
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={loc === locale}
            className={`px-1 uppercase tracking-wide transition-colors ${
              loc === locale
                ? "font-medium text-neutral-900 dark:text-neutral-100"
                : "text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
            }`}
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  );
}
