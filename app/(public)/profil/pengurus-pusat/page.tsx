import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";

export const metadata: Metadata = {
  title: "Pengurus Pusat | LIM Digital Platform",
  description:
    "Para pimpinan Lembaga Ittihadul Muballighin yang memegang amanah organisasi.",
};

const pengurus = [
  {
    nama: "KH. Ahmad Fauzi",
    jabatan: "Ketua Umum",
    deskripsi:
      "Memimpin LIM dengan visi dakwah profesional dan berakhlakul karimah.",
  },
  {
    nama: "KH. Muhammad Rizal",
    jabatan: "Wakil Ketua Umum",
    deskripsi: "Mendampingi Ketua Umum dalam menjalankan program organisasi.",
  },
  {
    nama: "Dr. H. Abdullah Syukri",
    jabatan: "Sekretaris Jenderal",
    deskripsi: "Mengelola administrasi dan koordinasi internal organisasi.",
  },
  {
    nama: "H. Muhammad Arifin",
    jabatan: "Bendahara Umum",
    deskripsi: "Mengelola keuangan dan aset organisasi secara transparan.",
  },
  {
    nama: "Ust. H. Hasan Basri",
    jabatan: "Ketua Bidang Dakwah",
    deskripsi: "Mengkoordinasikan seluruh program dakwah LIM.",
  },
  {
    nama: "Ust. H. Ibrahim Mas'ud",
    jabatan: "Ketua Bidang Pendidikan",
    deskripsi: "Mengelola program pendidikan dan pelatihan muballigh.",
  },
  {
    nama: "H. Sulaiman Effendi",
    jabatan: "Ketua Bidang Organisasi",
    deskripsi: "Mengelola struktur dan kepengurusan di seluruh Indonesia.",
  },
  {
    nama: "Ust. H. Rudy Haryanto",
    jabatan: "Ketua Bidang Kaderisasi",
    deskripsi: "Membina kader muballigh muda berbakat.",
  },
];

export default function PengurusPusatPage() {
  return (
    <>
      <PageHeader
        title="Pengurus Pusat"
        description="Para pimpinan Lembaga Ittihadul Muballighin yang memegang amanah dalam menjalankan roda organisasi."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pengurus.map((orang) => (
            <div
              key={orang.nama}
              className="group rounded-2xl border border-primary/15 bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-sans text-sm text-primary">
                {orang.nama.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-4 font-display text-sm font-semibold text-foreground">
                {orang.nama}
              </h3>
              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-primary">
                {orang.jabatan}
              </p>
              <p className="mt-2.5 text-xs leading-6 text-muted-foreground">
                {orang.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
