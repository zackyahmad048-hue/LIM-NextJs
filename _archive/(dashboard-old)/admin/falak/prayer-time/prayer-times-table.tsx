"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

import type { getRecentPrayerTimes } from "@/modules/falak/queries/prayer-time.query";

type Item = Awaited<ReturnType<typeof getRecentPrayerTimes>>[number];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "prayerDate",
    header: "Tanggal",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-admin-content-fg">
        {formatDateId(row.original.prayerDate)}
      </span>
    ),
  },
  {
    accessorKey: "fajr",
    header: "Subuh",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatTime(row.original.fajr)}
      </span>
    ),
  },
  {
    accessorKey: "sunrise",
    header: "Terbit",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatTime(row.original.sunrise)}
      </span>
    ),
  },
  {
    accessorKey: "dhuhr",
    header: "Dzuhur",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatTime(row.original.dhuhr)}
      </span>
    ),
  },
  {
    accessorKey: "asr",
    header: "Asar",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatTime(row.original.asr)}
      </span>
    ),
  },
  {
    accessorKey: "maghrib",
    header: "Maghrib",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatTime(row.original.maghrib)}
      </span>
    ),
  },
  {
    accessorKey: "isha",
    header: "Isya",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {formatTime(row.original.isha)}
      </span>
    ),
  },
];

export function PrayerTimesTable({ data }: { data: Item[] }) {
  return <DataTable columns={columns} data={data} />;
}