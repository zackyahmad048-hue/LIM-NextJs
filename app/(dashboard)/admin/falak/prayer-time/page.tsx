import { formatDateId } from "@/lib/format";
import { Clock } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getRecentPrayerTimes } from "@/modules/falak/queries/prayer-time.query";
import { DEFAULT_CITY } from "@/lib/cities";

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

      <AdminTable
        title="Riwayat Jadwal Shalat"
        description={`${recent.length} jadwal tercatat.`}
        columns={[
          {
            key: "tanggal",
            label: "Tanggal",
            render: (item) => (
              <span className="text-sm font-medium">
                {formatDateId(item.prayerDate)}
              </span>
            ),
          },
          {
            key: "fajr",
            label: "Subuh",
            render: (item) => <span className="text-xs">{formatTime(item.fajr)}</span>,
          },
          {
            key: "sunrise",
            label: "Terbit",
            render: (item) => (
              <span className="text-xs">{formatTime(item.sunrise)}</span>
            ),
          },
          {
            key: "dhuhr",
            label: "Dzuhur",
            render: (item) => (
              <span className="text-xs">{formatTime(item.dhuhr)}</span>
            ),
          },
          {
            key: "asr",
            label: "Asar",
            render: (item) => (
              <span className="text-xs">{formatTime(item.asr)}</span>
            ),
          },
          {
            key: "maghrib",
            label: "Maghrib",
            render: (item) => (
              <span className="text-xs">{formatTime(item.maghrib)}</span>
            ),
          },
          {
            key: "isha",
            label: "Isya",
            render: (item) => (
              <span className="text-xs">{formatTime(item.isha)}</span>
            ),
          },
        ]}
        data={recent}
        emptyMessage={
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4" />
            Belum ada jadwal shalat tersimpan. Jadwal akan muncul setelah
            perhitungan dijalankan.
          </span>
        }
      />
    </PageContainer>
  );
}
