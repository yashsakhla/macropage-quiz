"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getSessionState, registerParticipant } from "@/lib/api";
import { BigButton } from "@/components/BigButton";
import { LandingScreen } from "@/components/LandingScreen";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { VideoIntro } from "@/components/VideoIntro";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") ?? "";
  const { t } = useLanguage();

  const [showIntro, setShowIntro] = useState(true);
  const [entered, setEntered] = useState(false);
  const [name, setName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [checkingResume, setCheckingResume] = useState(true);

  useEffect(() => {
    const existingSessionId = localStorage.getItem("sessionId");
    const existingParticipantId = localStorage.getItem("participantId");

    // A session id in the URL that differs from the stored one means the user is
    // joining a different quiz — clear the stale participant so they register fresh
    // instead of being resumed/redirected into their old quiz's results.
    if (sessionId && existingSessionId && sessionId !== existingSessionId) {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("participantId");
      localStorage.removeItem("sessionToken");
      setCheckingResume(false);
      return;
    }

    if (!existingSessionId || !existingParticipantId) {
      setCheckingResume(false);
      return;
    }

    getSessionState(existingSessionId, existingParticipantId)
      .then((state) => {
        if (state.status === "ended") router.replace("/results");
        else if (state.status === "in_progress") router.replace("/quiz");
        else router.replace("/waiting");
      })
      .catch(() => setCheckingResume(false));
  }, [router, sessionId]);

  const mutation = useMutation({
    mutationFn: () => registerParticipant(sessionId, name, whatsappNumber),
    onSuccess: (data) => {
      localStorage.setItem("participantId", data.participantId);
      localStorage.setItem("sessionToken", data.sessionToken);
      localStorage.setItem("sessionId", sessionId);
      router.push("/onboarding");
    },
  });

  if (checkingResume) return null;

  if (showIntro) {
    return <VideoIntro onComplete={() => setShowIntro(false)} />;
  }

  if (!entered) {
    return <LandingScreen sessionId={sessionId} onEnter={() => setEntered(true)} />;
  }

  return (
    <main className="animate-fade-in relative flex min-h-screen flex-col justify-center overflow-hidden bg-brand-offwhite px-6 py-12">
      <InteractiveBackground />
      <div className="relative z-10 mx-auto w-full max-w-sm">
        <span className="mb-3 inline-block rounded-full bg-brand-orange/10 px-3 py-1 font-mono text-xs font-semibold text-brand-orange">
          {t("join", "badge")}
        </span>
        <h1 className="font-headline text-3xl leading-tight text-brand-charcoal">
          {t("join", "headline")}
        </h1>
        <p className="mt-3 text-brand-charcoal/70">{t("join", "subhead")}</p>

        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!sessionId) return;
            mutation.mutate();
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-charcoal/70">
              {t("join", "nameLabel")}
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("join", "namePlaceholder")}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-lg text-brand-charcoal outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-charcoal/70">
              {t("join", "whatsappLabel")}
            </label>
            <input
              required
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder={t("join", "whatsappPlaceholder")}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-lg text-brand-charcoal outline-none focus:border-brand-orange"
            />
          </div>

          {!sessionId && <p className="text-sm text-red-600">{t("join", "missingSession")}</p>}
          {mutation.isError && (
            <p className="text-sm text-red-600">
              {(mutation.error as Error).message || t("join", "genericError")}
            </p>
          )}

          <BigButton type="submit" disabled={!sessionId || mutation.isPending}>
            {mutation.isPending ? t("join", "submitting") : t("join", "submit")}
          </BigButton>
        </form>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <JoinForm />
    </Suspense>
  );
}
