import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
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

      <SiteSection>
        <Reveal>
          <HijriCalendarWidget />
        </Reveal>
      </SiteSection>
    </>
  );
}
