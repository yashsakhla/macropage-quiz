"use client";

import { useEffect, useState } from "react";

interface CountdownRingProps {
  totalSeconds: number;
  startedAt: number;
  onExpire?: () => void;
}

export function CountdownRing({ totalSeconds, startedAt, onExpire }: CountdownRingProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resync the ring immediately when a new question starts
    setRemaining(totalSeconds);
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const left = Math.max(0, totalSeconds - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeconds, startedAt]);

  const pct = Math.max(0, remaining / totalSeconds);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#3a3a3a" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#FF4208"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold text-white">
        {Math.ceil(remaining)}
      </div>
    </div>
  );
}
