'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { buildBreadcrumbs } from '@/components/layout/breadcrumb-trail'

// Tidak tampil di halaman Ringkasan (hanya satu level).
export function Breadcrumbs() {
  const items = buildBreadcrumbs(usePathname())
  if (items.length < 2) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${index}-${item.label}`} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0" />}
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="rounded-sm underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
