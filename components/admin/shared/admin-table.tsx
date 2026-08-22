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
    <SectionCard className="rounded-lg bg-background p-0 shadow-none">
      <div
        className={cn(
          "border-b p-4",
          toolbar && "flex flex-wrap items-start justify-between gap-3"
        )}
      >
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {toolbar && <div className="shrink-0">{toolbar}</div>}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn("h-10 text-xs", col.align === "right" && "text-right")}
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
                {...(onRowClick
                  ? {
                      onClick: () => onRowClick(item),
                      className: "cursor-pointer",
                    }
                  : {})}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className="py-2">
                    {col.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination}
    </SectionCard>
  );
}
