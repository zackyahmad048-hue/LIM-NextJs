"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/modules/authentication/presentation/login-form";
import { EASE_OUT } from "@/lib/ease";
import { motion } from "motion/react";
import { useReducedMotion } from "motion/react";

export default function LoginPage() {
  const reduced = useReducedMotion();

  return (
    <main className="relative flex min-h-dvh min-w-full flex-col items-center justify-center px-4 py-10">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 h-150 w-150 rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-125 w-125 rounded-full bg-primary/4 blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center justify-center py-10">
        <motion.div
          className="w-full"
          initial={reduced ? false : { opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <Card className="glass overflow-hidden rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                aria-label="Kembali ke beranda"
              >
                <ArrowLeft size={14} />
                Beranda
              </Link>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT }}
                className="mb-5 text-center"
              >
                <Image
                  src="/images/orangelim.png"
                  alt="Logo Lembaga Ittihadul Muballighin"
                  width={48}
                  height={48}
                  priority
                  className="mx-auto"
                />

                <h1 className="mt-3 font-heading text-2xl font-semibold text-balance text-card-foreground">
                  Admin Gateway
                </h1>

                <p className="mt-1.5 font-data text-[11px] uppercase text-muted-foreground">
                  Lembaga Ittihadul Muballighin
                </p>
              </motion.div>

              <LoginForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <footer className="relative z-10 w-full max-w-sm pb-6">
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE_OUT }}
          className="text-center text-xs text-muted-foreground"
        >
          © 2026 Sekretariat Lembaga Ittihadul Muballighin
        </motion.p>
      </footer>
    </main>
  );
}
