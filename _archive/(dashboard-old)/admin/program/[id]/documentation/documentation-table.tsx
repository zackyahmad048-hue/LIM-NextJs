"use client";

import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import type { getDocumentation } from "@/modules/program/queries/program.query";
import { removeDocumentation } from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getDocumentation>>[number];

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
      accessorKey: "description",
      header: "Deskripsi",
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
            onConfirm={removeDocumentation}
            args={[row.original.id, programId]}
            title="Hapus dokumentasi"
            description={`Dokumentasi "${row.original.title}" akan dihapus permanen.`}
            label="Hapus dokumentasi"
          />
        </div>
      ),
    },
  ];
}

export function DocumentationTable({
  data,
  programId,
}: {
  data: Item[];
  programId: string;
}) {
  const columns = useMemo(() => buildColumns(programId), [programId]);
  return <DataTable columns={columns} data={data} />;
}