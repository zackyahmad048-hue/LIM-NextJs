"use client";

import { NAVIGATION } from "@/config/navigation";

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

export function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={closeMobile}>
      <SheetContent
        side="left"
        className="w-72 bg-background/95 p-0 backdrop-blur-2xl"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu Admin</SheetTitle>
          <SheetDescription>
            Navigasi halaman admin.
          </SheetDescription>
        </SheetHeader>

        <Logo />

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {NAVIGATION.map((item) => (
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
