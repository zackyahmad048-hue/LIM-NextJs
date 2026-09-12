import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
import { PrayerTimeTable } from "@/components/website/falak/prayer-time-table";

export const metadata: Metadata = {
  title: "Jadwal Shalat | Falak | LIM Digital Platform",
  description: "Lihat jadwal shalat harian berdasarkan lokasi Anda.",
};

export default function JadwalShalatPage() {
  return (
    <>
      <PageHeader
        title="Jadwal Shalat"
        description="Jadwal shalat harian berdasarkan lokasi Anda — dengan mode waktu standar, waktu istiwa', dan ihtiyat +3 menit."
      />

      <SiteSection>
        <Reveal>
          <PrayerTimeTable />
        </Reveal>
      </SiteSection>
    </>
  );
}
