"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import type { getCommittees } from "@/modules/program/queries/program.query";
import { removeCommittee } from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getCommittees>>[number];

function buildColumns(programId: string): ColumnDef<Item>[] {
  return [
    {
      accessorKey: "user",
      header: "Nama",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs bg-primary/15 text-primary">
              {row.original.user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-admin-content-fg">
              {row.original.user.name}
            </p>
            <p className="text-xs text-admin-content-fg/60">
              {row.original.user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Peran",
      cell: ({ row }) => (
        <span className="text-xs text-admin-content-fg/80">
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "ACTIVE" ? "default" : "secondary"}
          className="h-5 px-2 text-[11px]"
        >
          {row.original.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ConfirmDelete
            onConfirm={removeCommittee}
            args={[row.original.id, programId]}
            title="Hapus panitia"
            description={`Panitia "${row.original.user?.name ?? "tersebut"}" akan dihapus dari panitia.`}
            label="Hapus panitia"
          />
        </div>
      ),
    },
  ];
}

export function CommitteesTable({
  data,
  programId,
}: {
  data: Item[];
  programId: string;
}) {
  const columns = useMemo(() => buildColumns(programId), [programId]);
  return <DataTable columns={columns} data={data} />;
}