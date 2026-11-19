// src/components/layout/public-navbar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

// Konfigurasi menu navigasi (single source of truth)
const navigationItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Artikel', href: '/artikel' },
  { label: 'Jadwal Shalat', href: '/falak' },
  { label: 'Verifikasi Surat', href: '/verifikasi' },
  { label: 'Tentang', href: '/tentang' },
] as const

// '/' aktif hanya persis; rute lain aktif juga untuk turunannya (mis. /artikel/judul).
function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function PublicNavbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="LIM Digital - Beranda"
        >
          <Image
            src="/logo_lim.svg"
            alt=""
            width={40}
            height={44}
            unoptimized
            className="rounded-md"
          />
          <div className="hidden flex-col sm:flex">
            <span className="text-xs text-muted-foreground">
              Lembaga
            </span>
            <span className="text-base font-semibold tracking-tight text-primary">
              Ittihadul Muballighin
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {navigationItems.map((item) => {
            const isActive = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 lg:px-4',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {/* Penanda halaman aktif berpindah mengikuti navigasi */}
                {isActive && (
                  <motion.span
                    layoutId="public-nav-active"
                    aria-hidden
                    className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary lg:inset-x-4"
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop: satu tombol masuk */}
        <div className="hidden items-center md:flex">
          <Link href="/login" className={buttonVariants({ size: 'sm' })}>
            Masuk
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Buka menu navigasi"
                className="h-10 w-10 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-70 sm:w-[320px]">
            <SheetHeader className="border-b border-border pb-4">
              <SheetTitle className="flex items-center gap-3 text-left">
                <Image
                  src="/logo_lim.svg"
                  alt=""
                  width={36}
                  height={40}
                  unoptimized
                  className="rounded-md"
                />
                <span className="text-base font-semibold">Menu</span>
              </SheetTitle>
            </SheetHeader>

            {/* Mobile Navigation */}
            <nav className="mt-6 flex flex-col gap-1 px-3" aria-label="Navigasi mobile">
              {navigationItems.map((item) => {
                const isActive = isActivePath(pathname, item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile: satu tombol masuk */}
            <div className="mt-auto border-t border-border p-3 pt-6">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(buttonVariants(), 'w-full')}
              >
                Masuk
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}