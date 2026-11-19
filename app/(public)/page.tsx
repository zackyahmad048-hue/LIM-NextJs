// app/(public)/page.tsx
import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PrayerTimeWidget } from '@/components/widgets/prayer-time-widget'
import { StarLattice } from '@/components/layout/star-lattice'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { listPublishedArticles } from '@/modules/cms/presentation/queries/list-articles.query'

// Layanan yang bisa dipakai tanpa akun — setiap rute di bawah ini adalah halaman publik yang nyata.
const publicServices = [
  {
    href: '/falak',
    title: 'Jadwal shalat dan arah kiblat',
    description:
      "Waktu shalat harian dan arah kiblat untuk lokasi Anda, dalam waktu standar atau waktu istiwa'.",
  },
  {
    href: '/verifikasi',
    title: 'Verifikasi surat',
    description: 'Masukkan kode pada QR di lembar surat untuk melihat nomor, perihal, pengirim, dan status surat.',
  },
  {
    href: '/artikel',
    title: 'Artikel',
    description: 'Tulisan dan pengumuman dari LIM yang sudah dipublikasikan.',
  },
] as const

async function LatestArticles() {
  const articles = await listPublishedArticles(3)

  if (articles.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada artikel yang dipublikasikan.</p>
  }

  return (
    <ul className="grid gap-x-8 gap-y-10 md:grid-cols-3">
      {articles.map((article) => {
        const tanggal = new Date(article.publishedAt ?? article.createdAt)
        return (
          <li key={article.id} className="border-t border-border pt-4">
            <time dateTime={tanggal.toISOString()} className="text-sm text-muted-foreground">
              {tanggal.toLocaleDateString('id-ID', { dateStyle: 'long' })}
            </time>
            <h3 className="mt-2 text-lg leading-snug font-semibold text-balance">
              <Link
                href={`/artikel/${article.slug}`}
                className="underline-offset-4 outline-none hover:underline focus-visible:underline"
              >
                {article.title}
              </Link>
            </h3>
            {article.excerpt && (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function LatestArticlesSkeleton() {
  return (
    <div aria-hidden className="grid gap-x-8 gap-y-10 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 border-t border-border pt-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-5 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      {/* Hero: jadwal shalat adalah isi utama, bukan hiasan di samping slogan */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 text-primary/[0.08] [mask-image:radial-gradient(ellipse_70%_80%_at_85%_15%,black,transparent)]">
          <StarLattice />
        </div>

        <Stagger className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <StaggerItem>
              <h1 className="max-w-xl text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
                Portal resmi Lembaga Ittihadul Muballighin
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Jadwal shalat harian, pemeriksaan surat resmi lewat kode QR, dan kabar terbaru dari pengurus LIM
                Pondok Pesantren Lirboyo.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/falak" className={buttonVariants({ size: 'lg' })}>
                  Lihat jadwal lengkap
                </Link>
                <Link href="/verifikasi" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                  Periksa surat
                </Link>
              </div>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 text-sm text-muted-foreground">
                Pengurus LIM?{' '}
                <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                  Masuk ke dashboard
                </Link>
              </p>
            </StaggerItem>
          </div>
          <StaggerItem className="flex justify-center lg:justify-end">
            <PrayerTimeWidget />
          </StaggerItem>
        </Stagger>
      </section>

      {/* Layanan publik */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Layanan yang terbuka untuk umum
          </h2>
          <p className="mt-3 max-w-sm text-muted-foreground">Tidak perlu akun untuk tiga layanan ini.</p>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {publicServices.map((service) => (
            <li key={service.href}>
              <Link href={service.href} className="group flex items-start justify-between gap-6 py-6 outline-none focus-visible:bg-muted/60">
                <div>
                  <h3 className="text-lg font-medium underline-offset-4 group-hover:underline">{service.title}</h3>
                  <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <ArrowUpRight
                  aria-hidden
                  className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Artikel terbaru — data nyata dari CMS */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Artikel terbaru</h2>
            <Link href="/artikel" className="text-sm font-medium underline underline-offset-4">
              Semua artikel
            </Link>
          </div>
          <div className="mt-10">
            <Suspense fallback={<LatestArticlesSkeleton />}>
              <LatestArticles />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
