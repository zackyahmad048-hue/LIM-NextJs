import Link from "next/link";

import { APP } from "@/modules/shared/constants/app";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed = false }: LogoProps) {
  return (
    <Link
      href="/admin"
      aria-label="Beranda admin"
      className={cn(
        "flex h-12 shrink-0 items-center border-b",
        collapsed ? "justify-center px-0" : "gap-2.5 px-4",
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Zap className="h-4 w-4" />
      </div>

      <div
        className={cn(
          "min-w-0 whitespace-nowrap transition-opacity duration-200 ease-in-out",
          collapsed ? "w-0 opacity-0" : "flex-1",
        )}
      >
        <h1 className="truncate text-sm font-bold leading-tight">
          {APP.shortName}
        </h1>
        <p className="truncate text-[10px] text-muted-foreground">
          {APP.organization.shortName}
        </p>
      </div>
    </Link>
  );
}
