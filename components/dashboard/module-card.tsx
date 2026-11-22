// components/dashboard/module-card.tsx
'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

interface ModuleCardProps {
  title: string
  description: string
  href: string
  index?: number
}

export function ModuleCard({ title, description, href, index = 0 }: ModuleCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }
      }
    >
      <Link
        href={href}
        className="group block rounded-2xl border border-white/45 bg-card/45 p-5 shadow-[inset_0_1px_0_oklch(1_0_0/0.35),0_8px_24px_-16px_oklch(0.147_0.004_49.3/0.2)] backdrop-blur-[12px] transition-[border-color,background-color,box-shadow] duration-200 hover:border-primary/30 hover:bg-card/60 hover:shadow-[inset_0_1px_0_oklch(1_0_0/0.45),0_12px_32px_-16px_oklch(0.553_0.195_38.402/0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10 dark:bg-card/35 dark:hover:bg-card/50"
      >
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </Link>
    </motion.div>
  )
}
