import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SiteSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/** Kontainer section publik — max-w-6xl + padding horizontal standar
 * (avoids pengulangan `mx-auto max-w-6xl px-4 sm:px-6`) dan ritme vertikal
 * `py-12 lg:py-16` (docs/08-design-system/layout.md §Ritme Section). */
export default function SiteSection({
  children,
  className,
  id,
}: SiteSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16",
        className,
      )}
    >
      {children}
    </section>
  );
}