"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getMe } from "@/lib/api";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuthStore } from "@/stores/auth-store";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, hydrated, user, setSession, refreshToken, clearSession } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    getMe()
      .then((nextUser) => {
        if (accessToken && refreshToken) {
          setSession({ accessToken, refreshToken, user: nextUser });
        }
      })
      .catch(() => {
        clearSession();
        if (pathname !== "/login") {
          router.replace("/login");
        }
      })
      .finally(() => setChecking(false));
  }, [accessToken, refreshToken, hydrated, pathname, router, setSession, clearSession]);

  if (!hydrated || checking || !user) {
    return <div className="splash-screen">Loading operator workspace...</div>;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
