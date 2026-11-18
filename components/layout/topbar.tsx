import Link from 'next/link'
import { MobileNav } from '@/components/layout/mobile-nav'
import { SignOutButton } from '@/components/layout/sign-out-button'
import { formatRoleLabel, getAccountNavGroups, getNavGroups } from '@/components/layout/nav-config'
import { ScopeIndicator } from '@/components/layout/scope-indicator'
import { Badge } from '@/components/ui/badge'
import type { UserScope } from '@/modules/authentication/application/get-user-scope'
import type { Role } from '@/generated/client'

export function Topbar({ email, role, scope }: { email: string; role: Role; scope: UserScope }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/85 px-4 backdrop-blur supports-backdrop-filter:bg-background/70 md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav groups={getNavGroups(role)} accountGroups={getAccountNavGroups(role)} />
        <Link href="/dashboard" className="text-sm font-semibold md:hidden">
          LIM Platform
        </Link>
        <span className="hidden min-w-0 truncate text-sm text-muted-foreground md:inline" title={email}>
          {email}
        </span>
        <ScopeIndicator scope={scope} className="ml-2 hidden lg:inline-flex" />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {formatRoleLabel(role)}
        </Badge>
        <SignOutButton />
      </div>
    </header>
  )
}
