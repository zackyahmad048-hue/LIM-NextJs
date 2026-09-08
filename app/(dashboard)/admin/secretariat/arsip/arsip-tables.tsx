"use client";

import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { LetterPlate } from "@/components/admin/shared/letter-plate";
import { DataTable } from "@/components/admin/shared/data-table";
import { documentTypeLabels } from "@/components/admin/secretariat/document-type-labels";
import { formatDateId } from "@/lib/format";

import type { getArchiveData } from "@/modules/secretariat/queries/secretariat.query";

type Outgoing = Awaited<ReturnType<typeof getArchiveData>>["outgoing"][number];
type Incoming = Awaited<ReturnType<typeof getArchiveData>>["incoming"][number];
type Document = Awaited<ReturnType<typeof getArchiveData>>["documents"][number];

function extractFileIdFromMediaUrl(url: string): string | null {
  const match = url.match(/\/api\/media\/([^?]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function AttachmentLink({ url, label }: { url: string | null; label: string }) {
  const fileId = url ? extractFileIdFromMediaUrl(url) : null;
  if (!fileId) return null;
  return (
    <Button asChild variant="ghost" size="sm" aria-label={label} title={label}>
      <a href={`/api/media/${encodeURIComponent(fileId)}`} target="_blank">
        <ExternalLink className="size-3.5" />
      </a>
    </Button>
  );
}

const outgoingColumns: ColumnDef<Outgoing>[] = [
  {
    accessorKey: "fullNumber",
    header: "Nomor Surat",
    cell: ({ row }) => {
      const item = row.original;
      return item.fullNumber ? (
        <LetterPlate fullNumber={item.fullNumber} size="sm" />
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Perihal",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="max-w-[240px]">
          <p className="truncate text-sm font-medium">{item.subject}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.recipient ?? "-"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "archivedAt",
    header: "Tanggal Arsip",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="text-xs">{formatDateId(item.archivedAt, { fallback: "—" })}</span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right text-sm font-medium text-admin-content-fg/70">Aksi</div>,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex justify-end gap-1">
          <AttachmentLink url={item.attachmentUrl} label="Buka lampiran" />
          <Button asChild variant="ghost" size="sm" aria-label="Buka surat" title="Buka surat">
            <Link href={`/admin/secretariat/outgoing-mail/${item.id}/edit`}>
              <FileText className="size-3.5" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

const incomingColumns: ColumnDef<Incoming>[] = [
  {
    accessorKey: "registrationNumber",
    header: "No. Surat Pengirim",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="text-xs text-muted-foreground">
          {item.registrationNumber}
        </span>
      );
    },
  },
  {
    accessorKey: "sender",
    header: "Pengirim",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="max-w-[200px]">
          <p className="truncate text-sm font-medium">{item.sender}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.senderAddress ?? ""}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Perihal",
    cell: ({ row }) => {
      const item = row.original;
      return <span className="truncate text-xs">{item.subject}</span>;
    },
  },
  {
    accessorKey: "archivedAt",
    header: "Tanggal Arsip",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="text-xs">{formatDateId(item.archivedAt, { fallback: "—" })}</span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right text-sm font-medium text-admin-content-fg/70">Aksi</div>,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex justify-end gap-1">
          <AttachmentLink url={item.attachmentUrl} label="Buka lampiran" />
          <Button asChild variant="ghost" size="sm" aria-label="Buka surat" title="Buka surat">
            <Link href={`/admin/secretariat/incoming-mail/${item.id}/edit`}>
              <FileText className="size-3.5" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

const documentColumns: ColumnDef<Document>[] = [
  {
    accessorKey: "documentNumber",
    header: "No. Dokumen",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="text-xs text-muted-foreground">
          {item.documentNumber}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="max-w-[240px]">
          <p className="truncate text-sm font-medium">{item.title}</p>
          {item.description && (
            <p className="truncate text-xs text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "documentType",
    header: "Jenis Dokumen",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="text-xs">
          {documentTypeLabels[item.documentType] ?? item.documentType}
        </span>
      );
    },
  },
  {
    accessorKey: "archivedAt",
    header: "Tanggal Arsip",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="text-xs">
          {formatDateId(item.archivedAt ?? item.approvedAt, { fallback: "—" })}
        </span>
      );
    },
  },
];

export function OutgoingArchiveTable({ data }: { data: Outgoing[] }) {
  return <DataTable columns={outgoingColumns} data={data} />;
}

export function IncomingArchiveTable({ data }: { data: Incoming[] }) {
  return <DataTable columns={incomingColumns} data={data} />;
}

export function DocumentsArchiveTable({ data }: { data: Document[] }) {
  return <DataTable columns={documentColumns} data={data} />;
}