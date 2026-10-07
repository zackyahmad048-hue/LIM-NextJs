"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useReducer } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/modules/authentication/presentation/login-form";
import { EASE_OUT } from "@/lib/ease";

export default function LoginStage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [state, dispatch] = useReducer(
    (
      prev: { exiting: boolean; shakeKey: number },
      action: { type: "error" | "exit" },
    ) =>
      action.type === "error"
        ? { ...prev, shakeKey: prev.shakeKey + 1 }
        : { ...prev, exiting: true },
    { exiting: false, shakeKey: 0 },
  );

  const handleSuccess = () => {
    dispatch({ type: "exit" });
    setTimeout(
      () => router.push("/admin"),
      reduced ? 0 : 250,
    );
  };

  return (
    <motion.div
      className="w-full"
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={
        state.exiting
          ? { opacity: 0, scale: 0.98, y: -8 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={
        state.exiting
          ? { duration: 0.25, ease: EASE_OUT }
          : { duration: 0.6, ease: EASE_OUT }
      }
    >
      <motion.div
        key={state.shakeKey}
        initial={false}
        animate={
          state.shakeKey > 0 && !reduced && !state.exiting
            ? { x: [0, -6, 6, -4, 4, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.3 }}
      >
        <Card className="glass rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="mb-5 text-center">
              <Image
                src="/images/orangelim.png"
                alt="Logo Lembaga Ittihadul Muballighin"
                width={48}
                height={48}
                priority
                className="mx-auto"
              />

              <h1 className="mt-3 font-heading text-2xl font-medium text-balance text-card-foreground">
                Admin Gateway
              </h1>

              <p className="mt-1.5 font-data text-[11px] uppercase text-muted-foreground">
                Lembaga Ittihadul Muballighin
              </p>
            </div>

            <LoginForm
              onError={() => dispatch({ type: "error" })}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
