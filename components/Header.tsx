"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { isDarkPage } from "@/lib/pageTheme";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const pathname = usePathname();
  const dark = isDarkPage(pathname);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-3 py-2 backdrop-blur-md sm:px-6",
        dark ? "bg-black/30 border-b border-white/10" : "bg-white/60 border-b border-black/5"
      )}
    >
      <Logo />
      <LanguageSwitcher />
    </header>
  );
}
