import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-[-0.01em] text-balance md:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
