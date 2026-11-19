'use client'

import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import type { WaktuShalat } from '@/modules/falak/domain/digital-falak'
import { fraksiSiang, posisiMatahari, type FaseHari } from '@/modules/falak/domain/posisi-matahari'
import { cn } from '@/lib/utils'

// Busur perjalanan matahari dari terbit (kiri) ke maghrib (kanan). Dzuhur dan Ashar ditandai titik;
// daftar jam di sebelahnya berfungsi sebagai legenda, jadi busur ini tanpa teks.
const LEBAR = 320
const TINGGI = 112
const PUSAT_X = LEBAR / 2
const GARIS_DASAR = 98
const RADIUS_X = 136
const RADIUS_Y = 76

function titik(fraksi: number) {
  const sudut = Math.PI * fraksi
  return { x: PUSAT_X - RADIUS_X * Math.cos(sudut), y: GARIS_DASAR - RADIUS_Y * Math.sin(sudut) }
}

const jalur = `M ${PUSAT_X - RADIUS_X} ${GARIS_DASAR} A ${RADIUS_X} ${RADIUS_Y} 0 0 1 ${PUSAT_X + RADIUS_X} ${GARIS_DASAR}`

const labelFase: Record<FaseHari, string> = {
  'sebelum-terbit': 'Matahari belum terbit',
  siang: 'Matahari sedang di atas cakrawala',
  'setelah-maghrib': 'Matahari sudah terbenam',
}

interface DayArcProps {
  waktu: WaktuShalat | null
  /** Menit sejak 00:00 pada zona jam yang ditampilkan; null sebelum jam klien tersedia. */
  menitSekarang: number | null
  className?: string
}

export function DayArc({ waktu, menitSekarang, className }: DayArcProps) {
  const kurangiGerak = useReducedMotion()
  const posisi = waktu && menitSekarang !== null ? posisiMatahari(waktu, menitSekarang) : null
  const target = posisi?.fraksi ?? 0
  const fase: FaseHari = posisi?.fase ?? 'sebelum-terbit'

  // Matahari berjalan dari terbit ke posisinya saat ini sekali saat data pertama tiba.
  const kemajuan = useMotionValue(0)
  useEffect(() => {
    if (kurangiGerak) {
      kemajuan.set(target)
      return
    }
    const kendali = animate(kemajuan, target, { duration: 1.4, ease: 'easeOut' })
    return () => kendali.stop()
  }, [target, kurangiGerak, kemajuan])

  const x = useTransform(kemajuan, (f) => titik(f).x)
  const y = useTransform(kemajuan, (f) => titik(f).y)
  const siang = fase === 'siang'

  return (
    <svg
      viewBox={`0 0 ${LEBAR} ${TINGGI}`}
      role="img"
      aria-label={posisi ? labelFase[fase] : 'Posisi matahari belum tersedia'}
      className={cn('h-auto w-full overflow-visible text-muted-foreground', className)}
    >
      <line
        x1={8}
        x2={LEBAR - 8}
        y1={GARIS_DASAR}
        y2={GARIS_DASAR}
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={1}
      />
      <path d={jalur} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="1 6" strokeLinecap="round" />
      <motion.path
        d={jalur}
        fill="none"
        className="stroke-primary"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ pathLength: kemajuan }}
      />

      {waktu &&
        (['dzuhur', 'ashar'] as const).map((kunci) => {
          const t = titik(fraksiSiang(waktu, waktu[kunci]))
          return <circle key={kunci} cx={t.x} cy={t.y} r={3} className="fill-card stroke-muted-foreground" strokeWidth={1.5} />
        })}

      <motion.circle r={14} cx={x} cy={y} className="fill-primary" fillOpacity={siang ? 0.16 : 0} />
      <motion.circle
        r={7}
        cx={x}
        cy={y}
        className={cn('stroke-primary', siang ? 'fill-primary' : 'fill-card')}
        strokeWidth={2.5}
      />
    </svg>
  )
}
