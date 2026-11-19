'use client'

import { useEffect, useState } from 'react'

// Waktu sekarang yang diperbarui berkala. null di render pertama agar hidrasi server/klien sama.
export function useNow(intervalMs: number): Date | null {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
