"use client";

import { useMemo } from "react";
import { CheckCircle, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import type { getParticipants } from "@/modules/program/queries/program.query";
import {
  updateParticipantStatus,
  removeParticipant,
} from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getParticipants>>[number];

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  PENDING: { label: "Pending", variant: "outline" },
  APPROVED: { label: "Diterima", variant: "default" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  CANCELLED: { label: "Batal", variant: "secondary" },
};

function buildColumns(programId: string): ColumnDef<Item>[] {
  return [
    {
      accessorKey: "user",
      header: "Peserta",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs bg-orange-100 text-orange-600">
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
      accessorKey: "registrationDate",
      header: "Tanggal Daftar",
      cell: ({ row }) => (
        <span className="text-xs text-admin-content-fg/80">
          {new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(row.original.registrationDate)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = statusLabels[row.original.registrationStatus] ?? {
          label: row.original.registrationStatus,
          variant: "outline" as const,
        };
        return (
          <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
            {s.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          {row.original.registrationStatus === "PENDING" && (
            <>
              <form
                action={updateParticipantStatus.bind(
                  null,
                  row.original.id,
                  programId,
                  "APPROVED",
                )}
              >
                <Button variant="ghost" size="sm" aria-label="Terima peserta" title="Terima">
                  <CheckCircle className="size-3.5 text-amber-600" />
                </Button>
              </form>
              <form
                action={updateParticipantStatus.bind(
                  null,
                  row.original.id,
                  programId,
                  "REJECTED",
                )}
              >
                <Button variant="ghost" size="sm" aria-label="Tolak peserta" title="Tolak">
                  <XCircle className="size-3.5 text-destructive" />
                </Button>
              </form>
            </>
          )}
          <ConfirmDelete
            onConfirm={removeParticipant}
            args={[row.original.id, programId]}
            title="Hapus peserta"
            description={`Peserta "${row.original.user?.name ?? "tersebut"}" akan dihapus dari program.`}
            label="Hapus peserta"
          />
        </div>
      ),
    },
  ];
}

export function ParticipantsTable({
  data,
  programId,
}: {
  data: Item[];
  programId: string;
}) {
  const columns = useMemo(() => buildColumns(programId), [programId]);
  return <DataTable columns={columns} data={data} />;
}