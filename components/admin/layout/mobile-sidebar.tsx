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

  return (
    <Sheet open={mobileOpen} onOpenChange={closeMobile}>
      <SheetContent 
        side="left" 
        className={cn(
          "w-72 border-r p-0",
          // Gradasi Nusantara disamakan dengan versi Desktop (reference/colorize.md)
          "bg-linear-to-b from-slate-50 to-stone-100 border-slate-200",
          "dark:bg-linear-to-b dark:from-slate-950 dark:via-slate-950/90 dark:to-emerald-950/30 dark:border-slate-800/80"
        )}
      >
        <SheetHeader className="sr-only">
          {/* Aksesibilitas dipertahankan: Bagus untuk screen reader (reference/audit.md) */}
          <SheetTitle>Menu Admin</SheetTitle>
          <SheetDescription>Navigasi halaman admin.</SheetDescription>
        </SheetHeader>

        <Logo />

        {/* Ritme & Spasi disesuaikan agar lebih lega di layar sentuh (reference/layout.md & reference/adapt.md) */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
          {navigation.map((item) => (
            <SidebarItem
              key={item.href ?? item.title}
              item={item}
              onNavigate={closeMobile}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}