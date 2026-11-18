// src/components/layout/public-footer.tsx
import Link from 'next/link'
import Image from 'next/image'

// 'use cache' agar new Date() legal saat prerender; tahun ikut naik saat cache ter-revalidate
async function Copyright() {
  'use cache'
  const year = new Date().getFullYear()
  return (
    <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
      &copy; {year} Lembaga Ittihadul Muballighin Pondok Pesantren
      Lirboyo. Hak cipta dilindungi undang-undang.
    </div>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo_lim.svg"
                alt=""
                width={36}
                height={40}
                unoptimized
                className="rounded-md"
              />
              <span className="text-base font-semibold text-foreground">
                LIM Digital Platform
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Menegakkan Ajaran Islam Ahlu as-Sunnah wa al-Jama&apos;ah melalui
              digitalisasi organisasi yang terstruktur, transparan, dan
              akuntabel.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/artikel"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Portal Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/falak"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Jadwal Shalat
                </Link>
              </li>
              <li>
                <Link
                  href="/verifikasi"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Verifikasi Surat
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Tentang LIM
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Kontak</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Pondok Pesantren Lirboyo</li>
              <li>Kota Kediri, Jawa Timur</li>
              <li>
                <a
                  href="mailto:info@lim.or.id"
                  className="transition-colors hover:text-primary"
                >
                  info@lim.or.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <Copyright />
      </div>
    </footer>
  )
}