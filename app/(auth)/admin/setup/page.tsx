"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAdmin, type CreateAdminResult } from "@/actions/create-admin";
import { EASE_OUT } from "@/lib/ease";

const initialState: CreateAdminResult = { ok: true, message: "" };

export default function SetupPage() {
  const [state, formAction, pending] = useActionState(
    createAdmin,
    initialState,
  );

  const reduced = useReducedMotion();

  return (
    <main className="login-aurora relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <Card className="overflow-hidden border border-(--glass-border) bg-(--glass-card-bg) shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5),var(--glass-highlight)] backdrop-blur-(--glass-blur) backdrop-saturate-(--glass-saturate)">
            <CardContent className="p-6 text-center">
              <Image
                src="/images/orangelim.png"
                alt="Logo Lembaga Ittihadul Muballighin"
                width={48}
                height={48}
                priority
                className="mx-auto"
              />

              <h1 className="mt-3 font-display text-2xl font-medium text-balance text-card-foreground">
                Buat Admin Pertama
              </h1>

              <p className="mt-1.5 font-data text-[11px] uppercase text-muted-foreground">
                Setup Awal Platform
              </p>

              <form action={formAction} className="mt-5 space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  Akun dibuat dari{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-data text-xs">
                    ADMIN_EMAIL
                  </code>{" "}
                  dan{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-data text-xs">
                    ADMIN_PASSWORD
                  </code>{" "}
                  pada file .env
                </p>

                {state.message && (
                  <p
                    role="alert"
                    className={`rounded-md border px-3 py-2 text-xs ${
                      state.ok
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : "border-destructive/30 bg-destructive/5 text-destructive"
                    }`}
                  >
                    {state.message}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={pending}
                  className="h-10 w-full"
                >
                  {pending ? "Membuat..." : "Buat Admin Pertama"}
                </Button>
              </form>

              <Link
                href="/admin/login"
                className="mt-4 inline-block text-xs font-medium text-primary transition hover:opacity-80"
              >
                Sudah punya akun? Login
              </Link>
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
