"use client";

import { NAVIGATION } from "@/config/navigation";

import { SidebarItem } from "../navigation/sidebar-item";
import { Logo } from "./logo";
import { useSidebar } from "../providers/sidebar-provider";

export function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r bg-background transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <Logo />

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAVIGATION.map((item) => (
          <SidebarItem
            key={item.href ?? item.title}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
