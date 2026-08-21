import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass";
}

export function SectionCard({
  children,
  className,
  variant = "default",
}: SectionCardProps) {
  const glass = variant === "glass";

  return (
    <section
      className={cn(
        "rounded-xl border p-6 shadow-sm",
        glass
          ? "border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]"
          : "bg-card",
        className,
      )}
    >
      {children}
    </section>
  );
}
