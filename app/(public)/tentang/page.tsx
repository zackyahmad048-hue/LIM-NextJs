import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tentang' }

// Cakupan mengikuti README proyek; tidak ada angka atau klaim di luar itu.
const cakupan = [
  {
    nama: 'Persuratan',
    isi: 'Penomoran surat per periode khidmat, alur persetujuan, dan kode QR untuk verifikasi.',
  },
  { nama: 'Wajib Khidmah', isi: 'Penugasan guru bantu dan laporan mingguan dari guru maupun lembaga.' },
  { nama: 'Safari Ramadan', isi: 'Titik safari, delegasi, dan jurnal harian beserta persetujuan berjenjang.' },
  { nama: 'Pesantren Ramadan', isi: 'Sekolah mitra, bank materi, dan laporan harian pengajar.' },
  { nama: 'Digital Falak', isi: 'Jadwal shalat dan penetapan awal bulan oleh Lajnah Falak.' },
  { nama: 'Dakwah digital dan daerah binaan', isi: 'Konten dakwah, event, serta laporan bulanan daerah binaan.' },
] as const

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Tentang LIM</h1>
      <p className="mt-3 max-w-prose text-lg text-muted-foreground">
        Lembaga Ittihadul Muballighin (LIM) — Pondok Pesantren Lirboyo
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-prose space-y-5 text-base leading-8">
          <p>
            Lembaga Ittihadul Muballighin (LIM) adalah lembaga di bawah Pondok Pesantren Lirboyo yang membina guru
            bantu dan muballigh di seluruh Indonesia. Platform digital ini mengintegrasikan persuratan,
            kepengurusan, Wajib Khidmah, Safari Ramadan, Pesantren Ramadan, Digital Falak, dakwah digital, dan
            daerah binaan.
          </p>
          <p>Platform mengikuti ketetapan resmi PKO MUNAS II 2025 dan arahan Lajnah Falak LIM.</p>
        </div>

        <section aria-labelledby="cakupan-judul">
          <h2 id="cakupan-judul" className="text-lg font-semibold">
            Yang dikelola platform ini
          </h2>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {cakupan.map((item) => (
              <div key={item.nama} className="py-4">
                <dt className="font-medium">{item.nama}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.isi}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}
