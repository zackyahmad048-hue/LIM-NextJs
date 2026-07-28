import type { Metadata } from "next";
import { PrayerTimeTable } from "@/components/website/falak/prayer-time-table";

export const metadata: Metadata = {
  title: "Jadwal Shalat | Falak | LIM Digital Platform",
  description: "Lihat jadwal shalat harian berdasarkan lokasi Anda.",
};

export default function JadwalShalatPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Jadwal Shalat</h1>
        <p className="mt-2 text-muted-foreground">
          Jadwal shalat harian berdasarkan lokasi dan metode perhitungan yang dipilih.
        </p>
      </div>

      <PrayerTimeTable />
    </section>
  );
}
