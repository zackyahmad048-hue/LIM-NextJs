import Image from "next/image";
import Link from "next/link";

import { APP } from "@/modules/shared/constants/app";
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
        "border-border",
        collapsed ? "justify-center px-0" : "gap-2.5 px-4",
      )}
    >
      <Image
        src="/images/orangelim.png"
        alt="Lembaga Ittihadul Muballighin"
        width={999}
        height={1107}
        className="h-7 w-auto object-contain shrink-0"
      />

      <div
        className={cn(
          "min-w-0 whitespace-nowrap transition-opacity duration-200 ease-in-out",
          collapsed ? "w-0 opacity-0" : "flex-1",
        )}
      >
        <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
          {APP.shortName}
        </h1>
        <p className="truncate text-[10px] text-muted-foreground">
          {APP.organization.shortName}
        </p>
      </div>
    </Link>
  );
}