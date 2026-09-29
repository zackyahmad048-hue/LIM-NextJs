"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";

import type { getAttendance } from "@/modules/program/queries/program.query";
import {
  checkInAttendance,
  checkOutAttendance,
} from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getAttendance>>[number];

function formatTime(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const attendanceLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  PRESENT: { label: "Hadir", variant: "default" },
  ABSENT: { label: "Tidak Hadir", variant: "destructive" },
  LATE: { label: "Terlambat", variant: "secondary" },
  EXCUSED: { label: "Izin", variant: "outline" },
};

function buildColumns(programId: string): ColumnDef<Item>[] {
  return [
    {
      accessorKey: "participant",
      header: "Peserta",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-admin-content-fg">
          {row.original.participant.user.name}
        </span>
      ),
    },
    {
      accessorKey: "checkIn",
      header: "Check In",
      cell: ({ row }) => (
        <span className="text-xs text-admin-content-fg/80">
          {formatTime(row.original.checkIn)}
        </span>
      ),
    },
    {
      accessorKey: "checkOut",
      header: "Check Out",
      cell: ({ row }) => (
        <span className="text-xs text-admin-content-fg/80">
          {formatTime(row.original.checkOut)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = attendanceLabels[row.original.status] ?? {
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
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          {!row.original.checkIn && (
            <form
              action={checkInAttendance.bind(
                null,
                row.original.participantId,
                programId,
              )}
            >
              <Button variant="outline" size="sm">
                Check In
              </Button>
            </form>
          )}
          {row.original.checkIn && !row.original.checkOut && (
            <form
              action={checkOutAttendance.bind(
                null,
                row.original.participantId,
                programId,
              )}
            >
              <Button variant="outline" size="sm">
                Check Out
              </Button>
            </form>
          )}
        </div>
      ),
    },
  ];
}

export function AttendanceTable({
  data,
  programId,
}: {
  data: Item[];
  programId: string;
}) {
  const columns = useMemo(() => buildColumns(programId), [programId]);
  return <DataTable columns={columns} data={data} />;
}