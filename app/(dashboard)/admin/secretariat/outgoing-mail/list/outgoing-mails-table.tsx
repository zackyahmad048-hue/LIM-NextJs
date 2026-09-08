"use client";

import Link from "next/link";
import { FileText, Pencil } from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/shared/data-table";
import { LetterPlate } from "@/components/admin/shared/letter-plate";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import { formatDateId } from "@/lib/format";

import type { getOutgoingMails } from "@/modules/secretariat/queries/secretariat.query";
import { deleteOutgoingMail } from "@/modules/secretariat/presentation/secretariat.action";

type Mail = Awaited<ReturnType<typeof getOutgoingMails>>["items"][number];

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SENT: { label: "Terkirim", variant: "default" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

const columns: ColumnDef<Mail>[] = [
  {
    accessorKey: "fullNumber",
    header: "Nomor Surat",
    cell: ({ row }) =>
      row.original.fullNumber ? (
        <LetterPlate fullNumber={row.original.fullNumber} size="sm" />
      ) : (
        <span className="text-xs text-admin-content-fg/60">
          Belum bernomor
        </span>
      ),
  },
  {
    accessorKey: "recipient",
    header: "Penerima",
    cell: ({ row }) => (
      <div className="max-w-50">
        <p className="truncate text-sm font-medium text-admin-content-fg">
          {row.original.recipient || "-"}
        </p>
        {row.original.ketuaName && (
          <p className="truncate text-xs text-admin-content-fg/60">
            Ketua: {row.original.ketuaName}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Perihal",
    cell: ({ row }) => (
      <span className="truncate text-xs text-admin-content-fg/80">
        {row.original.subject}
      </span>
    ),
  },
  {
    accessorKey: "mailDate",
    header: "Tanggal Surat",
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-admin-content-fg/80">
        {formatDateId(row.original.mailDate)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = statusLabels[row.original.status] ?? {
        label: row.original.status,
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
    header: () => (
      <div className="text-right text-sm font-medium text-admin-content-fg/70">
        Aksi
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button asChild variant="ghost" size="sm" aria-label="Cetak / PDF">
          <Link href={`/admin/secretariat/outgoing-mail/${row.original.id}/cetak`}>
            <FileText className="size-3.5" />
          </Link>
        </Button>
        {row.original.status !== "ARCHIVED" && (
          <Button asChild variant="ghost" size="sm" aria-label="Edit surat keluar">
            <Link href={`/admin/secretariat/outgoing-mail/${row.original.id}/edit`}>
              <Pencil className="size-3.5" />
            </Link>
          </Button>
        )}
        <ConfirmDelete
          onConfirm={deleteOutgoingMail}
          args={[row.original.id]}
          title="Hapus surat keluar"
          description={`Surat keluar "${row.original.subject}" akan dihapus permanen.`}
          label="Hapus surat keluar"
        />
      </div>
    ),
  },
];

export function OutgoingMailsTable({ data }: { data: Mail[] }) {
  return <DataTable columns={columns} data={data} />;
}