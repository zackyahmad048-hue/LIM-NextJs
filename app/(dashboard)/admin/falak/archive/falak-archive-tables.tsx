"use client";

import { Badge } from "@/components/ui/badge";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

import type { getRukyatByStatus } from "@/modules/falak/queries/rukyat.query";
import type { falakHisabRepository } from "@/modules/falak/infrastructure/repository";

type RukyatItem = Awaited<ReturnType<typeof getRukyatByStatus>>[number];
type HisabItem = Awaited<
  ReturnType<typeof falakHisabRepository.findPaginated>
>["items"][number];

/** Label hasil observasi — nilai enum Prisma tidak ditampilkan mentah. */
const RESULT_LABEL: Record<string, string> = {
  VISIBLE: "Terlihat",
  NOT_VISIBLE: "Tidak Terlihat",
  CLOUDY: "Berawan",
  UNKNOWN: "Tidak Diketahui",
};

const rukyatColumns: ColumnDef<RukyatItem>[] = [
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
    accessorKey: "observationDate",
    header: "Tanggal",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatDateId(row.original.observationDate)}
      </span>
    ),
  },
  {
    accessorKey: "result",
    header: "Hasil",
    cell: ({ row }) => (
      <Badge variant="outline">
        {RESULT_LABEL[row.original.result] ?? row.original.result}
      </Badge>
    ),
  },
  {
    accessorKey: "weather",
    header: "Cuaca",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/60">
        {row.original.weather}
      </span>
    ),
  },
];

const hisabColumns: ColumnDef<HisabItem>[] = [
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
    accessorKey: "calculationDate",
    header: "Tanggal",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatDateId(row.original.calculationDate)}
      </span>
    ),
  },
  {
    accessorKey: "latitude",
    header: "Koordinat",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/60">
        {row.original.latitude.toFixed(4)},{" "}
        {row.original.longitude.toFixed(4)}
      </span>
    ),
  },
];

export function RukyatArchiveTable({ data }: { data: RukyatItem[] }) {
  return (
    <DataTable
      columns={rukyatColumns}
      data={data}
      emptyMessage="Belum ada arsip observasi."
    />
  );
}

export function HisabArchiveTable({ data }: { data: HisabItem[] }) {
  return (
    <DataTable
      columns={hisabColumns}
      data={data}
      emptyMessage="Belum ada data hisab."
    />
  );
}