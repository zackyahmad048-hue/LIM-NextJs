'use client'

import { motion, type Variants } from 'framer-motion'

// Satu urutan masuk untuk hero: elemen naik sedikit dan muncul bergiliran, sekali saat halaman dimuat.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div data-motion variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div data-motion variants={item} className={className}>
      {children}
    </motion.div>
  )
}
