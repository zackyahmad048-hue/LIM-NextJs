import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/website/ui/skeleton";

export interface FalakDataColumn {
  header: React.ReactNode;
  className?: string;
}

export interface FalakDataTableProps {
  title: string;
  description?: string;
  columns: FalakDataColumn[];
  rows: Array<{ key: string; cells: React.ReactNode[] }>;
  emptyMessage: string;
  emptyAction?: {
    label: string;
    href: string;
  };
  error?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function FalakDataTable({
  title,
  description,
  columns,
  rows,
  emptyMessage,
  emptyAction,
  error,
  onRetry,
  isLoading,
  className,
}: FalakDataTableProps) {
  if (isLoading) {
    return (
      <div className={cn("overflow-hidden rounded-md border border-primary/25 bg-card", className)}>
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <TableSkeleton columns={columns.length} rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("rounded-md border border-destructive/30 bg-destructive/10 p-6", className)}>
        <div className="flex items-start gap-3">
          <div className="shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-destructive">Gagal memuat data</h3>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            {onRetry && (
              <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                Coba Lagi
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-primary/25 bg-card",
        className,
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-heading text-base font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase text-muted-foreground">
                {columns.map((column, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={cn(
                      "px-4 py-2.5 font-medium",
                      column.className,
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.key}
                  className="border-b border-border/40 last:border-0"
                >
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-4 py-2.5",
                        columns[i]?.className,
                      )}
                    >
                      <div className="truncate max-w-xs sm:max-w-md lg:max-w-lg">
                        {cell}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">{emptyMessage}</p>
          {emptyAction && (
            <Button variant="ghost" size="sm" asChild>
              <a href={emptyAction.href}>{emptyAction.label}</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}