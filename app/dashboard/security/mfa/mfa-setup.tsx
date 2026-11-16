'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function MfaSetup({ enabled, callbackUrl }: { enabled: boolean; callbackUrl?: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [totpURI, setTotpURI] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function enable() {
    setLoading(true); setMsg(null)
    const res = await authClient.twoFactor.enable({ password })
    setLoading(false)
    if (res.error) { setMsg(res.error.message ?? 'Gagal mengaktifkan MFA'); return }
    if (res.data && 'totpURI' in res.data) {
      setTotpURI(res.data.totpURI)
      setBackupCodes(res.data.backupCodes ?? [])
    } else {
      setMsg('Metode MFA tidak didukung di UI ini.')
    }
  }

  async function verify() {
    setLoading(true); setMsg(null)
    const res = await authClient.twoFactor.verifyTotp({ code })
    setLoading(false)
    if (res.error) { setMsg(res.error.message ?? 'Kode OTP salah'); return }
    setMsg('MFA aktif.')
    router.push(callbackUrl || '/dashboard')
    router.refresh()
  }

  if (enabled) {
    return <p>MFA sudah aktif untuk akun ini. <button className="underline" onClick={() => router.push(callbackUrl || '/dashboard')}>Lanjut</button></p>
  }

  return (
    <div className="space-y-4">
      {!totpURI ? (
        <div className="space-y-2">
          <p>Masukkan password untuk mengaktifkan TOTP.</p>
          <input className="border p-2 w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="border px-3 py-2" onClick={enable} disabled={loading || !password}>Aktifkan MFA</button>
        </div>
      ) : (
        <div className="space-y-2">
          <p>Scan URI/secret ini di aplikasi authenticator, lalu masukkan kode 6 digit.</p>
          <textarea className="border p-2 w-full text-xs" readOnly value={totpURI} rows={3} />
          {backupCodes.length > 0 && (
            <div><p className="font-medium">Backup codes (simpan aman):</p><pre className="border p-2 text-xs">{backupCodes.join('\n')}</pre></div>
          )}
          <input className="border p-2 w-full" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kode OTP" />
          <button className="border px-3 py-2" onClick={verify} disabled={loading || !code}>Verifikasi</button>
        </div>
      )}
      {msg && <p>{msg}</p>}
    </div>
  )
}
