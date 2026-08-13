"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LANGUAGES } from "@/lib/i18n/translations";
import { isDarkPage } from "@/lib/pageTheme";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const dark = isDarkPage(pathname);

  return (
    <div
      className={clsx(
        "flex gap-1 rounded-full p-1 shadow-lg backdrop-blur",
        dark ? "bg-white/10 border border-white/15" : "bg-white/90 border border-black/10"
      )}
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-semibold font-mono transition-colors",
            lang === l.code
              ? "bg-brand-orange text-white"
              : dark
              ? "text-white/60 hover:text-white"
              : "text-brand-charcoal/50 hover:text-brand-charcoal"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
