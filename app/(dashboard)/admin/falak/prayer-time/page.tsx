import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

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

      <Band variant="raised">
        <PrayerTimesTable data={recent} />
      </Band>
    </PageContainer>
  );
}