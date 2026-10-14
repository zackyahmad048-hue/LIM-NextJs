import type { Metadata } from "next";

/**
 * Metadata di layout, bukan di page, supaya render halaman galat pun ikut
 * tidak diindeks: alamatnya tetap memuat Nomor Surat, dan satu tautan yang
 * pernah ditemukan crawler cukup untuk menerbitkan kodenya ke indeks publik.
 */
export const metadata: Metadata = {
  title: "Verifikasi Surat | LIM Digital Platform",
  robots: { index: false, follow: false },
};

export default function VerifyLetterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
