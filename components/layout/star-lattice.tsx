import { useId } from 'react'
import { cn } from '@/lib/utils'

// Pola bintang delapan sudut (dua persegi bersilang) — motif geometris yang lazim pada
// ornamen masjid dan kitab. Digambar dengan garis tipis sehingga tetap tenang di balik teks.
// Dekoratif saja: aria-hidden, warna mengikuti `currentColor`.
export function StarLattice({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg aria-hidden="true" className={cn('pointer-events-none absolute inset-0 size-full', className)}>
      <defs>
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="12" y="12" width="24" height="24" />
            <rect x="12" y="12" width="24" height="24" transform="rotate(45 24 24)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
