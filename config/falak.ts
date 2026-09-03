import {
  Binoculars,
  Calculator,
  Calendar,
  Clock,
  Compass,
  Eclipse,
  type LucideIcon,
} from "lucide-react";

export interface FalakToolItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const FALAK_TOOLS: FalakToolItem[] = [
  {
    title: "Jadwal Shalat",
    description:
      "Jadwal shalat harian metode hisab markaz, mode waktu istiwa hakiki, dan ihtiyat +3 menit.",
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
  {
    title: "Hisab",
    description:
      "Perhitungan hilal dan kriteria imkanur rukyat, lengkap dengan hasil bulan ini.",
    icon: Calculator,
    href: "/falak/hisab",
  },
  {
    title: "Rukyat",
    description:
      "Laporan observasi hilal per wilayah beserta kesaksian saksi di setiap titik pantau.",
    icon: Binoculars,
    href: "/falak/rukyat",
  },
  {
    title: "Gerhana",
    description:
      "Jadwal gerhana matahari dan bulan beserta visibilitasnya dari wilayah Indonesia.",
    icon: Eclipse,
    href: "/falak/gerhana",
  },
];