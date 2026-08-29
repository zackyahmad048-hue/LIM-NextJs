import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionCard } from "@/components/admin/shared/section-card";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "right";
  render: (item: T) => ReactNode;
}

interface AdminTableProps<T> {
  title: string;
  description: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: ReactNode;
  onRowClick?: (item: T) => void;
  /** Rendered at the right side of the card header (e.g. search form). */
  toolbar?: ReactNode;
  /** Rendered as a footer below the table (e.g. TablePagination). */
  pagination?: ReactNode;
}

export function AdminTable<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  emptyMessage = "Belum ada data.",
  onRowClick,
  toolbar,
  pagination,
}: AdminTableProps<T>) {
  return (
    <SectionCard variant="elevated" className="p-0">
      <div
        className={cn(
          "border-b border-admin-card-border p-4",
          toolbar && "flex flex-wrap items-start justify-between gap-3",
        )}
      >
        <div>
          <h2 className="text-base font-semibold text-admin-content-fg">{title}</h2>
          <p className="text-xs text-admin-content-fg/50">{description}</p>
        </div>
        {toolbar && <div className="shrink-0">{toolbar}</div>}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-admin-border bg-admin-border/20">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "h-10 text-xs font-medium text-admin-content-fg/70 px-4",
                    col.align === "right" && "text-right",
                  )}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "border-b border-admin-border/50 transition-colors duration-150",
                    "hover:bg-admin-border/20",
                    "even:bg-admin-border/10",
                    onRowClick && "cursor-pointer",
                  )}
                  {...(onRowClick
                    ? {
                        onClick: () => onRowClick(item),
                      }
                    : {})}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        "py-3 px-4 text-sm text-admin-content-fg",
                        col.align === "right" && "text-right",
                      )}
                    >
                      {col.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-admin-content-fg/50"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination}
    </SectionCard>
  );
}
