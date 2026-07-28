import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

export default async function PrayerTimePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Jadwal Shalat"
        description="Atur jadwal waktu shalat untuk ditampilkan di website."
      />

      <SectionCard className="rounded-lg bg-background p-4 shadow-none">
        <p className="text-sm text-muted-foreground">
          Halaman pengaturan jadwal shalat akan segera tersedia.
        </p>
      </SectionCard>
    </PageContainer>
  );
}