"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Transisi antarrute — wrapper `template.tsx` di layout publik & admin.
 * `template` di-remount oleh Next saat navigasi, jadi fade+slide singkat
 * menyambut tiap halaman tanpa state yang hilang. Reduced-motion dihormati.
 */
export default function PageTransition({ children, className }: PageTransitionProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={reduced ? undefined : { duration: 0.4, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}