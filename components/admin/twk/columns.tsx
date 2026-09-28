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
import { cn } from "@/lib/utils";

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
  AKTIF: "bg-success/10 text-success",
  GUGUR: "bg-destructive/10 text-destructive",
  BEBAS_TUGAS: "bg-warning/10 text-warning",
  QODLO: "bg-admin-border/30 text-admin-content-fg/60",
};

function StatusBadge({ status }: { status: WajibKhidmahStatus }) {
  return (
    <Badge variant="secondary" className={STATUS_TONE[status]}>
      {WAJIB_KHIDMAH_STATUS_LABELS[status]}
    </Badge>
  );
}

function TextHeader({ title }: { title: string }) {
  return <span className="text-sm font-medium">{title}</span>;
}

function DashText({ value, className }: { value: string; className?: string }) {
  const trimmed = value?.trim();
  return (
    <span className={cn("text-sm", className)}>
      {trimmed ? trimmed : <span className="text-admin-content-fg/60">-</span>}
    </span>
  );
}

export function getMemberColumns({ onEdit }: Props): ColumnDef<MemberRow>[] {
  return [
    {
      id: "no",
      accessorKey: "no",
      header: ({ column }) => <DataColumnHeader column={column} title="No." />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-admin-content-fg/60">
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "nama",
      header: ({ column }) => <DataColumnHeader column={column} title="Nama" />,
      cell: ({ row }) => (
        <Link
          href={`/admin/twk/${row.original.id}`}
          className="font-medium text-admin-content-fg transition-colors hover:text-primary hover:underline"
        >
          {row.original.nama}
        </Link>
      ),
    },
    {
      accessorKey: "asalDaerah",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Asal Daerah" />
      ),
      cell: ({ row }) => (
        <span className="block max-w-48 truncate text-sm">
          {row.original.asalDaerah || (
            <span className="text-admin-content-fg/60">-</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "posWajibKhidmah",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Pos Wajib Khidmah" />
      ),
      cell: ({ row }) => (
        <DashText value={row.original.posWajibKhidmah ?? ""} />
      ),
    },
    {
      accessorKey: "tempatWajibKhidmah",
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Tempat Khidmah" />
      ),
      cell: ({ row }) => {
        const places = row.original.tempatWajibKhidmah ?? [];
        const trimmed = places.filter((place) => place.trim().length > 0);

        if (trimmed.length === 0) {
          return <span className="text-sm text-admin-content-fg/60">-</span>;
        }

        return (
          <span className="flex max-w-60 flex-col gap-1 text-sm">
            {trimmed.map((place, index) => (
              <span key={index} className="block truncate">
                {place}
              </span>
            ))}
          </span>
        );
      },
    },
    {
      accessorKey: "tugasKhidmah",
      header: () => <TextHeader title="Tugas Khidmah" />,
      cell: ({ row }) => <DashText value={row.original.tugasKhidmah ?? ""} />,
    },
    {
      accessorKey: "catatan",
      header: () => <TextHeader title="Catatan" />,
      cell: ({ row }) => (
        <span className="block max-w-56 text-sm">
          {row.original.catatan?.trim() ? (
            <span className="line-clamp-2">{row.original.catatan}</span>
          ) : (
            <span className="text-admin-content-fg/60">-</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "absensi",
      header: () => <TextHeader title="Absensi" />,
      cell: ({ row }) => (
        <span className="block max-w-40 truncate text-sm">
          {row.original.absensi || (
            <span className="text-admin-content-fg/60">-</span>
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
              <Button variant="ghost" size="icon" aria-label="Buka menu aksi">
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
                <Link href={`/admin/twk/${row.original.id}`}>Lihat detail</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export { StatusBadge };
