"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

/**
 * Label segmen rute admin. Segmen di luar kamus ini ditampilkan apa adanya
 * (capitalize). UUID dan segmen dinamis ditampilkan sebagai "Detail".
 */
const SEGMENT_LABELS: Record<string, string> = {
  about: "Tentang",
  agenda: "Agenda",
  archive: "Arsip",
  arsip: "Arsip",
  attendance: "Absensi",
  bidang: "Bidang",
  categories: "Kategori",
  cetak: "Cetak",
  committees: "Panitia",
  content: "Konten",
  disposition: "Disposisi",
  document: "Dokumen",
  documentation: "Dokumentasi",
  eclipse: "Eclipse",
  falak: "Falak",
  hero: "Hero",
  hisab: "Hisab",
  homepage: "Beranda",
  "incoming-mail": "Surat Masuk",
  lembaga: "Lembaga",
  list: "Daftar",
  media: "Media",
  new: "Tambah",
  officers: "Petugas",
  "outgoing-mail": "Surat Keluar",
  pages: "Halaman",
  participants: "Peserta",
  pendataan: "Pendataan",
  "pengurus-pusat": "Pengurus Pusat",
  penomoran: "Penomoran",
  posts: "Berita",
  "prayer-time": "Jadwal Shalat",
  profil: "Profil",
  program: "Program",
  reports: "Laporan",
  rukyat: "Rukyat",
  schedules: "Jadwal",
  secretariat: "Kesekretariatan",
  "surat-menyurat": "Surat Menyurat",
  system: "Sistem",
  tentang: "Tentang",
  twk: "TWK",
  units: "Unit",
  users: "Pengguna",
  roles: "Role",
};

const DYNAMIC_SEGMENT = /^\[.+\]$|^[0-9a-f]{8}-[0-9a-f]{4}-/i;

function labelFor(segment: string): string {
  if (DYNAMIC_SEGMENT.test(segment)) return "Detail";
  return SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/admin") {
    return (
      <nav aria-label="Breadcrumb">
        <span className="text-sm font-medium text-foreground">Dashboard</span>
      </nav>
    );
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    href: "/" + segments.slice(0, index + 1).join("/"),
    label: labelFor(segment),
  }));

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  aria-hidden
                  className="size-3.5 shrink-0 text-muted-foreground/50"
                />
              )}
              {isLast ? (
                <span className="truncate text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="truncate transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
