'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ModuleCard } from '@/components/dashboard/module-card'

interface DashboardModule {
  title: string
  description: string
  href: string
}

interface DashboardContentProps {
  email: string
  isOwner: boolean
  modules: DashboardModule[]
}

const ease = [0.22, 1, 0.36, 1] as const

export function DashboardContent({ email, isOwner, modules }: DashboardContentProps) {
  const reduceMotion = useReducedMotion()
  const t = (delay: number) =>
    reduceMotion ? { duration: 0.01 } : { duration: 0.45, ease, delay }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0)}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {isOwner ? 'Konsol Pusat' : 'Ringkasan'}
        </h1>
        <p className="mt-1 text-sm text-white/70">Masuk sebagai {email}</p>
      </motion.div>

      <section>
        <motion.h2
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.05)}
          className="mb-4 text-lg font-semibold text-white"
        >
          Modul
        </motion.h2>
        {modules.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t(0.1)}
            className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur-[8px]"
          >
            Belum ada modul yang tersedia untuk role Anda.
          </motion.p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((card, index) => (
              <ModuleCard
                key={card.href}
                title={card.title}
                description={card.description}
                href={card.href}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
