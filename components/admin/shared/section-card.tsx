import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated";
}

/** Kartu section solid — rounded-xl, border 1px primary/25, shadow lembut. Tanpa glass. */
export function SectionCard({
  children,
  className,
  variant = "default",
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-primary/25 p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary",
        variant === "elevated"
          ? "bg-admin-card-bg shadow-sm hover:shadow-md"
          : "bg-admin-card-bg",
        className,
      )}
    >
      {children}
    </section>
  );
}
