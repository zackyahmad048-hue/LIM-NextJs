import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 bg-muted/20 p-4 lg:p-5", className)}
    >
      {children}
    </div>
  );
}
