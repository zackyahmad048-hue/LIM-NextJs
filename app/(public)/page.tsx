// app/(public)/page.tsx
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PrayerTimeWidget } from '@/components/widgets/prayer-time-widget'

// ==========================================
// TIPE DATA
// ==========================================
interface StatItem {
  label: string
  value: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  slug: string
}

// ==========================================
// MOCK DATA
// ==========================================
const stats: StatItem[] = [
  { label: 'Pengurus Wilayah', value: '34' },
  { label: 'Pengurus Cabang', value: '514' },
  { label: 'Guru Bantu Aktif', value: '1,200+' },
  { label: 'Lembaga Mitra', value: '850+' },
]

const latestArticles: Article[] = [
  {
    id: '1',
    title: 'Pentingnya Wajib Khidmah dalam Mencetak Generasi Rabbani',
    excerpt: 'Program Wajib Khidmah bukan sekadar penugasan, melainkan sarana pengabdian dan pendalaman ilmu...',
    category: 'Wajib Khidmah',
    publishedAt: '15 Nov 2026',
    slug: 'pentingnya-wajib-khidmah',
  },
  {
    id: '2',
    title: 'Hasil Ijtima\' Lajnah Falak LIM: Penetapan Awal Ramadhan',
    excerpt: 'Berdasarkan hisab Tashilul Amtsilah dan kriteria yang ditetapkan, berikut adalah hasil penetapan...',
    category: 'Digital Falak',
    publishedAt: '10 Nov 2026',
    slug: 'penetapan-awal-ramadhan',
  },
  {
    id: '3',
    title: 'Panduan Lengkap Pengajuan Permohonan Guru Bantu via Portal',
    excerpt: 'Mempermudah lembaga eksternal dalam mengajukan permohonan guru bantu dengan sistem terintegrasi...',
    category: 'Panduan',
    publishedAt: '05 Nov 2026',
    slug: 'panduan-permohonan-guru-bantu',
  },
]

// ==========================================
// HALAMAN BERANDA
// ==========================================
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ==========================================
          SECTION 1: HERO (Teks Kiri, Widget Kanan)
      ========================================== */}
      <section className="relative overflow-hidden bg-surface py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            
            {/* KOLOM KIRI: Teks & CTA */}
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 text-primary">
                Platform Resmi LIM Pondok Pesantren Lirboyo
              </Badge>
              
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">
                Digitalisasi Organisasi <br className="hidden sm:block" />
                <span className="text-primary">yang Terstruktur & Akuntabel</span>
              </h1>
              
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-text-muted lg:mx-0">
                Ekosistem data terpadu untuk manajemen persuratan, Wajib Khidmah, Safari Ramadan, 
                dan layanan Digital Falak sesuai amanat PKO MUNAS II 2025.
              </p>
              
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link href="/login">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    Masuk ke Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/falak">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>

            {/* KOLOM KANAN: Widget Jadwal Shalat */}
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <PrayerTimeWidget />
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: STATISTIK LIM
      ========================================== */}
      <section className="border-y border-border bg-surface-muted py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: ARTIKEL TERBARU
      ========================================== */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                Artikel & Pengumuman Terbaru
              </h2>
              <p className="mt-2 text-text-muted">
                Informasi terkini seputar aktivitas dan kebijakan LIM.
              </p>
            </div>
            <Link href="/artikel">
              <Button variant="ghost" className="group">
                Lihat Semua Artikel
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <Link key={article.id} href={`/artikel/${article.slug}`} className="group block">
                <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {article.category}
                      </Badge>
                      <time className="text-xs text-text-subtle">{article.publishedAt}</time>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg font-semibold text-text transition-colors group-hover:text-primary">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 text-text-muted">
                      {article.excerpt}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: FINAL CTA
      ========================================== */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Siap Mengelola Organisasi dengan Lebih Baik?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Bergabunglah dengan ekosistem digital LIM untuk tata kelola yang lebih efisien, 
            transparan, dan terukur di seluruh tingkatan.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="bg-surface text-text hover:bg-surface-muted">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}