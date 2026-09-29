"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import { formatDateId } from "@/lib/format";

import type { falakService } from "@/modules/falak/application/service";
import { deleteHisab } from "@/modules/falak/presentation/falak.action";

type Item = Awaited<
  ReturnType<typeof falakService.getHisabPaginated>
>["items"][number];

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "locationName",
    header: "Lokasi",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-admin-content-fg">
        {row.original.locationName}
      </span>
    ),
  },
  {
    accessorKey: "latitude",
    header: "Koordinat",
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-admin-content-fg/60">
        {row.original.latitude.toFixed(4)},{" "}
        {row.original.longitude.toFixed(4)}
      </span>
    ),
  },
  {
    accessorKey: "calculationDate",
    header: "Tanggal",
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-admin-content-fg/80">
        {formatDateId(row.original.calculationDate)}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <ConfirmDelete
          onConfirm={deleteHisab}
          args={[row.original.id]}
          title="Hapus data hisab"
          description={`Data hisab untuk "${row.original.locationName}" akan dihapus permanen.`}
          label="Hapus data hisab"
        />
      </div>
    ),
  },
];

export function HisabTable({ data }: { data: Item[] }) {
  return <DataTable columns={columns} data={data} />;
}