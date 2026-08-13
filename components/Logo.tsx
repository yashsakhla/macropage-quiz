"use client";

import { usePathname } from "next/navigation";
import { isDarkPage } from "@/lib/pageTheme";

export function Logo() {
  const pathname = usePathname();
  const dark = isDarkPage(pathname);

  return (
    <div className="fixed left-3 top-3 z-50">
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark, no need for next/image optimization */}
      <img
        src={dark ? "/macropage-connect-white.svg" : "/macropage-connect-black.svg"}
        alt="MACROPAGE"
        className="h-7 w-auto sm:h-8"
      />
    </div>
  );
}
