import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Empty State component untuk Admin CMS.
 * Menggunakan font-heading (Fraunces) untuk title, font-body (Inter) untuk description.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 px-4 text-center",
        "bg-admin-card-bg border-primary/25 rounded-xl",
        className,
      )}
    >
      {Icon && (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/60">
          <Icon className="size-8" />
        </div>
      )}
      <div className="space-y-2 max-w-sm">
        <h3 className="font-heading text-xl font-semibold text-card-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="mt-2">{action}</div>
      )}
    </div>
  );
}

/**
 * Empty State khusus untuk tabel/data grid.
 * Lebih kompak, cocok di dalam card tabel.
 */
export function TableEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 px-4 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/60">
          <Icon className="size-6" />
        </div>
      )}
      <div className="space-y-1">
        <h4 className="font-heading text-base font-semibold text-card-foreground">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <div className="mt-2">{action}</div>
      )}
    </div>
  );
}

/**
 * Empty State untuk dashboard/module overview.
 * Menampilkan ilustrasi yang lebih besar dan ramah.
 */
export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 py-10 px-6 text-center",
        "bg-admin-card-bg border-primary/25 rounded-xl",
        className,
      )}
    >
      <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
        {Icon ? (
          <Icon className="size-10 text-primary/80" />
        ) : (
          <svg
            className="size-10 text-primary/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </div>
      <div className="space-y-2 max-w-xs">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="mt-1">{action}</div>
      )}
    </div>
  );
}