"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  downloadParticipantsCsv,
  endQuiz,
  getLeaderboard,
  getSessionState,
  listParticipants,
  openRegistration,
  startQuiz,
} from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import { useQuizSocket } from "@/lib/useQuizSocket";
import { BigButton } from "@/components/BigButton";
import { Leaderboard } from "@/components/Leaderboard";
import type { LeaderboardEntry, Participant, SessionState } from "@/lib/types";

type Tab = "control" | "participants";

export default function AdminSessionControlPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id;
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("control");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data: state } = useQuery<SessionState>({
    queryKey: ["session-state", sessionId],
    queryFn: () => getSessionState(sessionId),
    refetchInterval: 5000,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["leaderboard", sessionId],
    queryFn: () => getLeaderboard(sessionId),
    refetchInterval: 5000,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seed local leaderboard from polled REST state; socket events patch it afterward
    if (leaderboardData) setLeaderboard(leaderboardData);
  }, [leaderboardData]);

  useQuizSocket({
    sessionId,
    role: "admin",
    onEvent: (event, payload) => {
      if (event === "leaderboard:update") {
        const data = payload as { top: LeaderboardEntry[]; totalAnswered: number };
        setLeaderboard(data.top);
        setTotalAnswered(data.totalAnswered);
      }
      if (event === "session:state") {
        const data = payload as SessionState;
        queryClient.setQueryData(["session-state", sessionId], data);
      }
      if (event === "participant:count") {
        setParticipantCount((payload as { count: number }).count);
      }
    },
  });

  const { data: participants } = useQuery({
    queryKey: ["admin-participants", sessionId],
    queryFn: () => listParticipants(sessionId),
    refetchInterval: 5000,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seed participant count from polled REST list; socket events patch it afterward
    if (participants) setParticipantCount(participants.length);
  }, [participants]);

  function useAdminAction(fn: (id: string) => Promise<unknown>) {
    return useMutation({
      mutationFn: () => fn(sessionId),
      onMutate: () => setActionError(null),
      onSuccess: (data) => {
        queryClient.setQueryData(["session-state", sessionId], (prev: SessionState | undefined) =>
          prev ? { ...prev, ...(data as Partial<SessionState>) } : prev
        );
        queryClient.invalidateQueries({ queryKey: ["session-state", sessionId] });
      },
      onError: (err: Error) => setActionError(err.message),
    });
  }

  const openRegAction = useAdminAction(openRegistration);
  const startAction = useAdminAction(startQuiz);
  const endAction = useAdminAction(endQuiz);

  const status = state?.status;

  async function handleExport() {
    setExportError(null);
    setExporting(true);
    try {
      await downloadParticipantsCsv(sessionId);
    } catch (err) {
      setExportError((err as Error).message || "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/?session=${sessionId}` : "";
  const displayUrl = typeof window !== "undefined" ? `${window.location.origin}/display/${sessionId}` : "";

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/admin/sessions"
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-charcoal/60 hover:text-brand-orange"
      >
        ← Back to sessions
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-headline text-3xl text-brand-charcoal">Session control</h1>
        <span className="rounded-full bg-brand-orange/10 px-4 py-1 text-sm font-semibold text-brand-orange">
          {status?.replace("_", " ") ?? "loading…"}
        </span>
      </div>

      <div className="mt-6 flex gap-6 border-b border-black/10">
        {(["control", "participants"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold capitalize ${
              tab === t ? "border-b-2 border-brand-orange text-brand-orange" : "text-brand-charcoal/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "control" && (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 flex flex-col gap-6">
            {actionError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <BigButton
                variant="outline"
                onClick={() => openRegAction.mutate()}
                disabled={status !== "draft" || openRegAction.isPending}
              >
                Open Registration
              </BigButton>
              <BigButton
                onClick={() => startAction.mutate()}
                disabled={status !== "registration_open" || startAction.isPending}
              >
                Start Quiz
              </BigButton>
              <BigButton
                variant="outline"
                onClick={() => endAction.mutate()}
                disabled={
                  (status !== "in_progress" && status !== "registration_open") || endAction.isPending
                }
              >
                End Quiz
              </BigButton>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <p className="text-sm text-brand-charcoal/60">Participants</p>
                <p className="font-headline text-4xl text-brand-charcoal">{participantCount}</p>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <p className="text-sm text-brand-charcoal/60">Answered</p>
                <p className="font-headline text-4xl text-brand-charcoal">{totalAnswered}</p>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-brand-charcoal/60">Scan to join</p>
              <div className="flex items-center gap-5">
                {joinUrl && (
                  <div className="shrink-0 rounded-lg bg-white p-2 ring-1 ring-black/10">
                    <QRCodeSVG value={joinUrl} size={128} />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 text-sm">
                  <a
                    href={joinUrl}
                    target="_blank"
                    className="text-brand-orange underline break-all"
                  >
                    {joinUrl}
                  </a>
                  <a
                    href={displayUrl}
                    target="_blank"
                    className="text-brand-orange underline break-all"
                  >
                    {displayUrl} (open on projector)
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-brand-charcoal p-5">
            <h2 className="mb-3 text-sm uppercase tracking-widest text-white/50">
              Leaderboard · {totalAnswered} answered
            </h2>
            <Leaderboard entries={leaderboard} dense />
          </div>
        </div>
      )}

      {tab === "participants" && (
        <div className="mt-8">
          <div className="mb-4 flex flex-col items-end gap-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="rounded-xl bg-brand-orange px-5 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-60"
            >
              {exporting ? "Preparing…" : "Download CSV"}
            </button>
            {exportError && <p className="text-sm text-red-600">{exportError}</p>}
          </div>
          <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/5 text-brand-charcoal/60">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Goal</th>
                  <th className="px-4 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {[...(participants ?? [])]
                  .sort((a, b) => {
                    if (a.rank == null && b.rank == null) return (b.score ?? 0) - (a.score ?? 0);
                    if (a.rank == null) return 1;
                    if (b.rank == null) return -1;
                    return a.rank - b.rank;
                  })
                  .map((p: Participant) => (
                  <tr key={p.id} className="border-t border-black/5">
                    <td className="px-4 py-3">{p.rank ?? "—"}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.whatsappNumber}</td>
                    <td className="px-4 py-3">{p.businessName}</td>
                    <td className="px-4 py-3">{p.businessCategory}</td>
                    <td className="px-4 py-3">{p.goalOther || p.goal}</td>
                    <td className="px-4 py-3">{p.score ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
