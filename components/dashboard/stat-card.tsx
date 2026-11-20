// components/dashboard/stat-card.tsx
'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  title: string
  value: string | number
  trend?: {
    value: string
    isPositive: boolean
  }
  /** Elemen JSX, bukan tipe komponen: Server Component tidak boleh mengirim fungsi ke Client Component. */
  icon: ReactNode
  className?: string
}

export function StatCard({ title, value, trend, icon, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-semibold tracking-tight text-foreground">{value}</h3>

          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex items-center text-xs font-semibold',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-xs text-muted-foreground">vs periode lalu</span>
            </div>
          )}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
