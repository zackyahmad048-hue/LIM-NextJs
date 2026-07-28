import type { Metadata } from "next";
import { HijriCalendarWidget } from "@/components/website/falak/hijri-calendar-widget";

export const metadata: Metadata = {
  title: "Kalender Hijriah | Falak | LIM Digital Platform",
  description: "Konversi tanggal Masehi ke Hijriah dan lihat kalender Hijriah.",
};

export default function KalenderHijriahPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Kalender Hijriah</h1>
        <p className="mt-2 text-muted-foreground">
          Konversi tanggal antara Masehi dan Hijriah.
        </p>
      </div>

      <HijriCalendarWidget />
    </section>
  );
}
