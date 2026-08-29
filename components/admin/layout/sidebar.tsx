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
        // Fondasi layout & transisi halus (reference/layout.md & reference/animate.md)
        "sticky top-0 hidden h-dvh flex-col border-r transition-[width,padding] duration-300 ease-in-out lg:flex",
        
        // Gradasi Nusantara (reference/colorize.md)
        // Mode Terang: Bersih dengan sedikit sentuhan hangat batu alam (stone)
        // Mode Gelap: Midnight blue (slate-950) yang memudar halus ke zamrud gelap (emerald-950/30) di bagian bawah.
        "bg-linear-to-b from-slate-50 to-stone-100 border-slate-200",
        "dark:bg-linear-to-b dark:from-slate-950 dark:via-slate-950/90 dark:to-emerald-950/30 dark:border-slate-800/80",
        
        collapsed ? "w-16" : "w-56"
      )}
    >
      <Logo collapsed={collapsed} />

      <TooltipProvider delayDuration={200}>
        {/* custom scrollbar util jika ada (atau overflow-y-auto standar dengan gap yang lega) */}
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
            <div className="mt-auto space-y-1.5 border-t border-slate-200 pt-4 dark:border-slate-800/80">
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