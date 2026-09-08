"use client";

import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

import type { getRoles } from "@/modules/authorization/presentation/role.query";

type Role = Awaited<ReturnType<typeof getRoles>>[number];

const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Shield className="size-4 text-muted-foreground" />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-[11px] font-mono">
        {row.original.slug}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.description || <span className="italic">—</span>}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {formatDateId(row.original.createdAt)}
      </span>
    ),
  },
];

export function RolesTable({ data }: { data: Role[] }) {
  return <DataTable columns={columns} data={data} />;
}