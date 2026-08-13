"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizSocket } from "@/lib/useQuizSocket";
import { getSessionState } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function WaitingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of client-only storage on mount
    setSessionId(localStorage.getItem("sessionId"));
    setParticipantId(localStorage.getItem("participantId"));
  }, []);

  useQuizSocket({
    sessionId,
    role: "participant",
    participantId,
    onEvent: (event, payload) => {
      if (event === "session:state" && (payload as { status?: string })?.status === "in_progress") {
        router.push("/quiz");
      }
      if (event === "quiz:ended") router.push("/results");
    },
  });

  // Resync on mount / reconnect in case events were missed.
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    getSessionState(sessionId, participantId).then((state) => {
      if (cancelled) return;
      if (state.status === "in_progress") router.push("/quiz");
      if (state.status === "ended") router.push("/results");
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-tech-grid px-6 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-brand-orange/30" />
        <span className="relative h-16 w-16 rounded-full bg-brand-orange animate-pulse-soft" />
      </div>
      <h1 className="font-headline text-3xl text-white">{t("waiting", "title")}</h1>
      <p className="max-w-xs text-lg text-white/70">{t("waiting", "subhead")}</p>
    </main>
  );
}
