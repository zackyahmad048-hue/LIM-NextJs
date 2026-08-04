import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <PrayerTimeTable />
      </section>
    </>
  );
}
