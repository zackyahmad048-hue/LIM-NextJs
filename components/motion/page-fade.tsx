'use client'

import { motion } from 'framer-motion'

// Dipakai di app/(public)/template.tsx: konten halaman memudar masuk saat berpindah rute.
// Navbar dan footer ada di layout sehingga tidak ikut berkedip.
export function PageFade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      data-motion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
