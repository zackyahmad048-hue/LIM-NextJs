import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated";
}

/** Kartu section solid — rounded-2xl, border halus, shadow lembut. Tanpa glass. */
export function SectionCard({
  children,
  className,
  variant = "default",
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl p-6 transition-shadow duration-200",
        variant === "elevated"
          ? "bg-admin-card-bg border-admin-card-border shadow-sm hover:shadow-md"
          : "bg-admin-card-bg border-admin-card-border",
        className,
      )}
    >
      {children}
    </section>
  );
}
