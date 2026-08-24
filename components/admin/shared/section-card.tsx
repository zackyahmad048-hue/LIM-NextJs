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
        "rounded-2xl border p-6",
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
