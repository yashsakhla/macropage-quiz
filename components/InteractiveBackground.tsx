"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient animated backdrop for the light participant screens (landing, join, onboarding):
 * a slowly drifting grid, floating gradient blobs, and a subtle mouse-parallax layer.
 * Purely decorative — sits behind content via `absolute inset-0`, so the parent must be `relative`.
 */
export function InteractiveBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const el = parallaxRef.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--mx", `${x * 14}px`);
      el.style.setProperty("--my", `${y * 14}px`);
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-drift-grid absolute inset-[-40px] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,66,8,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,66,8,0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div
        ref={parallaxRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: "translate(var(--mx, 0px), var(--my, 0px))" }}
      >
        <div className="animate-float-slow absolute -left-16 top-10 h-64 w-64 rounded-full bg-brand-orange/15 blur-3xl" />
        <div
          className="animate-float-slow-reverse absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl"
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className="animate-float-slow absolute bottom-[-3rem] left-1/3 h-56 w-56 rounded-full bg-brand-orange/10 blur-3xl"
          style={{ animationDelay: "1.4s" }}
        />
      </div>

      <div className="animate-orbit absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-orange/10" />
      <div className="animate-orbit-reverse absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-orange/[0.07]" />
    </div>
  );
}
