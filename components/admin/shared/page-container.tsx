import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/** Wrapper konten halaman admin — padding vertikal & spacing saja. Inset horizontal
 * sudah ditangani pad oleh `<main>` (p-4 md:p-6 lg:p-8) agar tidak dobel. */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 py-5 lg:gap-5 lg:py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
