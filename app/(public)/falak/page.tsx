import Link from "next/link";
import { ArrowRight, Calendar, Clock, Compass } from "lucide-react";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { HubDot } from "@/components/shared/hub-dot";

const tools = [
  {
    title: "Jadwal Shalat",
    description:
      "Jadwal shalat harian dengan metode hisab Kemenag RI, mode waktu istiwa hakiki, dan ihtiyat +3 menit.",
    icon: Clock,
    href: "/falak/jadwal-shalat",
  },
  {
    title: "Arah Kiblat",
    description:
      "Tentukan arah kiblat dari lokasi Anda dengan kompas digital dan perhitungan geodesi.",
    icon: Compass,
    href: "/falak/kiblat",
  },
  {
    title: "Kalender Hijriah",
    description:
      "Konversi tanggal Masehi–Hijriah dan telusuri kalender Hijriah sepanjang tahun.",
    icon: Calendar,
    href: "/falak/kalender-hijriah",
  },
];

export default function FalakPage() {
  return (
    <>
      <PageHeader
        title="Layanan Falak"
        description="Ilmu falak yang hidup: jadwal shalat, arah kiblat, dan kalender Hijriah — dihitung mengikuti kaidah hisab yang dipakai para muwaqqit pesantren."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative flex flex-col rounded-2xl border border-primary/15 bg-card p-6 transition-colors hover:border-primary/45"
              >
                <div className="flex items-center justify-end">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <h3 className="mt-8 font-display text-xl font-semibold text-foreground">
                  {tool.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {tool.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all group-hover:gap-3">
                  <HubDot className="h-2 w-2" />
                  Buka Instrumen
                  <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-primary/15 bg-card p-6 sm:p-8">
          <SectionLabel>Metode Perhitungan</SectionLabel>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Seluruh layanan falak LIM mengikuti kaidah hisab yang digunakan
            Kementerian Agama RI dan tradisi muwaqqit pesantren: perhitungan
            posisi Matahari dan Bulan berdasarkan koordinat lokasi, dengan
            penambahan waktu ihtiyat sebesar 3 menit sebagai bentuk kehati-hatian
            dalam beribadah.
          </p>
        </div>
      </section>
    </>
  );
}
