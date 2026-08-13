"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/ease";

export function SuccessScreen() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      className="mx-auto max-w-md py-12 text-center"
    >
      <motion.div
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
      >
        <CheckCircle2 className="size-8" />
      </motion.div>

      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.2 }}
        className="mt-6 font-display text-2xl font-semibold text-foreground"
      >
        Permohonan Berhasil Dikirim
      </motion.h2>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.3 }}
        className="mt-3 text-sm leading-6 text-muted-foreground"
      >
        Terima kasih telah mengajukan permohonan guru bantu. Data permohonan
        telah kami terima dan akan ditinjau oleh Tim Wajib Khidmah.
      </motion.p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.4 }}
        className="mt-8"
      >
        <Button variant="outline" asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
