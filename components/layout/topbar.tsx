"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SignOutButton } from "@/components/layout/sign-out-button";
import {
  formatRoleLabel,
  getAccountNavGroups,
  getNavGroups,
} from "@/components/layout/nav-config";
import { ScopeIndicator } from "@/components/layout/scope-indicator";
import { Badge } from "@/components/ui/badge";
import type { UserScope } from "@/modules/authentication/application/get-user-scope";
import type { Role } from "@/generated/client";

export function Topbar({
  email,
  role,
  scope,
}: {
  email: string;
  role: Role;
  scope: UserScope;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b px-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 md:px-6 lg:px-8",
        scrolled
          ? "border-white/15 bg-background/72 shadow-[0_8px_30px_-24px_oklch(0.147_0.004_49.3/0.45)] backdrop-blur-xl dark:bg-background/58"
          : "border-white/10 bg-background/60 backdrop-blur-md dark:bg-background/45",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav
          groups={getNavGroups(role)}
          accountGroups={getAccountNavGroups(role)}
        />
        <Link href="/dashboard" className="text-sm font-semibold md:hidden">
          LIM Platform
        </Link>
        <span
          className="hidden min-w-0 truncate text-sm text-muted-foreground md:inline"
          title={email}
        >
          {email}
        </span>
        <ScopeIndicator scope={scope} className="ml-2 hidden lg:inline-flex" />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {formatRoleLabel(role)}
        </Badge>
        <SignOutButton />
      </div>
    </header>
  );
}
