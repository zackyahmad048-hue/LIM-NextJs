"use client";

import { Breadcrumb } from "../navigation/breadcrumb";
import { UserMenu } from "../navigation/user-menu";
import { CommandMenu } from "../navigation/command-menu";
import { DateChip } from "../shared/date-chip";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "../providers/sidebar-provider";

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
    <header className="sticky top-12 z-30 flex h-12 items-center gap-3 border-b px-4 md:px-6 glass-chrome">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={isMobile ? toggleMobile : toggle}
          aria-label={toggleLabel}
          className="text-admin-content-fg hover:bg-admin-sidebar-accent/10"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 px-3 py-1 rounded-lg bg-admin-card-bg border border-admin-card-border">
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