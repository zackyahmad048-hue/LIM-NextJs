import type { LucideIcon } from "lucide-react";

import { SectionCard } from "./section-card";
import { HubDot } from "@/components/shared/hub-dot";

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
    <SectionCard variant="glass">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <HubDot className="h-2 w-2" />
            {title}
          </p>

          <h2 className="text-3xl font-bold tabular-nums">{value}</h2>

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {Icon && (
          <div className="relative flex size-10 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-dashed border-primary/40" />
            <Icon className="relative h-4 w-4 text-primary" />
          </div>
        )}
      </div>
    </SectionCard>
  );
}
