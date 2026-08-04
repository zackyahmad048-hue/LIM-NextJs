import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import { HijriCalendarWidget } from "@/components/website/falak/hijri-calendar-widget";

export const metadata: Metadata = {
  title: "Kalender Hijriah | Falak | LIM Digital Platform",
  description: "Konversi tanggal Masehi ke Hijriah dan lihat kalender Hijriah.",
};

export default function KalenderHijriahPage() {
  return (
    <>
      <PageHeader
        title="Kalender Hijriah"
        description="Konversi tanggal antara Masehi dan Hijriah, serta telusuri kalender Hijriah sepanjang tahun."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <HijriCalendarWidget />
      </section>
    </>
  );
}
