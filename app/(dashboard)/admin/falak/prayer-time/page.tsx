import { formatDateId } from "@/lib/format";
import { Clock } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";

import { getRecentPrayerTimes } from "@/modules/falak/queries/prayer-time.query";
import { DEFAULT_CITY } from "@/lib/cities";

type Item = Awaited<ReturnType<typeof getRecentPrayerTimes>>[number];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default async function PrayerTimePage() {
  const recent = await getRecentPrayerTimes(
    DEFAULT_CITY.latitude,
    DEFAULT_CITY.longitude,
    "KEMENAG",
    30,
  );

  return (
    <PageContainer>
      <PageHeader
        title="Jadwal Shalat"
        description={`Data jadwal shalat yang tersimpan untuk ${DEFAULT_CITY.name} (metode Kemenag).`}
      />

      {recent.length === 0 && (
        <p className="inline-flex items-center gap-2 text-sm text-admin-content-fg/60">
          <Clock className="size-4" />
          Belum ada jadwal shalat tersimpan. Jadwal akan muncul setelah
          perhitungan dijalankan.
        </p>
      )}
      <DataTable<Item, unknown>
        data={recent}
        columns={[
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
        ]}
      />
    </PageContainer>
  );
}