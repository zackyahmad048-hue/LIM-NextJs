import Link from "next/link";
import { Clock, Compass, Calendar, Calculator } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

const features = [
  {
    title: "Jadwal Shalat",
    description: "Lihat jadwal shalat harian untuk lokasi Anda.",
    icon: Clock,
    href: "/falak/jadwal-shalat",
  },
  {
    title: "Arah Kiblat",
    description: "Temukan arah kiblat dari lokasi Anda.",
    icon: Compass,
    href: "/falak/kiblat",
  },
  {
    title: "Kalender Hijriah",
    description: "Konversi tanggal Masehi ke Hijriah.",
    icon: Calendar,
    href: "/falak/kalender-hijriah",
  },
  {
    title: "Hisab & Rukyat",
    description: "Data perhitungan hisab dan observasi rukyat.",
    icon: Calculator,
    href: "/falak/hisab-rukyat",
  },
];

export default function FalakPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        badge="Falak"
        title="Layanan Falak"
        description="Akses layanan falak: jadwal shalat, arah kiblat, kalender Hijriah, dan data hisab rukyat."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
