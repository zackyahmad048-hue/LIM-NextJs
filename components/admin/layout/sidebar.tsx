"use client";

import { useMemo } from "react";

import { SidebarItem } from "../navigation/sidebar-item";
import { Logo } from "./logo";
import { useSidebar } from "../providers/sidebar-provider";
import { glassChrome } from "../shared/chrome";
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
        "sticky top-0 hidden h-dvh flex-col border-r transition-[width] duration-300 ease-in-out lg:flex",
        glassChrome,
        collapsed ? "w-16" : "w-56",
      )}
    >
      <Logo collapsed={collapsed} />

      <TooltipProvider>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
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
            <div className="mt-auto space-y-1 border-t border-border/60 pt-3">
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
