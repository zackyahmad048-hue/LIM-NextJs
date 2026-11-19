// app/(public)/layout.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PublicNavbar } from '@/components/layout/public-navbar'
import { PublicFooter } from '@/components/layout/public-footer'
import { MotionProvider } from '@/components/motion/motion-provider'

export const metadata: Metadata = {
  title: {
    default: 'LIM Digital Platform — Pondok Pesantren Lirboyo',
    template: '%s | LIM Digital',
  },
  description:
    'Platform digital terintegrasi untuk ekosistem data, layanan, dan tata kelola organisasi Lembaga Ittihadul Muballighin (LIM) Pondok Pesantren Lirboyo.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotionProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {/* Tanpa JavaScript elemen animasi tidak boleh tersembunyi */}
        <noscript>
          <style>{'[data-motion]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <Suspense fallback={<header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-background/80" />}>
          <PublicNavbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </MotionProvider>
  )
}