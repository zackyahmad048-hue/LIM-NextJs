"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import AuroraBackground from "@/components/motion/aurora-background";
import LoginForm from "@/modules/authentication/presentation/login-form";
import { EASE_OUT } from "@/lib/ease";

export default function LoginPage() {
  return (
    <main className="login-aurora relative flex min-h-dvh min-w-full flex-col items-center justify-center px-4 py-10">
      <AuroraBackground
        colors={["#7C2D12", "#C2410C", "#F59E0B"]}
        autoIntensity={1.2}
      />

      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <Card className="overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-card-bg)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5),var(--glass-highlight)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]">
            <CardContent className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
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

                <h1 className="mt-3 font-display text-2xl font-medium text-balance text-card-foreground">
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE_OUT }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          © 2026 Sekretariat Lembaga Ittihadul Muballighin
        </motion.p>
      </div>
    </main>
  );
}