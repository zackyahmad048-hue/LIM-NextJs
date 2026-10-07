import Link from "next/link";
import { ArrowRight, Clock, Compass, Calendar, Calculator, Binoculars, Eclipse } from "lucide-react";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { HubDot } from "@/components/shared/hub-dot";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
import { getFalakContent } from "@/modules/cms/queries/site-page.query";

export const revalidate = 3600;

export default async function FalakPage() {
  const falak = await getFalakContent();

  return (
    <>
      <PageHeader
        title={falak.headerTitle}
        description={falak.headerDescription}
      />

      <SiteSection>
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          <Reveal index={0} delay={0.1} className="h-full">
            <Link
              href="/falak/jadwal-shalat"
              className="group relative flex h-full flex-col rounded-xl border border-primary/25 bg-card p-6 shadow-sm transition-all duration-300 ease-out hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center justify-end">
                <Clock className="h-5 w-5 text-primary" />
              </div>

              <h2 className="mt-8 font-heading text-xl font-semibold text-balance text-foreground">
                Jadwal Shalat
              </h2>

              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                Jadwal shalat harian metode hisab markaz, mode waktu istiwa hakiki, dan ihtiyat +3 menit.
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-[gap] group-hover:gap-3">
                <HubDot className="h-2 w-2" />
                Buka Instrumen
                <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>

          <Reveal index={1} delay={0.15} className="h-full">
            <Link
              href="/falak/kiblat"
              className="group relative flex h-full flex-col rounded-xl border border-primary/25 bg-card p-6 shadow-sm transition-all duration-300 ease-out hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center justify-end">
                <Compass className="h-5 w-5 text-primary" />
              </div>

              <h2 className="mt-8 font-heading text-xl font-semibold text-balance text-foreground">
                Arah Kiblat
              </h2>

              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                Tentukan arah kiblat dari lokasi Anda dengan kompas digital dan perhitungan geodesi.
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-[gap] group-hover:gap-3">
                <HubDot className="h-2 w-2" />
                Buka Instrumen
                <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>

          <Reveal index={2} delay={0.2} className="h-full">
            <Link
              href="/falak/kalender-hijriah"
              className="group relative flex h-full flex-col rounded-xl border border-primary/25 bg-card p-6 shadow-sm transition-all duration-300 ease-out hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center justify-end">
                <Calendar className="h-5 w-5 text-primary" />
              </div>

              <h2 className="mt-8 font-heading text-xl font-semibold text-balance text-foreground">
                Kalender Hijriah
              </h2>

              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                Konversi tanggal Masehi–Hijriah dan telusuri kalender Hijriah sepanjang tahun.
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-[gap] group-hover:gap-3">
                <HubDot className="h-2 w-2" />
                Buka Instrumen
                <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>

          <Reveal index={3} delay={0.25} className="h-full">
            <Link
              href="/falak/hisab"
              className="group relative flex h-full flex-col rounded-xl border border-primary/25 bg-card p-6 shadow-sm transition-all duration-300 ease-out hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center justify-end">
                <Calculator className="h-5 w-5 text-primary" />
              </div>

              <h2 className="mt-8 font-heading text-xl font-semibold text-balance text-foreground">
                Hisab
              </h2>

              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                Perhitungan hilal dan kriteria imkanur rukyat, lengkap dengan hasil bulan ini.
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-[gap] group-hover:gap-3">
                <HubDot className="h-2 w-2" />
                Buka Instrumen
                <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>

          <Reveal index={4} delay={0.3} className="h-full">
            <Link
              href="/falak/rukyat"
              className="group relative flex h-full flex-col rounded-xl border border-primary/25 bg-card p-6 shadow-sm transition-all duration-300 ease-out hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center justify-end">
                <Binoculars className="h-5 w-5 text-primary" />
              </div>

              <h2 className="mt-8 font-heading text-xl font-semibold text-balance text-foreground">
                Rukyat
              </h2>

              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                Laporan observasi hilal per wilayah beserta kesaksian saksi di setiap titik pantau.
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-[gap] group-hover:gap-3">
                <HubDot className="h-2 w-2" />
                Buka Instrumen
                <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>

          <Reveal index={5} delay={0.35} className="h-full">
            <Link
              href="/falak/gerhana"
              className="group relative flex h-full flex-col rounded-xl border border-primary/25 bg-card p-6 shadow-sm transition-all duration-300 ease-out hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center justify-end">
                <Eclipse className="h-5 w-5 text-primary" />
              </div>

              <h2 className="mt-8 font-heading text-xl font-semibold text-balance text-foreground">
                Gerhana
              </h2>

              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                Jadwal gerhana matahari dan bulan beserta visibilitasnya dari wilayah Indonesia.
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-[gap] group-hover:gap-3">
                <HubDot className="h-2 w-2" />
                Buka Instrumen
                <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.4} className="h-full">
            <div className="rounded-xl border border-primary/25 bg-card p-8 shadow-sm transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-md">
              <SectionLabel>Silaturahmi Spiritual</SectionLabel>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">
                Menuju Kiblat Hati dan Jiwa
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Falak membantu Anda menemukan arah yang benar, bukan hanya secara fisik tetapi juga spiritual. Dengan perhitungan astronomi yang akurat, kami membimbing umat menuju ibadah yang lebih khusyuk dan bermakna, mengikuti jejak para pendahulu yang telah memanfaatkan ilmu falak dalam kehidupan sehari-hari.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.5} className="h-full">
            <div className="rounded-xl border border-primary/25 bg-card p-8 shadow-sm transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-md">
              <SectionLabel>Nilai Astronomi Islam</SectionLabel>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">
                Mengungkap Misteri Langit
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Dari hisab hilal hingga arah kiblat, dari kalender hijriah hingga fase bulan, setiap perhitungan falak adalah jembatan antara ilmu pengetahuan dan ibadah. Kami menghadirkan warisan astronomi Islam yang kaya untuk dunia modern.
              </p>
            </div>
          </Reveal>
        </div>
      </SiteSection>
    </>
  );
}