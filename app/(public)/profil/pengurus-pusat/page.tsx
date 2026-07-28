import SectionHeading from "@/components/shared/section-heading";

const pengurus = [
  {
    nama: "KH. Ahmad Fauzi",
    jabatan: "Ketua Umum",
    deskripsi: "Memimpin LIM dengan visi dakwah profesional dan berakhlakul karimah.",
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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          badge="Profil"
          title="Pengurus Pusat"
          description="Para pimpinan Lembaga Ittihadul Muballighin yang memegang amanah dalam menjalankan roda organisasi."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pengurus.map((orang) => (
            <div
              key={orang.nama}
              className="group rounded-xl border border-border bg-card p-5 transition hover:border-orange-200 hover:shadow-md dark:hover:border-slate-600"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                {orang.nama
                  .split(" ")
                  .slice(-1)[0]
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <h3 className="mt-4 text-sm font-bold text-card-foreground">
                {orang.nama}
              </h3>
              <p className="mt-1 text-xs font-medium text-orange-500 dark:text-orange-400">
                {orang.jabatan}
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {orang.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
