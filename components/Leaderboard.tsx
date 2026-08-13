"use client";

import clsx from "clsx";
import type { LeaderboardEntry } from "@/lib/types";

const PODIUM_STYLES = [
  "bg-brand-orange text-white",
  "bg-white/90 text-brand-charcoal",
  "bg-white/60 text-brand-charcoal",
];

export function Leaderboard({
  entries,
  dense = false,
}: {
  entries: LeaderboardEntry[];
  dense?: boolean;
}) {
  return (
    <ol className="flex flex-col gap-2">
      {entries.map((entry, i) => (
        <li
          key={entry.participantId}
          className={clsx(
            "flex items-center gap-4 rounded-xl px-4 transition-all",
            dense ? "py-2" : "py-3",
            i < 3 ? PODIUM_STYLES[i] : "bg-white/10 text-white"
          )}
        >
          <span className="w-8 shrink-0 font-mono text-xl font-bold">
            {String(entry.rank).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{entry.name}</div>
            {entry.businessName && (
              <div className="truncate text-sm opacity-70">{entry.businessName}</div>
            )}
          </div>
          <span className="shrink-0 font-mono text-xl font-bold">{entry.score}</span>
        </li>
      ))}
    </ol>
  );
}
