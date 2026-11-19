'use client'

import { MotionConfig } from 'framer-motion'

// Semua animasi transform di bawahnya otomatis dimatikan bila pengguna memilih reduced motion
// (opacity tetap berjalan sebagai pengganti — lihat docs/frontend/02.DESIGN_SYSTEM.md §6).
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
