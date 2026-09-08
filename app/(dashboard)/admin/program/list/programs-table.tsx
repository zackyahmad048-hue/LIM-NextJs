"use client";

import Link from "next/link";
import { Calendar, Pencil } from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import { formatDateId } from "@/lib/format";

import type { getPrograms } from "@/modules/program/queries/program.query";
import { deleteProgram } from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getPrograms>>["items"][number];

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  PUBLISHED: { label: "Published", variant: "default" },
  REGISTRATION_OPEN: { label: "Registrasi Dibuka", variant: "default" },
  REGISTRATION_CLOSED: { label: "Registrasi Ditutup", variant: "secondary" },
  ON_GOING: { label: "Berlangsung", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "secondary" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-admin-content-fg/60">
        {row.original.code}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama Program",
    cell: ({ row }) => (
      <div className="max-w-62.5">
        <p className="truncate text-sm font-medium text-admin-content-fg">
          {row.original.name}
        </p>
        {row.original.personInCharge && (
          <p className="truncate text-xs text-admin-content-fg/60">
            PIC: {row.original.personInCharge.name}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Jenis",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Mulai",
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-admin-content-fg/80">
        {formatDateId(row.original.startDate)}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Selesai",
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-admin-content-fg/80">
        {formatDateId(row.original.endDate)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = statusLabels[row.original.status] ?? {
        label: row.original.status,
        variant: "outline" as const,
      };
      return (
        <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
          {s.label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button asChild variant="ghost" size="sm" aria-label="Edit program">
          <Link href={`/admin/program/${row.original.id}/edit`}>
            <Pencil className="size-3.5" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" aria-label="Jadwal program">
          <Link href={`/admin/program/${row.original.id}/schedules`}>
            <Calendar className="size-3.5" />
          </Link>
        </Button>
        <ConfirmDelete
          onConfirm={deleteProgram}
          args={[row.original.id]}
          title="Hapus program"
          description={`Program "${row.original.name}" beserta seluruh datanya akan dihapus permanen.`}
          label="Hapus program"
        />
      </div>
    ),
  },
];

export function ProgramsTable({ data }: { data: Item[] }) {
  return <DataTable columns={columns} data={data} />;
}