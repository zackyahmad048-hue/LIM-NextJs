// app/lupa-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { Mail, MailCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
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

export default function LupaPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [terkirim, setTerkirim] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      })

      if (error) {
        toast.error('Gagal mengirim tautan', {
          description: error.message || 'Silakan coba lagi dalam beberapa saat.',
        })
        return
      }
      // Server selalu sukses agar keberadaan email tidak bocor (anti-enumerasi)
      setTerkirim(true)
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
                Lupa Password
              </CardTitle>
              <CardDescription className="mt-1 text-muted-foreground">
                Masukkan email Anda dan kami kirim tautan untuk mengatur ulang password.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            {terkirim ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-4 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MailCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Tautan reset telah dikirim</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Jika email terdaftar, tautan pengaturan ulang password sudah dikirim ke{' '}
                    <span className="font-medium text-foreground">{email}</span>. Periksa juga
                    folder spam Anda.
                  </p>
                </div>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  Kembali ke Masuk
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@lim.or.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-9 transition-colors duration-150 focus:border-primary"
                      autoComplete="email"
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
                        Kirim Tautan Reset
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.p
                  variants={item}
                  className="text-center text-xs text-muted-foreground"
                >
                  Sudah ingat password Anda?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-primary transition-opacity hover:opacity-80"
                  >
                    Masuk di sini
                  </Link>
                </motion.p>
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
