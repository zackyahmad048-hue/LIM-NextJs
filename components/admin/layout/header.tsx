"use client";

import { Breadcrumb } from "../navigation/breadcrumb";
import { UserMenu } from "../navigation/user-menu";
import { CommandMenu } from "../navigation/command-menu";
import { DateChip } from "../shared/date-chip";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "../providers/sidebar-provider";
import { cn } from "@/lib/utils";
import { chrome } from "../shared/chrome";

interface HeaderUser {
  name: string;
  email: string;
  image: string | null;
  roleLabel: string;
}

interface Props {
  user: HeaderUser;
  roleSlugs: string[];
}

export function Header({ user, roleSlugs }: Props) {
  const { isMobile, collapsed, mobileOpen, toggle, toggleMobile } =
    useSidebar();

  const toggleLabel = isMobile
    ? mobileOpen
      ? "Tutup menu"
      : "Buka menu"
    : collapsed
      ? "Buka sidebar"
      : "Tutup sidebar";

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center gap-3 border-b px-4",
        chrome,
      )}
    >
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={isMobile ? toggleMobile : toggle}
          aria-label={toggleLabel}
          className="text-admin-content-fg hover:bg-admin-border"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 rounded-lg bg-admin-border/50 px-3 py-1">
          <Breadcrumb />
        </div>
      </div>

      <CommandMenu roleSlugs={roleSlugs} />

      <div className="ml-auto flex items-center gap-2">
        <DateChip className="hidden lg:flex" />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
