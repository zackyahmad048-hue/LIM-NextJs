'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl')
    const res = await authClient.signIn.email({ email, password })
    setPending(false)
    if (res.error) {
      setError('Email atau password salah.')
      return
    }
    router.push(callbackUrl || '/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6">
        <div>
          <h1 className="text-xl font-semibold">Masuk</h1>
          <p className="text-sm text-muted-foreground">Platform Digital Lembaga Ittihadul Muballighin</p>
        </div>
        {error && <p role="alert" className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</p>}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm">Email</label>
            <input id="email" type="email" required autoComplete="email" className="w-full rounded-md border bg-transparent px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm">Password</label>
            <div className="relative">
              <input id="password" type={show ? 'text' : 'password'} required autoComplete="current-password" className="w-full rounded-md border bg-transparent px-3 py-2 pr-16" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-2 text-xs text-muted-foreground">{show ? 'Sembunyi' : 'Tampil'}</button>
            </div>
          </div>
          <button type="submit" disabled={pending} className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">
            {pending ? 'Memproses…' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
