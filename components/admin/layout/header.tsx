"use client";

import { Breadcrumb } from "../navigation/breadcrumb";
import { UserMenu } from "../navigation/user-menu";
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
}

export function Header({ user }: Props) {
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
    <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-[var(--glass-border)] bg-[var(--glass-chrome-bg)] px-4 backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={isMobile ? toggleMobile : toggle}
          aria-label={toggleLabel}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb />
      </div>

      <UserMenu user={user} />
    </header>
  );
}
