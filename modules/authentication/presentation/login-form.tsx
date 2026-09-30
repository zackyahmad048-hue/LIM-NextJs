"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff } from "lucide-react";
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
import { SmoothInput } from "@/components/ui/skiper-ui/skiper106";

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
    router.push("/cms");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-xs font-medium"
        >
          Email
        </label>
        <SmoothInput
          id="login-email"
          {...register("email")}
          type="text"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          placeholder="admin@email.com"
          wrapperClassName="p-0"
          className="h-9 rounded-full border border-input bg-background px-3 text-xs placeholder:text-muted-foreground"
        />
        {errors.email && (
          <p id="login-email-error" className="mt-1 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-xs font-medium"
        >
          Password
        </label>
        <div className="relative">
          <SmoothInput
            id="login-password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            placeholder="********"
            wrapperClassName="p-0"
            className="h-9 rounded-full border border-input bg-background px-3 pr-9 text-xs placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors focus:text-primary"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="mt-1 text-xs text-destructive">
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

      <motion.button
        whileTap={{ scale: PRESS_SCALE }}
        whileHover={{ scale: 1.01 }}
        type="submit"
        disabled={isSubmitting}
        className="mt-5 flex h-10 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <motion.div
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
      </motion.button>
    </form>
  );
}
