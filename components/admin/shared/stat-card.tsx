import type { LucideIcon } from "lucide-react";

import { SectionCard } from "./section-card";
import { HubDot } from "@/components/shared/hub-dot";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <SectionCard variant="elevated">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-sm text-admin-content-fg/60">
            <HubDot className="h-2 w-2 bg-admin-border" />
            {title}
          </p>

          <h2 className="font-display text-3xl font-semibold tracking-[-0.01em] tabular-nums text-admin-content-fg">
            {value}
          </h2>

          {description && (
            <p className="text-sm text-admin-content-fg/50">{description}</p>
          )}
        </div>

        {Icon && (
          <div className={cn(
            "relative flex size-10 items-center justify-center rounded-lg",
            "bg-admin-border/30"
          )}>
            <Icon className="relative h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </SectionCard>
  );
}
