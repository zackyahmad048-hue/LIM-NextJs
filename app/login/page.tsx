// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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

// Transisi kartu: naik + fade sekali, anak-anak menyusul bergiliran (lembut, "Tenang Modern")
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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      })

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
        // Redirect ke dashboard setelah login sukses
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

      {/* Kartu masuk */}
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
                Masuk ke Dashboard
              </CardTitle>
              <CardDescription className="mt-1 text-muted-foreground">
                Masukkan kredensial Anda untuk mengakses sistem LIM Digital.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
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

              {/* Password */}
              <motion.div variants={item} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <a
                    href="/lupa-password"
                    className="text-xs font-medium text-primary transition-opacity hover:opacity-80"
                  >
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-9 transition-colors duration-150 focus:border-primary"
                    autoComplete="current-password"
                  />
                </div>
              </motion.div>

              {/* Tombol masuk */}
              <motion.div variants={item}>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-primary transition-opacity hover:opacity-80">
            Daftar di sini
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
