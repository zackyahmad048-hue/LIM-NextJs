"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import AuroraBackground from "@/components/motion/aurora-background";
import LoginForm from "@/modules/authentication/presentation/login-form";

export default function LoginPage() {
  return (
    <main className="login-aurora relative flex min-h-screen min-w-full flex-col items-center justify-center px-4 py-10">
      <AuroraBackground colors={["#7C2D12", "#C2410C", "#F59E0B"]} autoIntensity={1.2} />

      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            type: "spring",
            stiffness: 80,
            damping: 20,
          }}
        >
          <Card className="border-border/10 bg-card shadow-[0_24px_60px_-24px] shadow-black/20">
            <CardContent className="p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-4 text-center"
              >
                <Image
                  src="/images/orangelim.png"
                  alt="Logo Lembaga Ittihadul Muballighin"
                  width={52}
                  height={52}
                  priority
                  className="mx-auto"
                />

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-card-foreground">
                  Admin Gateway
                </h1>

                <p className="mt-1.5 text-xs text-muted-foreground">
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
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center text-sm text-muted-foreground"
        >
          © 2026 Sekretariat Lembaga Ittihadul Muballighin
        </motion.p>
      </div>
    </main>
  );
}
