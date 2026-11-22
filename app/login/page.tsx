// app/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

// Latar: Unsplash photo-1519681393784-d120267933ba, sudah diblur di CDN (blur=80) → 31 KB, tanpa filter runtime.

export default function LoginPage() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const container: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0.01 }
        : { duration: 0.45, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.07, delayChildren: 0.08 },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0.01 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await authClient.signIn.email({ email, password, rememberMe })

      if (error) {
        toast.error('Gagal masuk', {
          description: error.message || 'Periksa kembali email dan password Anda.',
        })
        return
      }

      if (data?.user) {
        toast.success('Berhasil masuk', {
          description: `Selamat datang kembali, ${data.user.name || 'Ustadz'}!`,
        })
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan', {
        description: 'Silakan coba lagi dalam beberapa saat.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-[oklch(0.18_0.02_275)]"
      >
        <Image
          src="/login-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.147 0.004 49.3 / 0.55), oklch(0.147 0.004 49.3 / 0.35))',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.553 0.195 38.402 / 0.12), transparent 70%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduceMotion ? { duration: 0.01 } : { duration: 0.35, ease: 'easeOut' }}
        className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6"
      >
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        </Link>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[420px]"
      >
        <Card className="rounded-3xl border border-white/60 bg-card/50 shadow-[inset_0_1px_0_oklch(1_0_0/0.5),0_24px_70px_-24px_oklch(0.147_0.004_49.3/0.45)] ring-0 backdrop-blur-[30px] backdrop-saturate-150 supports-[backdrop-filter]:bg-card/42 dark:border-white/12 dark:bg-card/38 dark:shadow-[inset_0_1px_0_oklch(1_0_0/0.12),0_24px_70px_-24px_oklch(0_0_0/0.6)]">
          <CardHeader className="space-y-4 text-center">
            <motion.div variants={item} className="flex justify-center">
              <Image
                src="/logo_lim.svg"
                alt="Logo Lembaga Ittihadul Muballighin"
                width={64}
                height={71}
                priority
                unoptimized
                className="rounded-xl"
              />
            </motion.div>
            <motion.div variants={item} className="space-y-1.5">
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                Masuk ke Dashboard
              </CardTitle>
              <CardDescription className="text-foreground/80">
                Masukkan kredensial Anda untuk mengakses sistem LIM Digital.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@lim.or.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    inputMode="email"
                    className="h-11 rounded-full border border-white/40 bg-white/20 pl-10 pr-4 backdrop-blur-[6px] shadow-[inset_0_1px_0_oklch(1_0_0/0.3)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-foreground/70 focus-visible:bg-white/30 dark:border-white/10 dark:bg-white/5 dark:focus-visible:bg-white/10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="h-11 rounded-full border border-white/40 bg-white/20 pl-10 pr-12 backdrop-blur-[6px] shadow-[inset_0_1px_0_oklch(1_0_0/0.3)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-foreground/70 focus-visible:bg-white/30 dark:border-white/10 dark:bg-white/5 dark:focus-visible:bg-white/10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label="Tampilkan password"
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 h-full w-11 rounded-full px-0 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="h-4 w-4" />
                    ) : (
                      <Eye aria-hidden="true" className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="cursor-pointer text-sm font-normal text-foreground/85"
                  >
                    Ingat saya
                  </Label>
                </div>
                <Link
                  href="/lupa-password"
                  className="rounded-sm text-xs font-medium text-foreground underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Lupa password?
                </Link>
              </motion.div>

              <motion.div variants={item} className="pt-1">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="h-11 w-full rounded-full text-sm font-semibold shadow-[inset_0_1px_0_oklch(1_0_0/0.22),0_8px_20px_-8px_oklch(0.553_0.195_38.402/0.55)]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        <motion.p variants={item} className="mt-6 text-center text-sm text-white/70">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="rounded-sm font-medium text-white transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Daftar di sini
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
