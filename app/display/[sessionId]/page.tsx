"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { getLeaderboard, getSessionState } from "@/lib/api";
import { useQuizSocket } from "@/lib/useQuizSocket";
import { Leaderboard } from "@/components/Leaderboard";
import type { LeaderboardEntry, SessionState } from "@/lib/types";

function joinUrl(sessionId: string) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/?session=${sessionId}`;
}

export default function DisplayPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const [state, setState] = useState<SessionState | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const { data: initialState } = useQuery({
    queryKey: ["session-state", sessionId],
    queryFn: () => getSessionState(sessionId),
    enabled: !!sessionId,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (initialState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- seed local display state from polled REST state; socket events patch it afterward
      setState(initialState);
    }
  }, [initialState]);

  useQuizSocket({
    sessionId,
    role: "display",
    onEvent: (event, payload) => {
      if (event === "session:state") {
        setState(payload as SessionState);
      }
      if (event === "leaderboard:update") {
        const data = payload as { top: LeaderboardEntry[]; totalAnswered: number };
        setLeaderboard(data.top);
        setTotalAnswered(data.totalAnswered);
      }
      if (event === "quiz:ended") {
        setState((s) => (s ? { ...s, status: "ended" } : s));
        getLeaderboard(sessionId).then(setLeaderboard).catch(() => {});
      }
    },
  });

  const status = state?.status ?? "draft";

  return (
    <main className="flex min-h-screen flex-col bg-tech-grid p-12 text-white">
      {status !== "in_progress" && status !== "ended" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
          <h1 className="font-headline text-6xl">Scan to join</h1>
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            {sessionId && <QRCodeSVG value={joinUrl(sessionId)} size={320} />}
          </div>
        </div>
      )}

      {status === "in_progress" && (
        <div className="flex flex-1 gap-16">
          <div className="flex flex-1 flex-col justify-center gap-6">
            <p className="text-2xl text-white/50">Quiz in progress</p>
            <h1 className="font-headline text-6xl leading-tight">Racing the clock...</h1>
          </div>
          <div className="flex w-[420px] flex-col gap-4">
            <h2 className="text-sm uppercase tracking-widest text-white/50">
              Leaderboard · {totalAnswered} answered
            </h2>
            <Leaderboard entries={leaderboard.slice(0, 10)} />
          </div>
        </div>
      )}

      {status === "ended" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <h1 className="font-headline text-6xl">Final Leaderboard</h1>
          <div className="w-full max-w-2xl">
            <Leaderboard entries={leaderboard.slice(0, 10)} />
          </div>
        </div>
      )}
    </main>
  );
}
