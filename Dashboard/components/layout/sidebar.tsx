"use client";

import clsx from "clsx";
import { Activity, GalleryVerticalEnd, LayoutDashboard, Medal, Package, Palette, PanelTop, Sparkles, Users, Waypoints } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUiStore } from "@/stores/ui-store";

const items = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/hero", label: "Hero", icon: Sparkles },
  { href: "/about", label: "About", icon: PanelTop },
  { href: "/products", label: "Products", icon: Package },
  { href: "/achievements", label: "Achievements", icon: Medal },
  { href: "/footer", label: "Footer", icon: Waypoints },
  { href: "/theme", label: "Theme", icon: Palette },
  { href: "/media", label: "Media", icon: GalleryVerticalEnd },
  { href: "/users", label: "Users", icon: Users },
  { href: "/activity", label: "Activity", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const currentPath = pathname.replace(/^\/dashboard/, "") || "/";
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <aside className={clsx("sidebar", sidebarOpen && "is-open")}>
      <div className="brand-lockup">
        <div className="brand-mark">AZ</div>
        <div>
          <strong>Azizam Control</strong>
          <span>Operator Console</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx("nav-item", active && "is-active")}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
