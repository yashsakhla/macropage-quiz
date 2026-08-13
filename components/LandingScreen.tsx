"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { InteractiveBackground } from "@/components/InteractiveBackground";

interface LandingScreenProps {
  sessionId: string;
  onEnter: () => void;
}

export function LandingScreen({ sessionId, onEnter }: LandingScreenProps) {
  const { t } = useLanguage();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand-offwhite px-6 py-12 text-center">
      <InteractiveBackground />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <span className="animate-fade-in mb-4 inline-block rounded-full bg-brand-orange/10 px-3 py-1 font-mono text-xs font-semibold text-brand-orange">
          {t("landing", "badge")}
        </span>

        <h1
          className="animate-fade-in font-headline text-4xl leading-tight text-brand-charcoal"
          style={{ animationDelay: "0.08s" }}
        >
          {t("landing", "headline")}
        </h1>

        <p
          className="animate-fade-in mt-4 max-w-xs text-brand-charcoal/70"
          style={{ animationDelay: "0.16s" }}
        >
          {t("landing", "subhead")}
        </p>

        <div className="animate-fade-in mt-10 w-full" style={{ animationDelay: "0.24s" }}>
          {sessionId ? (
            <button
              onClick={onEnter}
              className="group relative w-full overflow-hidden rounded-2xl bg-brand-orange px-6 py-6 text-lg font-semibold text-white shadow-xl shadow-brand-orange/25 transition-transform active:scale-[0.97]"
            >
              <span className="absolute inset-0 -z-10 animate-pulse-soft bg-brand-orange" />
              <span className="relative flex items-center justify-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                </span>
                {t("landing", "sessionLive")} · {t("landing", "enterButton")}
              </span>
            </button>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-charcoal/15 px-6 py-8">
              <p className="font-semibold text-brand-charcoal">{t("landing", "noSession")}</p>
              <p className="mt-2 text-sm text-brand-charcoal/60">{t("landing", "noSessionHint")}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
