import type { LucideIcon } from "lucide-react";

import { SectionCard } from "./section-card";

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
    <SectionCard>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="text-3xl font-bold tracking-tight">
            {value}
          </h2>

          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <Icon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
    </SectionCard>
  );
}