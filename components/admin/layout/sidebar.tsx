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
        // Chrome solid: rail sidebar memakai permukaan solid (bukan kaca);
        // -admin-sidebar-bg memakai nilai opaque (app/globals.css). Glass
        // dipertahankan hanya untuk kartu/widget konten.
        "sticky top-0 hidden h-dvh flex-col border-r transition-[width,padding] duration-300 ease-in-out lg:flex",

        "border-r border-admin-sidebar-border bg-admin-sidebar-bg",

        collapsed ? "w-16" : "w-56"
      )}
    >
      <Logo collapsed={collapsed} />

      <TooltipProvider delayDuration={200}>
        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4">
          <div className="space-y-1.5">
            {main.map((item) => (
              <SidebarItem
                key={item.href ?? item.title}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </div>

          {bottom.length > 0 && (
            <div className="mt-auto space-y-1.5 border-t border-admin-sidebar-border/60 pt-4">
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
    </aside>
  );
}