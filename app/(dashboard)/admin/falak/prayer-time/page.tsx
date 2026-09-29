import { Clock } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getRecentPrayerTimes } from "@/modules/falak/queries/prayer-time.query";
import { DEFAULT_CITY } from "@/lib/cities";
import { PrayerTimesTable } from "./prayer-times-table";

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
      <PrayerTimesTable data={recent} />
    </PageContainer>
  );
}