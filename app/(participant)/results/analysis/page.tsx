"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { requestAnalysis } from "@/lib/api";
import { buildStaticAnalysis } from "@/lib/staticAnalysis";
import { AiThinking } from "@/components/AiThinking";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const ANALYSIS_MAX_ATTEMPTS = 3;
const MIN_LOADING_MS = 10000;

/** Retries the live analysis a few times, then quietly falls back to a static
 *  report so a transient API outage never surfaces as a broken screen. */
async function fetchAnalysisWithFallback(participantId: string) {
  const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS));

  async function fetchReport() {
    for (let attempt = 1; attempt <= ANALYSIS_MAX_ATTEMPTS; attempt++) {
      try {
        return await requestAnalysis(participantId);
      } catch {
        if (attempt === ANALYSIS_MAX_ATTEMPTS) return buildStaticAnalysis(participantId);
      }
    }
    return buildStaticAnalysis(participantId);
  }

  const [report] = await Promise.all([fetchReport(), minDelay]);
  return report;
}

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, score)) / 100;

  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#2a2a2a" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#FF4208"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline text-5xl text-white">{score}</span>
        <span className="text-xs uppercase tracking-widest text-white/50">{label}</span>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const { t, lang } = useLanguage();
  const [participantId, setParticipantId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of client-only storage on mount
    setParticipantId(localStorage.getItem("participantId"));
  }, []);

  const { data: report, isPending } = useQuery({
    queryKey: ["analysis", participantId],
    queryFn: () => fetchAnalysisWithFallback(participantId as string),
    enabled: !!participantId,
    staleTime: Infinity,
    retry: false,
  });

  const isHi = lang === "hi";
  const headline = (isHi && report?.reportJson.headlineHi) || report?.reportJson.headline;
  const businessSnapshot =
    (isHi && report?.reportJson.businessSnapshotHi) || report?.reportJson.businessSnapshot;
  const mindsetProfile =
    (isHi && report?.reportJson.mindsetProfileHi) || report?.reportJson.mindsetProfile;
  const goalRoadmap =
    (isHi && report?.reportJson.goalRoadmapHi) || report?.reportJson.goalRoadmap;
  const techRecommendation =
    (isHi && report?.reportJson.techRecommendationHi) || report?.reportJson.techRecommendation;

  return (
    <main className="min-h-screen bg-tech-grid px-6 pb-16 pt-28 text-white">
      {isPending || !report ? (
        <div className="flex min-h-[70vh] items-center justify-center">
          <AiThinking />
        </div>
      ) : (
        <div className="mx-auto flex max-w-md flex-col gap-8 animate-[fadeIn_0.6s_ease]">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-brand-orange">
              {t("analysis", "reportLabel")}
            </p>
            <h1 className="font-headline mt-2 text-3xl leading-tight">{headline}</h1>
          </div>

          <ScoreGauge score={report.techScore} label={t("analysis", "techScoreLabel")} />

          <div className="rounded-2xl bg-white/5 p-6 text-center">
            <p className="text-sm uppercase tracking-widest text-white/50">
              {t("analysis", "archetypeLabel")}
            </p>
            <p className="font-headline mt-1 text-2xl text-brand-orange">{report.archetype}</p>
          </div>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/50">
              {t("analysis", "snapshotLabel")}
            </h2>
            <p className="text-white/80 leading-relaxed">{businessSnapshot}</p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/50">
              {t("analysis", "mindsetLabel")}
            </h2>
            <p className="text-white/80 leading-relaxed">{mindsetProfile}</p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/50">
              {t("analysis", "roadmapLabel")}
            </h2>
            <ul className="flex flex-col gap-3">
              {goalRoadmap?.map((step, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-white/90">{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-brand-orange/40 bg-brand-orange/10 p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              {t("analysis", "recommendationLabel")}
            </h2>
            <p className="text-white/90 leading-relaxed">{techRecommendation}</p>
            <p className="mt-4 text-sm text-white/60">
              {t("analysis", "ctaText")}{" "}
              <a href="https://macropage.in" className="font-semibold text-brand-orange underline">
                macropage.in
              </a>
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
