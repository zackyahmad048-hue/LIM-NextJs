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
}

export function AdminTable<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  emptyMessage = "Belum ada data.",
  onRowClick,
}: AdminTableProps<T>) {
  return (
    <SectionCard className="rounded-lg bg-background p-0 shadow-none">
      <div className="border-b p-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`h-10 text-xs ${col.align === "right" ? "text-right" : ""}`}
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
    </SectionCard>
  );
}
