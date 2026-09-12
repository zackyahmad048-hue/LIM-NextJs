"use client";

import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

/** Bentuk serializable dari entity `Role` — RSC menolak instance class domain
 *  sebagai props client component (lihat role.query → domain/role.entity). */
export interface RoleRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const columns: ColumnDef<RoleRow>[] = [
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

export function RolesTable({ data }: { data: RoleRow[] }) {
  return <DataTable columns={columns} data={data} />;
}