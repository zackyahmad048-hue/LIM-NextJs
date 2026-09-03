import { cn } from "@/lib/utils";

export interface FalakDataColumn {
  header: React.ReactNode;
  className?: string;
}

interface FalakDataTableProps {
  title: string;
  description?: string;
  columns: FalakDataColumn[];
  rows: Array<{ key: string; cells: React.ReactNode[] }>;
  emptyMessage: string;
  className?: string;
}

export function FalakDataTable({
  title,
  description,
  columns,
  rows,
  emptyMessage,
  className,
}: FalakDataTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-primary/25 bg-card",
        className,
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {title}
        </h3>
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
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}