"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import { ArchiveIncomingMailButton } from "@/components/admin/secretariat/archive-incoming-mail-button";
import { formatDateId } from "@/lib/format";

import type { getIncomingMails } from "@/modules/secretariat/queries/secretariat.query";
import { deleteIncomingMail } from "@/modules/secretariat/presentation/secretariat.action";

type Incoming = Awaited<ReturnType<typeof getIncomingMails>>["items"][number];

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  RECEIVED: { label: "Diterima", variant: "default" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

const columns: ColumnDef<Incoming>[] = [
  {
    accessorKey: "registrationNumber",
    header: "No. Surat Pengirim",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/60">
        {row.original.registrationNumber}
      </span>
    ),
  },
  {
    accessorKey: "sender",
    header: "Pengirim",
    cell: ({ row }) => (
      <div className="max-w-50">
        <p className="truncate text-sm font-medium text-admin-content-fg">
          {row.original.sender}
        </p>
        {row.original.senderAddress && (
          <p className="truncate text-xs text-admin-content-fg/60">
            {row.original.senderAddress}
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
    accessorKey: "receivedDate",
    header: "Tanggal Diterima",
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-admin-content-fg/80">
        {formatDateId(row.original.receivedDate)}
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
        <Button asChild variant="ghost" size="sm" aria-label="Edit surat masuk">
          <Link href={`/admin/secretariat/incoming-mail/${row.original.id}/edit`}>
            <Pencil className="size-3.5" />
          </Link>
        </Button>
        {row.original.status === "RECEIVED" && (
          <ArchiveIncomingMailButton
            id={row.original.id}
            subject={row.original.subject}
          />
        )}
        <ConfirmDelete
          onConfirm={deleteIncomingMail}
          args={[row.original.id]}
          title="Hapus surat masuk"
          description={`Surat masuk "${row.original.subject}" akan dihapus permanen.`}
          label="Hapus surat masuk"
        />
      </div>
    ),
  },
];

export function IncomingMailsTable({
  data,
  page,
  pageCount,
}: {
  data: Awaited<ReturnType<typeof import("@/modules/secretariat/queries/secretariat.query").getIncomingMails>>["items"];
  page: number;
  pageCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <DataTable
      columns={columns}
      data={data}
      manualPagination
      pageCount={pageCount}
      pageIndex={page - 1}
      onPaginationChange={(pageIndex) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pageIndex + 1));
        router.push(`/admin/secretariat/incoming-mail/list?${searchParams.toString()}`);
      }}
    />
  );
}