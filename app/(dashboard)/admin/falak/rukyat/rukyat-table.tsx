"use client";

import { Archive, CheckCircle, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

import type { falakService } from "@/modules/falak/application/service";
import {
  verifyRukyat,
  confirmRukyat,
  archiveRukyat,
} from "@/modules/falak/presentation/falak.action";

type Item = Awaited<
  ReturnType<typeof falakService.getRukyatPaginated>
>["items"][number];

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "CONFIRMED"
      ? "default"
      : status === "VERIFIED"
        ? "secondary"
        : "outline";

  const label =
    status === "DRAFT"
      ? "Draft"
      : status === "VERIFIED"
        ? "Terverifikasi"
        : status === "CONFIRMED"
          ? "Dikonfirmasi"
          : status === "ARCHIVED"
            ? "Diarsipkan"
            : status;

  return (
    <Badge variant={variant} className="h-5 px-2 text-[11px]">
      {label}
    </Badge>
  );
}

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "locationName",
    header: "Lokasi",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-admin-content-fg">
        {row.original.locationName}
      </span>
    ),
  },
  {
    accessorKey: "observationDate",
    header: "Tanggal",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatDateId(row.original.observationDate)}
      </span>
    ),
  },
  {
    accessorKey: "weather",
    header: "Cuaca",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {row.original.weather}
      </span>
    ),
  },
  {
    accessorKey: "result",
    header: "Hasil",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {row.original.result}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "id",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        {row.original.status === "DRAFT" && (
          <form
            action={verifyRukyat.bind(null, row.original.id)}
          >
            <Button
              variant="ghost"
              size="sm"
              aria-label="Verifikasi"
              title="Verifikasi"
            >
              <ShieldCheck className="size-3.5" />
            </Button>
          </form>
        )}
        {row.original.status === "VERIFIED" && (
          <form
            action={confirmRukyat.bind(null, row.original.id)}
          >
            <Button
              variant="ghost"
              size="sm"
              aria-label="Konfirmasi"
              title="Konfirmasi"
            >
              <CheckCircle className="size-3.5" />
            </Button>
          </form>
        )}
        {row.original.status === "CONFIRMED" && (
          <form
            action={archiveRukyat.bind(null, row.original.id)}
          >
            <Button
              variant="ghost"
              size="sm"
              aria-label="Arsipkan"
              title="Arsipkan"
            >
              <Archive className="size-3.5" />
            </Button>
          </form>
        )}
      </div>
    ),
  },
];

export function RukyatTable({ data }: { data: Item[] }) {
  return <DataTable columns={columns} data={data} />;
}