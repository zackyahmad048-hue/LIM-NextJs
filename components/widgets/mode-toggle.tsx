'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ModeWaktu = 'standar' | 'istiwa'

const pilihan: ReadonlyArray<{ nilai: ModeWaktu; label: string }> = [
  { nilai: 'standar', label: 'Waktu Standar' },
  { nilai: 'istiwa', label: "Waktu Istiwa'" },
]

// Pilihan waktu standar / istiwa'. Latar pilihan aktif bergeser ke tombol yang dipilih (200ms).
export function ModeToggle({
  value,
  onChange,
  className,
}: {
  value: ModeWaktu
  onChange: (mode: ModeWaktu) => void
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('flex rounded-full bg-muted p-1', className)}>
      {pilihan.map((item) => {
        const aktif = value === item.nilai
        return (
          <button
            key={item.nilai}
            type="button"
            onClick={() => onChange(item.nilai)}
            aria-pressed={aktif}
            className={cn(
              'relative flex-1 rounded-full px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40',
              aktif ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {aktif && (
              <motion.span
                layoutId={`mode-${id}`}
                aria-hidden
                className="absolute inset-0 rounded-full bg-background shadow-sm"
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
