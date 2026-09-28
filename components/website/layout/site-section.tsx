import type { ComponentProps, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SiteSectionProps<T extends ElementType = "section"> = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: T;
} & Omit<ComponentProps<T>, "children" | "className" | "id">;

/** Kontainer section publik — max-w-6xl + padding horizontal standar
 * (avoids pengulangan `mx-auto max-w-6xl px-4 sm:px-6`) dan ritme vertikal
 * `py-12 lg:py-16` (docs/08-design-system/layout.md §Ritme Section). */
export default function SiteSection<T extends ElementType = "section">({
  children,
  className,
  id,
  as,
  ...rest
}: SiteSectionProps<T>) {
  const Tag = as || "section";
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}