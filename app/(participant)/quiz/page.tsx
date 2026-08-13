"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useQuizSocket } from "@/lib/useQuizSocket";
import { submitAnswer, getQuestions, getSessionState } from "@/lib/api";
import { CountdownRing } from "@/components/CountdownRing";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { OptionKey, QuizQuestion } from "@/lib/types";

const ADVANCE_DELAY_MS = 1200;

export default function QuizPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of client-only storage on mount
    setSessionId(localStorage.getItem("sessionId"));
    setParticipantId(localStorage.getItem("participantId"));
  }, []);

  useQuizSocket({
    sessionId,
    role: "participant",
    participantId,
    onEvent: (event) => {
      if (event === "quiz:ended") router.push("/results");
    },
  });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    getSessionState(sessionId, participantId).then((state) => {
      if (cancelled) return;
      if (state.status === "ended") {
        router.push("/results");
      } else if (state.status === "in_progress") {
        getQuestions(sessionId).then((qs) => {
          if (cancelled) return;
          setQuestions(qs);
          setQuestionIndex(0);
          setStartedAt(Date.now());
        }).catch(() => {});
      } else {
        router.push("/waiting");
      }
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [sessionId, participantId, router]);

  const question = questions?.[questionIndex] ?? null;

  const mutation = useMutation({
    mutationFn: (key: OptionKey) => {
      if (!question) throw new Error("Not ready");
      return submitAnswer(question.id, key, Date.now() - startedAt);
    },
  });

  function advance() {
    if (!questions) return;
    if (questionIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setQuestionIndex((i) => i + 1);
    setStartedAt(Date.now());
    setSelectedOption(null);
    setTimeUp(false);
  }

  function handleSelect(key: OptionKey) {
    if (selectedOption || timeUp || !question) return;
    setSelectedOption(key);
    mutation.mutate(key);
    setTimeout(advance, ADVANCE_DELAY_MS);
  }

  function handleExpire() {
    setTimeUp(true);
    setTimeout(advance, ADVANCE_DELAY_MS);
  }

  if (finished) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-tech-grid px-6 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-brand-orange/30" />
          <span className="relative h-16 w-16 rounded-full bg-brand-orange animate-pulse-soft" />
        </div>
        <h1 className="font-headline text-3xl text-white">{t("quiz", "doneTitle")}</h1>
        <p className="max-w-xs text-lg text-white/70">{t("quiz", "doneSubhead")}</p>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-tech-grid">
        <p className="text-white/60">{t("quiz", "loading")}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-tech-grid px-5 pb-8 pt-24 text-white">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-medium text-white/60">
          {t("quiz", "questionLabel")} {String(questionIndex + 1).padStart(2, "0")} /{" "}
          {String(questions?.length ?? 0).padStart(2, "0")}
        </span>
        <CountdownRing
          totalSeconds={question.timeLimitSeconds}
          startedAt={startedAt}
          onExpire={handleExpire}
        />
      </div>

      <h1 className="font-headline mt-6 text-xl leading-snug">
        {lang === "hi" && question.textHi ? question.textHi : question.text}
      </h1>

      <div className="mt-6 flex flex-1 flex-col gap-2.5">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.key;
          return (
            <button
              key={option.key}
              onClick={() => handleSelect(option.key)}
              disabled={!!selectedOption || timeUp}
              className={`flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left text-sm font-medium transition-all active:scale-[0.98] disabled:active:scale-100 ${
                isSelected
                  ? "border-brand-orange bg-brand-orange text-white"
                  : "border-white/15 bg-white/5 text-white hover:border-white/30"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-headline text-xs ${
                  isSelected ? "bg-white text-brand-orange" : "bg-white/10 text-white/70"
                }`}
              >
                {option.key}
              </span>
              {lang === "hi" && option.textHi ? option.textHi : option.text}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        {selectedOption && <p className="text-brand-orange font-medium">{t("quiz", "locked")}</p>}
        {!selectedOption && timeUp && <p className="text-white/50 font-medium">{t("quiz", "timesUp")}</p>}
      </div>
    </main>
  );
}
