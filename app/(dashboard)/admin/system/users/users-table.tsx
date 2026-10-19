"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

import type { getUsers } from "@/modules/authorization/queries/user.query";

type User = Awaited<ReturnType<typeof getUsers>>[number];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback className="bg-primary/15 text-xs text-primary">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "roles",
    header: "Peran",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {user.roles.length > 0 ? (
            user.roles.map((role) => (
              <Badge
                key={role.id}
                variant="secondary"
                className="text-[11px]"
              >
                {role.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Verifikasi",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge
          variant={user.emailVerified ? "default" : "outline"}
          className="text-[11px]"
        >
          {user.emailVerified ? "Terverifikasi" : "Belum"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Terdaftar",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {formatDateId(row.original.createdAt, { fallback: "—" })}
      </span>
    ),
  },
];

export function UsersTable({ data }: { data: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="Belum ada pengguna."
      emptyDescription=""
    />
  );
}