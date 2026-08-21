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
        className="w-72 border-r border-[var(--glass-border)] bg-[var(--glass-chrome-bg)] p-0 backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu Admin</SheetTitle>
          <SheetDescription>Navigasi halaman admin.</SheetDescription>
        </SheetHeader>

        <Logo />

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
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
