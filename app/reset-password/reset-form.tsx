// app/reset-password/reset-form.tsx
// Token datang dari tautan email (redirect better-auth: /reset-password?token=…)
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { Lock, ArrowLeft, ArrowRight, CircleCheck, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'

const container: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export function FormulirReset({ token, error }: { token?: string; error?: string }) {
  const [password, setPassword] = useState('')
  const [konfirmasi, setKonfirmasi] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sukses, setSukses] = useState(false)

  const tokenTidakValid = !token || error === 'INVALID_TOKEN'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!token) {
      toast.error('Tautan tidak valid', { description: 'Minta tautan reset yang baru.' })
      return
    }

    // Batas sama dengan konfigurasi better-auth (min 8, maks 128)
    if (password.length < 8 || password.length > 128) {
      toast.error('Password tidak valid', { description: 'Password harus 8–128 karakter.' })
      return
    }
    if (password !== konfirmasi) {
      toast.error('Password tidak cocok', { description: 'Kedua isian password berbeda.' })
      return
    }

    setIsLoading(true)
    try {
      const { data, error: gagal } = await authClient.resetPassword({ token, newPassword: password })

      if (gagal || !data?.status) {
        toast.error('Gagal mengatur ulang', {
          description: gagal?.message || 'Tautan mungkin sudah dipakai atau kedaluwarsa.',
        })
        return
      }
      setSukses(true)
    } catch {
      toast.error('Terjadi kesalahan', {
        description: 'Silakan coba lagi dalam beberapa saat.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Pojok kiri atas: kembali ke beranda */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute left-4 top-4 sm:left-6 sm:top-6"
      >
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          title="Kembali ke beranda"
          className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-md">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="space-y-3 text-center">
            <motion.div variants={item} className="flex justify-center">
              <Image
                src="/logo_lim.svg"
                alt="Logo Lembaga Ittihadul Muballighin"
                width={64}
                height={70}
                priority
                unoptimized
                className="rounded-lg"
              />
            </motion.div>
            <motion.div variants={item}>
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                Atur Ulang Password
              </CardTitle>
              <CardDescription className="mt-1 text-muted-foreground">
                Buat password baru untuk akun Anda.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            {tokenTidakValid ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-4 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Tautan tidak valid</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tautan reset tidak valid atau sudah kedaluwarsa. Minta tautan baru untuk
                    melanjutkan.
                  </p>
                </div>
                <Link
                  href="/lupa-password"
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  Minta Tautan Baru
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ) : sukses ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-4 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CircleCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Password berhasil diubah</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Masuk dengan password baru Anda untuk melanjutkan.
                  </p>
                </div>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  Masuk
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password Baru
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      maxLength={128}
                      disabled={isLoading}
                      className="pl-9 transition-colors duration-150 focus:border-primary"
                      autoComplete="new-password"
                    />
                  </div>
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="konfirmasi" className="text-sm font-medium text-foreground">
                    Konfirmasi Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="konfirmasi"
                      type="password"
                      placeholder="Ulangi password baru"
                      value={konfirmasi}
                      onChange={(e) => setKonfirmasi(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-9 transition-colors duration-150 focus:border-primary"
                      autoComplete="new-password"
                    />
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={isLoading}
                    className="w-full transition-all duration-150 hover:brightness-105 active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Simpan Password Baru
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </CardContent>
        </Card>

        <motion.p variants={item} className="mt-6 text-center text-xs text-muted-foreground">
          Dilindungi oleh sistem keamanan LIM Digital Platform.
        </motion.p>
      </motion.div>
    </div>
  )
}
