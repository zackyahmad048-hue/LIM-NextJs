"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PRESS_SCALE } from "@/lib/ease";

import { authClient } from "@/modules/authentication/infrastructure/better-auth-client";
import {
  loginSchema,
  type LoginSchema,
} from "@/modules/authentication/validators/login.schema";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Selamat datang kembali.");
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
      <h2 className="text-center text-xl font-semibold text-balance text-foreground">
        Masuk
      </h2>

      <p className="mt-1.5 text-center text-xs text-muted-foreground">
        Silakan masuk menggunakan akun administrator.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium">Email</label>

          <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Mail size={15} className="mr-2.5 shrink-0 text-muted-foreground" />

            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              placeholder="admin@email.com"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium">Password</label>

          <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Lock size={15} className="mr-2.5 shrink-0 text-muted-foreground" />

            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              placeholder="********"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 rounded-md p-1 text-muted-foreground transition hover:text-primary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="rounded border-input" />
            Ingat Saya
          </label>

          <Link
            href="#"
            className="text-xs font-medium text-primary hover:opacity-80"
          >
            Lupa Password?
          </Link>
        </div>

        <motion.button
          whileTap={{ scale: PRESS_SCALE }}
          whileHover={{ scale: 1.01 }}
          type="submit"
          disabled={isSubmitting}
          className="mt-5 flex h-10 w-full items-center justify-center rounded-md bg-orange-500 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "linear",
              }}
              className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
            />
          ) : (
            "Masuk ke Dashboard"
          )}
        </motion.button>
      </form>
    </div>
  );
}
