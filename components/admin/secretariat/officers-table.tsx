"use client";

import Link from "next/link";
import { Crown, Pencil } from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataColumnHeader,
  DataTable,
} from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { deleteOfficerAction } from "@/modules/organization/presentation/organization.action";
import type { OfficerEntity } from "@/modules/organization/domain/entities";

const columns: ColumnDef<OfficerEntity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataColumnHeader column={column} title="Nama" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-admin-content-fg">
          {row.original.name}
        </span>
        {row.original.isLeader && (
          <Badge variant="default" className="h-5 gap-1 px-2 text-[11px]">
            <Crown className="size-3" />
            Ketua
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "Jabatan",
    cell: ({ row }) => (
      <span className="text-sm text-admin-content-fg/80">{row.original.position}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Kontak",
    cell: ({ row }) => (
      <div className="text-xs text-admin-content-fg/60">
        <p>{row.original.phone ?? "—"}</p>
        {row.original.email && (
          <p className="max-w-[180px] truncate">{row.original.email}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "sortOrder",
    header: ({ column }) => (
      <DataColumnHeader column={column} title="Urutan" />
    ),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-admin-content-fg/80">
        {row.original.sortOrder}
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
      <div className="flex justify-end gap-1">
        <Button asChild variant="ghost" size="sm" aria-label="Edit pengurus">
          <Link
            href={`/admin/secretariat/pendataan/officers/${row.original.id}/edit`}
          >
            <Pencil className="size-3.5" />
          </Link>
        </Button>
        <ConfirmDelete
          onConfirm={deleteOfficerAction}
          args={[row.original.id]}
          title="Hapus pengurus"
          description={`Pengurus "${row.original.name}" akan dihapus dari unit.`}
          label="Hapus pengurus"
        />
      </div>
    ),
  },
];

export function OfficersTable({ data }: { data: OfficerEntity[] }) {
  return <DataTable columns={columns} data={data} />;
}