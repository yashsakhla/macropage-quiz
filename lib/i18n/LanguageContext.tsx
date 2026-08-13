"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type Lang, t as translate, translations } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: <Section extends keyof typeof translations, Key extends keyof (typeof translations)[Section]>(
    section: Section,
    key: Key
  ) => ReturnType<typeof translate<Section, Key>>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "en" || stored === "hi" || stored === "hinglish") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a client-only storage API on mount
      setLangState(stored);
    }
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (section, key) => translate(lang, section, key),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
