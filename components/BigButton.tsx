"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export function BigButton({ variant = "primary", className, children, ...props }: BigButtonProps) {
  return (
    <button
      className={clsx(
        "w-full rounded-2xl px-6 py-5 text-lg font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
        variant === "primary" &&
          "bg-brand-orange text-white shadow-lg shadow-brand-orange/20 hover:brightness-110",
        variant === "outline" &&
          "border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
