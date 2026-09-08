"use client";

import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import type { getSchedules } from "@/modules/program/queries/program.query";
import { deleteSchedule } from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getSchedules>>[number];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildColumns(programId: string): ColumnDef<Item>[] {
  return [
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-admin-content-fg">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Mulai",
      cell: ({ row }) => (
        <span className="text-xs text-admin-content-fg/80">
          {formatTime(row.original.startTime)}
        </span>
      ),
    },
    {
      accessorKey: "endTime",
      header: "Selesai",
      cell: ({ row }) => (
        <span className="text-xs text-admin-content-fg/80">
          {formatTime(row.original.endTime)}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Keterangan",
      cell: ({ row }) => (
        <span className="text-xs text-admin-content-fg/60">
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ConfirmDelete
            onConfirm={deleteSchedule}
            args={[row.original.id, programId]}
            title="Hapus jadwal"
            description={`Jadwal "${row.original.title}" akan dihapus permanen.`}
            label="Hapus jadwal"
          />
        </div>
      ),
    },
  ];
}

export function SchedulesTable({
  data,
  programId,
}: {
  data: Item[];
  programId: string;
}) {
  const columns = useMemo(() => buildColumns(programId), [programId]);
  return <DataTable columns={columns} data={data} />;
}