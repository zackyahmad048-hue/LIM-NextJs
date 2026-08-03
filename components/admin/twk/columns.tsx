"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataColumnHeader } from "@/components/admin/shared/data-table";

import { DeleteMemberDialog } from "./delete.dialog";
import type { MemberRow } from "./types";

interface Props {
  onEdit(member: MemberRow): void;
}

function Cell({ value }: { value: string | null }) {
  return value ? (
    <span className="text-sm">{value}</span>
  ) : (
    <span className="text-sm text-muted-foreground">-</span>
  );
}

export function getMemberColumns({ onEdit }: Props): ColumnDef<MemberRow>[] {
  return [
    {
      id: "no",
      accessorKey: "no",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="No." />
      ),
      cell: ({ row }) => <span className="text-sm">{row.index + 1}</span>,
    },
    {
      accessorKey: "nama",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nama}</span>
      ),
    },
    {
      accessorKey: "kelas",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Kelas" />
      ),
      cell: ({ row }) => <Cell value={row.original.kelas} />,
    },
    {
      accessorKey: "posWajibKhidmah",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Pos" />
      ),
      cell: ({ row }) => <Cell value={row.original.posWajibKhidmah} />,
    },
    {
      accessorKey: "tempatWajibKhidmah",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Tempat" />
      ),
      cell: ({ row }) => <Cell value={row.original.tempatWajibKhidmah} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Edit
            </DropdownMenuItem>

            <DeleteMemberDialog
              id={row.original.id}
              nama={row.original.nama}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
