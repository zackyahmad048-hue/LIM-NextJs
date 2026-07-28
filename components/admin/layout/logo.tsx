import Link from "next/link";

import { APP } from "@/modules/shared/constants/app";
import { Zap } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/admin"
      className="flex h-12 items-center gap-2.5 border-b px-4"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Zap className="h-4 w-4" />
      </div>

      <div>
        <h1 className="text-sm font-bold leading-tight">
          {APP.shortName}
        </h1>
        <p className="text-[10px] text-muted-foreground">
          {APP.organization.shortName}
        </p>
      </div>
    </Link>
  );
}
