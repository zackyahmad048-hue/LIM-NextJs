"use client";

import { useMemo } from "react";

import { SidebarItem } from "../navigation/sidebar-item";
import { Logo } from "./logo";
import { useSidebar } from "../providers/sidebar-provider";
import { filterNavigation } from "@/modules/authorization/application/permission-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  roleSlugs: string[];
}

export function Sidebar({ roleSlugs }: Props) {
  const { collapsed } = useSidebar();

  const navigation = useMemo(() => filterNavigation(roleSlugs), [roleSlugs]);

  const main = navigation.filter((item) => item.pin !== "bottom");
  const bottom = navigation.filter((item) => item.pin === "bottom");

  return (
    <aside
      className={cn(
        "sticky top-12 z-30 hidden h-[calc(100dvh-3rem)] flex-col transition-[width,padding] duration-300 ease-out lg:flex",
        "bg-admin-sidebar-bg",
        "border-r border-admin-sidebar-border",
        "relative overflow-hidden",
        collapsed ? "w-14" : "w-60",
      )}
      aria-label="Main navigation"
    >
      {/* Gradient Nusantara — dark: slate-950 → emerald-950/20 */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/20 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col h-full">
        <Logo collapsed={collapsed} />

        <TooltipProvider delayDuration={200}>
          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-3">
            <div className="space-y-1">
              {main.map((item) => (
                <SidebarItem
                  key={item.href ?? item.title}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>

            {bottom.length > 0 && (
              <div className="mt-auto space-y-1 border-t border-admin-sidebar-border pt-3">
                {bottom.map((item) => (
                  <SidebarItem
                    key={item.href ?? item.title}
                    item={item}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            )}
          </nav>
        </TooltipProvider>
      </div>
    </aside>
  );
}