"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getParticipantRank } from "@/lib/api";
import { BigButton } from "@/components/BigButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ResultsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [participantId, setParticipantId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a client-only storage API on mount
    setParticipantId(localStorage.getItem("participantId"));
  }, []);

  const { data: rank, isLoading } = useQuery({
    queryKey: ["rank", participantId],
    queryFn: () => getParticipantRank(participantId as string),
    enabled: !!participantId,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-tech-grid px-6 text-center text-white">
      <p className="text-sm uppercase tracking-widest text-white/50">{t("results", "complete")}</p>

      {isLoading && <p className="text-white/60">{t("results", "calculating")}</p>}

      {rank && (
        <h1 className="font-headline text-4xl leading-tight">
          {t("results", "finishedPrefix")}
          <br />
          {rank.rank != null ? (
            <>
              <span className="text-brand-orange">#{rank.rank}</span> · {t("analysis", "techScoreLabel")}{" "}
              {rank.score}
            </>
          ) : (
            <span className="text-brand-orange">{rank.score} pts</span>
          )}
        </h1>
      )}

      <p className="max-w-xs text-white/70">{t("results", "ctaLead")}</p>

      <div className="w-full max-w-sm">
        <BigButton onClick={() => router.push("/results/analysis")}>
          {t("results", "analyzeButton")}
        </BigButton>
      </div>
    </main>
  );
}
