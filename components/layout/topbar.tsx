import Link from 'next/link'
import { SignOutButton } from '@/components/layout/sign-out-button'
import type { Role } from '@/generated/client'

export function Topbar({ email, role }: { email: string; role: Role }) {
  return (
    <header className="flex items-center justify-between border-b bg-background p-4">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="text-sm font-semibold md:hidden">LIM</Link>
        <span className="text-sm text-muted-foreground">{email}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline">{role}</span>
        <SignOutButton />
      </div>
    </header>
  )
}
