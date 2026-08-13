"use client";

import { useRef, useState } from "react";
import clsx from "clsx";

interface VideoIntroProps {
  onComplete: () => void;
}

type Phase = "start" | "playing" | "logo";

export function VideoIntro({ onComplete }: VideoIntroProps) {
  const [phase, setPhase] = useState<Phase>("start");
  const videoRef = useRef<HTMLVideoElement>(null);
  const skippedRef = useRef(false);

  const finish = () => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    onComplete();
  };

  const handleStart = () => {
    setPhase("playing");
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play().catch(() => {
        // Autoplay with sound was rejected; fall back to muted playback.
        video.muted = true;
        video.play();
      });
    }
  };

  const handleEnded = () => {
    setPhase("logo");
    window.setTimeout(finish, 2800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-charcoal">
      <video
        ref={videoRef}
        playsInline
        muted
        onEnded={handleEnded}
        className={clsx(
          "h-full w-full object-cover transition-opacity duration-700 ease-out",
          phase === "logo" ? "opacity-0" : "opacity-100"
        )}
      >
        <source src="/video/macropage-promo.mp4" type="video/mp4" />
      </video>

      {phase === "start" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 bg-brand-charcoal/70 px-6 text-center backdrop-blur-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark, no need for next/image optimization */}
          <img
            src="/macropage-connect-white.svg"
            alt="MACROPAGE"
            className="h-10 w-auto animate-fade-in sm:h-12"
          />
          <button
            onClick={handleStart}
            className="group relative flex items-center gap-3 overflow-hidden border border-brand-orange/70 bg-brand-charcoal px-10 py-4 font-mono text-base font-semibold uppercase tracking-[0.3em] text-brand-orange shadow-[0_0_25px_rgba(255,66,8,0.35)] transition-transform active:scale-[0.96]"
          >
            <span className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-brand-orange" />
            <span className="absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-brand-orange" />
            <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-brand-orange" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-brand-orange" />

            <span className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-brand-orange/25 to-transparent animate-scan-line" />
            </span>

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
            </span>
            <span className="relative">START</span>
          </button>
        </div>
      )}

      <div
        className={clsx(
          "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 bg-brand-charcoal px-6 text-center transition-opacity duration-700 ease-out",
          phase === "logo" ? "opacity-100" : "opacity-0"
        )}
      >
        <h2 className="animate-fade-in max-w-lg font-mono text-lg font-semibold uppercase tracking-[0.15em] text-white/90 sm:text-2xl">
          Build{" "}
          <span className="text-brand-orange text-glow">Web</span>
          <span className="animate-blink-caret text-brand-orange">_</span>, APP and Automate your
          Business with
        </h2>

        {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark, no need for next/image optimization */}
        <img
          src="/macropage-connect-white.svg"
          alt="MACROPAGE"
          className="animate-fade-in h-16 w-auto sm:h-20"
          style={{ animationDelay: "0.15s" }}
        />

        <p
          className="animate-fade-in absolute bottom-8 left-0 right-0 font-mono text-xs uppercase tracking-[0.3em] text-white/50 sm:text-sm"
          style={{ animationDelay: "0.3s" }}
        >
          Team of Young Indian Tech Minds Building for the{" "}
          <span className="text-brand-orange">WORLD</span> !!
        </p>
      </div>

      {phase !== "start" && (
        <button
          onClick={finish}
          className="absolute bottom-6 right-6 z-10 rounded-full border border-white/30 px-4 py-2 font-mono text-xs text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10"
        >
          Skip
        </button>
      )}
    </div>
  );
}
