// components/dashboard/module-card.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MoreHorizontal, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface ModuleCardProps {
  title: string
  description: string
  status: { label: string; tone: 'success' | 'warning' | 'error' | 'info' }
  stats: { label: string; value: string }[]
  progress: { color: string; width: string }[]
  href: string
  delay?: number
}

const TONE_STYLES: Record<ModuleCardProps['status']['tone'], string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
}

export function ModuleCard({ title, description, status, stats, progress, href, delay = 0 }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      {/* Header kartu */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" size="icon" className="-mr-2 -mt-1 h-8 w-8 text-muted-foreground" aria-label={`Opsi ${title}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Status badge */}
      <div className="mt-3">
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', TONE_STYLES[status.tone])}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {status.label}
        </span>
      </div>

      {/* Mini stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted p-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline progress */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Minggu ini</span>
          <span>Senin – Ahad</span>
        </div>
        <div className="flex gap-1">
          {progress.map((p, i) => (
            <div key={i} className={cn('h-1.5 rounded-full', p.color)} style={{ width: p.width }} />
          ))}
        </div>
      </div>

      {/* Aksi */}
      <div className="mt-5 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Laporan
        </Button>
        <Button size="sm" render={<Link href={href} />} className="flex-1">
          Buka
          <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  )
}
