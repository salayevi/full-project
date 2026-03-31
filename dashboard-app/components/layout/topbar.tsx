"use client";

import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/lib/api";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/hero": "Hero management",
  "/about": "About management",
  "/products": "Products",
  "/achievements": "Achievements",
  "/footer": "Footer management",
  "/theme": "Theme settings",
  "/media": "Media library",
  "/users": "Users & roles",
  "/activity": "Activity logs",
};

export function Topbar() {
  const pathname = usePathname();
  const currentPath = pathname.replace(/^\/dashboard/, "") || "/";
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      clearSession();
    }
    router.replace("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button type="button" className="icon-button mobile-only" onClick={toggleSidebar}>
          <Menu size={18} />
        </button>
        <div>
          <span>Operator workspace</span>
          <h1>{pageTitles[currentPath] || "Dashboard"}</h1>
        </div>
      </div>

      <div className="topbar-tools">
        <div className="profile-pill">
          <div className="profile-avatar">{initials(user?.display_name)}</div>
          <div>
            <strong>{user?.display_name || "Operator"}</strong>
            <span>{user?.role || "staff"}</span>
          </div>
        </div>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
