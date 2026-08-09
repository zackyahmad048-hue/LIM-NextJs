"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataColumnHeader } from "@/components/admin/shared/data-table";

import { WAJIB_KHIDMAH_STATUS_LABELS } from "@/modules/twk/domain/entities";
import type { WajibKhidmahStatus } from "@/modules/twk/domain/entities";

import {
  DeactivateMemberDialog,
  ReactivateMemberDialog,
} from "./deactivate.dialog";
import type { MemberRow } from "./types";

interface Props {
  onEdit(member: MemberRow): void;
}

const STATUS_TONE: Record<WajibKhidmahStatus, string> = {
  AKTIF: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  GUGUR: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  BEBAS_TUGAS:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  QODLO: "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
};

function StatusBadge({ status }: { status: WajibKhidmahStatus }) {
  return (
    <Badge variant="secondary" className={STATUS_TONE[status]}>
      {WAJIB_KHIDMAH_STATUS_LABELS[status]}
    </Badge>
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
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "nama",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/twk/${row.original.id}`}
          className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
        >
          {row.original.nama}
        </Link>
      ),
    },
    {
      accessorKey: "posWajibKhidmah",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Pos" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.posWajibKhidmah ?? (
            <span className="text-muted-foreground">-</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isActive = row.original.status === "AKTIF";
        return (
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

              {isActive ? (
                <DeactivateMemberDialog
                  id={row.original.id}
                  nama={row.original.nama}
                />
              ) : (
                <>
                  <ReactivateMemberDialog
                    id={row.original.id}
                    nama={row.original.nama}
                  />
                  <DeactivateMemberDialog
                    id={row.original.id}
                    nama={row.original.nama}
                  />
                </>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={`/admin/twk/${row.original.id}`}>
                  Lihat detail
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export { StatusBadge };
