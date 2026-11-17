'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  return (
    <button
      className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        await authClient.signOut()
        router.push('/login')
        router.refresh()
      }}
    >
      {pending ? 'Keluar…' : 'Keluar'}
    </button>
  )
}
