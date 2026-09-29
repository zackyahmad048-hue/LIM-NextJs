"use client";

import Link from "next/link";
import {
  Archive,
  CheckCircle,
  FileText,
  Pencil,
  Send,
  XCircle,
} from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import { documentTypeLabels } from "@/components/admin/secretariat/document-type-labels";

import type { getAdministrativeDocuments } from "@/modules/secretariat/queries/secretariat.query";
import {
  deleteAdministrativeDocument,
  transitionAdministrativeDocumentStatus,
} from "@/modules/secretariat/presentation/secretariat.action";

type Document = Awaited<
  ReturnType<typeof getAdministrativeDocuments>
>["items"][number];

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SUBMITTED: { label: "Diajukan", variant: "default" },
  APPROVED: { label: "Disetujui", variant: "secondary" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

const statusActions: Record<
  string,
  {
    label: string;
    status: string;
    icon: typeof Send;
    variant: "default" | "secondary" | "destructive" | "outline";
  }[]
> = {
  DRAFT: [{ label: "Ajukan", status: "SUBMITTED", icon: Send, variant: "default" }],
  SUBMITTED: [
    { label: "Setujui", status: "APPROVED", icon: CheckCircle, variant: "default" },
    { label: "Tolak", status: "REJECTED", icon: XCircle, variant: "destructive" },
  ],
  APPROVED: [
    { label: "Arsipkan", status: "ARCHIVED", icon: Archive, variant: "outline" },
  ],
  REJECTED: [],
};

const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "documentNumber",
    header: "No. Dokumen",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-admin-content-fg/60">
        {row.original.documentNumber}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => (
      <div className="max-w-62.5">
        <p className="truncate text-sm font-medium text-admin-content-fg">
          {row.original.title}
        </p>
        <p className="truncate text-xs text-admin-content-fg/60">
          {documentTypeLabels[row.original.documentType] ??
            row.original.documentType}
        </p>
      </div>
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
        {(statusActions[row.original.status] ?? []).map((action) => {
          const Icon = action.icon;
          return (
            <form
              key={action.status}
              action={transitionAdministrativeDocumentStatus.bind(
                null,
                row.original.id,
                action.status,
              )}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                aria-label={action.label}
                title={action.label}
              >
                <Icon className="size-3.5" />
                <span className="hidden xl:inline">{action.label}</span>
              </Button>
            </form>
          );
        })}
        <Button asChild variant="ghost" size="sm" aria-label="Cetak / PDF">
          <Link href={`/admin/secretariat/document/${row.original.id}/cetak`}>
            <FileText className="size-3.5" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" aria-label="Edit dokumen">
          <Link href={`/admin/secretariat/document/${row.original.id}/edit`}>
            <Pencil className="size-3.5" />
          </Link>
        </Button>
        <ConfirmDelete
          onConfirm={deleteAdministrativeDocument}
          args={[row.original.id]}
          title="Hapus dokumen"
          description={`Dokumen "${row.original.title}" akan dihapus permanen.`}
          label="Hapus dokumen"
        />
      </div>
    ),
  },
];

export function DocumentTable({ data }: { data: Document[] }) {
  return <DataTable columns={columns} data={data} />;
}