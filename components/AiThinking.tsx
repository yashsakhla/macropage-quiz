"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

const TYPE_SPEED_MS = 28;
const HOLD_MS = 500;

export function AiThinking() {
  const { lang } = useLanguage();
  const lines = translations.aiThinking.lines[lang];
  const modelTag = translations.aiThinking.modelTag[lang];

  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  useEffect(() => {
    const currentLine = lines[Math.min(lineIndex, lines.length - 1)];

    if (charCount < currentLine.length) {
      const timeout = setTimeout(() => setCharCount((c) => c + 1), TYPE_SPEED_MS);
      return () => clearTimeout(timeout);
    }

    const holdTimeout = setTimeout(() => {
      if (lineIndex < lines.length - 1) {
        setCompletedLines((prev) => [...prev, currentLine]);
        setLineIndex((i) => i + 1);
        setCharCount(0);
      }
    }, HOLD_MS);
    return () => clearTimeout(holdTimeout);
  }, [charCount, lineIndex, lines]);

  // Reset the typewriter if the language changes mid-flight.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resync the typewriter when the language selection changes
    setLineIndex(0);
    setCharCount(0);
    setCompletedLines([]);
  }, [lang]);

  const currentLine = lines[Math.min(lineIndex, lines.length - 1)];
  const visibleText = currentLine.slice(0, charCount);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="animate-orbit absolute h-full w-full">
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-orange shadow-[0_0_10px_rgba(255,66,8,0.9)]" />
        </div>
        <div className="animate-orbit-reverse absolute h-20 w-20">
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-orange/70" />
        </div>
        <span className="absolute h-full w-full rounded-full border border-brand-orange/20" />
        <span className="absolute h-20 w-20 rounded-full border border-brand-orange/25" />
        <span className="absolute h-12 w-12 animate-pulse-soft rounded-full bg-brand-orange/20 blur-md" />
        <span className="relative h-6 w-6 rounded-full bg-brand-orange shadow-[0_0_24px_rgba(255,66,8,0.8)]" />
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-auto font-mono text-[10px] tracking-widest text-white/40">
            {modelTag}
          </span>
        </div>
        <div className="relative min-h-[7.5rem] overflow-hidden px-4 py-4 font-mono text-sm">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-8 animate-scan-line bg-gradient-to-b from-brand-orange/15 to-transparent"
            aria-hidden
          />
          {completedLines.map((line, i) => (
            <p key={i} className="text-white/35 line-through decoration-white/20">
              {line}
            </p>
          ))}
          <p className="text-brand-orange">
            <span className="text-white/50">{"> "}</span>
            {visibleText}
            <span className="animate-blink-caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-brand-orange align-middle" />
          </p>
        </div>
      </div>
    </div>
  );
}
