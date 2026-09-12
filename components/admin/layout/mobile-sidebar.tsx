"use client";

import { useMemo } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { SidebarItem } from "../navigation/sidebar-item";
import { Logo } from "./logo";
import { useSidebar } from "../providers/sidebar-provider";
import { filterNavigation } from "@/modules/authorization/application/permission-nav";
import { cn } from "@/lib/utils";

interface Props {
  roleSlugs: string[];
}

export function MobileSidebar({ roleSlugs }: Props) {
  const { mobileOpen, closeMobile } = useSidebar();

  const navigation = useMemo(() => filterNavigation(roleSlugs), [roleSlugs]);

  const main = navigation.filter((item) => item.pin !== "bottom");
  const bottom = navigation.filter((item) => item.pin === "bottom");

  return (
    <Sheet open={mobileOpen} onOpenChange={closeMobile}>
      <SheetContent 
        side="left" 
        className={cn(
          "w-72 border-r p-0",
          // Chrome solid — sama dengan versi Desktop (bukan kaca).
          "border-r border-admin-sidebar-border bg-admin-sidebar-bg"
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu Admin</SheetTitle>
          <SheetDescription>Navigasi halaman admin.</SheetDescription>
        </SheetHeader>

        <Logo />

        <nav className="flex flex-1 flex-col space-y-1.5 overflow-y-auto px-4 py-4">
          <div className="space-y-1.5">
            {main.map((item) => (
              <SidebarItem
                key={item.href ?? item.title}
                item={item}
                onNavigate={closeMobile}
              />
            ))}
          </div>

          {bottom.length > 0 && (
            <div className="mt-auto space-y-1.5 border-t border-admin-sidebar-border/60 pt-4">
              {bottom.map((item) => (
                <SidebarItem
                  key={item.href ?? item.title}
                  item={item}
                  onNavigate={closeMobile}
                />
              ))}
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}