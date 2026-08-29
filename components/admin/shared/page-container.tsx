import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/** Wrapper konten halaman admin — padding & spacing, tanpa background tambahan (sudah di .admin). */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 px-4 py-5 lg:gap-5 lg:px-6 lg:py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
