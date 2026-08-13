"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout, isAdminTokenValid } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  const checkSession = useCallback(() => {
    if (isLoginPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time auth gate check on mount/navigation
      setReady(true);
      return;
    }
    if (!isAdminTokenValid()) {
      adminLogout();
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLoginPage, router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Re-check when the tab regains focus so a token that expired while the tab
  // was idle in the background gets caught immediately instead of on the next click.
  useEffect(() => {
    if (isLoginPage) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") checkSession();
    };
    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", onVisible);
    const interval = setInterval(checkSession, 60_000);
    return () => {
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(interval);
    };
  }, [isLoginPage, checkSession]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-brand-offwhite">
      {!isLoginPage && (
        <div className="flex justify-end border-b border-black/10 bg-white px-6 py-3">
          <button
            onClick={() => {
              adminLogout();
              router.replace("/admin/login");
            }}
            className="text-sm font-semibold text-brand-charcoal/60 transition-colors hover:text-brand-orange"
          >
            Sign out
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
