'use client'

import { motion } from 'framer-motion'

// Tanda centang yang tergambar sekali saat hasil verifikasi muncul — jawaban atas aksi pengguna.
export function VerifiedMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-8 text-success" fill="none" role="img" aria-label="Terverifikasi">
      {/* pathLength hanya bermakna pada <path>, bukan <circle>. Lingkaran digambar sebagai path. */}
      <motion.path
        data-motion
        d="M 2 12 a 10 10 0 1 1 20 0 a 10 10 0 1 1 -20 0"
        stroke="currentColor"
        strokeWidth="1.75"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
      <motion.path
        data-motion
        d="M7.5 12.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.35, ease: 'easeOut' }}
      />
    </svg>
  )
}
