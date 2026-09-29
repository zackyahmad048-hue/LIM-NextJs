"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";

import type { listLembaga } from "@/modules/twk-lembaga/queries/lembaga.query";

type LembagaRow = Awaited<
  ReturnType<typeof listLembaga>
>["items"][number];

const columns: ColumnDef<LembagaRow>[] = [
  {
    accessorKey: "namaLembagaPendidikan",
    header: "Nama Lembaga",
    cell: ({ row }) => (
      <Link
        href={`/admin/twk/lembaga/${row.original.id}`}
        className="font-medium transition-colors hover:text-primary hover:underline"
      >
        {row.original.namaLembagaPendidikan}
      </Link>
    ),
  },
  {
    id: "daerah",
    header: "Daerah",
    cell: ({ row }) => {
      const daerah = [
        row.original.kecamatan,
        row.original.kabupatenKota,
        row.original.provinsi,
      ]
        .filter(Boolean)
        .join(", ");
      return (
        <span className="text-sm text-admin-content-fg/80">
          {daerah || <span className="text-admin-content-fg/40">-</span>}
        </span>
      );
    },
  },
  {
    accessorKey: "pengasuhNama",
    header: "Pengasuh",
    cell: ({ row }) => (
      <span className="text-sm text-admin-content-fg/80">
        {row.original.pengasuhNama || (
          <span className="text-admin-content-fg/40">-</span>
        )}
      </span>
    ),
  },
  {
    accessorKey: "jumlahGuruBantuDimohon",
    header: "Guru Bantu",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-admin-content-fg/80">
        {row.original.jumlahGuruBantuDimohon}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right text-sm font-medium text-admin-content-fg/70">
        Aksi
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/twk/lembaga/${row.original.id}`}>
            Detail
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    ),
  },
];

export function LembagaTable({ data }: { data: LembagaRow[] }) {
  return <DataTable columns={columns} data={data} />;
}