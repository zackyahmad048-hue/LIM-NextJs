"use client";

import { useMemo } from "react";

import { SidebarItem } from "../navigation/sidebar-item";
import { Logo } from "./logo";
import { useSidebar } from "../providers/sidebar-provider";
import { filterNavigation } from "@/modules/authorization/application/permission-nav";

interface Props {
  roleSlugs: string[];
}

export function Sidebar({ roleSlugs }: Props) {
  const { collapsed } = useSidebar();

  const navigation = useMemo(() => filterNavigation(roleSlugs), [roleSlugs]);

  return (
    <aside
      className={`sticky top-0 hidden h-screen flex-col border-r border-border/60 bg-background transition-all duration-300 lg:flex ${
        collapsed ? "w-16" : "w-56"
      }`}
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
