"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
    setAuthError(null);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError(error.message ?? "Gagal masuk. Periksa email dan password.");
      toast.error(error.message);
      return;
    }

    toast.success("Selamat datang kembali.");
    router.push("/admin");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="login-email">Email</Label>

        <div className="relative">
          <Mail
            size={15}
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
            placeholder="admin@email.com"
            className="h-11 rounded-md pl-9 text-base md:text-sm"
          />
        </div>

        {errors.email && (
          <p id="login-email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="login-password">Password</Label>

        <div className="relative">
          <Lock
            size={15}
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            {...register("password")}
            placeholder="********"
            className="h-11 rounded-md pl-9 pr-11 text-base md:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:text-primary"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {errors.password && (
          <p id="login-password-error" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {authError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
        >
          {authError}
        </p>
      )}

      <motion.div whileTap={{ scale: PRESS_SCALE }}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 h-11 w-full rounded-md text-sm font-semibold"
        >
          {isSubmitting ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "linear",
              }}
              className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
            />
          ) : (
            "Masuk ke Dashboard"
          )}
        </Button>
      </motion.div>
    </form>
  );
}
