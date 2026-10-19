"use client";

import { Badge } from "@/components/ui/badge";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

import type { falakService } from "@/modules/falak/application/service";

type Item = Awaited<
  ReturnType<typeof falakService.getEclipsePaginated>
>["items"][number];

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "eclipseType",
    header: "Jenis",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.eclipseType === "SOLAR" ? "default" : "secondary"
        }
      >
        {row.original.eclipseType === "SOLAR" ? "Matahari" : "Bulan"}
      </Badge>
    ),
  },
  {
    accessorKey: "eclipseDate",
    header: "Tanggal",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatDateId(row.original.eclipseDate)}
      </span>
    ),
  },
  {
    accessorKey: "visibility",
    header: "Visibilitas",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {row.original.visibility || "-"}
      </span>
    ),
  },
  {
    accessorKey: "details",
    header: "Keterangan",
    cell: ({ row }) => {
      const details = row.original.details;
      const text = details == null ? "" : (JSON.stringify(details) ?? "");

      if (text === "") {
        return <span className="text-xs text-admin-content-fg/60">-</span>;
      }

      return (
        <span
          className="block max-w-60 truncate font-mono text-[11px] text-admin-content-fg/60"
          title={text}
        >
          {text}
        </span>
      );
    },
  },
];

export function EclipseTable({ data }: { data: Item[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="Belum ada data gerhana."
    />
  );
}