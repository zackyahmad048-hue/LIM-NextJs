"use client";

import { useMemo } from "react";

import { SidebarItem } from "../navigation/sidebar-item";
import { Logo } from "./logo";
import { useSidebar } from "../providers/sidebar-provider";
import { filterNavigation } from "@/modules/authorization/application/permission-nav";
import { cn } from "@/lib/utils";

interface Props {
  roleSlugs: string[];
}

export function Sidebar({ roleSlugs }: Props) {
  const { collapsed } = useSidebar();

  const navigation = useMemo(() => filterNavigation(roleSlugs), [roleSlugs]);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh flex-col border-r border-[var(--glass-border)] bg-[var(--glass-chrome-bg)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)] transition-[width] duration-200 lg:flex",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <Logo />

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {navigation.map((item) => (
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
