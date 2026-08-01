"use client";

import { Breadcrumb } from "../navigation/breadcrumb";
import { UserMenu } from "../navigation/user-menu";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "../providers/sidebar-provider";

export function Header() {
  const { isMobile, toggle, toggleMobile } = useSidebar();

  return (
    <header className="flex h-12 items-center justify-between border-b border-border/50 bg-background/50 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={isMobile ? toggleMobile : toggle}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb />
      </div>

      <UserMenu />
    </header>
  );
}
