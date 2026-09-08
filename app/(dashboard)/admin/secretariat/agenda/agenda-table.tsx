"use client";

import { Calendar, MapPin, Users } from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

import type { getAgendaBooks } from "@/modules/secretariat/queries/secretariat.query";

type Agenda = Awaited<ReturnType<typeof getAgendaBooks>>["items"][number];

const columns: ColumnDef<Agenda>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-muted-foreground" />
          <span className="text-xs tabular-nums">{formatDateId(row.original.date, { long: true })}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="max-w-62.5">
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
    accessorKey: "location",
    header: "Lokasi",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-muted-foreground" />
          <span className="text-xs">{item.location ?? "-"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "participants",
    header: "Peserta",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="max-w-50">
          {item.participants ? (
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5 text-muted-foreground shrink-0" />
              <span className="truncate text-xs">{item.participants}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Catatan",
    cell: ({ row }) => {
      const item = row.original;
      return <span className="truncate text-xs">{item.notes ?? "-"}</span>;
    },
  },
];

export function AgendaTable({ data }: { data: Agenda[] }) {
  return <DataTable columns={columns} data={data} />;
}