import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { glassCard, softCard } from "./chrome";

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
  return (
    <section
      className={cn(
        "rounded-2xl border p-6",
        variant === "glass" ? `shadow-sm ${glassCard}` : softCard,
        className,
      )}
    >
      {children}
    </section>
  );
}
