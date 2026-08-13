"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSession, listSessions, seedMindsetBank, seedTriviaBank } from "@/lib/api";
import { BigButton } from "@/components/BigButton";

export default function AdminSessionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [triviaCount, setTriviaCount] = useState<string>("0");
  const [shapeError, setShapeError] = useState<string | null>(null);

  const { data: sessions, isLoading, isError } = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: listSessions,
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([seedMindsetBank(), seedTriviaBank()]);
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      const count = Number(triviaCount);
      return createSession(title, count > 0 ? { triviaCount: count } : undefined);
    },
    onMutate: () => setShapeError(null),
    onSuccess: (session) => {
      if (!session?.id) {
        console.error("createSession response missing id:", session);
        setShapeError("Session was created but the server response didn't include an id — check the console.");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
      router.push(`/admin/sessions/${session.id}`);
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-headline text-3xl text-brand-charcoal">Sessions</h1>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-white p-5">
        <div>
          <p className="font-semibold text-brand-charcoal">Question banks</p>
          <p className="text-sm text-brand-charcoal/60">
            Seed the mindset &amp; trivia banks once — required before Start Quiz will work. Safe to run again.
          </p>
          {seedMutation.isError && (
            <p className="mt-1 text-sm text-red-600">
              {(seedMutation.error as Error).message || "Failed to seed question banks."}
            </p>
          )}
          {seedMutation.isSuccess && <p className="mt-1 text-sm text-green-600">Question banks seeded.</p>}
        </div>
        <div className="w-56 shrink-0">
          <BigButton
            type="button"
            variant="outline"
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="py-3 text-base"
          >
            {seedMutation.isPending ? "Seeding…" : "Seed question banks"}
          </BigButton>
        </div>
      </div>

      <form
        className="mt-6 flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) mutation.mutate();
        }}
      >
        <label className="text-sm font-semibold text-brand-charcoal/70">New session title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Aug Meetup"
          className="rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand-orange"
        />
        <label className="text-sm font-semibold text-brand-charcoal/70">
          Random trivia question count (0 for mindset-only)
        </label>
        {/* <input
          type="number"
          min={0}
          max={50}
          value={triviaCount}
          onChange={(e) => setTriviaCount(e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand-orange"
        /> */}
        {mutation.isError && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message || "Failed to create session."}
          </p>
        )}
        {shapeError && <p className="text-sm text-red-600">{shapeError}</p>}
        <div className="w-48">
          <BigButton type="submit" disabled={mutation.isPending} className="py-3 text-base">
            {mutation.isPending ? "Creating…" : "Create session"}
          </BigButton>
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        <p className="text-sm font-semibold text-brand-charcoal/60">All sessions</p>
        {isLoading && <p className="text-brand-charcoal/50">Loading sessions…</p>}
        {isError && <p className="text-sm text-red-600">Failed to load sessions.</p>}
        {sessions?.map((s) => (
          <button
            key={s.id}
            onClick={() => router.push(`/admin/sessions/${s.id}`)}
            className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-5 py-4 text-left transition-colors hover:border-brand-orange"
          >
            <div>
              <p className="font-semibold text-brand-charcoal">{s.title}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-brand-charcoal/40">
                {s.status.replace("_", " ")}
              </p>
            </div>
            <span className="text-brand-orange">Open →</span>
          </button>
        ))}
        {!isLoading && !isError && sessions?.length === 0 && (
          <p className="text-brand-charcoal/50">No sessions yet — create one above.</p>
        )}
      </div>
    </main>
  );
}
