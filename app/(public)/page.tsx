// app/(public)/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Users, Moon, ArrowRight } from 'lucide-react'

// Mock data untuk statistik (nanti bisa diganti dengan fetch dari API/Database)
const stats = [
  { label: 'Pengurus Wilayah', value: '34' },
  { label: 'Pengurus Cabang', value: '514' },
  { label: 'Guru Bantu Aktif', value: '1,200+' },
  { label: 'Lembaga Mitra', value: '850+' },
]

const features = [
  {
    icon: FileText,
    title: 'Persuratan Digital',
    description: 'Penomoran surat dinamis, alur approval berjenjang, dan verifikasi QR code untuk keaslian dokumen.',
  },
  {
    icon: Users,
    title: 'Wajib Khidmah',
    description: 'Monitoring penugasan guru bantu, cross-check laporan mingguan otomatis, dan evaluasi kasus terpadu.',
  },
  {
    icon: Moon,
    title: 'Digital Falak',
    description: 'Jadwal shalat berbasis hisab Tashilul Amtsilah khas Lirboyo dan penetapan awal bulan yang akurat.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Digitalisasi Organisasi <br className="hidden sm:block" />
            <span className="text-primary">LIM Pondok Pesantren Lirboyo</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Platform terintegrasi untuk ekosistem data, layanan, dan tata kelola organisasi yang terstruktur, transparan, dan akuntabel sesuai amanat PKO MUNAS II 2025.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                Masuk ke Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tentang">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Fitur Utama Platform
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Solusi digital komprehensif untuk mendukung seluruh aspek operasional LIM.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 transition-all duration-200 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Siap Mengelola Organisasi dengan Lebih Baik?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Bergabunglah dengan ekosistem digital LIM untuk tata kelola yang lebih efisien dan terukur.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="bg-card text-foreground hover:bg-muted">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}