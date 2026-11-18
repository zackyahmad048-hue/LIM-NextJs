'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Alur sesingkat mungkin: password → OTP. Secret & backup code dilipat di <details>.
export default function MfaSetup({ enabled, callbackUrl }: { enabled: boolean; callbackUrl?: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [totpURI, setTotpURI] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function activate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const res = await authClient.twoFactor.enable({ password })
    setLoading(false)
    if (res.error) return setMsg(res.error.message ?? 'Gagal mengaktifkan MFA')
    if (res.data && 'totpURI' in res.data) {
      setTotpURI(res.data.totpURI)
      setBackupCodes(res.data.backupCodes ?? [])
      return
    }
    setMsg('Metode MFA tidak didukung di UI ini.')
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const res = await authClient.twoFactor.verifyTotp({ code })
    setLoading(false)
    if (res.error) return setMsg(res.error.message ?? 'Kode OTP salah')
    router.push(callbackUrl || '/dashboard')
    router.refresh()
  }

  if (enabled) {
    return (
      <p className="text-sm">
        MFA sudah aktif.{' '}
        <Button variant="link" className="h-auto p-0" onClick={() => router.push(callbackUrl || '/dashboard')}>
          Lanjut
        </Button>
      </p>
    )
  }

  if (!totpURI) {
    return (
      <form onSubmit={activate} className="max-w-sm space-y-3">
        <p className="text-sm text-muted-foreground">Masukkan password untuk mengaktifkan MFA.</p>
        <div className="space-y-2">
          <Label htmlFor="mfa-password">Password</Label>
          <Input
            id="mfa-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading || !password}>
          {loading ? 'Memproses...' : 'Aktifkan MFA'}
        </Button>
        {msg && <p className="text-sm text-destructive">{msg}</p>}
      </form>
    )
  }

  return (
    <form onSubmit={verify} className="max-w-sm space-y-3">
      <p className="text-sm text-muted-foreground">Masukkan kode 6 digit dari aplikasi authenticator.</p>
      <details className="rounded-md border p-2 text-xs">
        <summary className="cursor-pointer">Secret / URI</summary>
        <code className="mt-2 block break-all">{totpURI}</code>
      </details>
      {backupCodes.length > 0 && (
        <details className="rounded-md border p-2 text-xs">
          <summary className="cursor-pointer">Kode cadangan</summary>
          <pre className="mt-2 whitespace-pre-wrap">{backupCodes.join('\n')}</pre>
        </details>
      )}
      <div className="space-y-2">
        <Label htmlFor="mfa-code">Kode OTP</Label>
        <Input
          id="mfa-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          autoFocus
        />
      </div>
      <Button type="submit" disabled={loading || code.length < 6}>
        {loading ? 'Memverifikasi...' : 'Verifikasi'}
      </Button>
      {msg && <p className="text-sm text-destructive">{msg}</p>}
    </form>
  )
}
